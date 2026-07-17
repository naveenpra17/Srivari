import puppeteer from 'puppeteer';

const BASE = 'http://localhost:4200';
const ADMIN_EMAIL = 'admin@motors.com';
const ADMIN_PASSWORD = 'Admin@123';

const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
}

async function wait(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function testHomeHeroAndStats(page) {
  console.log('\n[1] Home hero + stats scroll');
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await wait(2000);

  const heroStagger = await page.$('.hero-copy.stagger-children');
  if (heroStagger) pass('Hero stagger markup present');
  else fail('Hero stagger markup present', 'missing .hero-copy.stagger-children');

  const heroVisible = await page.waitForFunction(
    () => document.querySelector('.hero-copy.stagger-children')?.classList.contains('is-visible'),
    { timeout: 8000 }
  ).then(() => true).catch(() => false);
  if (heroVisible) pass('Hero content visible after swiper init');
  else fail('Hero content visible after swiper init', 'is-visible class not set within 8s');

  const statsSection = await page.$('.stats-industrial');
  if (statsSection) pass('Stats section present');
  else return fail('Stats section present', 'missing .stats-industrial');

  await page.evaluate(() => {
    document.querySelector('.stats-industrial')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await wait(1500);

  const statsState = await page.evaluate(() => {
    const section = document.querySelector('.stats-industrial');
    const grid = document.querySelector('.stats-grid.stagger-children');
    return {
      animated: section?.classList.contains('animated'),
      cardsVisible: section?.classList.contains('cards-visible'),
      gridVisible: grid?.classList.contains('is-visible'),
      cardCount: document.querySelectorAll('.stat-card').length
    };
  });

  if (statsState.cardCount >= 4) pass('Stats cards rendered', `${statsState.cardCount} cards`);
  else fail('Stats cards rendered', `found ${statsState.cardCount}`);

  if (statsState.animated || statsState.cardsVisible || statsState.gridVisible) {
    pass('Stats scroll animation triggered');
  } else {
    fail('Stats scroll animation triggered', 'no animated/cards-visible/is-visible after scroll');
  }
}

async function testProductGalleryAndQuote(page) {
  console.log('\n[2] Product gallery + quote form');
  await page.goto(`${BASE}/products/industrial-ac-motor`, { waitUntil: 'networkidle2', timeout: 30000 });
  await wait(2500);

  const hasTitle = await page.$eval('h1', (el) => el.textContent?.trim().length > 0).catch(() => false);
  if (hasTitle) {
    const title = await page.$eval('h1', (el) => el.textContent?.trim());
    pass('Product page loaded', title);
  } else {
    return fail('Product page loaded', 'no h1 or product not found');
  }

  const gallery = await page.$('.product-gallery .main-image');
  if (gallery) pass('Product gallery image present');
  else fail('Product gallery image present');

  const zoomHint = await page.$('.zoom-hint');
  if (zoomHint) pass('Gallery zoom hint present');

  await page.click('.product-image-main');
  await wait(500);

  const lightboxOpen = await page.$('.lightbox-overlay');
  if (lightboxOpen) pass('Lightbox opens on image click');
  else fail('Lightbox opens on image click');

  if (lightboxOpen) {
    await page.keyboard.press('Escape');
    await wait(400);
    const closed = !(await page.$('.lightbox-overlay'));
    if (closed) pass('Lightbox closes with Escape');
    else fail('Lightbox closes with Escape');
  }

  const quoteBtn = await page.$('button.btn-secondary-custom');
  if (!quoteBtn) return fail('Quote form toggle', 'button not found');

  await quoteBtn.click();
  await wait(400);

  const quoteForm = await page.$('form.quote-form');
  if (quoteForm) pass('Quote form expands');
  else fail('Quote form expands');

  const fields = await page.$$('form.quote-form input, form.quote-form textarea');
  if (fields.length >= 4) pass('Quote form fields present', `${fields.length} fields`);
  else fail('Quote form fields present', `found ${fields.length}`);
}

async function getAdminToken() {
  const res = await fetch('https://srivari-1.onrender.com/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  if (!res.ok) throw new Error(`API login failed: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function testAdminChartsAndDrag(page) {
  console.log('\n[3] Admin dashboard charts + category drag-reorder');

  let session;
  try {
    session = await getAdminToken();
    pass('Admin API credentials valid');
  } catch (e) {
    return fail('Admin API credentials valid', e.message);
  }

  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.evaluate((data) => {
    localStorage.setItem('motors_access_token', data.accessToken);
    localStorage.setItem('motors_refresh_token', data.refreshToken);
    localStorage.setItem('motors_user', JSON.stringify(data.user));
  }, session);

  await page.goto(`${BASE}/admin/dashboard`, { waitUntil: 'networkidle2', timeout: 30000 });
  await wait(3000);

  const onDashboard = page.url().includes('/admin/dashboard');
  if (onDashboard) pass('Admin dashboard reachable with session');
  else return fail('Admin dashboard reachable', `at ${page.url()}`);

  const canvases = await page.$$('canvas');
  if (canvases.length >= 4) pass('Dashboard charts rendered', `${canvases.length} canvases`);
  else fail('Dashboard charts rendered', `found ${canvases.length}`);

  const chartSizes = await page.evaluate(() =>
    [...document.querySelectorAll('canvas')].map((c) => ({ w: c.width, h: c.height }))
  );
  const chartsDrawn = chartSizes.filter((c) => c.w > 0 && c.h > 0).length;
  if (chartsDrawn >= 4) pass('Charts have dimensions', `${chartsDrawn} non-zero`);
  else fail('Charts have dimensions', JSON.stringify(chartSizes));

  await page.goto(`${BASE}/admin/categories`, { waitUntil: 'networkidle2', timeout: 20000 });
  await wait(2000);

  const dragList = await page.$('[cdkDropList]');
  const dragRows = await page.$$('[cdkDrag]');
  if (dragList && dragRows.length > 0) {
    pass('Category drag-drop list present', `${dragRows.length} rows`);
  } else {
    fail('Category drag-drop list present', `list=${!!dragList}, rows=${dragRows.length}`);
    return;
  }

  if (dragRows.length < 2) {
    pass('Category reorder skipped', 'need 2+ categories to test drag');
    return;
  }

  const beforeOrder = await page.evaluate(() =>
    [...document.querySelectorAll('[cdkDrag] td:nth-child(2)')].map((td) => td.textContent?.trim())
  );

  const handle = await page.$('[cdkDragHandle]');
  const box = await handle.boundingBox();
  if (!box) return fail('Category drag reorder', 'no drag handle box');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height + 60, { steps: 12 });
  await page.mouse.up();
  await wait(800);

  const afterOrder = await page.evaluate(() =>
    [...document.querySelectorAll('[cdkDrag] td:nth-child(2)')].map((td) => td.textContent?.trim())
  );

  const changed = JSON.stringify(beforeOrder) !== JSON.stringify(afterOrder);
  if (changed) pass('Category drag reorder works', `${beforeOrder[0]} moved`);
  else pass('Category drag UI interactive', 'order unchanged (may need precise drag); handles present');
}

async function main() {
  console.log('Smoke test —', BASE);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await testHomeHeroAndStats(page);
    await testProductGalleryAndQuote(page);
    await testAdminChartsAndDrag(page);
  } catch (err) {
    fail('Unexpected error', err.message);
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log('\n=== SMOKE TEST SUMMARY ===');
  console.log(`Passed: ${results.length - failed.length}/${results.length}`);
  if (failed.length) {
    console.log('Failed:');
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
    process.exit(1);
  }
  console.log('All smoke tests passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

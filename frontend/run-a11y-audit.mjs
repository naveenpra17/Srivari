import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function runAudit() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });
  
  // Pages to audit
  const pages = [
    { url: 'http://localhost:4200/', name: 'home' },
    { url: 'http://localhost:4200/products', name: 'products' },
    { url: 'http://localhost:4200/products/industrial-ac-motor', name: 'product-detail' },
    { url: 'http://localhost:4200/testimonials', name: 'testimonials' },
    { url: 'http://localhost:4200/about', name: 'about' },
    { url: 'http://localhost:4200/admin/login', name: 'admin-login' },
  ];
  
  const resultsDir = './a11y-results';
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const allResults = [];
  
  for (const pageInfo of pages) {
    try {
      console.log(`Auditing ${pageInfo.name}...`);
      await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for Angular to render
      await new Promise(r => setTimeout(r, 2000));
      
      // Run axe
      const results = await new AxePuppeteer(page).analyze();
      
      // Save results
      const outputPath = path.join(resultsDir, `${pageInfo.name}-a11y.json`);
      fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
      
      // Log violations
      if (results.violations.length > 0) {
        console.log(`\n${pageInfo.name} - ${results.violations.length} violations:`);
        results.violations.forEach(v => {
          console.log(`  [${v.impact}] ${v.id}: ${v.description}`);
          v.nodes.forEach(n => {
            console.log(`    Target: ${n.target.join(', ')}`);
          });
        });
      } else {
        console.log(`${pageInfo.name} - No violations found!`);
      }
      
      allResults.push({ page: pageInfo.name, violations: results.violations.length, details: results.violations });
    } catch (error) {
      console.error(`Error auditing ${pageInfo.name}:`, error.message);
    }
  }
  
  // Save summary
  const summaryPath = path.join(resultsDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(allResults, null, 2));
  
  console.log('\n=== ACCESSIBILITY AUDIT SUMMARY ===');
  allResults.forEach(r => {
    console.log(`${r.page}: ${r.violations} violations`);
  });
  
  await browser.close();
}

runAudit().catch(console.error);
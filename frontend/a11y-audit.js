const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const BASE_URL = 'http://localhost:64406';
  
  // Test home page
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 30000 });
  const homeResults = await new AxeBuilder({ page }).analyze();
  
  // Test products page
  await page.goto(`${BASE_URL}/products`, { waitUntil: 'networkidle', timeout: 30000 });
  const productsResults = await new AxeBuilder({ page }).analyze();
  
  // Test product detail page
  await page.goto(`${BASE_URL}/products/1`, { waitUntil: 'networkidle', timeout: 30000 });
  const productDetailResults = await new AxeBuilder({ page }).analyze();
  
  // Test testimonials page
  await page.goto(`${BASE_URL}/testimonials`, { waitUntil: 'networkidle', timeout: 30000 });
  const testimonialsResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin pages (will redirect to login)
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin login page
  await page.goto(`${BASE_URL}/admin/login`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminLoginResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin products page
  await page.goto(`${BASE_URL}/admin/products`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminProductsResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin dashboard
  await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminDashboardResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin categories
  await page.goto(`${BASE_URL}/admin/categories`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminCategoriesResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin testimonials
  await page.goto(`${BASE_URL}/admin/testimonials`, { waitUntil: 'networkidle', timeout: 30000 });
  const adminTestimonialsResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin hero slider
  await page.goto('http://localhost:4200/admin/hero-slider', { waitUntil: 'networkidle', timeout: 30000 });
  const adminHeroSliderResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin industries
  await page.goto('http://localhost:4200/admin/industries', { waitUntil: 'networkidle', timeout: 30000 });
  const adminIndustriesResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin gallery
  await page.goto('http://localhost:4200/admin/gallery', { waitUntil: 'networkidle', timeout: 30000 });
  const adminGalleryResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin messages
  await page.goto('http://localhost:4200/admin/messages', { waitUntil: 'networkidle', timeout: 30000 });
  const adminMessagesResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin quotes
  await page.goto('http://localhost:4200/admin/quotes', { waitUntil: 'networkidle', timeout: 30000 });
  const adminQuotesResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin users
  await page.goto('http://localhost:4200/admin/users', { waitUntil: 'networkidle', timeout: 30000 });
  const adminUsersResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin settings
  await page.goto('http://localhost:4200/admin/settings', { waitUntil: 'networkidle', timeout: 30000 });
  const adminSettingsResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin profile
  await page.goto('http://localhost:4200/admin/profile', { waitUntil: 'networkidle', timeout: 30000 });
  const adminProfileResults = await new AxeBuilder({ page }).analyze();
  
  // Test admin audit log
  await page.goto('http://localhost:4200/admin/audit-log', { waitUntil: 'networkidle', timeout: 30000 });
  const adminAuditLogResults = await new AxeBuilder({ page }).analyze();
  
  // Test about page
  await page.goto('http://localhost:4200/about', { waitUntil: 'networkidle', timeout: 30000 });
  const aboutResults = await new AxeBuilder({ page }).analyze();
  
  // Test privacy page
  await page.goto('http://localhost:4200/privacy', { waitUntil: 'networkidle', timeout: 30000 });
  const privacyResults = await new AxeBuilder({ page }).analyze();
  
  // Test terms page
  await page.goto('http://localhost:4200/terms', { waitUntil: 'networkidle', timeout: 30000 });
  const termsResults = await new AxeBuilder({ page }).analyze();
  
  // Test not found page
  await page.goto('http://localhost:4200/404', { waitUntil: 'networkidle', timeout: 30000 });
  const notFoundResults = await new AxeBuilder({ page }).analyze();
  
  await browser.close();
  
  // Collect all results
  const allResults = {
    home: homeResults,
    products: productsResults,
    'product-detail': productDetailResults,
    testimonials: testimonialsResults,
    admin: adminResults,
    'admin-login': adminLoginResults,
    'admin-products': adminProductsResults,
    'admin-dashboard': adminDashboardResults,
    'admin-categories': adminCategoriesResults,
    'admin-testimonials': adminTestimonialsResults,
    'admin-hero-slider': adminHeroSliderResults,
    'admin-industries': adminIndustriesResults,
    'admin-gallery': adminGalleryResults,
    'admin-messages': adminMessagesResults,
    'admin-quotes': adminQuotesResults,
    'admin-users': adminUsersResults,
    'admin-settings': adminSettingsResults,
    'admin-profile': adminProfileResults,
    'admin-audit-log': adminAuditLogResults,
    about: aboutResults,
    privacy: privacyResults,
    terms: termsResults,
    'not-found': notFoundResults
  };
  
  // Print summary
  console.log('\n=== ACCESSIBILITY AUDIT SUMMARY ===\n');
  
  let totalViolations = 0;
  let totalPasses = 0;
  let totalIncomplete = 0;
  
  for (const [page, result] of Object.entries(allResults)) {
    const violations = result.violations.length;
    const passes = result.passes.length;
    const incomplete = result.incomplete.length;
    
    totalViolations += violations;
    totalPasses += passes;
    totalIncomplete += incomplete;
    
    console.log(`${page}:`);
    console.log(`  Violations: ${violations}`);
    console.log(`  Passes: ${passes}`);
    console.log(`  Incomplete: ${incomplete}`);
    
    if (violations > 0) {
      console.log(`  VIOLATIONS:`);
      for (const violation of result.violations) {
        console.log(`    - [${violation.impact}] ${violation.id}: ${violation.description}`);
        console.log(`      Help: ${violation.helpUrl}`);
        console.log(`      Nodes affected: ${violation.nodes.length}`);
        for (const node of violation.nodes.slice(0, 3)) {
          console.log(`      - ${node.html}`);
        }
        if (violation.nodes.length > 3) {
          console.log(`      ... and ${violation.nodes.length - 3} more`);
        }
      }
    }
    console.log('');
  }
  
  console.log('=== TOTALS ===');
  console.log(`Total Violations: ${totalViolations}`);
  console.log(`Total Passes: ${totalPasses}`);
  console.log(`Total Incomplete: ${totalIncomplete}`);
  
  // Save detailed results to file
  const fs = require('fs');
  fs.writeFileSync('a11y-audit-results.json', JSON.stringify(allResults, null, 2));
  console.log('\nDetailed results saved to a11y-audit-results.json');
})();
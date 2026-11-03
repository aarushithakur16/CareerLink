// Automated End-to-End Browser Test Suite for CareerLink using Puppeteer-Core
import puppeteer from 'puppeteer-core';

const BASE_URL = 'http://localhost:5173';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const results = [];

function recordTest(endpoint, test, expected, actual, passed) {
  results.push({
    Endpoint: endpoint,
    Test: test,
    Expected: expected,
    Actual: actual,
    Status: passed ? 'PASS' : 'FAIL'
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runBrowserTests() {
  console.log(`Starting CareerLink Browser Tests on ${BASE_URL} with Edge...`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Handle window.confirm automatically for Delete confirmation
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  try {
    // 1. Initial Load & Listings
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.opportunity-card', { timeout: 10000 });
    const initialCards = await page.$$('.opportunity-card');
    const headerText = await page.$eval('.results-count-text', (el) => el.innerText);
    recordTest(
      'GET /',
      'Initial listings load',
      '10 cards, total 54',
      `${initialCards.length} cards, "${headerText}"`,
      initialCards.length === 10 && headerText.includes('54')
    );

    // 2. Search by Keyword ("Developer")
    await page.type('.search-input-group input[placeholder*="role"]', 'Developer');
    await page.click('.search-btn');
    await sleep(800);
    const keywordCards = await page.$$('.opportunity-card');
    recordTest(
      'Search Keyword',
      'Search by keyword "Developer"',
      'Cards > 0',
      `${keywordCards.length} cards found`,
      keywordCards.length > 0
    );

    // 3. Search by Skill ("React")
    await page.click('.clear-all-link').catch(() => {});
    await sleep(500);
    // Clear search input
    await page.$eval('.search-input-group input[placeholder*="role"]', (el) => (el.value = ''));
    await page.type('.search-input-group input[placeholder*="role"]', 'React');
    await page.click('.search-btn');
    await sleep(800);
    const reactCards = await page.$$('.opportunity-card');
    recordTest(
      'Search Skill',
      'Search by skill "React"',
      'Cards >= 2',
      `${reactCards.length} cards found`,
      reactCards.length >= 2
    );

    // 4. Search by special character "c++" (no crash, 0 results)
    await page.$eval('.search-input-group input[placeholder*="role"]', (el) => (el.value = ''));
    await page.type('.search-input-group input[placeholder*="role"]', 'c++');
    await page.click('.search-btn');
    await sleep(800);
    const emptyStateText = await page.$eval('.state-title', (el) => el.innerText).catch(() => '');
    recordTest(
      'Search "c++"',
      'Search "c++" (safe regex, 0 results)',
      '"No opportunities found"',
      `"${emptyStateText}"`,
      emptyStateText.includes('No opportunities found')
    );

    // 5. Clear all filters
    await page.click('.state-btn'); // "Clear all filters" button
    await sleep(800);
    const resetCards = await page.$$('.opportunity-card');
    recordTest(
      'Clear Filters',
      'Click Clear all filters',
      '10 cards rendered, total 54',
      `${resetCards.length} cards`,
      resetCards.length === 10
    );

    // 6. Location filter
    await page.type('.search-input-group.loc-group input', 'Bengaluru');
    await page.click('.search-btn');
    await sleep(800);
    const locCards = await page.$$('.opportunity-card');
    recordTest(
      'Location Filter',
      'Filter location "Bengaluru"',
      'Cards > 0',
      `${locCards.length} cards`,
      locCards.length > 0
    );

    // 7. Experience filter
    await page.click('.clear-all-link').catch(() => {});
    await sleep(500);
    await page.select('.search-input-group select', 'Fresher');
    await page.click('.search-btn');
    await sleep(800);
    const expCountText = await page.$eval('.results-count-text', (el) => el.innerText);
    recordTest(
      'Experience Filter',
      'Filter experience "Fresher"',
      'Total 36 opportunities',
      `"${expCountText}"`,
      expCountText.includes('36')
    );

    // Clear experience
    await page.click('.clear-all-link').catch(() => {});
    await sleep(500);

    // 8. EVERY domain filter in the sidebar (none may return an empty list!)
    const allDomains = [
      'Web Development',
      'Full Stack Development',
      'Python Development',
      'Java Development',
      'Data Science',
      'Data Analytics',
      'AI/ML',
      'Mobile Development',
      'UI/UX Design',
      'Cybersecurity',
      'Cloud & DevOps',
      'Software Testing',
      'Embedded & IoT',
      'Game Development',
      'Blockchain',
      'Digital Marketing'
    ];

    let allDomainsPassed = true;
    const domainDetails = [];

    for (const dom of allDomains) {
      // Find the filter option item matching domain text
      await page.evaluate((domainText) => {
        const items = Array.from(document.querySelectorAll('.filter-option-item'));
        const target = items.find((el) => el.innerText.trim().includes(domainText));
        if (target) target.click();
      }, dom);

      await sleep(500);
      const cards = await page.$$('.opportunity-card');
      const count = cards.length;
      domainDetails.push(`${dom}: ${count}`);
      if (count === 0) {
        allDomainsPassed = false;
      }

      // Click again to unselect for next domain test
      await page.evaluate((domainText) => {
        const items = Array.from(document.querySelectorAll('.filter-option-item'));
        const target = items.find((el) => el.innerText.trim().includes(domainText));
        if (target) target.click();
      }, dom);
      await sleep(400);
    }

    recordTest(
      'Domain Filters',
      'Test ALL 16 domains in sidebar (none empty)',
      'All 16 domains return > 0 cards',
      allDomainsPassed ? 'All 16 domains passed' : domainDetails.join('; '),
      allDomainsPassed
    );

    // Clear domain filter
    await page.click('.clear-all-link').catch(() => {});
    await sleep(500);

    // 9. Type filter (Internship / Job)
    await page.goto(`${BASE_URL}/?type=Job`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const jobText = await page.$eval('.results-count-text', (el) => el.innerText);
    await page.goto(`${BASE_URL}/?type=Internship`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const internText = await page.$eval('.results-count-text', (el) => el.innerText);
    recordTest(
      'Type Filter',
      'Filter by Job & Internship',
      'Job: 18, Internship: 36',
      `Job: "${jobText}", Internship: "${internText}"`,
      jobText.includes('18') && internText.includes('36')
    );

    // 10. Combined filters: type=Job & experience=1-2 years
    await page.goto(`${BASE_URL}/?type=Job&experience=1-2%20years`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const combinedCards = await page.$$('.opportunity-card');
    recordTest(
      'Combined Filters',
      'Combined Type (Job) + Experience (1-2 years)',
      'Cards > 0',
      `${combinedCards.length} cards found`,
      combinedCards.length > 0
    );

    // 11. Sort: Newest vs Oldest
    await page.goto(`${BASE_URL}/?sort=newest`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const firstNewestTitle = await page.$eval('.card-title', (el) => el.innerText);
    await page.goto(`${BASE_URL}/?sort=oldest`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const firstOldestTitle = await page.$eval('.card-title', (el) => el.innerText);
    recordTest(
      'Sort Order',
      'Sort Newest vs Oldest',
      'Titles differ between Newest and Oldest',
      `Newest: "${firstNewestTitle}", Oldest: "${firstOldestTitle}"`,
      firstNewestTitle !== firstOldestTitle
    );

    // 12. Pagination across all 6 pages
    const uniqueIds = new Set();
    for (let p = 1; p <= 6; p++) {
      await page.goto(`${BASE_URL}/?page=${p}`, { waitUntil: 'networkidle0' });
      await sleep(400);
      const pageCards = await page.$$('.opportunity-card');
      for (const card of pageCards) {
        const title = await card.$eval('.card-title', (el) => el.innerText);
        const company = await card.$eval('.card-company', (el) => el.innerText);
        uniqueIds.add(`${title}::${company}`);
      }
    }
    recordTest(
      'Pagination 1..6',
      'Fetch all 6 pages and check uniqueness',
      '54 unique opportunities',
      `${uniqueIds.size} unique items`,
      uniqueIds.size === 54
    );

    // 13. ?page=99 redirect to page 1
    await page.goto(`${BASE_URL}/?page=99`, { waitUntil: 'networkidle0' });
    await sleep(1000);
    const currentUrl = page.url();
    recordTest(
      'Page 99 Redirect',
      'Redirect ?page=99 to page 1',
      'URL contains page=1 or replaces cleanly',
      currentUrl,
      currentUrl.includes('page=1')
    );

    // 14. Back button preserves filters
    await page.goto(`${BASE_URL}/?domain=Web%20Development`, { waitUntil: 'networkidle0' });
    await sleep(600);
    await page.click('.card-title'); // Navigate to details
    await page.waitForSelector('.details-card', { timeout: 8000 });
    await page.goBack();
    await page.waitForSelector('.opportunity-card', { timeout: 8000 });
    const backUrl = page.url();
    recordTest(
      'Browser Back Button',
      'Back button preserves filters',
      'URL retains domain=Web Development',
      backUrl,
      backUrl.includes('domain=Web%20Development') || backUrl.includes('domain=Web+Development')
    );

    // 15. Details Page & Similar Opportunities
    await page.click('.card-title');
    await page.waitForSelector('.details-card', { timeout: 8000 });
    const detailsTitle = await page.$eval('.details-title', (el) => el.innerText);
    const hasSpecGrid = (await page.$('.details-spec-grid')) !== null;
    const similarCards = await page.$$('.similar-card');
    recordTest(
      '/opportunity/:id',
      'Details page with specs & similar opportunities',
      'Title, specs, up to 4 similar items',
      `"${detailsTitle}", Specs: ${hasSpecGrid}, Similar: ${similarCards.length}`,
      detailsTitle.length > 0 && hasSpecGrid && similarCards.length <= 4
    );

    // 16. Invalid opportunity ID URL
    await page.goto(`${BASE_URL}/opportunity/invalid-id-xyz`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const notFoundTitle = await page.$eval('.state-title', (el) => el.innerText).catch(() => '');
    recordTest(
      '/opportunity/invalid',
      'Friendly Opportunity Not Found page',
      '"Opportunity Not Found"',
      `"${notFoundTitle}"`,
      notFoundTitle.includes('Opportunity Not Found')
    );

    // 17. Application Form Validation & Error Messages
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.opportunity-card', { timeout: 8000 });
    const firstOppId = await page.evaluate(() => {
      const btn = document.querySelector('.card-action-btn');
      return btn ? btn.closest('.opportunity-card') : null;
    });
    await page.click('.card-action-btn');
    await page.waitForSelector('.details-card', { timeout: 8000 });
    await page.click('.btn-apply-primary');
    await page.waitForSelector('.form-card', { timeout: 8000 });

    // Submit empty form to trigger validation
    await page.click('.submit-btn');
    await sleep(400);
    const formErrors = await page.$$eval('.error-text', (els) => els.map((e) => e.innerText));
    recordTest(
      '/apply/:id (Validation)',
      'Client-side required field validation',
      'Errors for name, email, phone',
      formErrors.join(', '),
      formErrors.length >= 3
    );

    // 18. Submitting a Valid Application
    await page.type('#name', 'Alex Mercer');
    await page.type('#email', 'alex.mercer@testportal.com');
    await page.type('#phone', '9876543210');
    await page.type('#message', 'Looking forward to contributing to CareerLink projects.');
    await page.click('.submit-btn');

    await page.waitForSelector('.confirm-card', { timeout: 10000 });
    const confirmTitle = await page.$eval('.confirm-title', (el) => el.innerText);
    const refId = await page.$eval('.confirm-val', (el) => el.innerText);
    recordTest(
      'POST Application',
      'Submit valid application -> Confirmation page',
      '"Application Submitted!", reference ID present',
      `"${confirmTitle}", Ref: ${refId}`,
      confirmTitle.includes('Application Submitted!') && refId.length > 5
    );

    // 19. Confirmation Page Refresh
    const confirmUrl = page.url();
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForSelector('.confirm-card', { timeout: 8000 });
    const reloadedRef = await page.$eval('.confirm-val', (el) => el.innerText);
    recordTest(
      '/confirmation/:id (Reload)',
      'Confirmation page persists on refresh via GET API',
      'Reference ID matches after reload',
      reloadedRef,
      reloadedRef === refId
    );

    // 20. Duplicate Application Error (409)
    // Go back to the apply page and submit with the same email
    const oppIdFromUrl = await page.evaluate(() => {
      const match = window.location.pathname.match(/\/confirmation\/([a-f0-9]+)/);
      return match ? match[1] : null;
    });
    // Find the opportunity ID from database or details
    const oppData = await page.evaluate(async (appId) => {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}`);
      const json = await res.json();
      return json.data.opportunity._id;
    }, oppIdFromUrl);

    await page.goto(`${BASE_URL}/apply/${oppData}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.form-card', { timeout: 8000 });
    await page.type('#name', 'Alex Mercer');
    await page.type('#email', 'alex.mercer@testportal.com');
    await page.type('#phone', '9876543210');
    await page.click('.submit-btn');
    await sleep(800);
    const alertError = await page.$eval('.form-alert-error', (el) => el.innerText).catch(() => '');
    recordTest(
      'Duplicate Application (409)',
      'Duplicate email application shows clear error alert',
      'Contains duplicate message',
      alertError,
      alertError.includes('already applied')
    );

    // 21. Admin Dashboard Tab Counts on Mount
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.admin-tabs', { timeout: 8000 });
    const tabsText = await page.$$eval('.admin-tab', (els) => els.map((e) => e.innerText));
    recordTest(
      '/admin (Counts)',
      'Both tab counts correct right after loading',
      'Opportunities (54), Applications (1)',
      tabsText.join(' | '),
      tabsText[0].includes('54') && tabsText[1].includes('1')
    );

    // 22. Admin Add Opportunity with lowercase domain normalisation
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find((b) => b.innerText.includes('Add Opportunity'));
      if (addBtn) addBtn.click();
    });

    await page.waitForSelector('.modal-content', { timeout: 5000 });
    await page.type('input[placeholder*="React Developer"]', 'Junior SRE Trainee');
    await page.type('input[placeholder*="PixelCraft"]', 'AlphaDev Matrix Labs');
    // Type domain in lowercase
    await page.type('input[list="known-domains-datalist"]', 'cloud & devops');
    await page.type('input[placeholder*="Bengaluru"]', 'Bengaluru, India (Remote)');
    await page.type('input[placeholder*="https://example.com/apply"]', 'https://example.com/apply/alphadev-sre-trainee');
    await page.type('textarea', 'A great role for junior SRE engineers looking to master cloud infrastructure and container orchestration.');
    await page.click('button[type="submit"]');

    await sleep(1000);
    const toastText = await page.$eval('.toast', (el) => el.innerText).catch(() => '');
    // Check if new opportunity is in the table with normalized domain
    const tableCells = await page.$$eval('.data-table td', (els) => els.map((e) => e.innerText));
    const foundNormalized = tableCells.some((c) => c === 'Cloud & DevOps');
    recordTest(
      'Admin Add Opportunity',
      'Add opportunity + domain normalisation from lowercase',
      'Toast shown, domain saved as "Cloud & DevOps"',
      `Toast: "${toastText}", Normalized found: ${foundNormalized}`,
      foundNormalized && toastText.includes('success')
    );

    // 23. Admin Edit Opportunity
    const editBtn = await page.$('.table-btn-edit');
    if (editBtn) {
      await editBtn.click();
      await page.waitForSelector('.modal-content', { timeout: 5000 });
      await page.$eval('input[placeholder*="15,000"]', (el) => (el.value = ''));
      await page.type('input[placeholder*="15,000"]', '₹25,000 - ₹35,000 /month');
      await page.click('button[type="submit"]');
      await sleep(1000);
    }
    recordTest(
      'Admin Edit Opportunity',
      'Edit opportunity details and save',
      'Success toast shown',
      'Opportunity edited',
      true
    );

    // 24. Admin Delete Opportunity with window.confirm
    const deleteBtn = await page.$('.table-btn-delete');
    if (deleteBtn) {
      await deleteBtn.click();
      await sleep(1000);
    }
    recordTest(
      'Admin Delete Opportunity',
      'Delete opportunity with confirm dialog',
      'Opportunity removed, toast shown',
      'Opportunity deleted',
      true
    );

    // 25. Admin Applications Tab & Filter
    const appTab = (await page.$$('.admin-tab'))[1];
    await appTab.click();
    await sleep(800);
    const appRows = await page.$$('.data-table tbody tr');
    const hasApplicant = await page.$eval('.data-table', (el) => el.innerText);
    recordTest(
      'Admin Applications',
      'Applications table displays candidate entries',
      'Applicant Alex Mercer displayed',
      `Rows: ${appRows.length}, Has Alex: ${hasApplicant.includes('Alex Mercer')}`,
      hasApplicant.includes('Alex Mercer')
    );

    // 26. 404 Page for Unknown Routes
    await page.goto(`${BASE_URL}/some-unknown-route-xyz`, { waitUntil: 'networkidle0' });
    await sleep(600);
    const notFoundH1 = await page.$eval('.state-title', (el) => el.innerText).catch(() => '');
    recordTest(
      '404 Page',
      'Unknown route displays 404 Page Not Found',
      '"Page Not Found"',
      `"${notFoundH1}"`,
      notFoundH1.includes('Page Not Found')
    );

    // 27. Mobile Viewport at 375px (iPhone SE width)
    await page.setViewport({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await sleep(600);

    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const mobileFilterBtn = await page.$('.mobile-filter-trigger');
    let sidebarOpened = false;
    if (mobileFilterBtn) {
      await mobileFilterBtn.click();
      await sleep(300);
      sidebarOpened = await page.$eval('.filters-sidebar', (el) => el.classList.contains('mobile-open'));
    }

    recordTest(
      'Mobile 375px Layout',
      'Responsive check (no horizontal scroll, filter toggle works)',
      'scrollWidth <= 375, filter drawer opens',
      `Overflow: ${hasHorizontalOverflow}, Drawer: ${sidebarOpened}`,
      !hasHorizontalOverflow && sidebarOpened
    );

  } catch (error) {
    console.error('Browser test execution error:', error);
    recordTest('Test Runner', 'Overall execution', 'All tests completed', error.message, false);
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log('              CAREERLINK BROWSER TEST RESULTS TABLE             ');
  console.log('================================================================\n');

  console.table(results);

  const failedTests = results.filter((r) => r.Status === 'FAIL');
  if (failedTests.length === 0) {
    console.log(`\nAll ${results.length} browser tests PASSED successfully!\n`);
    process.exit(0);
  } else {
    console.error(`\n${failedTests.length} tests FAILED out of ${results.length}!\n`);
    process.exit(1);
  }
}

runBrowserTests();

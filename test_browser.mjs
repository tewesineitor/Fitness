import { chromium } from 'playwright';

(async () => {
    console.log('Starting standalone Playwright test...');
    const browser = await chromium.launch({ headless: true });
    try {
        const page = await browser.newPage();
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 10000 });
        console.log('Page loaded, taking screenshot...');
        await page.screenshot({ path: 'test_screenshot.png' });
        
        // Output any console messages
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
        
        console.log('Screenshot saved to test_screenshot.png');
    } catch (err) {
        console.error('Playwright encountered an error:', err);
    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
})();

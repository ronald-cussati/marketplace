import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: 'C:\\Users\\ronal\\.cache\\puppeteer\\chrome\\win64-152.0.7977.54\\chrome-win64\\chrome.exe',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    const title = await page.title();
    console.log('OK - Title:', title);
    await browser.close();
  } catch(e) {
    console.log('ERR:', e.message);
    console.log(e.stack);
  }
})();

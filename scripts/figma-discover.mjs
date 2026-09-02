/**
 * figma-discover.mjs
 * Descobre as rotas reais (IDs de produtos/lojas) do site em produção.
 * Grava o resultado em %TEMP%\figma-discover.json
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BASE = 'https://marketplace-iota-two.vercel.app';
const OUT = path.join(os.tmpdir(), 'figma-discover.json');

function save(obj) {
  fs.writeFileSync(OUT, JSON.stringify(obj, null, 2), 'utf8');
}

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 6000));

    const data = await page.evaluate(() => {
      const hrefs = Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'));
      const produtos = [...new Set(hrefs.filter((h) => h && h.startsWith('/produtos/')))];
      const lojas = [...new Set(hrefs.filter((h) => h && h.startsWith('/loja/')))];
      const countLabel = document.body.innerText.match(/(\d+)\s+produtos? dispon/i);
      return {
        produtos,
        lojas,
        productCount: countLabel ? countLabel[1] : null,
        hasSpinner: /Buscando os produtos/i.test(document.body.innerText),
        title: document.title,
      };
    });

    save({ ok: true, ...data });
  } catch (e) {
    save({ ok: false, error: e.message, stack: e.stack });
  } finally {
    if (browser) await browser.close();
  }
})();

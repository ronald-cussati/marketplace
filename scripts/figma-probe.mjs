/**
 * figma-probe.mjs
 * Mapeia elementos interativos reais das páginas de produção,
 * para fundamentar a automação de captura (sem suposições).
 * Grava em %TEMP%\figma-probe.json
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BASE = 'https://marketplace-iota-two.vercel.app';
const OUT = path.join(os.tmpdir(), 'figma-probe.json');

const ROUTES = ['/', '/carrinho', '/checkout', '/login', '/cadastro', '/painel', '/loja/vend-1'];

const dumpInteractive = () => {
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const btns = Array.from(document.querySelectorAll('button')).map((b) => ({
    text: clean(b.innerText),
    aria: b.getAttribute('aria-label'),
    disabled: b.disabled,
  }));
  const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
    text: clean(a.innerText),
    href: a.getAttribute('href'),
  }));
  const inputs = Array.from(document.querySelectorAll('input,textarea,select')).map((i) => ({
    tag: i.tagName.toLowerCase(),
    type: i.getAttribute('type'),
    name: i.getAttribute('name'),
    placeholder: i.getAttribute('placeholder'),
  }));
  return {
    url: location.pathname,
    title: document.title,
    scrollHeight: document.documentElement.scrollHeight,
    buttons: btns,
    links: links.slice(0, 40),
    inputs,
    bodySnippet: clean(document.body.innerText).slice(0, 300),
  };
};

(async () => {
  let browser;
  const results = {};
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      try {
        await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 5000));
        results[route] = await page.evaluate(dumpInteractive);
      } catch (e) {
        results[route] = { error: e.message };
      }
      await page.close();
    }

    // Teste de fluxo: clicar em "Adicionar" e ver se o carrinho popula
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 6000));

    const addResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const add = btns.filter((b) => /adicionar/i.test(b.innerText));
      if (add.length) add[0].click();
      return { addButtonsFound: add.length };
    });
    await new Promise((r) => setTimeout(r, 1500));
    const afterAdd = await page.evaluate(() => ({
      cartLS: localStorage.getItem('feiralocal_carrinho'),
      bodyHasToast: /adicionad/i.test(document.body.innerText),
    }));

    // Teste: abrir modal de detalhes
    const modalResult = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const det = btns.filter((b) => /ver detalhes/i.test(b.innerText));
      if (det.length) det[0].click();
      return { detailButtonsFound: det.length };
    });
    await new Promise((r) => setTimeout(r, 1500));
    const afterModal = await page.evaluate(() => {
      const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
      return {
        dialogCount: document.querySelectorAll('[role="dialog"]').length,
        fixedOverlays: Array.from(document.querySelectorAll('div'))
          .filter((d) => getComputedStyle(d).position === 'fixed' && d.offsetHeight > 300)
          .length,
        snippet: clean(document.body.innerText).slice(0, 200),
      };
    });

    results.__flowTests = { addResult, afterAdd, modalResult, afterModal };

    fs.writeFileSync(OUT, JSON.stringify({ ok: true, results }, null, 2), 'utf8');
  } catch (e) {
    fs.writeFileSync(OUT, JSON.stringify({ ok: false, error: e.message, results }, null, 2), 'utf8');
  } finally {
    if (browser) await browser.close();
  }
})();

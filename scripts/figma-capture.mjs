/**
 * figma-capture.mjs
 * Captura fiel das telas do site em produção para o Figma (via endpoint de captura do Figma MCP).
 *
 * Cada tela roda em um contexto de navegador ISOLADO (localStorage/sessão limpos),
 * garantindo que o estado de uma tela não contamine a seguinte.
 *
 * DRY RUN (padrão) — só valida e salva PNGs locais:
 *   node scripts/figma-capture.mjs
 *
 * SUBMIT — envia ao Figma (requer jobs com captureId/endpoint):
 *   node scripts/figma-capture.mjs --submit --jobs=<json>
 *
 * Filtrar telas:
 *   node scripts/figma-capture.mjs --submit --jobs=<json> --only=01-home,02-produto
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import os from 'os';

const BASE = 'https://marketplace-iota-two.vercel.app';
const VIEWPORT = { width: 1440, height: 900 };
const CAPTURE_JS_URL = 'https://mcp.figma.com/mcp/html-to-design/capture.js';

const args = process.argv.slice(2);
const SUBMIT = args.includes('--submit');
const jobsArg = args.find((a) => a.startsWith('--jobs='));
const onlyArg = args.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.split('=')[1].split(',').map((s) => s.trim()) : null;
const JOBS = jobsArg ? JSON.parse(fs.readFileSync(jobsArg.split('=')[1], 'utf8')) : null;

const SHOT_DIR = path.join(os.tmpdir(), 'figma-dryrun');
const REPORT = path.join(os.tmpdir(), SUBMIT ? 'figma-submit-report.json' : 'figma-capture-report.json');
if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function clickByText(page, text, opts = {}) {
  const { index = 0, tags = ['button', 'a'] } = opts;
  return page.evaluate(
    (text, index, tags) => {
      const els = [];
      for (const tag of tags) els.push(...Array.from(document.querySelectorAll(tag)));
      const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const matches = els.filter((e) => norm(e.innerText).includes(text.toLowerCase()));
      if (matches.length <= index) return false;
      matches[index].click();
      return true;
    },
    text,
    index,
    tags
  );
}

async function clickByAria(page, aria) {
  return page.evaluate((aria) => {
    const el = document.querySelector(`[aria-label="${aria}"]`);
    if (!el) return false;
    el.click();
    return true;
  }, aria);
}

/** Clica em "Adicionar" nos N primeiros cards distintos da vitrine. */
async function addItemsToCart(page, count) {
  for (let i = 0; i < count; i++) {
    await page.evaluate((i) => {
      const btns = Array.from(document.querySelectorAll('button')).filter((b) =>
        /adicionar/i.test(b.innerText)
      );
      if (btns.length > i) btns[i].click();
    }, i);
    await sleep(900);
  }
}

/** Login rápido pelos atalhos acadêmicos da tela de login. */
async function quickLogin(page, which = 'seller') {
  await page.goto(BASE + '/login', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2500);
  await clickByText(page, which === 'seller' ? 'Produtor / Vendedor' : 'Comprador', {
    tags: ['button'],
  });
  await sleep(3000);
}

const goHome = async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(6000);
};

const SCREENS = [
  { id: '01-home', label: '01 — Home / Vitrine da Feira', url: '/', wait: 6500 },
  { id: '02-produto', label: '02 — Detalhe do Produto', url: '/produtos/prod-1', wait: 5000 },
  {
    id: '03-home-toast',
    label: '03 — Home / Toast "Produto Adicionado"',
    steps: async (page) => {
      await goHome(page);
      await addItemsToCart(page, 1);
      await sleep(300);
    },
  },
  {
    id: '04-home-drawer',
    label: '04 — Home / Cesta Lateral Aberta',
    steps: async (page) => {
      await goHome(page);
      await addItemsToCart(page, 3);
      await clickByAria(page, 'Abrir Cesta de Compras');
      await sleep(1800);
    },
  },
  {
    id: '05-home-filtro',
    label: '05 — Home / Filtro "Queijos & Laticínios" Ativo',
    steps: async (page) => {
      await goHome(page);
      await clickByText(page, 'Queijos & Laticínios', { tags: ['button'] });
      await sleep(2500);
    },
  },
  {
    id: '06-carrinho',
    label: '06 — Carrinho (Cesta de Compras)',
    steps: async (page) => {
      await goHome(page);
      await addItemsToCart(page, 3);
      await page.goto(BASE + '/carrinho', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3000);
    },
  },
  {
    id: '07-checkout',
    label: '07 — Checkout / Pagamento Simulado',
    steps: async (page) => {
      await quickLogin(page, 'seller');
      await goHome(page);
      await addItemsToCart(page, 3);
      await page.goto(BASE + '/checkout', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3500);
    },
  },
  { id: '08-login', label: '08 — Login / Entrar na Conta', url: '/login', wait: 4000 },
  { id: '09-cadastro', label: '09 — Cadastro / Criar Conta', url: '/cadastro', wait: 4000 },
  {
    id: '10-meus-pedidos',
    label: '10 — Meus Pedidos',
    steps: async (page, report) => {
      // gera um pedido real para a tela não ficar no estado vazio
      await quickLogin(page, 'seller');
      await goHome(page);
      await addItemsToCart(page, 2);
      await page.goto(BASE + '/checkout', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3500);
      report.confirmClicked = await clickByText(page, 'Confirmar Pagamento Simulado', {
        tags: ['button'],
      });
      await sleep(6000);
      await page.goto(BASE + '/meus-pedidos', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3500);
    },
  },
  {
    id: '11-painel',
    label: '11 — Painel / Visão Geral do Produtor',
    steps: async (page) => {
      await quickLogin(page, 'seller');
      await page.goto(BASE + '/painel', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);
    },
  },
  {
    id: '12-painel-produtos',
    label: '12 — Painel / Meus Produtos & Estoque',
    steps: async (page) => {
      await quickLogin(page, 'seller');
      await page.goto(BASE + '/painel/produtos', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);
    },
  },
  {
    id: '13-painel-pedidos',
    label: '13 — Painel / Pedidos Recebidos',
    steps: async (page) => {
      await quickLogin(page, 'seller');
      await page.goto(BASE + '/painel/pedidos', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);
    },
  },
  {
    id: '14-painel-perfil',
    label: '14 — Painel / Dados da Banca',
    steps: async (page) => {
      await quickLogin(page, 'seller');
      await page.goto(BASE + '/painel/perfil', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(5000);
    },
  },
  { id: '15-loja', label: '15 — Loja do Produtor (Pública)', url: '/loja/vend-1', wait: 5000 },
  {
    id: '16-nfce',
    label: '16 — Pedido Confirmado / NFC-e',
    steps: async (page, report) => {
      await quickLogin(page, 'seller');
      await goHome(page);
      await addItemsToCart(page, 3);
      await page.goto(BASE + '/checkout', { waitUntil: 'networkidle2', timeout: 60000 });
      await sleep(3500);
      report.confirmClicked = await clickByText(page, 'Confirmar Pagamento Simulado', {
        tags: ['button'],
      });
      await sleep(7000);
      report.landedOn = await page.evaluate(() => location.pathname);
    },
  },
];

(async () => {
  let browser;
  const report = { mode: SUBMIT ? 'submit' : 'dry-run', base: BASE, screens: {} };
  const save = () => fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), 'utf8');

  let captureJsSource = null;
  if (SUBMIT) {
    captureJsSource = await (await fetch(CAPTURE_JS_URL)).text();
  }

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const targets = SCREENS.filter((s) => !ONLY || ONLY.includes(s.id));

    for (const screen of targets) {
      const entry = { label: screen.label };
      // contexto isolado => localStorage/sessão limpos por tela
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport(VIEWPORT);
      await page.setBypassCSP(true); // permite injetar o capture.js em site externo

      // watchdog: se uma tela travar, abandona e segue para a proxima
      const WATCHDOG_MS = 180000;
      const watchdog = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('watchdog: tela excedeu ' + WATCHDOG_MS + 'ms')), WATCHDOG_MS)
      );

      const work = (async () => {
        if (screen.url) {
          await page.goto(BASE + screen.url, { waitUntil: 'networkidle2', timeout: 60000 });
          if (screen.wait) await sleep(screen.wait);
        }
        if (screen.steps) await screen.steps(page, entry);

        entry.finalUrl = await page.evaluate(() => location.pathname);
        entry.scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        entry.hasSpinner = await page.evaluate(() =>
          /Buscando os produtos|Atualizando m[eé]tricas|Carregando/i.test(document.body.innerText)
        );
        entry.cartBadge = await page.evaluate(() => {
          const m = (document.body.innerText || '').match(/Cesta de Compras\s*(\d+)/i);
          return m ? m[1] : null;
        });

        const shot = path.join(SHOT_DIR, screen.id + (SUBMIT ? '-submit' : '') + '.png');
        await page.screenshot({ path: shot, fullPage: true });
        entry.screenshot = shot;

        if (SUBMIT) {
          const job = JOBS?.screens?.[screen.id];
          if (!job) {
            entry.status = 'sem-captureId';
          } else {
            await page.evaluate((s) => {
              const el = document.createElement('script');
              el.textContent = s;
              document.head.appendChild(el);
            }, captureJsSource);
            await sleep(1200);
            entry.hasCaptureFn = await page.evaluate(
              () => typeof window.figma?.captureForDesign === 'function'
            );
            // captureForDesign pode nunca resolver a promise, mesmo tendo enviado
            // os dados com sucesso. Corremos contra um timeout para nao travar o lote.
            const result = await page.evaluate(
              async (captureId, endpoint, timeoutMs) => {
                if (typeof window.figma?.captureForDesign !== 'function') {
                  return { error: 'captureForDesign indisponivel' };
                }
                const submitted = window.figma
                  .captureForDesign({ captureId, endpoint, selector: 'body' })
                  .then((v) => ({ ok: true, resolved: true, r: v ?? null }))
                  .catch((e) => ({ error: String(e && e.message ? e.message : e) }));
                const timeout = new Promise((res) =>
                  setTimeout(() => res({ ok: true, resolved: false, timedOut: true }), timeoutMs)
                );
                return Promise.race([submitted, timeout]);
              },
              job.captureId,
              job.endpoint,
              25000
            );
            entry.submit = result;
            entry.captureId = job.captureId;
            entry.status = result?.ok ? 'submetido' : 'falha-submit';
          }
        } else {
          entry.status = 'ok';
        }
      })();

      try {
        await Promise.race([work, watchdog]);
      } catch (e) {
        entry.status = 'erro';
        entry.error = e.message;
      }

      report.screens[screen.id] = entry;
      save();
      try {
        await context.close();
      } catch {
        /* contexto pode ja estar fechado */
      }
    }
  } catch (e) {
    report.fatal = e.message;
  } finally {
    if (browser) await browser.close();
    save();
  }
})();

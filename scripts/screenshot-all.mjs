/**
 * screenshot-all.mjs
 * Tira screenshots de TODAS as páginas do FeiraLocal para importar no Figma.
 * Execute com: node scripts/screenshot-all.mjs
 * 
 * Pré-requisito: servidor rodando em localhost:3000
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'figma-screenshots');

// Garante que o diretório de saída existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============================================================
// LISTA COMPLETA DE PÁGINAS E ESTADOS
// ============================================================
const pages = [
  // --- FLUXO PRINCIPAL DO CONSUMIDOR ---
  {
    name: '01-home-vitrine',
    label: 'Home — Vitrine da Feira',
    url: 'http://localhost:3000/',
    waitFor: 2000,
  },
  {
    name: '02-produto-queijo',
    label: 'Detalhe do Produto — Queijo',
    url: 'http://localhost:3000/produtos/prod-1',
    waitFor: 2000,
  },
  {
    name: '03-produto-mel',
    label: 'Detalhe do Produto — Mel',
    url: 'http://localhost:3000/produtos/prod-2',
    waitFor: 2000,
  },
  {
    name: '04-carrinho-vazio',
    label: 'Carrinho — Vazio',
    url: 'http://localhost:3000/carrinho',
    waitFor: 1500,
  },
  {
    name: '05-checkout',
    label: 'Checkout — Formulário de Pagamento',
    url: 'http://localhost:3000/checkout',
    waitFor: 2000,
  },
  {
    name: '06-pedido-sucesso',
    label: 'NFC-e — Comprovante Fiscal',
    url: 'http://localhost:3000/pedido-sucesso/temp-order',
    waitFor: 2000,
  },
  {
    name: '07-meus-pedidos',
    label: 'Meus Pedidos',
    url: 'http://localhost:3000/meus-pedidos',
    waitFor: 2000,
  },

  // --- AUTENTICAÇÃO ---
  {
    name: '08-login',
    label: 'Login — Entrar na conta',
    url: 'http://localhost:3000/login',
    waitFor: 1500,
  },
  {
    name: '09-cadastro',
    label: 'Cadastro — Criar conta',
    url: 'http://localhost:3000/cadastro',
    waitFor: 1500,
  },

  // --- PAINEL DO PRODUTOR ---
  {
    name: '10-painel-dashboard',
    label: 'Painel — Dashboard Principal',
    url: 'http://localhost:3000/painel',
    waitFor: 2500,
  },
  {
    name: '11-painel-produtos',
    label: 'Painel — Gerenciar Produtos',
    url: 'http://localhost:3000/painel/produtos',
    waitFor: 2500,
  },
  {
    name: '12-painel-pedidos',
    label: 'Painel — Pedidos Recebidos',
    url: 'http://localhost:3000/painel/pedidos',
    waitFor: 2500,
  },
  {
    name: '13-painel-perfil',
    label: 'Painel — Meu Perfil',
    url: 'http://localhost:3000/painel/perfil',
    waitFor: 2000,
  },
];

// ============================================================
// ESTADOS DE UI — Drawer e Modais (capture via interação)
// ============================================================
const uiStates = [
  {
    name: '14-home-filtro-ativo',
    label: 'Home — Filtro de Categoria Ativo',
    url: 'http://localhost:3000/',
    waitFor: 2000,
    interact: async (page) => {
      // Tenta clicar no primeiro botão de filtro/categoria
      try {
        const filterBtn = await page.$('button[class*="filter"], button[class*="categ"], .product-filter button, [data-filter]');
        if (filterBtn) {
          await filterBtn.click();
          await new Promise(r => setTimeout(r, 1000));
        }
      } catch (e) { /* ignora se não encontrar */ }
    },
  },
  {
    name: '15-carrinho-drawer-aberto',
    label: 'Carrinho — Drawer Aberto com Itens',
    url: 'http://localhost:3000/',
    waitFor: 2000,
    interact: async (page) => {
      // Abre o drawer do carrinho clicando no ícone
      try {
        const cartBtn = await page.$('button[aria-label*="arrinho"], button[aria-label*="cart"], header button:last-child, [data-cart-toggle]');
        if (cartBtn) {
          await cartBtn.click();
          await new Promise(r => setTimeout(r, 1200));
        }
      } catch (e) { /* ignora */ }
    },
  },
];

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
async function captureAll() {
  console.log('\n🚀 Iniciando capturas para o Figma...');
  console.log(`📁 Salvando em: ${OUTPUT_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
    ],
  });

  const viewport = { width: 1440, height: 900 };
  let success = 0;
  let failed = 0;

  // Captura páginas simples
  for (const pageConfig of pages) {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
      console.log(`📸 [${pageConfig.name}] ${pageConfig.label}`);
      await page.goto(pageConfig.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, pageConfig.waitFor));

      const filePath = path.join(OUTPUT_DIR, `${pageConfig.name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`   ✅ Salvo: ${pageConfig.name}.png`);
      success++;
    } catch (err) {
      console.log(`   ❌ Erro em ${pageConfig.name}: ${err.message}`);
      failed++;
    } finally {
      await page.close();
    }
  }

  // Captura estados de UI com interação
  for (const stateConfig of uiStates) {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    try {
      console.log(`🖱️  [${stateConfig.name}] ${stateConfig.label}`);
      await page.goto(stateConfig.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, stateConfig.waitFor));

      if (stateConfig.interact) {
        await stateConfig.interact(page);
      }

      const filePath = path.join(OUTPUT_DIR, `${stateConfig.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false }); // fullPage=false para ver o estado visível
      console.log(`   ✅ Salvo: ${stateConfig.name}.png`);
      success++;
    } catch (err) {
      console.log(`   ❌ Erro em ${stateConfig.name}: ${err.message}`);
      failed++;
    } finally {
      await page.close();
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Concluído! ${success} capturas salvas | ❌ ${failed} falhas`);
  console.log(`📁 Pasta: ${OUTPUT_DIR}`);
  console.log('\n📌 Próximo passo:');
  console.log('   1. Abra o Figma');
  console.log('   2. Menu: File → Import...');
  console.log('   3. Selecione TODAS as imagens da pasta figma-screenshots/');
  console.log('   4. Organize as telas no canvas em ordem de fluxo');
  console.log('='.repeat(50) + '\n');
}

captureAll().catch(console.error);

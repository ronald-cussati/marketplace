# 🌿 FeiraLocal — Marketplace Digital para Pequenos Produtores e Artesãos

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%2B_RLS-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Multivix](https://img.shields.io/badge/Faculdade-Multivix-005691?style=for-the-badge)](https://multivix.edu.br/)

Projeto acadêmico interdisciplinar do curso de **Bacharelado em Sistemas de Informação** da **Faculdade Multivix**. O **FeiraLocal** é um marketplace digital comunitário desenvolvido para feirantes, agricultores familiares e artesãos divulgarem e comercializarem seus produtos diretamente aos consumidores locais, sem intermediários predatórios.

---

## 🚀 Funcionalidades Principais

### 🛒 Para o Comprador (Consumidor Local)
- **Vitrine Interativa com Filtros:** Navegação por categorias (*Hortifrúti Orgânico, Queijos & Laticínios, Panificação & Doces, Mel & Geleias, Artesanato, Bebidas Artesanais*).
- **Busca em Tempo Real:** Pesquisa instantânea por nome do produto ou descrição.
- **Carrinho de Compras Reativo:** Adição de itens com validação imediata de estoque disponível e persistência local.
- **Checkout Simulado com Mock Gateway:** Escolha de método simulado (*Pix com QR Code mock, Cartão com preenchimento de teste e Pagamento na Entrega*), gerando aprovação instantânea e recibo.
- **Área "Meus Pedidos":** Acompanhamento do histórico de compras e status.

### 👨‍🌾 Para o Produtor / Vendedor
- **Cadastro e Autenticação Integrada:** Criação automática de perfil e loja na base de dados Supabase.
- **Painel do Vendedor Completo:**
  - Métricas de faturamento simulado e contagem de pedidos.
  - Alerta visual de produtos com estoque baixo (5 unidades ou menos).
- **CRUD de Produtos com Gestão de Estoque:**
  - Cadastro e edição de itens com foto, preço, categoria e estoque.
  - Botões de ajuste rápido de quantidade (+/-) e switch de ativação/desativação na vitrine.
- **Gestão de Pedidos Recebidos:** Listagem dos itens vendidos com nome e WhatsApp do comprador para separação no dia da feira.
- **Personalização da Banca:** Edição de bio, município de origem e contatos.

---

## 🏗️ Arquitetura e Modelo de Dados

- **Frontend & Backend:** Next.js 15 (App Router, Server Components & Client Hooks).
- **Estilização:** Tailwind CSS com paleta artesanal/orgânica customizada e micro-interações.
- **Banco de Dados & Autenticação:** PostgreSQL gerenciado via Supabase com **Row Level Security (RLS)** ativo em 100% das tabelas.
- **Pagamento:** Módulo desacoplado de Mock de Gateway de Pagamento.

```
usuarios (id, nome, tipo, telefone)
    └── vendedores (id, usuario_id, nome_loja, descricao, cidade)
            └── produtos (id, vendedor_id, nome, preco, categoria, estoque_qtd, ativo)
pedidos (id, comprador_id, status, total)
    ├── itens_pedido (id, pedido_id, produto_id, quantidade, preco_unitario)
    └── pagamentos (id, pedido_id, status = 'aprovado', metodo = 'mock')
```

---

## 📚 Acervo de Entregáveis Acadêmicos (Multivix)

Todos os 13 entregáveis exigidos encontram-se estruturados na pasta [`/docs`](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs) e raiz:

1. [Documento de Visão do Projeto](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/01-documento-visao.md)
2. [Backlog do Produto, EAP e MoSCoW](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/02-backlog-eap-moscow.md)
3. [Documento de Requisitos e Histórias BDD](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/03-documento-requisitos.md)
4. [Diagrama BPMN do Fluxo Ponta a Ponta](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/04-diagrama-bpmn.md)
5. [Modelagem de Dados (MER, DER e RLS)](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/05-modelagem-dados-mer.md)
6. [Diagrama de Arquitetura e Gateway Mock](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/06-diagrama-arquitetura.md)
7. [Protótipo de Interface e Design System](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/07-prototipo-interface.md)
8. [Manual de Instalação e Execução Local](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/08-manual-implantacao-local.md)
9. [Plano de Testes Funcionais e Usabilidade SUS](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/09-plano-testes-evidencias.md)
10. [Roteiro de Implantação na Nuvem Vercel](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/10-roteiro-implantacao-nuvem.md)
11. Código-fonte no GitHub com README Completo (Este arquivo)
12. [Roteiro da Apresentação Final (15–20 min)](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/docs/12-roteiro-apresentacao.md)
13. [Arquivo de Entrega Institucional do Grupo](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/entrega-grupo.txt)

---

## 🛠️ Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone https://github.com/ronald-cussati/marketplace.git
cd marketplace
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hzccqgzcttjsemshbqey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NEXT_PUBLIC_SITE_NAME=FeiraLocal
```

### 4. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 👥 Equipe Scrum (6 Integrantes — Multivix)

- **Ronald Cussati** — Desenvolvimento Full-Stack & Supabase
- **[Integrante 2]** — Engenharia de Requisitos & BPMN
- **[Integrante 3]** — Modelagem de Dados & Arquitetura
- **[Integrante 4]** — Design de Interface & Frontend
- **[Integrante 5]** — Qualidade, Testes & Usabilidade
- **[Integrante 6]** — DevOps, Deploy & Documentação

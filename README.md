# 🌿 FeiraLocal

Marketplace digital voltado para **pequenos produtores, agricultores familiares, feirantes e artesãos**, aproximando produtores locais de consumidores através de uma plataforma simples, moderna e responsiva.

🌐 **Aplicação online:** https://www.feiralocal.online/  
💻 **Repositório:** https://github.com/ronald-cussati/marketplace

---

## 📋 Sobre o projeto

O **FeiraLocal** foi desenvolvido como projeto acadêmico do curso de **Sistemas de Informação da Faculdade Multivix**.

A proposta é digitalizar parte da experiência das feiras locais, permitindo que produtores divulguem seus produtos e gerenciem sua banca, enquanto consumidores podem pesquisar produtos, adicioná-los ao carrinho e realizar pedidos.

O projeto aplica conceitos de:

- Desenvolvimento Web;
- Engenharia de Software;
- Banco de Dados;
- Engenharia de Requisitos;
- Segurança da Informação;
- UX/UI;
- Testes;
- Deploy em nuvem.

---

## 🚀 Funcionalidades

### 🛒 Consumidor

O usuário pode:

- Visualizar produtos disponíveis;
- Pesquisar produtos;
- Filtrar por categorias;
- Acessar detalhes de cada produto;
- Visualizar a banca do produtor;
- Adicionar produtos ao carrinho;
- Alterar quantidades;
- Finalizar pedidos;
- Escolher formas de pagamento simuladas;
- Consultar seus pedidos.

---

### 👨‍🌾 Produtor

O produtor possui um painel administrativo onde pode:

- Cadastrar produtos;
- Editar produtos;
- Remover produtos;
- Ativar ou desativar produtos;
- Controlar estoque;
- Visualizar produtos com estoque baixo;
- Consultar pedidos recebidos;
- Visualizar informações dos compradores;
- Personalizar informações da sua banca.

---

## 💳 Checkout e pagamentos

O sistema possui um **gateway de pagamento simulado**, criado para representar o fluxo de checkout sem utilizar transações financeiras reais.

Entre as opções simuladas estão:

- PIX;
- Cartão;
- Pagamento na entrega.

> O módulo de pagamento é apenas acadêmico e não processa pagamentos reais.

---

## 🔐 Autenticação e segurança

A autenticação e o banco de dados utilizam o **Supabase**.

O sistema possui:

- Cadastro de usuários;
- Login;
- Controle de sessão;
- Associação entre usuário e produtor;
- Controle de acesso;
- Row Level Security (RLS).

As políticas de RLS ajudam a garantir que cada usuário possa manipular apenas os dados aos quais possui acesso.

---

## 🧰 Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| **Next.js 15** | Framework principal |
| **React 19** | Interface |
| **TypeScript** | Tipagem |
| **Tailwind CSS** | Estilização |
| **Supabase** | Banco de dados e autenticação |
| **PostgreSQL** | Persistência de dados |
| **Lucide React** | Ícones |
| **Vercel** | Deploy |

---

## 📁 Estrutura principal

```text
marketplace/
│
├── docs/
├── scripts/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── lib/
│   └── types/
│
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🧭 Principais rotas

| Rota | Função |
|---|---|
| `/` | Página inicial |
| `/cadastro` | Cadastro |
| `/login` | Login |
| `/produtos/[id]` | Detalhes do produto |
| `/loja/[id]` | Página do produtor |
| `/carrinho` | Carrinho |
| `/checkout` | Finalização da compra |
| `/meus-pedidos` | Pedidos do consumidor |
| `/painel` | Painel do produtor |
| `/pedido-sucesso/[id]` | Confirmação do pedido |

---

## 🗃️ Banco de dados

O sistema utiliza **PostgreSQL através do Supabase**.

As principais entidades da aplicação são:

```text
Usuários
   │
   ├── Vendedores
   │      └── Produtos
   │
   └── Pedidos
          ├── Itens do pedido
          └── Pagamentos
```

O estoque dos produtos também é integrado ao fluxo de compra, evitando que sejam solicitadas quantidades superiores às disponíveis.

---

## ⚙️ Executando o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/ronald-cussati/marketplace.git
cd marketplace
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
NEXT_PUBLIC_SITE_NAME=FeiraLocal
```

### 4. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

---

## 📜 Scripts

```bash
npm run dev
```

Inicia o ambiente de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run start
```

Executa a aplicação em produção.

```bash
npm run lint
```

Executa a análise de código configurada no projeto.

---

## 📚 Documentação

O diretório `docs/` contém os principais artefatos acadêmicos do projeto, incluindo:

- Documento de visão;
- Documento de requisitos;
- Backlog e EAP;
- Priorização MoSCoW;
- BPMN;
- Modelagem de dados;
- Diagrama de arquitetura;
- Protótipos;
- Manual de implantação;
- Plano de testes;
- Roteiro de deploy;
- Roteiro de apresentação.

---

## 👥 Equipe

Projeto desenvolvido pelos alunos:

- **Alvino Mainette Santos**
- **Amanda Marcarini Cezanhock**
- **Jordana Wantil Tomazeli**
- **Leonarda Candal de Carvalho**
- **Ronald Cussati Cesar da Fonseca**
- **Thalys Cestari Thouzo**

**Curso:** Sistemas de Informação  
**Instituição:** Faculdade Multivix

---

## ☁️ Deploy

A aplicação está publicada utilizando **Vercel**, integrada ao repositório GitHub.

```text
GitHub
   ↓
Vercel
   ↓
Next.js
   ↓
Supabase
```

🌐 https://www.feiralocal.online/

---

## 📌 Status

**Status:** Projeto acadêmico funcional  
**Frontend:** Next.js + React  
**Banco:** Supabase / PostgreSQL  
**Linguagem:** TypeScript  
**Deploy:** Vercel  
**Pagamentos:** Gateway simulado

---

## 🌱 FeiraLocal

> **Fortalecendo produtores locais através da tecnologia.**

**Da banca da feira direto para a sua mesa.**
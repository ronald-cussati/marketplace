# 🌿 FeiraLocal

### Marketplace Digital para Pequenos Produtores, Agricultores Familiares e Artesãos

<p align="center">
  <strong>Da banca da feira direto para a sua mesa.</strong>
</p>

<p align="center">
  <a href="https://www.feiralocal.online/">🌐 Acessar aplicação</a>
  ·
  <a href="https://github.com/ronald-cussati/marketplace">💻 Repositório</a>
</p>

---

## 📋 Sobre o Projeto

O **FeiraLocal** é uma plataforma de marketplace comunitário desenvolvida para aproximar **produtores locais, agricultores familiares, feirantes e artesãos** dos consumidores.

A proposta é transformar a tradicional experiência da feira em uma experiência digital, permitindo que pequenos produtores apresentem seus produtos, mantenham seus estoques e recebam pedidos, enquanto consumidores podem pesquisar produtos, adicionar itens ao carrinho e realizar pedidos através de uma interface simples e responsiva.

O projeto foi desenvolvido como **projeto acadêmico interdisciplinar do curso de Bacharelado em Sistemas de Informação da Faculdade Multivix**, aplicando conceitos de:

- Engenharia de Software;
- Engenharia de Requisitos;
- Desenvolvimento Web;
- Banco de Dados;
- Arquitetura de Sistemas;
- UX/UI Design;
- Segurança da Informação;
- Testes de Software;
- Metodologias Ágeis;
- DevOps e Cloud Computing.

A aplicação encontra-se publicada e pode ser acessada através do endereço:

**🌐 https://www.feiralocal.online/**

O repositório oficial do projeto está disponível em:

**💻 https://github.com/ronald-cussati/marketplace**

---

# 🎯 Objetivo

O principal objetivo do FeiraLocal é criar uma solução digital que permita aos pequenos produtores comercializarem seus produtos de maneira mais acessível, reduzindo a dependência de intermediários e aumentando a visibilidade dos produtos locais.

### Problema

Pequenos produtores e artesãos frequentemente dependem de:

- vendas presenciais;
- divulgação através de redes sociais;
- mensagens individuais pelo WhatsApp;
- controle manual de estoque;
- divulgação limitada ao público da região.

Isso pode dificultar a organização das vendas e limitar o alcance dos produtores.

### Solução

O FeiraLocal centraliza esse processo em uma única plataforma.

O produtor pode:

1. Criar sua conta;
2. Criar sua banca virtual;
3. Cadastrar seus produtos;
4. Definir preços e estoque;
5. Ativar ou desativar produtos;
6. Receber pedidos;
7. Visualizar informações dos compradores;
8. Gerenciar sua operação através de um painel.

Enquanto o consumidor pode:

1. Explorar produtos;
2. Pesquisar por nome ou descrição;
3. Filtrar por categoria;
4. Visualizar produtos e produtores;
5. Adicionar produtos ao carrinho;
6. Finalizar um pedido;
7. Escolher um método de pagamento simulado;
8. Consultar seus pedidos.

---

# 🚀 Funcionalidades

## 🛒 Área do Consumidor

### Vitrine de produtos

A página inicial apresenta os produtos disponíveis na plataforma em formato de vitrine.

O consumidor pode visualizar informações como:

- Nome do produto;
- Preço;
- Categoria;
- Produtor;
- Disponibilidade;
- Imagem;
- Descrição.

A aplicação possui categorias relacionadas ao contexto de produtos locais, incluindo:

- 🌱 Hortifrúti Orgânico;
- 🧀 Queijos & Laticínios;
- 🍞 Pães & Doces;
- 🍯 Mel & Geleias;
- 🏺 Artesanato & Decoração;
- 🥤 Bebidas & Licores;
- 🌿 Temperos & Ervas.

---

## 🔎 Busca de produtos

O sistema disponibiliza pesquisa de produtos.

O usuário pode procurar por termos relacionados ao:

- Nome do produto;
- Descrição;
- Tipo de produto.

A busca permite encontrar produtos sem precisar navegar manualmente por todas as categorias.

---

## 🏷️ Filtros por categoria

Os produtos podem ser filtrados através das categorias disponíveis.

Isso permite que o consumidor encontre rapidamente produtos relacionados ao que procura.

Exemplo:

```text
Hortifrúti Orgânico
        ↓
Produtos disponíveis
        ↓
Seleção do produto
        ↓
Visualização dos detalhes
```

---

# 🏪 Página do Produtor

Cada produtor possui uma página própria, funcionando como uma **banca virtual**.

A página apresenta informações como:

- Nome da banca;
- Descrição;
- Município;
- Informações do produtor;
- Produtos cadastrados;
- Informações de contato.

Isso permite que o consumidor conheça não apenas o produto, mas também quem está por trás da produção.

---

# 📦 Página de Produto

Cada produto possui uma página própria com informações detalhadas.

O consumidor pode visualizar:

- Imagem;
- Nome;
- Descrição;
- Preço;
- Categoria;
- Produtor responsável;
- Disponibilidade em estoque;
- Quantidade desejada.

A página também permite adicionar o produto ao carrinho.

---

# 🛍️ Carrinho de Compras

O carrinho permite que o consumidor organize os produtos antes de finalizar a compra.

É possível:

- Adicionar produtos;
- Remover produtos;
- Alterar quantidades;
- Visualizar subtotal;
- Visualizar total;
- Conferir os produtos selecionados.

O sistema também realiza validações relacionadas ao estoque disponível.

O estado do carrinho possui persistência local, permitindo que os itens selecionados sejam mantidos durante a navegação.

---

# 💳 Checkout

O projeto possui um **gateway de pagamento simulado (Mock Gateway)**.

Essa abordagem foi utilizada para representar o fluxo de pagamento sem realizar transações financeiras reais.

O checkout permite simular diferentes formas de pagamento:

### PIX

Fluxo simulado de pagamento via PIX, incluindo representação de QR Code.

### Cartão

Formulário para preenchimento de dados de cartão de teste.

### Pagamento na entrega

Permite simular um pedido cujo pagamento acontece no momento da retirada/entrega.

---

## ⚠️ Importante sobre pagamentos

O gateway implementado no projeto é **exclusivamente acadêmico e simulado**.

Nenhum pagamento financeiro real é processado pela aplicação.

A arquitetura foi desenvolvida de maneira desacoplada para permitir que, futuramente, o módulo possa ser substituído por um gateway real.

---

# 🧾 Confirmação do Pedido

Após o checkout, o sistema apresenta uma página de confirmação.

O usuário recebe:

- Identificação do pedido;
- Produtos comprados;
- Quantidades;
- Valores;
- Total;
- Status do pagamento;
- Informações relacionadas ao pedido.

A aplicação possui uma rota específica para confirmação:

```text
/pedido-sucesso/[id]
```

---

# 📋 Meus Pedidos

O consumidor possui uma área dedicada ao histórico de pedidos.

Através dela é possível acompanhar:

- Pedidos realizados;
- Produtos comprados;
- Valores;
- Status;
- Informações do pedido.

Rota:

```text
/meus-pedidos
```

---

# 👨‍🌾 Área do Produtor

O FeiraLocal possui uma área administrativa destinada aos produtores.

O produtor pode gerenciar sua banca e seus produtos através de um painel próprio.

Rota:

```text
/painel
```

---

# 📊 Dashboard do Produtor

O painel apresenta informações relevantes para o gerenciamento da banca.

Entre os indicadores estão:

- Quantidade de pedidos;
- Faturamento simulado;
- Produtos cadastrados;
- Situação do estoque;
- Produtos com estoque reduzido.

O sistema possui alerta visual para produtos com **5 unidades ou menos** em estoque.

---

# 📦 Gerenciamento de Produtos

O produtor possui controle completo sobre seus produtos.

É possível:

### Criar

Cadastrar um novo produto informando:

- Nome;
- Descrição;
- Preço;
- Categoria;
- Estoque;
- Imagem;
- Status de publicação.

### Visualizar

Consultar os produtos cadastrados na banca.

### Editar

Alterar informações de produtos existentes.

### Excluir

Remover produtos que não devem mais fazer parte da banca.

### Controlar estoque

A quantidade disponível pode ser ajustada através de controles rápidos de incremento e decremento.

### Ativar/desativar

Um produto pode ser temporariamente retirado da vitrine sem necessariamente ser excluído do banco de dados.

Esse mecanismo permite preservar os dados históricos do produto enquanto controla sua disponibilidade comercial.

---

# 📦 Controle de Estoque

O estoque é integrado ao fluxo de compra.

Quando o consumidor adiciona um produto ao carrinho, o sistema considera a quantidade disponível.

Isso evita que o consumidor selecione uma quantidade superior à disponibilidade cadastrada.

O produtor também pode atualizar rapidamente a quantidade disponível.

### Alerta de estoque baixo

Produtos com:

```text
estoque <= 5
```

são destacados para chamar a atenção do produtor.

---

# 🧾 Gestão de Pedidos do Produtor

O produtor pode consultar os pedidos recebidos.

As informações permitem organizar os produtos que deverão ser separados para o consumidor.

Entre as informações disponíveis estão:

- Produto;
- Quantidade;
- Valor;
- Comprador;
- Telefone/WhatsApp;
- Status do pedido.

Esse fluxo foi pensado especialmente para o contexto de retirada ou entrega durante a feira.

---

# 🏪 Personalização da Banca

O produtor pode personalizar as informações públicas de sua loja.

Entre os dados estão:

- Nome da banca;
- Descrição;
- Município;
- Informações de contato;
- Biografia/apresentação.

O objetivo é criar uma identidade digital para cada produtor.

---

# 🔐 Autenticação

A aplicação utiliza autenticação integrada ao **Supabase**.

O sistema contempla:

- Cadastro;
- Login;
- Sessão do usuário;
- Identificação do tipo de usuário;
- Associação entre usuário e produtor;
- Proteção das áreas administrativas.

A autenticação é integrada à estrutura de dados da aplicação.

---

# 🛡️ Segurança e Row Level Security

O banco de dados utiliza **Row Level Security (RLS)** através do Supabase.

A finalidade é controlar quais registros cada usuário pode acessar ou modificar.

A aplicação segue o princípio de que o usuário deve ter acesso somente aos dados que possui autorização para manipular.

Exemplo conceitual:

```text
Usuário
   │
   ├── Seus dados
   │
   ├── Sua banca
   │
   ├── Seus produtos
   │
   └── Seus pedidos
```

As políticas de segurança ficam associadas ao banco de dados PostgreSQL gerenciado pelo Supabase.

---

# 🏗️ Arquitetura

O projeto utiliza uma arquitetura baseada em **Next.js 15 com App Router**, utilizando React no frontend e Supabase como camada de persistência e autenticação.

Arquitetura simplificada:

```text
                    ┌─────────────────────┐
                    │      Usuário        │
                    │  Navegador / Mobile │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Next.js        │
                    │     App Router      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
        ┌─────────────────┐       ┌──────────────────┐
        │ React Components│       │ Server / Client  │
        │     + Hooks     │       │      Logic       │
        └────────┬────────┘       └─────────┬────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │ Authentication      │
                    │ PostgreSQL          │
                    │ RLS                 │
                    └─────────────────────┘
```

---

# 🧰 Stack Tecnológica

## Frontend

| Tecnologia | Utilização |
|---|---|
| **React 19** | Construção da interface |
| **Next.js 15** | Framework principal |
| **TypeScript** | Tipagem estática |
| **Tailwind CSS** | Estilização |
| **Lucide React** | Ícones |
| **clsx** | Composição de classes |
| **tailwind-merge** | Gerenciamento de classes Tailwind |

O `package.json` do projeto confirma o uso de Next.js 15.1.7, React 19, TypeScript, Tailwind CSS, Supabase SSR e Supabase JS.

---

## Backend / Dados

### Supabase

Utilizado para:

- Autenticação;
- PostgreSQL;
- Persistência de dados;
- Controle de acesso;
- Row Level Security.

---

## Banco de Dados

O banco utiliza PostgreSQL através do Supabase.

O modelo conceitual principal pode ser representado da seguinte maneira:

```text
USUÁRIOS
   │
   │ 1:N
   ▼
VENDEDORES
   │
   │ 1:N
   ▼
PRODUTOS


USUÁRIOS
   │
   │ 1:N
   ▼
PEDIDOS
   │
   ├──────────────┐
   │              │
   ▼              ▼
ITENS_PEDIDO   PAGAMENTOS
   │
   │ N:1
   ▼
PRODUTOS
```

### Principais entidades

#### `usuarios`

Armazena os usuários da plataforma.

Exemplo de campos:

```text
id
nome
tipo
telefone
```

---

#### `vendedores`

Representa a banca/produtor associado a um usuário.

```text
id
usuario_id
nome_loja
descricao
cidade
```

---

#### `produtos`

Armazena os produtos comercializados.

```text
id
vendedor_id
nome
preco
categoria
estoque_qtd
ativo
```

---

#### `pedidos`

Representa uma compra realizada.

```text
id
comprador_id
status
total
```

---

#### `itens_pedido`

Representa os produtos pertencentes a um pedido.

```text
id
pedido_id
produto_id
quantidade
preco_unitario
```

---

#### `pagamentos`

Registra o resultado do pagamento simulado.

```text
id
pedido_id
status
metodo
```

No cenário acadêmico, o pagamento pode assumir o status:

```text
aprovado
```

e utilizar:

```text
metodo = mock
```

---

# 📁 Estrutura do Projeto

A estrutura principal do código está organizada dentro de `src`, separando páginas, componentes, contextos, bibliotecas e tipos.

```text
marketplace/
│
├── docs/
│   ├── 01-documento-visao.md
│   ├── 02-backlog-eap-moscow.md
│   ├── 03-documento-requisitos.md
│   ├── 04-diagrama-bpmn.md
│   ├── 05-modelagem-dados-mer.md
│   ├── 06-diagrama-arquitetura.md
│   ├── 07-prototipo-interface.md
│   ├── 08-manual-implantacao-local.md
│   ├── 09-plano-testes-evidencias.md
│   ├── 10-roteiro-implantacao-nuvem.md
│   └── 12-roteiro-apresentacao.md
│
├── scripts/
│
├── src/
│   ├── app/
│   │   ├── cadastro/
│   │   ├── carrinho/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── loja/[id]/
│   │   ├── meus-pedidos/
│   │   ├── painel/
│   │   ├── pedido-sucesso/[id]/
│   │   ├── produtos/[id]/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   │
│   ├── components/
│   │
│   ├── contexts/
│   │
│   ├── lib/
│   │
│   └── types/
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

A aplicação possui rotas específicas para cadastro, login, carrinho, checkout, lojas, pedidos, painel administrativo, confirmação de pedido e produtos individuais.

---

# 🧭 Principais Rotas

| Rota | Função |
|---|---|
| `/` | Página inicial e vitrine |
| `/cadastro` | Cadastro de usuário/produtor |
| `/login` | Autenticação |
| `/carrinho` | Carrinho de compras |
| `/checkout` | Finalização do pedido |
| `/meus-pedidos` | Histórico do consumidor |
| `/loja/[id]` | Página pública do produtor |
| `/produtos/[id]` | Detalhes do produto |
| `/painel` | Dashboard do produtor |
| `/pedido-sucesso/[id]` | Confirmação do pedido |

---

# 🔄 Fluxo de Compra

O fluxo principal do consumidor pode ser representado por:

```text
┌──────────────┐
│ Página Inicial│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Pesquisar /  │
│   Filtrar    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Produto    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Carrinho  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Checkout   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Mock Gateway │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Pedido Criado│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Confirmação  │
└──────────────┘
```

---

# 🔄 Fluxo do Produtor

```text
Cadastro
   │
   ▼
Login
   │
   ▼
Painel do Produtor
   │
   ├───────────────┐
   │               │
   ▼               ▼
Produtos        Pedidos
   │               │
   ├── Criar       ├── Visualizar
   ├── Editar      ├── Separar
   ├── Estoque     └── Contatar
   └── Ativar
```

---

# 🖥️ Interface e Design

A interface foi desenvolvida considerando o contexto visual de:

- Agricultura familiar;
- Feiras livres;
- Produtos artesanais;
- Produção regional;
- Sustentabilidade;
- Comércio local.

O projeto utiliza uma identidade visual baseada em elementos naturais e uma paleta artesanal/orgânica.

Também foram utilizados micro-interações para melhorar a percepção de resposta da interface.

---

# 📱 Responsividade

A interface foi desenvolvida para funcionar em diferentes tamanhos de tela.

O objetivo é permitir que o consumidor utilize a plataforma principalmente através de:

- Computadores;
- Notebooks;
- Tablets;
- Smartphones.

Isso é particularmente importante para o produtor, que pode precisar administrar sua banca diretamente através do celular.

---

# ☁️ Deploy

A aplicação está publicada utilizando **Vercel** como plataforma de deploy.

A arquitetura utiliza:

```text
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js
   │
   ▼
Supabase
```

O site publicado está disponível em:

**https://www.feiralocal.online/**

---

# ⚙️ Instalação Local

## Pré-requisitos

Antes de executar o projeto, é necessário possuir:

- Node.js;
- npm;
- Git;
- Conta/projeto no Supabase.

Recomenda-se utilizar uma versão atual do Node.js compatível com Next.js 15.

---

## 1. Clonar o repositório

```bash
git clone https://github.com/ronald-cussati/marketplace.git
```

Entrar no diretório:

```bash
cd marketplace
```

---

## 2. Instalar dependências

```bash
npm install
```

---

## 3. Configurar variáveis de ambiente

Crie um arquivo:

```text
.env.local
```

na raiz do projeto.

Exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
NEXT_PUBLIC_SITE_NAME=FeiraLocal
```

### ⚠️ Segurança

Nunca publique no GitHub:

```text
.env.local
```

ou qualquer arquivo contendo credenciais privadas.

O repositório possui um arquivo `.env.example` para demonstrar as variáveis necessárias sem expor segredos.

---

## 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível normalmente em:

```text
http://localhost:3000
```

---

# 🏗️ Build de Produção

Para gerar a versão de produção:

```bash
npm run build
```

Depois:

```bash
npm run start
```

---

# 📜 Scripts disponíveis

Os scripts principais definidos no projeto são:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a build de produção.

```bash
npm run start
```

Executa a aplicação em modo de produção.

```bash
npm run lint
```

Executa a verificação de lint configurada para o projeto.

Os scripts são definidos diretamente no `package.json`.

---

# 📚 Documentação Acadêmica

O repositório contém uma estrutura dedicada aos entregáveis acadêmicos do projeto.

A pasta `docs/` possui documentação relacionada ao processo de desenvolvimento e aos artefatos exigidos pela disciplina.

### Documentos disponíveis

| Nº | Documento |
|---:|---|
| 01 | Documento de Visão do Projeto |
| 02 | Backlog, EAP e MoSCoW |
| 03 | Documento de Requisitos |
| 04 | Diagrama BPMN |
| 05 | Modelagem de Dados — MER |
| 06 | Diagrama de Arquitetura |
| 07 | Protótipo de Interface |
| 08 | Manual de Implantação Local |
| 09 | Plano de Testes e Evidências |
| 10 | Roteiro de Implantação em Nuvem |
| 12 | Roteiro da Apresentação |

Essa documentação complementa o código-fonte e permite compreender não apenas **como o sistema foi implementado**, mas também **como seus requisitos, arquitetura, dados, testes e implantação foram planejados**.

---

# 🧪 Testes

O projeto possui documentação específica relacionada ao planejamento e execução de testes.

Os testes abrangem aspectos como:

- Funcionamento das funcionalidades;
- Fluxos de compra;
- Cadastro;
- Autenticação;
- Produtos;
- Carrinho;
- Checkout;
- Pedidos;
- Área do produtor;
- Usabilidade.

Também foi considerada avaliação de usabilidade através da metodologia **SUS — System Usability Scale**.

---

# 🔒 Considerações de Segurança

O projeto utiliza algumas práticas importantes:

- Variáveis sensíveis através de `.env.local`;
- Autenticação através do Supabase;
- Row Level Security;
- Separação entre frontend e persistência;
- Controle de acesso aos dados;
- Validação de estoque;
- Não exposição de credenciais privadas no código-fonte.

> **Nota:** por se tratar de um projeto acadêmico, o gateway de pagamento é simulado e não deve ser utilizado como infraestrutura de pagamentos reais sem uma implementação adicional de segurança, antifraude, validação e integração com um provedor financeiro.

---

# 🧩 Decisões Técnicas

## Por que Next.js?

O Next.js foi escolhido por fornecer uma estrutura moderna para aplicações React, incluindo:

- App Router;
- Server Components;
- Client Components;
- Roteamento baseado em arquivos;
- Otimizações de aplicação;
- Integração simplificada com deploy na Vercel.

---

## Por que Supabase?

O Supabase foi utilizado por oferecer uma combinação de:

- PostgreSQL;
- Autenticação;
- APIs;
- Row Level Security;
- Integração com aplicações JavaScript/TypeScript.

Isso permitiu desenvolver rapidamente uma arquitetura full-stack sem a necessidade de implementar manualmente toda a infraestrutura de backend.

---

## Por que TypeScript?

O TypeScript permite adicionar tipagem estática ao projeto, reduzindo erros relacionados a tipos e tornando o código mais previsível e fácil de manter.

---

## Por que Tailwind CSS?

O Tailwind CSS permite construir a interface utilizando classes utilitárias, facilitando:

- Padronização visual;
- Responsividade;
- Reutilização;
- Desenvolvimento rápido;
- Manutenção do design.

---

# 📈 Possíveis Evoluções

Embora o projeto utilize um gateway de pagamento simulado, a arquitetura permite evoluções futuras.

Entre as possíveis melhorias estão:

### 💳 Pagamentos reais

Integração com:

- Mercado Pago;
- Stripe;
- Asaas;
- PagBank;
- Outro gateway compatível.

---

### 📍 Entregas

Implementação de:

- Área de entrega;
- Cálculo de distância;
- Taxa de entrega;
- Rastreamento;
- Integração com entregadores.

---

### 💬 Comunicação

Implementação de:

- Chat comprador ↔ produtor;
- Notificações;
- Integração oficial com WhatsApp;
- E-mail transacional.

---

### 📊 Analytics

Dashboard com:

- Vendas por período;
- Produtos mais vendidos;
- Ticket médio;
- Receita;
- Conversão;
- Estoque;
- Produtos mais visualizados.

---

### ⭐ Avaliações

Sistema de avaliação para:

- Produtos;
- Produtores;
- Pedidos.

---

### 🔔 Notificações

Notificações para:

- Novo pedido;
- Pedido atualizado;
- Estoque baixo;
- Produto esgotado;
- Pagamento aprovado.

---

# 🎓 Contexto Acadêmico

O FeiraLocal foi desenvolvido como projeto acadêmico do curso de:

**Bacharelado em Sistemas de Informação**

**Faculdade Multivix**

O projeto busca integrar conhecimentos de diferentes áreas do curso em uma aplicação funcional, incluindo:

```text
Engenharia de Requisitos
        ↓
Modelagem
        ↓
Arquitetura
        ↓
Desenvolvimento
        ↓
Banco de Dados
        ↓
Segurança
        ↓
Testes
        ↓
Deploy
        ↓
Documentação
```

O projeto também utiliza uma abordagem baseada em **Scrum**, com organização de backlog, divisão de responsabilidades e desenvolvimento incremental.

---

# 👥 Equipe

Projeto desenvolvido por uma equipe acadêmica de Sistemas de Informação da Faculdade Multivix.

### Responsabilidades

| Área | Responsabilidade |
|---|---|
| Desenvolvimento Full-Stack | Implementação da aplicação |
| Banco de Dados | Modelagem e Supabase |
| Engenharia de Requisitos | Levantamento e documentação |
| Arquitetura | Definição da solução técnica |
| UI/UX | Interface e experiência do usuário |
| QA | Testes e validação |
| DevOps | Deploy e infraestrutura |
| Documentação | Artefatos acadêmicos |

### Desenvolvimento

**Ronald Cussati**  
Desenvolvimento Full-Stack & Integração Supabase

---

# 📂 Repositório

O código-fonte completo está disponível publicamente:

**https://github.com/ronald-cussati/marketplace**

A estrutura atual do repositório contém o código-fonte, documentação acadêmica, configurações do projeto e arquivos necessários para execução.

---

# 🌐 Aplicação Online

A versão publicada pode ser acessada em:

**https://www.feiralocal.online/**

A aplicação apresenta a vitrine, categorias, produtores, cadastro de banca e demais fluxos implementados no projeto.

---

# 📌 Status do Projeto

**Status:** 🟢 Projeto acadêmico funcional

**Versão:** `0.1.0`

**Deploy:** Vercel

**Banco de Dados:** Supabase / PostgreSQL

**Frontend:** Next.js + React

**Linguagem:** TypeScript

**Estilização:** Tailwind CSS

**Pagamentos:** Mock Gateway

---

# 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos no contexto da Faculdade Multivix.

Caso o projeto seja posteriormente disponibilizado para uso comercial ou distribuição pública, recomenda-se definir uma licença de software específica e revisar as condições de utilização do código, imagens, dados e demais recursos utilizados.

---

# 🌱 FeiraLocal

> **Fortalecendo produtores locais através da tecnologia.**

O FeiraLocal demonstra como uma aplicação web pode conectar tecnologia, comércio local e agricultura familiar em uma única plataforma digital.

**Da banca da feira direto para a sua mesa.**

---

<p align="center">
  Desenvolvido com 💻 por estudantes de Sistemas de Informação — Multivix
</p>
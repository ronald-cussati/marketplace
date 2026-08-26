# Documento de Especificação de Requisitos — FeiraLocal

**Curso:** Bacharelado em Sistemas de Informação — Faculdade Multivix  
**Disciplina:** Engenharia de Software / Projeto Interdisciplinar  
**Projeto:** FeiraLocal  
**Versão:** 1.0  
**Data:** 2026-08-26  

---

## 1. Requisitos Funcionais e Histórias de Usuário (User Stories)

### 1.1 Módulo de Autenticação e Perfis

#### **US-01: Cadastro de Usuário com Seleção de Perfil**
- **Como** visitante do FeiraLocal,
- **Quero** criar uma conta informando meu e-mail, senha, nome, telefone e selecionando se sou "Comprador" ou "Vendedor",
- **Para que** eu possa acessar os recursos personalizados da plataforma.

**Critérios de Aceitação (BDD / Gherkin):**
```gherkin
Cenário: Cadastro de Comprador com sucesso
  Dado que estou na página "/cadastro"
  Quando preencho meu nome "Maria Silva", e-mail "maria@exemplo.com", senha "SenhaSegura123" e seleciono o tipo "Comprador"
  E clico no botão "Criar Conta"
  Então minha conta é registrada no Supabase Auth e na tabela "usuarios" com tipo "comprador"
  E sou redirecionado para a página inicial com sessão ativa.

Cenário: Cadastro de Vendedor com criação automática de Loja
  Dado que estou na página "/cadastro"
  Quando preencho meus dados e seleciono o tipo "Vendedor"
  E preencho os campos adicionais: Nome da Loja "Horta do Zé", Cidade "Vitória" e Descrição "Hortaliças orgânicas colhidas no dia"
  E clico em "Criar Conta"
  Então minha conta é criada no Supabase Auth, na tabela "usuarios" (tipo "vendedor") e na tabela "vendedores" vinculada ao meu ID
  E sou redirecionado diretamente para o "/painel" do vendedor.
```

---

#### **US-02: Login e Gerenciamento de Sessão**
- **Como** usuário cadastrado,
- **Quero** realizar login com meu e-mail e senha,
- **Para que** eu possa acessar meu carrinho, histórico ou painel de vendas.

**Critérios de Aceitação:**
```gherkin
Cenário: Login com credenciais válidas
  Dado que estou na página "/login"
  Quando informo meu e-mail e senha corretos e clico em "Entrar"
  Então sou autenticado e a barra de navegação passa a exibir meu nome e atalhos correspondentes ao meu perfil.

Cenário: Tentativa com credenciais incorretas
  Dado que informo uma senha incorreta
  Quando clico em "Entrar"
  Então vejo uma mensagem amigável de erro informando "E-mail ou senha incorretos" sem expor detalhes técnicos do banco.
```

---

### 1.2 Módulo de Catálogo e Produtos

#### **US-03: Visualização da Vitrine Pública e Filtros**
- **Como** comprador,
- **Quero** navegar pelo catálogo de produtos com filtros por categoria (Hortifrúti, Queijos, Doces, Artesanato, etc.) e campo de busca instantânea,
- **Para que** eu encontre rapidamente os itens de meu interesse.

**Critérios de Aceitação:**
```gherkin
Cenário: Filtragem por categoria
  Dado que estou na página inicial
  Quando clico na categoria "Queijos & Laticínios"
  Então o catálogo exibe apenas os produtos ativos cadastrados nessa categoria
  E a quantidade de itens encontrados é atualizada na tela.

Cenário: Busca textual por nome do produto
  Dado que digito "Mel" no campo de busca
  Quando o texto é processado
  Então são listados todos os produtos cujo nome ou descrição contenham a palavra "Mel", independentemente de maiúsculas/minúsculas.
```

---

#### **US-04: Gestão de Produtos pelo Vendedor (CRUD)**
- **Como** produtor/vendedor autenticado,
- **Quero** cadastrar, listar, editar e inativar meus produtos informando nome, descrição, preço, categoria, quantidade em estoque e imagem,
- **Para que** minha vitrine esteja sempre atualizada para os compradores.

**Critérios de Aceitação:**
```gherkin
Cenário: Cadastro de novo produto com estoque
  Dado que estou no "/painel/produtos" e clico em "Novo Produto"
  Quando preencho nome "Queijo Meia Cura", preço "32.00", estoque "15", categoria "Queijos & Laticínios" e clico em "Salvar"
  Então o produto é gravado na tabela "produtos" associado ao meu "vendedor_id"
  E passa a ser exibido imediatamente na minha listagem e no catálogo público.

Cenário: Inativação de produto esgotado
  Dado que tenho um produto com estoque zero
  Quando desmarco o switch "Produto Ativo"
  Então o campo "ativo" passa para false e o item deixa de ser exibido na vitrine pública para compradores.
```

---

### 1.3 Módulo de Carrinho e Checkout Simulado

#### **US-05: Carrinho de Compras Reativo**
- **Como** comprador,
- **Quero** adicionar produtos ao carrinho, alterar quantidades e remover itens,
- **Para que** eu monte minha cesta de compras com cálculo em tempo real.

**Critérios de Aceitação:**
```gherkin
Cenário: Limite de quantidade baseado no estoque disponível
  Dado que um produto tem 5 unidades em estoque
  Quando tento adicionar 6 unidades ao carrinho
  Então o sistema limita a quantidade em 5 e exibe um alerta informando "Limite máximo em estoque atingido".
```

---

#### **US-06: Checkout Simulado com Mock de Gateway de Pagamento**
- **Como** comprador com itens no carrinho,
- **Quero** revisar meu pedido, escolher um método de pagamento simulado (Pix, Cartão ou Dinheiro) e clicar em "Pagar",
- **Para que** meu pedido seja confirmado instantaneamente sem necessidade de cartão real.

**Critérios de Aceitação:**
```gherkin
Cenário: Finalização de compra simulada com sucesso
  Dado que estou na página "/checkout" com R$ 85,00 no carrinho
  Quando seleciono "Pix Simulado" e clico em "Confirmar Pagamento Simulado"
  Então o sistema cria um registro na tabela "pedidos" (status: 'pago'), grava os registros em "itens_pedido"
  E registra em "pagamentos" com status 'aprovado' e metodo 'mock'
  E decrementa a quantidade comprada do "estoque_qtd" de cada produto
  E sou redirecionado para a tela "/pedido-sucesso/[id]" exibindo a mensagem "✅ Pagamento aprovado com sucesso!".
```

---

### 1.4 Módulo Painel do Vendedor

#### **US-07: Dashboard de Vendas e Controle de Estoque**
- **Como** vendedor,
- **Quero** visualizar em meu painel o total faturado simulado, a quantidade de pedidos recebidos e alertas visuais de produtos com estoque baixo (menor que 5 unidades),
- **Para que** eu possa repor a produção da minha banca a tempo.

---

## 2. Requisitos Não Funcionais (RNF)

| Identificador | Categoria | Descrição e Métrica de Conformidade |
| :--- | :--- | :--- |
| **RNF-01** | **Usabilidade** | A interface deve seguir as 10 Heurísticas de Nielsen, com design responsivo (Mobile-First) adaptável a telas de 320px a 4K, contrastes WCAG AA e linguagem acessível ao produtor rural. |
| **RNF-02** | **Performance** | O tempo de carregamento da página inicial (LCP) não deve exceder 2 segundos em conexões 4G padrão; o TTFB (Time to First Byte) deve ser inferior a 300ms no Vercel Edge. |
| **RNF-03** | **Segurança & RLS** | 100% das tabelas do Supabase devem operar com Row Level Security (RLS) habilitado. Um vendedor nunca pode visualizar nem alterar produtos ou pedidos de outros vendedores. |
| **RNF-04** | **Compatibilidade** | O sistema deve funcionar de maneira consistente nos principais navegadores modernos (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge, Opera). |
| **RNF-05** | **Integridade de Dados** | Operações de checkout devem ser atômicas. O estoque só pode ser debitado se o pedido for confirmado com sucesso, prevenindo inconsistências de concorrência. |
| **RNF-06** | **Disponibilidade** | A arquitetura Serverless Next.js + Supabase gerenciado assegura disponibilidade teórica superior a 99,5% no ambiente de hospedagem. |
| **RNF-07** | **Manutenibilidade** | O código-fonte deve ser escrito em TypeScript estrito, com modularização em componentes reutilizáveis e padrão de pastas App Router. |

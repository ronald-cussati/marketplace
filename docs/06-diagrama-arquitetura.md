# Diagrama e Especificação de Arquitetura de Software — FeiraLocal

**Curso:** Bacharelado em Sistemas de Informação — Faculdade Multivix  
**Disciplina:** Arquitetura e Padrões de Software / Engenharia de Software  
**Projeto:** FeiraLocal  
**Stack:** Next.js 15 (App Router, Server & Client Components), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + RLS)  
**Versão:** 1.0  
**Data:** 2026-08-26  

---

## 1. Visão Geral da Arquitetura em Camadas

A arquitetura do **FeiraLocal** foi concebida seguindo o padrão **Clean Architecture / Layered Architecture** adaptado ao ecossistema moderno do Next.js (App Router) com integração Serverless ao Supabase.

```mermaid
graph TB
    subgraph "Navegador do Cliente (Client-Side)"
        UI[Camada de Apresentação / UI Components]
        CTX[Contexts Globais: AuthContext & CartContext]
        HOOKS[Hooks Customizados: useProducts, useOrders]
    end

    subgraph "Next.js Application Layer (Server & Edge)"
        ROUTING[App Router: Pages & Dynamic Routes]
        ACTIONS[Server Actions & API Routes]
        MW[Middleware de Sessão & Auth SSR]
        MOCK_GW[Mock Payment Gateway Service]
    end

    subgraph "Supabase Backend-as-a-Service (BaaS)"
        AUTH[Supabase Auth Engine]
        DB[(PostgreSQL Database)]
        RLS[Políticas Row Level Security]
        STORAGE[Supabase Storage - Imagens]
    end

    UI --> CTX
    CTX --> HOOKS
    HOOKS --> ROUTING
    ROUTING --> ACTIONS
    ACTIONS --> MW
    ACTIONS --> MOCK_GW
    MW --> AUTH
    ACTIONS --> DB
    DB --> RLS
    UI --> STORAGE
```

---

## 2. Estrutura de Diretórios e Pacotes

```text
src/
├── app/                        # Camada de Roteamento (App Router)
│   ├── (auth)/                 # Grupo de rotas de autenticação
│   │   ├── login/page.tsx
│   │   └── cadastro/page.tsx
│   ├── painel/                 # Área restrita do Vendedor
│   │   ├── layout.tsx          # Sidebar e verificação de role
│   │   ├── page.tsx            # Dashboard de métricas
│   │   ├── produtos/page.tsx   # Gestão de produtos & estoque
│   │   ├── pedidos/page.tsx    # Pedidos recebidos pelo produtor
│   │   └── perfil/page.tsx     # Edição dos dados da banca
│   ├── carrinho/page.tsx       # Cesta de compras do cliente
│   ├── checkout/page.tsx       # Checkout simulado com gateway mock
│   ├── pedido-sucesso/[id]/    # Recibo e confirmação do pedido
│   ├── meus-pedidos/page.tsx   # Histórico de compras do comprador
│   ├── produtos/[id]/page.tsx  # Página detalhada do produto
│   ├── loja/[id]/page.tsx      # Vitrine exclusiva do produtor
│   ├── layout.tsx              # Root layout (Navbar, Providers, Footer)
│   ├── page.tsx                # Vitrine principal e catálogo com filtros
│   └── globals.css             # Design tokens e Tailwind CSS
├── components/                 # Componentes Visuais Reutilizáveis
│   ├── layout/                 # Navbar, Footer, Sidebar
│   ├── ui/                     # Button, Card, Badge, Modal, Input, Toast
│   ├── produtos/               # ProductCard, ProductGrid, ProductFilter
│   ├── carrinho/               # CartDrawer, CartItem, OrderSummary
│   └── painel/                 # MetricCard, ProductModal, StockBadge
├── contexts/                   # Estado Global da Aplicação
│   ├── AuthContext.tsx         # Sessão, usuário ativo e perfil (comprador/vendedor)
│   └── CartContext.tsx         # Itens do carrinho, contadores e persistência
├── lib/                        # Integrações e Serviços
│   ├── supabase/
│   │   ├── client.ts           # Cliente Supabase para Browser Components
│   │   ├── server.ts           # Cliente Supabase para Server Actions
│   │   └── middleware.ts       # Validador de cookies de sessão
│   ├── services/
│   │   ├── mockPayment.ts      # Gateway de pagamento simulado
│   │   ├── productService.ts   # Operações de catálogo e estoque
│   │   └── orderService.ts     # Gravação atômica de pedidos
│   └── utils.ts                # Formatadores de moeda (BRL), datas e classes
└── types/                      # Definições de Tipos TypeScript
    └── database.ts             # Interfaces tipadas espelhando o banco
```

---

## 3. Diagrama de Classes e Entidades TypeScript

```mermaid
classDiagram
    class Usuario {
        +string id
        +string nome
        +TipoUsuario tipo
        +string telefone
        +Date criado_em
    }

    class Vendedor {
        +string id
        +string usuario_id
        +string nome_loja
        +string descricao
        +string cidade
        +Date criado_em
    }

    class Produto {
        +string id
        +string vendedor_id
        +string nome
        +string descricao
        +number preco
        +string categoria
        +number estoque_qtd
        +string imagem_url
        +boolean ativo
        +Date criado_em
    }

    class Pedido {
        +string id
        +string comprador_id
        +StatusPedido status
        +number total
        +Date criado_em
        +ItemPedido[] itens
    }

    class ItemPedido {
        +string id
        +string pedido_id
        +string produto_id
        +number quantidade
        +number preco_unitario
        +Produto produto
    }

    class PagamentoMock {
        +string id
        +string pedido_id
        +StatusPagamento status
        +string metodo
        +Date criado_em
    }

    Usuario "1" -- "0..1" Vendedor : possui
    Usuario "1" -- "*" Pedido : realiza
    Vendedor "1" -- "*" Produto : oferta
    Pedido "1" -- "*" ItemPedido : contém
    Produto "1" -- "*" ItemPedido : referencia
    Pedido "1" -- "1" PagamentoMock : liquida via mock
```

---

## 4. Padrão de Mock do Gateway de Pagamento

Para assegurar o desacoplamento e cumprir o requisito acadêmico sem expor transações financeiras reais, o sistema implementa a interface `PaymentGatewayService`:

```typescript
export interface PaymentResult {
  sucesso: boolean;
  transacaoId: string;
  metodo: 'pix' | 'cartao' | 'dinheiro' | 'mock';
  mensagem: string;
}

export class MockPaymentGateway {
  static async processarPagamento(pedidoId: string, valor: number, metodo: string): Promise<PaymentResult> {
    // Simula latência de rede realista (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    return {
      sucesso: true,
      transacaoId: `mock_${Date.now()}`,
      metodo: (metodo as any) || 'mock',
      mensagem: "Pagamento simulado aprovado com sucesso!",
    };
  }
}
```

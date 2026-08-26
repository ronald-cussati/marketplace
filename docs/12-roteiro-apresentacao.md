# Roteiro da Apresentação Final (15 a 20 Minutos) — FeiraLocal

**Curso:** Bacharelado em Sistemas de Informação — Faculdade Multivix  
**Projeto:** FeiraLocal — Marketplace Digital para Pequenos Produtores e Artesãos  
**Formato:** Apresentação em Vídeo / Slides + Demonstração Prática do Software  
**Tempo Total:** 18 minutos (Ideal: entre 15 e 20 min)  
**Equipe:** 6 Integrantes  
**Versão:** 1.0  
**Data:** 2026-08-26  

---

## 1. Grade Cronometrada de Fala por Integrante

| Bloco | Duração | Tema Abordado | Responsável Sugerido |
| :---: | :---: | :--- | :--- |
| **Bloco 1** | 02:30 min | **Abertura, Contexto e Problema:** Apresentação da equipe, motivação social do marketplace comunitário e diferenciais frente a grandes plataformas. | Integrante 1 |
| **Bloco 2** | 02:30 min | **Metodologia Ágil (Scrum) & Requisitos:** Papéis, rodízio de PO simulando a feira, divisão dos Sprints e priorização MoSCoW. | Integrante 2 |
| **Bloco 3** | 03:00 min | **Processos de Negócio & BPMN:** Demonstração do fluxo de compra ponta a ponta nas raias de responsabilidade. | Integrante 3 |
| **Bloco 4** | 03:00 min | **Modelagem de Dados e Arquitetura:** Estrutura do PostgreSQL no Supabase, políticas de RLS e arquitetura em camadas Next.js. | Integrante 4 |
| **Bloco 5** | 05:00 min | **Demonstração Prática do Software (Live Demo):**<br>- Cadastro do produtor e criação de produtos.<br>- Navegação na vitrine com filtros e busca.<br>- Carrinho de compras e simulação de checkout com aprovação mock.<br>- Painel do vendedor com baixa de estoque em tempo real. | Integrante 5 |
| **Bloco 6** | 02:00 min | **Plano de Testes, Deploy e Conclusão:** Resultados do teste de usabilidade (SUS Score), relato do deploy na Vercel e considerações finais. | Integrante 6 |

---

## 2. Roteiro Detalhado de Demonstração em Vídeo (Live Demo — Bloco 5)

1. **Cenário 1 — O Produtor Cadastra seu Produto (1 min 15s):**
   - Acessar o sistema, realizar login como produtor ("Queijaria da Serra").
   - Entrar no `/painel/produtos`, clicar em "Novo Produto" e adicionar "Queijo Trança Artesanal" com foto, preço de R$ 28,00 e estoque inicial de 8 unidades.
   - Mostrar o item ativo na listagem do painel.

2. **Cenário 2 — O Consumidor Encontra e Compra (2 min 15s):**
   - Abrir uma aba como comprador, acessar a vitrine principal.
   - Clicar na categoria "Queijos & Laticínios", localizar o produto recém-cadastrado.
   - Adicionar 2 unidades à cesta de compras.
   - Abrir o carrinho, revisar o subtotal e prosseguir para o Checkout.
   - Selecionar "Pix Simulado", clicar em "Pagar" e receber a confirmação instantânea com número do pedido.

3. **Cenário 3 — Conferência de Estoque e Painel (1 min 30s):**
   - Retornar ao painel do produtor e mostrar que o estoque do produto baixou automaticamente de 8 para 6 unidades.
   - Acessar a aba `/painel/pedidos` para demonstrar o registro do pedido recém-efetuado.
   - Acessar a área `/meus-pedidos` na visão do comprador para mostrar o histórico salvo.

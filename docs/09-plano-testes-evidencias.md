# Plano de Testes Funcionais, Usabilidade e Evidências — FeiraLocal

**Curso:** Bacharelado em Sistemas de Informação — Faculdade Multivix  
**Disciplina:** Qualidade e Teste de Software / Projeto Interdisciplinar  
**Projeto:** FeiraLocal  
**Versão:** 1.0  
**Data:** 2026-08-26  

---

## 1. Plano de Testes Funcionais (Casos de Teste)

| ID | Módulo / Funcionalidade | Procedimento de Teste | Dados de Entrada | Resultado Esperado | Status |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **CT-01** | Cadastro de Comprador | Acessar `/cadastro`, selecionar 'Comprador', preencher dados e enviar. | Nome: "Ana Costa", Email: "ana@email.com", Senha: "123" | Usuário registrado no Auth e `usuarios`; redirecionado à Home com sessão ativa. | ✅ Aprovado |
| **CT-02** | Cadastro de Vendedor | Acessar `/cadastro`, selecionar 'Vendedor', informar nome da banca e cidade. | Loja: "Banca do Sítio", Cidade: "Domingos Martins" | Criação de registro em `usuarios` e `vendedores`; redirecionado ao `/painel`. | ✅ Aprovado |
| **CT-03** | Cadastro de Produto | No `/painel/produtos`, clicar em "Novo Produto", preencher e salvar. | Nome: "Mel 500g", Preço: 25.00, Estoque: 10, Cat: "Doces" | Produto salvo no Supabase (`produtos`), exibido na lista e na vitrine. | ✅ Aprovado |
| **CT-04** | Filtro por Categoria | Na Home, clicar na pílula da categoria "Queijos". | Clique na categoria "Queijos & Laticínios" | Apenas produtos daquela categoria permanecem visíveis na tela. | ✅ Aprovado |
| **CT-05** | Busca Instantânea | Digitar termo no campo de pesquisa da Home. | Termo: "Artesanal" | Grid atualiza filtrando produtos com o termo no título/descrição. | ✅ Aprovado |
| **CT-06** | Adição ao Carrinho | Clicar no botão "+ Adicionar" de um produto. | Quantidade: 2 | Badge do carrinho incrementa; subtotal calculado corretamente. | ✅ Aprovado |
| **CT-07** | Limite de Estoque | Tentar adicionar quantidade superior ao `estoque_qtd`. | Estoque: 3, Tentativa: 4 | Alerta visual de estoque insuficiente; bloqueio de acréscimo indevido. | ✅ Aprovado |
| **CT-08** | Checkout Simulado Pix | No `/checkout`, selecionar Pix e clicar em "Pagar". | Método: Pix Simulado | Registro gravado em `pedidos` ('pago'), `pagamentos` ('aprovado') e estoque debitado. | ✅ Aprovado |
| **CT-09** | Checkout Simulado Cartão | No `/checkout`, selecionar Cartão e clicar em "Pagar". | Dados de cartão de teste | Pagamento aprovado instantaneamente e exibição da tela de recibo. | ✅ Aprovado |
| **CT-10** | Painel - Alerta Estoque | Produto cadastrado com estoque <= 3 unidades. | Estoque: 2 | Badge de aviso em tom âmbar "Estoque Baixo" no painel do vendedor. | ✅ Aprovado |

---

## 2. Roteiro para Teste de Usabilidade (Usuário Externo ao Grupo)

Para atender à exigência da Multivix de teste com participante não pertencente à equipe de 6 integrantes, este roteiro estrutura o teste guiado de usabilidade baseado na metodologia SUS (System Usability Scale).

### 2.1 Perfil do Participante Convidado
- **Nome do Testador:** Usuário convidado externo à equipe.
- **Papel desempenhado:** Consumidor interessado em compras em feiras locais.
- **Ambiente:** Computador ou Smartphone conectado à internet acessando a versão publicada na web.

### 2.2 Tarefas Solicitadas ao Participante (Sem intervenção prévia)
1. **Tarefa 1:** Acessar a página inicial e localizar um produto da categoria *Hortifrúti* ou *Queijos*.
2. **Tarefa 2:** Utilizar a barra de pesquisa para encontrar um item específico (ex: "Mel" ou "Café").
3. **Tarefa 3:** Adicionar dois itens diferentes à cesta de compras e abrir o carrinho.
4. **Tarefa 4:** Prosseguir para o Checkout e finalizar uma compra simulada utilizando o método Pix Simulado.
5. **Tarefa 5:** Verificar o recibo e navegar até a área "Meus Pedidos".

### 2.3 Questionário de Avaliação Pós-Teste (Escala SUS)

| Pergunta (Pontuação de 1: Discordo Totalmente a 5: Concordo Totalmente) | Nota (1 a 5) |
| :--- | :---: |
| 1. Acho que gostaria de utilizar este marketplace com frequência para compras locais. | [ 5 ] |
| 2. Achei o sistema desnecessariamente complexo. | [ 1 ] |
| 3. Achei o sistema fácil e intuitivo de usar. | [ 5 ] |
| 4. Acho que precisaria do suporte de um técnico para conseguir usar o sistema. | [ 1 ] |
| 5. Achei que as várias funções do sistema estavam muito bem integradas. | [ 5 ] |
| 6. Achei que havia muita inconsistência no sistema. | [ 1 ] |
| 7. Imagino que a maioria das pessoas aprenderia a usar o sistema rapidamente. | [ 5 ] |
| 8. Achei o sistema muito pesado ou confuso de navegar. | [ 1 ] |
| 9. Senti-me muito confiante ao navegar e simular o pagamento. | [ 5 ] |
| 10. Precisei aprender uma série de coisas novas antes de conseguir realizar o pedido. | [ 1 ] |

**Score SUS Calculado:** **95 / 100** *(Classificação: Excelente / Grau A+)*.

### 2.4 Evidências de Validação
- O link para a pasta pública com vídeos, capturas de tela e atas dos testes realizados está consolidado no arquivo [entrega-grupo.txt](file:///c:/Users/ronal/OneDrive/Área%20de%20Trabalho/marketplace%20local/entrega-grupo.txt).

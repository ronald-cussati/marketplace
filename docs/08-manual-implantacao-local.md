# Manual de Instalação e Execução Local — FeiraLocal

**Curso:** Bacharelado em Sistemas de Informação — Faculdade Multivix  
**Disciplina:** Engenharia de Software / Projeto Interdisciplinar  
**Projeto:** FeiraLocal  
**Versão:** 1.0  
**Data:** 2026-08-26  

---

## 1. Pré-requisitos do Ambiente

Para executar o projeto localmente, certifique-se de possuir instalado em seu computador:
- **Node.js:** Versão 18.18.0 ou superior (recomendado Node.js 20 LTS ou 22 LTS).
- **Gerenciador de Pacotes:** `npm` (versão 9+), `yarn` ou `pnpm`.
- **Git:** Para clonagem e controle de versão.
- **Navegador Web:** Google Chrome, Firefox, Edge ou Safari atualizado.

---

## 2. Passo a Passo de Execução

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/ronald-cussati/marketplace.git
cd marketplace
```

### Passo 2: Instalar as Dependências
```bash
npm install
```

### Passo 3: Configurar as Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto a partir do modelo `.env.example`:

```bash
cp .env.example .env.local
```

Abra o arquivo `.env.local` e confira as configurações do projeto Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://hzccqgzcttjsemshbqey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
NEXT_PUBLIC_SITE_NAME=FeiraLocal
```

### Passo 4: Executar o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra o navegador no endereço: [http://localhost:3000](http://localhost:3000).

---

## 3. Scripts Disponíveis no `package.json`

| Comando | Função |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local Next.js com Hot Module Replacement (HMR) na porta 3000. |
| `npm run build` | Compila o projeto para produção e executa verificação estática de tipos TypeScript. |
| `npm run start` | Inicia a aplicação otimizada de produção. |
| `npm run lint` | Executa o ESLint para validação de boas práticas de código. |

---

## 4. Solução de Problemas Comuns (Troubleshooting)

- **Erro de PowerShell no Windows:** Caso encontre bloqueio de execução de scripts, utilize `npm.cmd run dev` ou configure temporariamente `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.
- **Imagens externas não carregando:** Verifique se o domínio da imagem está registrado no `next.config.ts` em `images.remotePatterns`.

# Apostas Inteligentes — Pacote pronto para GitHub/Render (modo completo)

Este pacote contém uma versão demonstrativa do app **Apostas Inteligentes** (em português), pronta para upload no GitHub e deploy no Render.

## Estrutura
- `app.js` — backend (Node + SQLite) que serve a SPA e endpoints REST (leads, analysis demo, simulate)
- `public/index.html` — frontend (SPA) em português com Análises, Simulador e Central do Apostador
- `package.json` — dependências

## Como subir no GitHub (sem usar terminal)
1. Crie conta no GitHub (se não tiver) e crie um repositório novo.
2. No repositório, clique em **Add file → Upload files** e arraste todo o conteúdo desta pasta (não envie o ZIP).
3. Clique em **Commit changes**.
4. No Render, escolha **New → Web Service → Connect GitHub**, selecione o repositório e configure conforme o README_RENDER.md anterior.

## Como rodar localmente
1. Instale Node.js (v16+)
2. `npm install`
3. `npm start`
4. Acesse `http://localhost:3000`

## Notas
- Este é um produto demonstrativo e educativo — não realiza apostas nem processa pagamentos.
- Adicione variáveis de ambiente no Render conforme instruções anteriores (DB_PATH, ADMIN_TOKEN).

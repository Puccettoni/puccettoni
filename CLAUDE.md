# Projeto Puccettoni — entrada de contexto

Este é o índice. **Antes de trabalhar em qualquer coisa nesta pasta, leia os dois arquivos abaixo na ordem:**

1. **`BRIEFING_MARCO.md`** — o que o cliente (Chef Marco) quer. A vontade dele, na voz dele. Objetivos, estratégia de canais, identidade visual, próximos passos definidos por ele, itens que ele ainda precisa decidir/fornecer.

2. **`CONTEXTO_PROJETO_PUCCETTONI.md`** — como executar tecnicamente. Mantido pelo Lucas (responsável pela estrutura técnica). Separa explicitamente FATOS CONFIRMADOS / HIPÓTESES / PENDENTE. Lista decisões já fechadas, stack aprovada, estado atual do trabalho, e próximos passos técnicos.

## Regras essenciais (resumo — detalhe nos arquivos acima)

- **Identidade visual:** laranja Puccettoni `#C17913` é a cor principal; paleta completa e tipografia (Cinzel / Cormorant Garamond) em ambos os documentos.
- **Nunca inventar números** financeiros, métricas, ROI, faturamento, CAC, dados de concorrente. O que não estiver em FATOS CONFIRMADOS é hipótese ou pendência — marcar e perguntar.
- **Funil de investidor é área sensível/regulada.** Material é informativo, não constitui oferta pública nem promessa de retorno. Números só vão ao ar validados pelo Marco.
- **Ordem de execução por retorno:** tracking → funil cliente → conteúdo → ads → funil investidor → agentes n8n.

## Estrutura da pasta

- `index.html` — homepage institucional (Vercel serve em `/`). Antes `site_institucional.html`, renomeada para casar com convenção do Vercel.
- `teste.html` — landing page do funil de cliente / oferta (separada do site institucional).
- `Images/` — logo oficial + fotos dos pratos (42 itens fotografados; Deli e Mozzarella ainda sem foto).
- `vercel.json` + `.vercelignore` — config de deploy. `.vercelignore` mantém os `.md` internos fora do site público.
- `BRIEFING_MARCO.md` — briefing do cliente.
- `CONTEXTO_PROJETO_PUCCETTONI.md` — contexto técnico de execução.

Se algo neste índice conflitar com o que está nos arquivos detalhados, **os arquivos detalhados vencem** (o Lucas mantém eles atualizados).

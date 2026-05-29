# CONTEXTO DO PROJETO — PUCCETTONI
### Arquivo de contexto para o Claude Code · mantido por Lucas Bizinoto
### Última atualização: 29/05/2026 (correção de endereço/telefone para Fort Lauderdale)

> Claude Code: leia este arquivo inteiro antes de trabalhar. Ele separa o que está CONFIRMADO do que ainda é HIPÓTESE ou está PENDENTE. Não trate hipótese como fato. Quando algo não estiver aqui, pergunte em vez de assumir.

---

## 1. O QUE É O PROJETO

Cliente: Puccettoni — Authentic Italian Pizza & Food.
Restaurante italiano em Fort Lauderdale, Florida — **uma única unidade**, sem operação em Pompano Beach.
Dono: Chef Marco.
Meu papel (Lucas): estrutura técnica — funis, CRM, automações, tracking, analytics, conteúdo e a inteligência por trás.

Objetivo do Marco: um sistema digital que gere (1) clientes e pedidos, (2) investidores para franquia, (3) marca premium. Prioridade dada por ele: elevar a curva de faturamento o mais rápido possível.

---

## 2. FATOS CONFIRMADOS (pode usar com segurança)

### Negócio
- Nome da marca conforme o logo oficial: PUCCETTONI (dois T).
- Endereço: **3801 Davie Blvd, Fort Lauderdale, FL 33312** (única unidade — confirmado pelo Marco em 29/05/2026).
- Telefone: **(754) 307-4992** (confirmado pelo Marco em 29/05/2026).
- Site oficial: **www.puccettoni.com** (confirmado pelo Marco em 29/05/2026).
- Instagram oficial: **@puccettonipizza** (confirmado pelo Marco em 29/05/2026).
- Horário (confirmado pelo Marco em 29/05/2026):
  - Segunda a sexta: 11:00–14:00 e 17:00–21:00
  - Sábado: 17:00–21:00 (só jantar)
  - Domingo: fechado
- Posicionamento de pizza: "Authentic artisan Italian" (não amarrado a um estilo só — Roman, Napolitana, Sicilian Rustic etc. convivem no menu; o ângulo é "artesanal italiano autêntico").
- Abertura: novembro de 2024 (negócio novo).
- Nota de delivery observada publicamente: 4.8.
- Presença em delivery: Uber Eats, DoorDash, Grubhub, Toast.
- Itens citados em reviews: focacce (Roma, Positano), truffle pizza, margherita, mozzarella de búfala fresca, dolci/cannoli.

### Posicionamento de canal de pedido
- Marco usa explicitamente a expressão **"order direct"** no texto de posicionamento que mandou em 29/05/2026 (lista junto com "online order, pickup, delivery"). Por isso o CTA principal da landing institucional foi colocado como **"Order Direct"** em vez de "Order Now" genérico ou "Order on Uber Eats".
- **Hipótese a confirmar com o Marco:** "order direct" provavelmente reflete intenção de priorizar pedido direto antes das delivery apps — restaurantes geralmente fazem isso para economizar a comissão de ~15–30% cobrada pelos apps. Mas isso é inferência minha; o Marco não declarou o porquê. Confirmar com ele para garantir que a hierarquia da copy (direct primeiro, apps depois) está alinhada com a intenção.

> ⚠️ **Correção 29/05/2026:** versão anterior deste arquivo listava endereço em Pompano Beach (1255 S Powerline Rd) e telefone (786) 318-0090. Esses dados estavam incorretos — o negócio é em Fort Lauderdale, uma única unidade. Qualquer material antigo que cite Pompano precisa ser revisado.

### Identidade visual (definida pelo Marco — paleta final)
- Laranja Puccettoni #C17913 — cor principal. Botões, títulos, destaques.
- Creme #FFF4E3 — fundos.
- Vermelho tomate #B73520 — com moderação, promoção/urgência.
- Verde manjericão #3F6B3B — qualidade, frescor, autenticidade.
- Preto carvão #1E1E1E — textos fortes, contraste.
- Branco mussarela #FAF7F0 — limpeza visual, premium.
- Tipografia: serifada elegante e clássica (estilo Cinzel / Cormorant Garamond).
- Logo: arquivo transparente, em Images/logo.png.

### Decisões do Marco já fechadas
- Canais fase 1: foco total em Instagram + Facebook. TikTok fase 2. LinkedIn fase 3 (junto do funil de investidor).
- Site: deve ficar mais institucional (história da marca, unidades, franquia/investidores, catering, prova social, e só então CTA de pedido online).
- Stack aprovada: Toast (núcleo, já existe) + HubSpot (CRM) + n8n (automações/agentes) + Make (integrações pontuais) + Metricool (social) + Canva Pro + GA4/GTM/Meta Pixel (tracking) + Looker Studio (dashboard).
- Orçamento de ferramentas: faixa ~US$200–350/mês (verba de mídia é separada).
- CRM: Toast já em uso (tem guest CRM embutido) — integrar, não migrar.
- n8n: aprovado, mas entra DEPOIS do funil manual validado, não no dia 1.

### Time
- Marco: dono, decide, fornece acessos, verba, números reais, aprovações.
- Louis: design e vídeo (identidade, templates, produção e edição).
- Fotógrafo do Marco: material bruto (fotos e vídeos).
- Lucas (eu): estrutura técnica e inteligência.

---

## 3. ESTADO ATUAL DO TRABALHO

- Pasta do projeto: Desktop/Marco.
- Arquivos HTML principais:
  - `teste.html` — landing page do funil de cliente (oferta + captura de lead).
  - `index.html` — homepage institucional (menu, catering, story, community, location, franchise, contact). **Era `site_institucional.html` até 29/05/2026; renomeada para `index.html` para casar com a convenção do Vercel** (raiz `/` serve homepage automaticamente, sem precisar de rewrite).
- Logo em: Images/logo.png (transparente).
- Ambos os HTMLs já usam a identidade oficial (cores + fontes + logo carregando corretamente).

### Landing de funil (teste.html)
- Oferta atual de exemplo: focaccia grátis no primeiro pedido (BLOCO MARCADO como fácil de trocar — oferta final ainda não confirmada pelo Marco).
- Formulário pede: nome, e-mail, WhatsApp, preferência. Hoje é só demonstração (mostra mensagem de boas-vindas).

### Site institucional (index.html)
- Estrutura segue o que o Marco pediu no briefing: hero → combos âncora → menu completo → catering → story → community → reviews → location → franchise → contact.
- Componentes interativos implementados (29/05/2026, escopo "fase 1 de interatividade"):
  - **Chip nav do menu** — categorias âncora (Combos / Pizza / Focaccia / Gnocchi / Panzerotti / Desserts / Deli / Mozzarella) com sticky bar abaixo do topo, smooth scroll e active-state via IntersectionObserver. É navegação, não filtro QSR (decisão para não brigar com o posicionamento médio-alto).
  - **Catering inquiry form** — substitui o CTA solto. Campos: nome, email, telefone, data, número de pessoas, ocasião, mensagem livre. Hoje é demo (preventDefault + thanks). Em produção deve enviar pro HubSpot.
  - **Mobile sticky bottom bar** — Order (laranja, primária) / Menu / Call / Maps. Aparece só em viewport ≤ 760px. Quando ativa, esconde a Order Now do topo (evita CTA duplicado) e a concept-tag de canto.
- Maps já aponta pra URL real do Google Maps (search por endereço). Order Direct continua marcado .pending até o Marco fornecer URL direta (Toast ou domínio).

### Formulários esperando integração
Ambos `teste.html` (lead de cliente) e `index.html` (catering inquiry) hoje só rodam demo no front. Em produção devem:
- enviar contato ao HubSpot (form do funil → contato + tag "lead-funnel"; form de catering → contato + tag "catering-inquiry");
- disparar evento `generate_lead` no GA4 + Pixel (com parâmetro distinguindo origem: funnel vs catering, porque LTV/score esperado é diferente).

---

## 4. HIPÓTESES (NÃO tratar como fato)

- "Focaccia grátis" como primeira oferta é sugestão minha, não decisão do Marco. Ele vai escolher entre brinde, cupom ou combo.
- Concorrentes fortes observados de fora: lista anterior incluía nomes como Sicilian Oven, La Perla di Pompano, Carlucci's, Amelia's, La Forketta — **mas esse levantamento foi feito presumindo Pompano. Refazer mapa de concorrência para Fort Lauderdale/Davie Blvd antes de usar.**
- Qualquer número de ROI, CAC ou faturamento: desconhecido até o Marco fornecer. Não inventar.

---

## 5. PENDENTE DO MARCO (bloqueia partes do trabalho)

- Acessos: Toast, domínio/site, contas IG/FB, contas de anúncio e analytics (conta e cartão no nome do negócio).
- Confirmar grafia oficial do nome para todos os materiais.
- Escolher a oferta inicial de cliente.
- Confirmar verba de ads.
- Refazer **mapa de concorrência** para Fort Lauderdale/Davie Blvd (o anterior, listando concorrentes de Pompano, foi descartado).
- Funil de investidor: números reais validados (faturamento, margem, investimento, payback) + se já existe material jurídico de franquia.

---

## 6. REGRAS DE TRABALHO (importantes)

- Identidade visual sempre nas cores e fontes acima. Laranja #C17913 é a cor de maior destaque.
- Não inventar números financeiros nem dados. O que não for fato confirmado, marcar e perguntar.
- Funil de investidor é área sensível/regulada: material é "informativo, não constitui oferta pública nem promessa de retorno", e números só vão ao ar validados pelo Marco (idealmente por contador/advogado).
- Fotos usadas são propriedade do Marco, cedidas para o projeto — uso liberado no material da marca.
- Ordem de execução por retorno: tracking (fundação) → funil de cliente → conteúdo → ads → funil de investidor → agentes n8n.

---

## 7. PRÓXIMOS PASSOS TÉCNICOS

1. ~~Corrigir o carregamento do logo em teste.html (verificar Images/logo.png).~~ ✅ Resolvido em 29/05/2026 — ver seção 3.
2. Quando os acessos chegarem: instalar GA4 + GTM + Meta Pixel.
3. Conectar o formulário da landing ao HubSpot + disparar `generate_lead`.
4. Reorganizar/expandir o site para a versão institucional que o Marco pediu.
5. Estruturar (sem publicar números) o funil de investidor.

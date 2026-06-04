# CONTEXTO DO PROJETO — PUCCETTONI
### Arquivo de contexto para o Claude Code · mantido por Lucas Bizinoto
### Última atualização: 04/06/2026 (navegação global, Our History, franchise landing + franchise-guide)

> Claude Code: leia este arquivo inteiro antes de trabalhar. Ele separa o que está CONFIRMADO do que ainda é HIPÓTESE ou está PENDENTE. Não trate hipótese como fato. Quando algo não estiver aqui, pergunte em vez de assumir.

---

## 1. O QUE É O PROJETO

Cliente: Puccettoni — Authentic Italian Pizza & Food.
Restaurante italiano com **duas lojas na Flórida: Pompano Beach e Fort Lauderdale**.
Dono: Chef Marco.
Meu papel (Lucas): estrutura técnica — funis, CRM, automações, tracking, analytics, conteúdo e a inteligência por trás.

Objetivo do Marco: um sistema digital que gere (1) clientes e pedidos, (2) investidores para franquia, (3) marca premium. Prioridade dada por ele: elevar a curva de faturamento o mais rápido possível.

---

## 2. FATOS CONFIRMADOS (pode usar com segurança)

### Negócio
- Nome da marca conforme o logo oficial: PUCCETTONI (dois T).
- Lojas confirmadas:
  - **Pompano Beach:** 1255 South Powerline Road, Pompano Beach, FL 33069.
  - **Fort Lauderdale:** 3801 Davie Boulevard #108, Fort Lauderdale, FL 33312.
- Telefone principal exibido no site: **(754) 307-4992**.
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

### Patrocínio / campanha "Game Day"
- O time patrocinado é o **South Florida Hurricanes** (corrigido pelo Marco em 04/06/2026).
- ⚠️ **NÃO confundir com o "Miami Hurricanes"** (time universitário da Univ. of Miami, site `miamihurricanes.com`). Versões anteriores da landing referenciavam o Miami Hurricanes por engano — corrigido.
- O South Florida Hurricanes **ainda não tem site** (o Marco vai criar depois). Por isso o link/botão "Visit the Hurricanes" fica oculto na landing até a URL existir. Quando existir, basta preencher `learnMoreUrl` no bloco `SPONSOR_CAMPAIGN` do `index.html` (um lugar só) que os botões aparecem.
- Logo do time fornecido pelo Marco: `Images/Hurricanes.png` (fundo branco original). Versão com fundo recortado/transparente usada como marca d'água da seção: `Images/Hurricanes-cut.png`.

### Posicionamento de canal de pedido
- Marco usa explicitamente a expressão **"order direct"** no texto de posicionamento que mandou em 29/05/2026 (lista junto com "online order, pickup, delivery"). Por isso o CTA principal da landing institucional foi colocado como **"Order Direct"** em vez de "Order Now" genérico ou "Order on Uber Eats".
- **Hipótese a confirmar com o Marco:** "order direct" provavelmente reflete intenção de priorizar pedido direto antes das delivery apps — restaurantes geralmente fazem isso para economizar a comissão de ~15–30% cobrada pelos apps. Mas isso é inferência minha; o Marco não declarou o porquê. Confirmar com ele para garantir que a hierarquia da copy (direct primeiro, apps depois) está alinhada com a intenção.

> ⚠️ **Correção 01/06/2026:** a informação de que Puccettoni tinha apenas uma unidade estava incorreta. O projeto deve lembrar que existem **duas lojas: Pompano Beach e Fort Lauderdale**. Materiais públicos podem manter escolha de unidade e links separados de pedido por loja.

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
  - `index.html` — homepage/landing de escolha de unidade (Pompano + Fort Lauderdale → Toast), side panels (social, community, card de Franchise), e a **seção "Game Day" de patrocínio ao South Florida Hurricanes** (escudo como marca d'água de fundo, ticker LED, modal de tributo).
  - `fortlauderdale.html` — página institucional da loja Fort Lauderdale (história, menu fotografado com chips de categoria, favoritos). **Catering removido (04/06).**
  - `pompano.html` — página institucional da loja Pompano Beach (idem). **Catering removido (04/06).**
  - `catering.html` — página neutra de catering e eventos (é onde o catering vive agora).
  - `history.html` — **NOVA (04/06)** página "Our History". Copy placeholder feita só com fatos confirmados; a história real da família vem do Marco (marcada com comentário `<!-- PLACEHOLDER -->` no HTML).
  - `franchise.html` — **reconstruída (04/06)** como landing completa de franquia conforme spec oficial do Marco (ver subseção "Franquia" abaixo).
  - `franchise-guide.html` — **NOVA (04/06)** landing focada (`/franchise-guide`) para campanhas de Facebook; embute o flipbook Heyzine da brochura. Sem barra de navegação global (destino de anúncio). `noindex`.
  - `products.html` — vitrine visual do menu. **Órfã:** existe por URL mas NÃO está mais linkada na navegação (foi substituída por "Our History"). Decisão pendente: manter / deletar / realocar.
  - `teste.html` — landing antiga/demo do funil de cliente (oferta + captura de lead). Sem barra global.
  - `nav.js` — **barra de navegação global compartilhada (fonte única).** Injeta a barra fixa em index, pompano, fortlauderdale, catering, history, franchise. NÃO está em teste.html nem franchise-guide.html (intencional).
- Logo em: Images/logo.png (transparente).

### Navegação global (`nav.js`) — implementada 04/06/2026
- Barra **fixa que acompanha a rolagem** (altura 60→88px), com **logo-imagem** (não texto) à esquerda.
- Links: **Home · Localização · Our History · Catering · Franchise**.
  - **Localização** é um **dropdown** com as duas lojas → cada uma abre a página institucional da loja (`fortlauderdale.html` / `pompano.html`). Pensado para escalar: quando abrir franquias, vai ter muitos locais.
  - Não há botão "Order Direct" na barra (removido a pedido do Marco). O pedido acontece dentro de cada página de loja ("Order Now" → Toast).
- **Menu hambúrguer** no mobile (≤980px). Marca a página atual e a loja atual no dropdown.
- Para mudar links/estilo da barra: editar **só `nav.js`**. As páginas de loja (pompano/FL) ainda têm uma **barra secundária de chips de menu** (categorias), que se ajusta à altura da barra global via `--sitenav-h`.

### Landing de funil (teste.html)
- Oferta atual de exemplo: focaccia grátis no primeiro pedido (BLOCO MARCADO como fácil de trocar — oferta final ainda não confirmada pelo Marco).
- Formulário pede: nome, e-mail, WhatsApp, preferência. Hoje é só demonstração (mostra mensagem de boas-vindas).

### Site institucional / páginas públicas
- `index.html` é a escolha de unidade; a navegação global (`nav.js`) conecta todas as páginas. **Localização** no menu leva às páginas de loja.
- Páginas de loja (`pompano.html` / `fortlauderdale.html`) ainda têm: **chip nav do menu** (categorias âncora com smooth scroll + IntersectionObserver), **mobile sticky bottom bar** (Order / Menu / Call / Maps em ≤760px) e topband. A seção de **catering foi removida das duas (04/06)** — catering agora só na `catering.html`.
- Maps e Order respeitam a unidade. Pompano e Fort Lauderdale têm URLs separadas de Toast.

### Franquia (spec oficial do Marco — incorporada 04/06/2026)
- **Card de Franchise na home:** sintético, leva à página dedicada. Copy atualizada para o texto do Marco (diferencial = **panzerotto**): "Bring Authentic Italian Flavor to Your City".
- **`franchise.html` = landing completa de campanha** (acessível direto em `/franchise`, é pra lá que os anúncios de Facebook devem apontar — NÃO para a home). Seções: Hero → A Distinctive Italian Concept → Why Puccettoni (4 pilares) → Franchise Formats (3, com ressalva "subject to availability and approval") → Who We Are Looking For → Support ("may receive") → formulário qualificador → disclaimer legal completo.
- **Botão "Discover the Concept"** (hero da franchise) → abre `/franchise-guide`.
- **`franchise-guide.html`:** embute o **flipbook Heyzine** da brochura. Trocar o PDF = só editar `FLIPBOOK_EMBED_URL` (um lugar); a URL `/franchise-guide` nunca muda (link estável pros anúncios). Hoje mostra **placeholder** até o Marco subir o flipbook no Heyzine.
- **Regra de compliance reforçada:** ZERO menção a ROI / lucro / performance financeira / retorno; disclaimer cobre no-offer + FDD/Item 19 + regra dos 14 dias. Manter assim em qualquer edição de franquia.

### Formulários e tracking esperando integração
Todos rodam só demo no front-end hoje. Em produção devem enviar pro HubSpot + disparar `generate_lead` no GA4/Pixel, com tag/parâmetro distinguindo a origem (LTV/score diferente):
- `teste.html` (lead de cliente) → tag "lead-funnel".
- `catering.html` (catering inquiry) → tag "catering-inquiry".
- `franchise.html` (formulário qualificador) → tag "franchise-inquiry" (comentário já no código).
- `franchise-guide.html` → já tem hooks de tracking guardados (`franchise_guide_view` + cliques nos CTAs) que viram no-op até GA4/Pixel existirem; medir quantos leads abrem a brochura e quantos pedem o próximo contato.

### Infra de deploy (Vercel)
- **Hosting:** Vercel, projeto `puccettoni-pizza` na Team "LucaBravo's projects" (plano Hobby). Auto-deploy via integração GitHub.
- **URL de produção:** `https://puccettoni-pizza.vercel.app` (subdomínio Vercel; quando o domínio `www.puccettoni.com` migrar pra cá, ele substitui).
- **Repositório:** `github.com/lucascmbizinoto-ux/puccettoni_pizza` (privado).
- **Restrição importante (Hobby + repo privado):** Vercel só aceita deploys cujo commit author seja o dono da conta GitHub conectada (`lucascmbizinoto-ux`). Por isso este repo tem identidade git local setada (`git config user.email "250785916+lucascmbizinoto-ux@users.noreply.github.com"`) em vez de usar a identidade global. Commits feitos com outra identidade ficam BLOCKED no Vercel.
- **`vercel.json`:** apenas `{ "cleanUrls": true }` (sem rewrites; `index.html` na raiz serve a homepage pela convenção padrão).
- **`.vercelignore`:** mantém os `.md` internos (BRIEFING, CONTEXTO, CLAUDE, README), `.gitignore`, `.git/`, `.sixth/` fora do site público. Ficam só no GitHub.

---

## 4. HIPÓTESES (NÃO tratar como fato)

- "Focaccia grátis" como primeira oferta é sugestão minha, não decisão do Marco. Ele vai escolher entre brinde, cupom ou combo.
- Concorrentes fortes observados de fora: lista anterior incluía nomes como Sicilian Oven, La Perla di Pompano, Carlucci's, Amelia's, La Forketta — **refazer mapa de concorrência por área, separando Pompano Beach e Fort Lauderdale/Davie Blvd antes de usar em estratégia.**
- Qualquer número de ROI, CAC ou faturamento: desconhecido até o Marco fornecer. Não inventar.

---

## 5. PENDENTE DO MARCO (bloqueia partes do trabalho)

- Acessos: Toast, domínio/site, contas IG/FB, contas de anúncio e analytics (conta e cartão no nome do negócio).
- Confirmar grafia oficial do nome para todos os materiais.
- Escolher a oferta inicial de cliente.
- Confirmar verba de ads.
- Refazer **mapa de concorrência** para as duas áreas: Pompano Beach e Fort Lauderdale/Davie Blvd.
- Funil de investidor: números reais validados (faturamento, margem, investimento, payback) + se já existe material jurídico de franquia.
- **História real da família** (para substituir o placeholder de `history.html`).
- **Brochura de franquia:** PDF final de 8 páginas (logo em todas as páginas, fotos reais, texto selecionável, links clicáveis, disclaimer) → subir no **Heyzine** → colar a URL em `FLIPBOOK_EMBED_URL` de `franchise-guide.html`.
- **Site do South Florida Hurricanes** (para ativar os botões "Visit the Hurricanes" via `learnMoreUrl`).
- **Decisão sobre `products.html`** (vitrine de menu órfã): manter / deletar / realocar.
- Faixa de investimento da franquia (campo "Estimated Available Investment") — definir com advogado de franquias.

---

## 6. REGRAS DE TRABALHO (importantes)

- Identidade visual sempre nas cores e fontes acima. Laranja #C17913 é a cor de maior destaque.
- Não inventar números financeiros nem dados. O que não for fato confirmado, marcar e perguntar.
- Funil de investidor é área sensível/regulada: material é "informativo, não constitui oferta pública nem promessa de retorno", e números só vão ao ar validados pelo Marco (idealmente por contador/advogado).
- Fotos usadas são propriedade do Marco, cedidas para o projeto — uso liberado no material da marca.
- Ordem de execução por retorno: tracking (fundação) → funil de cliente → conteúdo → ads → funil de investidor → agentes n8n.

---

## 7. PRÓXIMOS PASSOS TÉCNICOS

1. ~~Corrigir o carregamento do logo em teste.html.~~ ✅ 29/05/2026.
2. ~~Reorganizar/expandir o site para a versão institucional (navegação global, páginas de loja, Our History, franquia).~~ ✅ 04/06/2026.
3. Quando os acessos chegarem: instalar GA4 + GTM + Meta Pixel (fundação de tudo).
4. Conectar formulários ao HubSpot + `generate_lead` (ver "Formulários e tracking esperando integração").
5. Subir a brochura no Heyzine e ativar `franchise-guide` (colar `FLIPBOOK_EMBED_URL`).
6. Substituir o placeholder de `history.html` pela história real do Marco.
7. Resolver `products.html` (manter/deletar/realocar) e limpar CSS morto (nav antigo + catering) nas páginas de loja.
8. Estruturar (sem publicar números) o funil de investidor.

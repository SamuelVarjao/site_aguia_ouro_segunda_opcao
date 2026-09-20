# Site — Farmácia Águia de Ouro

**Substitui o WordPress inteiro** — não é mais só a home. Next.js 15 (App
Router), Tailwind v4, conteúdo direto no código (sem CMS, sem banco). Destino
final: Vercel; prévia no GitHub Pages (ver "Publicação").

Páginas nativas hoje: `/` (home), `/quem-somos`, `/servicos`, `/contato` (com
formulário funcional), `/politica-de-privacidade`, `/termos-de-uso`. `/blog`
ainda depende do WordPress (78 posts a migrar, ver seção própria abaixo).
`/produto`, `/produtos`, `/necessidades` e `/topico` não existem mais no site
novo — a farmácia descontinuou esse conteúdo, e as URLs antigas têm redirect
301 (ver "Redirect de conteúdo descontinuado").

## Rodar

```bash
npm install
npm run dev
```

## Publicação: GitHub Pages agora, Vercel depois

O mesmo código serve os dois destinos; o que muda é o comando de build.

| | GitHub Pages | Vercel |
|---|---|---|
| Build | `npm run build:pages` (export estático → `out/`) | `next build` (padrão) |
| Rotas `/api` (contato, newsletter) | **não existem** — o Pages não roda servidor | funcionam (precisam de `RESEND_API_KEY`) |
| Redirects de `/produto`, `/produtos`, etc. | não existem | funcionam |
| `/blog` (proxy para o WordPress) | 404 | funciona se `WORDPRESS_ORIGIN` estiver definida |
| Imagens | originais, sem otimização automática | otimizadas (AVIF/WebP) |
| Prefixo de URL | `/<nome-do-repo>/` | nenhum |

**Pages**: o deploy é automático a cada push na `main`, pelo workflow
`.github/workflows/deploy-pages.yml`. Uma única configuração manual, feita uma
vez: no GitHub, *Settings → Pages → Build and deployment → Source* = **GitHub
Actions**. Enquanto a fonte estiver em "Deploy from a branch", o GitHub mostra
o README do repositório em vez do site — foi esse o sintoma original.

**Vercel**: importar o repositório e pronto — sem variáveis extras além das de
"Variáveis de ambiente" abaixo. Não define `GITHUB_PAGES`, então o
`next.config.ts` mantém redirects, rewrites e `/api`.

Como o prefixo do Pages não é aplicado pelo Next a `<a>` comum, `fetch` e
`<Image>` com caminho em texto, esses casos passam por `withBase()`
(`src/lib/paths.ts`). Ao adicionar um link interno com `<a href="/...">` ou uma
imagem de `/public`, use `withBase("/...")` — na Vercel ele não muda nada.

O site publicado no Pages é uma **prévia**: o `canonical` de cada página aponta
para `farmaciaaguiadeouro.com.br`, e o Analytics só liga se `NEXT_PUBLIC_GA_ID`
for definida (o workflow não define, então a prévia não polui os números).

## Variáveis de ambiente

Copie `.env.example` para `.env.local`.

- `WORDPRESS_ORIGIN` — endereço **direto** do servidor WordPress, só para
  `/blog` (o único caminho que ainda depende dele — ver `src/lib/routes.ts`).
  Sem a variável, `/blog/*` devolve 404. **Não pode ser
  `https://farmaciaaguiadeouro.com.br`**: esse é o domínio do próprio site, e
  apontar para ele faz o site reescrever para si mesmo em laço. O build falha
  de propósito nesse caso, com a mensagem explicando o que pedir à hospedagem
  (um subdomínio como `wp.farmaciaaguiadeouro.com.br`, o origin hostname da
  hospedagem, ou o IP do servidor).
- `NEXT_PUBLIC_GA_ID` — ID de medição do GA4 (`G-XXXXXXXXXX`). Sem ele o script
  do Analytics simplesmente não é injetado.
- `RESEND_API_KEY` — chave da API do Resend, usada pelo formulário de contato
  (`/api/contato`). Sem ela, o formulário responde erro claro ao usuário
  ("Formulário indisponível... Fale pelo WhatsApp") em vez de falhar
  silenciosamente. Ver "Formulário de contato" abaixo para o que falta
  configurar antes de funcionar de verdade.

## Rastreamento

GA4 configurado: `NEXT_PUBLIC_GA_ID=G-RJLMJ0Q4T4` em `.env.local` (property
329327830 — não confundir os dois; o `GoogleAnalytics` do
`@next/third-parties` só aceita o measurement ID).

Todo elemento clicável relevante da página carrega `data-ga-event` +
`data-ga-origem`. Não existe um componente de cliente por botão: um único
listener delegado, em `SiteInteractions.tsx`, ouve cliques em
`[data-ga-event]` na página inteira e chama `sendGAEvent`. Para adicionar
rastreio a um novo link, basta escrever os dois atributos nele — em uma
`<a>` comum ou via `<CtaLink event="..." origem="...">` — nenhum outro
arquivo precisa mudar.

| Evento | Onde dispara | Marcar como conversão no GA4? |
|---|---|---|
| `contato_whatsapp` | nav, hero, "Como pedir", botão flutuante, rodapé (telefone da seção Contato e texto do número) | **sim** |
| `ir_para_loja` | hero, faixa "Não tem receita?", rodapé (Vitrine Virtual) | **sim** |
| `instagram_click` | faixa do Instagram no rodapé (botão e link da lista) | opcional — engajamento |
| `facebook_click` | rodapé, link da lista | opcional — engajamento |
| `tiktok_click` | rodapé, link da lista | opcional — engajamento |
| `contato_telefone` | rodapé, número de telefone (`tel:`) | opcional — engajamento |
| `contato_email` | rodapé, e-mail (`mailto:`) | opcional — engajamento |
| `link_institucional` | "Saber mais", "Ler história completa", e os links institucionais do rodapé (Quem somos, Blog, Política de privacidade, Termos de uso) | não |
| `contato_formulario` | envio bem-sucedido do formulário em `/contato/` | **sim** |
| `newsletter_cadastro` | envio bem-sucedido do formulário de newsletter, na home | **sim** |
| `link_avaliacoes_google` | home, link "avaliações no Google" na seção de depoimentos | opcional — engajamento |

Cada CTA de WhatsApp usa um texto pré-preenchido diferente (`WHATSAPP_LINKS`
em `src/lib/site.ts`), o que identifica a origem dentro da própria conversa
— inclusive o do rodapé, que ganhou o seu próprio texto nesta rodada.

Links para a loja levam UTM (`utm_source=lp&utm_medium=site&utm_campaign=home`)
com `utm_content` igual a `hero`, `sem-receita` ou `rodape`.

**Pendente no painel do GA4**: marcar `contato_whatsapp`, `ir_para_loja`,
`contato_formulario` e `newsletter_cadastro` como conversões (Admin → Eventos
→ marcar como conversão-chave). Os demais eventos são só para métricas de
engajamento e não precisam virar conversão.

## Movimento e interatividade

Quase toda a interação de cliente vive em **um único componente**,
`src/components/SiteInteractions.tsx`. As únicas duas exceções são
`ContactForm.tsx` e `Newsletter.tsx` — precisam de estado real de formulário
(campos, envio, sucesso/erro), o que não cabe no padrão de delegação por
atributo `data-ga-event`. `SiteInteractions.tsx` cuida de:

- revelação dos blocos ao entrar na viewport (`<Reveal>` só escreve
  `data-reveal`; quem observa é o controlador, com um listener por página);
- estado `data-scrolled` da barra fixa (transparente sobre o hero, navy ao
  rolar; sem JavaScript a classe `.js` não existe e a barra fica sempre navy,
  para o logo branco não sumir sobre o creme);
- rotação da bolha do botão flutuante de WhatsApp, a cada 5s;
- montagem do `<video>` do hero, só acima de 768px e depois do poster pintar;
- eventos do GA4, por delegação de clique em `[data-ga-event]`.

Isso é deliberado. A primeira versão usava um `"use client"` por elemento
animado (20 no total) e o TBT no mobile saltou de ~200 ms para ~500 ms.
Concentrando tudo em um controlador, a árvore inteira volta a ser renderizada
no servidor. **Antes de espalhar novos `"use client"` pela página, meça.**

A revelação usa varredura por posição no scroll, não `IntersectionObserver`:
com IO, um salto instantâneo até o rodapé faz os blocos do meio nunca cruzarem
o limiar e eles ficam invisíveis até a pessoa rolar de volta.

O CSS esconde os blocos apenas quando a classe `.js` existe no `<html>`, posta
por um script inline no layout. Sem JavaScript nada fica escondido, e o script
se desarma sozinho em 5s se a hidratação nunca acontecer.

`prefers-reduced-motion: reduce` desliga tudo: revelações aparecem prontas, o
anel do botão flutuante some, a bolha para de alternar e o vídeo não é montado.

## Cores da marca

Havia dois dourados em produção ao mesmo tempo — `#BFA364` no logo e `#977C3E`
no CSS do site antigo (106 usos contra 7). Não é um dado a consultar, é uma
decisão; ela foi tomada assim:

**O logo é a fonte da verdade.** Um logo é desenhado, um CSS se acumula. Mas
`#BFA364` não serve para tudo: como texto sobre branco dá 2,43:1, abaixo do
mínimo de 3,0 para texto grande. Daí dois passos do mesmo matiz (41,5°),
variando só a claridade — uma rampa, não duas cores de marca em conflito:

| Token | Hex | Uso | Contraste |
|---|---|---|---|
| `gold-400` | `#BFA364` | preenchimento de botão, texto sobre navy, anéis | 7,85:1 sobre navy |
| `gold-600` | `#8A7138` | numerais, divisores e bordas sobre fundo claro | 4,67:1 sobre branco |

Marinho: `#04063E`, amostrado do logo (o CSS do site usa `#04063D`, um ponto de
diferença). Os tons `navy-700`, `navy-600` e `navy-050` são clareamentos, não
amostras.

Creme: mantido `#FAF7F0`. O `#F0EFED` do site atual é **indistinguível** do
`navy-050` (`#EEEFF6`) — 1,00 de contraste entre os dois — e as seções alternam
creme / navy-050 / branco, então adotá-lo colapsaria duas delas na mesma cor.

Para voltar a um único dourado, iguale `gold-400` e `gold-600` a `#977C3E`:
passa em todos os usos, mas fica visivelmente mais escuro que o logo ao lado
dele na barra fixa.

## Contraste do hero

`--hero-overlay` (em `globals.css`) controla a opacidade do filtro navy sobre o
vídeo. Está em **0,72**. Medido contra o pixel mais claro do vídeo real
(237,237,237):

| Elemento | Contraste |
|---|---|
| Branco (h1) | 8,83:1 |
| Branco 90% (parágrafo) | 7,53:1 |
| Branco 80% (endereço) | 6,36:1 |
| Dourado da marca, se fosse usado | **3,63:1 — reprova** |

Por isso o eyebrow do hero é branco (`.eyebrow-light`) e o subtítulo do logo na
barra também — com o cabeçalho transparente ele fica sobre o vídeo. No rodapé,
sobre navy sólido, o dourado volta. Se aumentar a transparência, remeça.

## Assets

Todos em `public/img`, já otimizados. O `next/image` converte para AVIF/WebP e
gera os tamanhos responsivos no build — não é preciso versionar variantes.

| Arquivo | Onde aparece |
|---|---|
| `lab-manipulacao.jpg` | Autoridade — foto grande (3:2) |
| `lab-balanca.jpg` | Autoridade — inferior esquerda (4:3) |
| `lab-paramentacao.jpg` | Autoridade — inferior direita (4:3, `object-top` para não cortar a placa) |
| `fundador-1988.jpg` | Tradição — foto histórica (16:9), sem filtro |
| `logo-marca.png` | Águia da barra fixa e do rodapé |
| `logo-aguia-de-ouro.png` | Logo completo, usado para gerar a imagem de Open Graph |

Duas observações sobre os originais:

- O SVG do kit **não é vetor**: tem 9,9 MB e 95% do arquivo são dois PNGs
  embutidos em base64; os 323 `<path>` são só máscaras (removendo as imagens, o
  logo desaparece). Não dá para servi-lo direto. Em compensação ele tem fundo
  de fato transparente, então os PNGs acima foram rasterizados a partir dele —
  o que corrigiu os detalhes internos das penas, que são brancos e não navy.
  Se um dia a agência entregar um vetor real, é só regerar os dois PNGs.
- A assinatura "Águia de Ouro / Farmácia de manipulação" é texto real no HTML,
  não imagem: pesa menos e é lida por buscadores e leitores de tela.
- `fundador-1988.jpg` tem só 870x461. É exibido a até 570px, então passa, mas um
  scan maior do original renderia bem melhor.

Vídeo do hero em `public/video/` (MP4 396 KB, WebM 212 KB, poster 25 KB). Para
regerar a partir de um novo original:

```bash
ffmpeg -i original.mp4 -an -vf "scale=1920:-2" -c:v libx264 -crf 30 -preset slow -movflags +faststart public/video/hero.mp4
ffmpeg -i original.mp4 -an -vf "scale=1920:-2" -c:v libvpx-vp9 -crf 38 -b:v 0 public/video/hero.webm
ffmpeg -i original.mp4 -vframes 1 -vf "scale=1920:-2" -q:v 3 public/video/hero-poster.jpg
```

O favicon (`src/app/icon.png`) e a imagem de Open Graph
(`src/app/opengraph-image.jpg`) são geradas a partir do logo. Para refazer:

```bash
ffmpeg -y -f lavfi -i "color=c=0x0A0E42:s=512x512:d=1" -i public/img/logo-marca.png -filter_complex "[1:v]scale=420:-1[m];[0:v][m]overlay=(W-w)/2:(H-h)/2" -frames:v 1 src/app/icon.png
ffmpeg -y -f lavfi -i "color=c=0xFFFFFF:s=1200x630:d=1" -i public/img/logo-aguia-de-ouro.png -filter_complex "[1:v]scale=-1:520[m];[0:v][m]overlay=(W-w)/2:(H-h)/2" -frames:v 1 -q:v 2 src/app/opengraph-image.jpg
```

## Barra final em toda URL (`trailingSlash: true`)

Decisão site inteiro, em `next.config.ts`. Toda URL canônica termina em barra
— `/servicos/`, não `/servicos`. Motivo: todas as URLs antigas do WordPress
terminavam em barra, e o Next, com o padrão (`trailingSlash: false`), **tira
a barra antes de consultar `redirects()`** — isso é um passo interno do
framework, incondicional, que nem `redirects()` nem Middleware conseguem
interceptar. O resultado seria sempre 2 saltos (Next tira a barra, só depois
redireciona pro destino final), o que a auditoria de SEO original proíbe
explicitamente. Com `trailingSlash: true`, a barra final vira a forma
canônica do site inteiro, a URL antiga já chega no formato certo, e tudo
resolve em 1 salto. Testado e confirmado (`curl -sIL`) antes de generalizar.

Consequência prática: todo link interno novo precisa terminar em barra
(`href="/quem-somos/"`, não `href="/quem-somos"`) — já corrigido em todos os
componentes existentes. Toda página nova precisa declarar
`alternates: { canonical: `${SITE_URL}/rota/` }` com a barra. O `sitemap.ts`
já gera todas as URLs com barra.

## Redirect de conteúdo descontinuado (`/produto`, `/produtos`, `/necessidades`)

A farmácia descontinuou o catálogo que existia no WordPress (49 produtos + 13
termos de categoria + 21 "necessidades" = 83 URLs) porque esse papel passou
para a Vitrine Virtual (loja separada, `aguiadeouro.loja.pedidopago.com.br`).
`/topico` também saiu, mas não tem post type nem taxonomia exposta pela API
do WordPress — sem lista de slugs pra casar individualmente.

**Processo de matching** (documentado porque não é óbvio e pode precisar ser
refeito se a loja mudar de plataforma): a Vitrine Virtual não tem sitemap de
produtos nem API pública — o catálogo é renderizado no cliente. O único jeito
de descobrir se um produto existe lá é pela busca em
`/produtos/{termo}` (SSR, then curl-able). Um script (não versionado, rodou
uma vez — ver histórico se precisar refazer) tentou casar o nome de cada um
dos 83 itens contra essa busca, extraindo o(s) produto(s) retornado(s) e
comparando por palavra distintiva (não por contador de resultados — quando a
busca não acha nada relevante, a loja mostra uma lista padrão de "produtos
relacionados" em vez de zero, então contar resultados > 0 não prova match).

Resultado: **57 de 83 com destino específico** (URL de busca da loja que
mostra o produto certo), **29 em fallback para `/servicos`**. A lista
completa dos que não foram encontrados:

- **Produtos** (post type `produto`): Sérum Hidratante e Rejuvenescedor
  (Tensiplus/Hyaxel/Matrixyl), Sérum Área dos Olhos (Beautifeye/Idealift),
  Bitter Melon, 5-HTP 100mg.
- **Taxonomia `produtos`**: Aminoácido, Antioxidante, Beleza e Estética,
  Cosmético Manipulado, Esportivo, Fitoterápico, Medicamento Manipulado,
  Mineral, Patenteado.
- **Taxonomia `necessidades`**: Ansiedade e Humor, Anti-inflamatório,
  Antioxidante, Articulações e Ossos, Circulação, Cognição e Foco, Controle
  Glicêmico, Drenagem e Retenção, Energia e Disposição, Libido, Menopausa,
  Saúde Feminina, Saúde Intestinal.

O mapa final está em `src/data/redirect-map-produtos.json` (86 entradas — 83
itens + as 3 raízes `/produto`, `/produtos`, `/necessidades`), aplicado via
`redirects()` em `next.config.ts`. `scripts/build-redirect-map.mjs` e
`scripts/clean-redirect-map.mjs` documentam como o arquivo final foi montado
e normalizado (minúsculo, sem acento, sem dosagem no termo de busca) — não
rodam como parte do build, são histórico/ferramenta pra remontar o mapa se
precisar.

## Formulário de contato

`/api/contato` (Route Handler) recebe o POST da página `/contato/` e envia
por e-mail via [Resend](https://resend.com) para
`atendimentoaguiadeouro@gmail.com`. Defesas contra spam sem depender de
serviço externo nenhum: campo honeypot (invisível, só um robô preenche) e
tempo mínimo entre carregar o formulário e enviar (< 2,5s é comportamento de
robô). Validação de e-mail/tamanho de campo no servidor, checagem de mesma
origem no header `Origin`, e o endpoint responde `X-Robots-Tag: noindex` e
405 a GET — não é uma página, não deve ser indexado nem acessível por
navegação direta.

**Falta para funcionar de verdade**, do lado de vocês:

1. Criar conta no [Resend](https://resend.com) (grátis, sem cartão até um
   volume considerável de e-mails).
2. Verificar o domínio `farmaciaaguiadeouro.com.br` lá — o Resend fornece
   registros DNS (TXT/DKIM) para adicionar no DNS Pro/cPanel, mesmo painel
   onde vocês já mexeram para o subdomínio do WordPress. Sem isso, o Resend
   só permite enviar para o próprio e-mail da conta, não para
   `atendimentoaguiadeouro@gmail.com`.
3. Gerar uma API key no Resend e me passar o valor — vai em
   `RESEND_API_KEY`, nunca commitado (mesmo tratamento do `NEXT_PUBLIC_GA_ID`).

Não criei a conta por vocês — está fora do que posso fazer sozinho (ver
regras de segurança no início desta sessão).

## Newsletter

`/api/newsletter` segue o mesmo desenho do `/api/contato`: honeypot, tempo
mínimo antes do envio, checagem de mesma origem, `X-Robots-Tag: noindex`,
405 a GET. A diferença é o que acontece depois da validação — **não há
provedor de e-mail marketing configurado ainda**. Cada cadastro vira um
e-mail avulso para `atendimentoaguiadeouro@gmail.com`, reaproveitando a
mesma conta Resend (e a mesma `RESEND_API_KEY`) do formulário de contato —
não é preciso criar nenhuma conta nova para isso funcionar.

Isso é combinado, não descuido: quando eu perguntei que provedor usar
(Resend Audiences, Mailchimp, etc.), a resposta foi "só capturar o e-mail
por enquanto". Então, até vocês decidirem uma ferramenta de disparo de
verdade, os cadastros chegam por e-mail avulso e alguém precisa reunir os
endereços manualmente (por exemplo, numa planilha) para disparar campanhas.
Quando houver um ESP definido, é só trocar o corpo de
`src/app/api/newsletter/route.ts` — o formulário (`Newsletter.tsx`) e o
contrato da API continuam os mesmos.

O texto da seção promete "conteúdo de saúde" (dicas, cuidados, novidades),
conforme definido — não promoções. Se a intenção mudar, o texto em
`src/components/Newsletter.tsx` precisa mudar junto, para não prometer algo
diferente do que é enviado.

## Avaliações de clientes (Google)

A seção "O que dizem os clientes", na home, mostra seis avaliações reais do
perfil da farmácia no Google Maps — todas conferidas manualmente como 5
estrelas (de 182 avaliações no total, 148 são 5★; a nota geral do perfil é
4,5). Nomes aparecem abreviados (ex.: "Cristiane F.") para reduzir exposição
de dado pessoal, mesmo sendo informação que o próprio Google já expõe
publicamente.

Não há integração automática com a API do Google — as avaliações em
`src/components/Testimonials.tsx` são um retrato de 17/09/2026. Se quiserem
manter a seção atualizada, é preciso revisar de tempos em tempos (trocar por
avaliações mais recentes, ou simplesmente conferir se as atuais continuam
representativas). O link "ver avaliações no Google" e o `aggregateRating`
somado ao JSON-LD do site (`src/app/layout.tsx`) usam os mesmos números —
`ratingValue`/`reviewCount` em `GOOGLE_REVIEWS`, `src/lib/site.ts` — e devem
ser atualizados junto.

## Migração do blog — pendente, maior tarefa que falta

78 posts confirmados via API do WordPress (`/wp-json/wp/v2/posts`, aberta,
sem autenticação). Não fica pesado migrar todos: um site estático em Next.js
pré-gera cada página em build — mais posts custam tempo de build, não
velocidade para quem visita.

Ainda não iniciado: templates de listagem e post individual, extração e
limpeza do HTML de cada post (vem com marcação do editor de blocos do
WordPress, precisa virar HTML limpo), download e otimização das imagens
referenciadas, e o texto de revisão por farmacêutica em cada post —
**"revisado pela farmacêutica responsável, Dra. Midiã Castro Varjão de Melo,
CRF-SP 44084"**, junto da autoria de Samuel Varjão, confirmados como padrão
para todo post (conteúdo de saúde exige esse sinal de E-E-A-T). Autor:
Samuel Varjão — cargo/título a confirmar.

## WordPress origin — infra confirmada, faltam dois passos no servidor

Servidor identificado: `pro118.dnspro.com.br` (cPanel/WHM + LiteSpeed +
CloudLinux), conta `farm3832`, document root `/home/farm3832/public_html`.
Descartadas as opções mais simples: o endereço temporário `~usuario` dá 404
(mod_userdir desligado, padrão em cPanel novo com LiteSpeed), e o IP
`186.209.113.106` é compartilhado — bater nele direto não identifica o site
certo.

O caminho é criar um subdomínio. `WORDPRESS_ORIGIN` em `.env.local` já está
com o valor combinado (`https://wp.farmaciaaguiadeouro.com.br`) e o build já
confirmou: 18 rewrites gerados, sem disparar a trava de auto-referência (é
host diferente do domínio público). Faltam dois passos, ambos no lado do
WordPress/hospedagem — nenhum deles é código deste repositório:

**1. Criar o subdomínio no cPanel.** Domínios → Subdomínios (ou "Criar novo
domínio" → tipo subdomínio, dependendo da versão do painel): subdomínio `wp`,
domínio `farmaciaaguiadeouro.com.br`, document root **`public_html`** — o
cPanel sugere `public_html/wp` por padrão, precisa trocar manualmente, senão
o subdomínio serve uma pasta vazia em vez do WordPress. Esperar o AutoSSL
emitir o certificado (geralmente minutos) antes de testar por HTTPS.

**2. Desligar o redirect canônico do WordPress para esse host.** Sem isso, o
subdomínio funciona mas o WP devolve 301 de volta para o domínio público
sempre que o `Host` da requisição não bate com a opção `siteurl` salva no
banco — que continua sendo o domínio público de propósito (ver abaixo). Isso
reabre o mesmo loop, só que via redirect em vez de rewrite.

Duas saídas foram cogitadas — manter `siteurl`/`home` no domínio público e
suprimir só o redirect, ou trocar `WP_HOME`/`WP_SITEURL` dinamicamente pelo
host. A primeira é a certa aqui: os rewrites deste projeto fazem proxy de
bytes crus, sem reescrever o HTML que volta — se o WordPress emitisse seus
links internos (menu, `rel=canonical`, RSS, sitemap, REST API) com o host
`wp.`, um visitante clicando em qualquer link do blog cairia num endereço que
não deveria existir para o público, e o Google indexaria conteúdo duplicado
nos dois hosts.

Crie `wp-content/mu-plugins/no-canonical-proxy.php` (crie a pasta
`mu-plugins` se ela não existir — o WordPress não cria sozinha, mas qualquer
`.php` solto ali roda automaticamente, sem precisar ativar em Plugins):

```php
<?php
/**
 * Desliga o redirect canônico do WordPress só para requisições que chegam
 * pelo host interno do proxy (wp.farmaciaaguiadeouro.com.br).
 *
 * Usa o FILTRO redirect_canonical, não a action de mesmo nome — remover a
 * action via remove_filter() depende de rodar depois que ela foi registrada
 * em default-filters.php, e a ordem entre isso e o carregamento de mu-plugins
 * varia por versão do WP. O filtro não tem esse problema: ele só precisa
 * estar registrado antes de redirect_canonical() executar de fato, o que só
 * acontece muito mais tarde no ciclo da requisição (perto do fim, quando o
 * template é escolhido) — bem depois de qualquer mu-plugin já ter rodado.
 */
add_filter( 'redirect_canonical', function ( $redirect_url ) {
    if ( ( $_SERVER['HTTP_HOST'] ?? '' ) === 'wp.farmaciaaguiadeouro.com.br' ) {
        return false;
    }
    return $redirect_url;
} );
```

Depois de testar `/blog` pela LP: se ainda vier 301/302 mesmo com isso no ar,
o suspeito mais comum é um plugin de segurança ou cache com verificação
própria de `Host` (alguns firewalls de aplicação bloqueiam ou redirecionam
hosts "não reconhecidos" como proteção contra cache poisoning) — a correção é
a mesma ideia: abrir uma exceção para o host `wp.`.

## Pendente do cliente

- **Resend**: criar conta, verificar o domínio `farmaciaaguiadeouro.com.br`
  (registros DNS no cPanel/DNS Pro) e passar a API key — sem isso o
  formulário de contato não envia e-mail de verdade (ver "Formulário de
  contato" acima).
- **Blog**: enquanto `WORDPRESS_ORIGIN` não estiver configurado (ver seção
  própria), `/blog/*` responde 404 — e mesmo configurado, isso é só uma
  ponte temporária até a migração dos 78 posts terminar.
- Criar o subdomínio `wp.farmaciaaguiadeouro.com.br` no cPanel e o mu-plugin
  — os dois passos detalhados na seção "WordPress origin" abaixo. Necessário
  só para `/blog` continuar respondendo enquanto a migração não termina.
- Cargo/título de Samuel Varjão, para a assinatura dos posts do blog.
- Fotos e bios da equipe para a página Quem Somos (hoje com placeholders
  visíveis, "Área reservada para foto e bio").
- Confirmar se "Atendimento Farmacêutico" (mantido em Serviços) e os outros
  fatos herdados do site atual (ex.: horário, especialidades) continuam
  exatos — parte veio de raspagem do site em produção, vale um olhar humano.
- Aval da marca sobre a rampa de dourado escolhida acima.

Resolvido nesta rodada: `NEXT_PUBLIC_GA_ID` (`G-RJLMJ0Q4T4`, em `.env.local`,
que não vai para o git); a rampa de dourado, com o hex do logo como fonte da
verdade; o logo — o cliente confirmou usar os PNGs já extraídos do `.svg`
mesmo sem um vetor de verdade, então essa pendência caiu; e o parágrafo da
seção Tradição (`src/components/Tradition.tsx`), com o texto que o cliente
enviou sobre a origem paranaense do fundador, a mudança para São Paulo e a
abertura da farmácia aos 29 anos com um único farmacêutico.

Uma fusão de texto que valeu registrar: o parágrafo enviado repetia a data de
fundação e o "trabalhou desde a adolescência em farmácia" que já estavam no
texto de abertura (ambos vieram do próprio cliente, em mensagens diferentes).
Em vez de empilhar os dois, mesclei tudo numa narrativa só, sem repetir
nenhum fato e sem inventar nada além do que as duas mensagens traziam. Isso
também deixou o parágrafo bem mais longo que o original — a coluna de texto
passou a ficar quase o dobro da altura da foto ao lado. Em vez de cortar
conteúdo real para caber, troquei o alinhamento da grade de `items-center`
para `items-start` no desktop: a foto ancora no topo, junto do título, e a
folga sobra só embaixo — como um retrato ao lado de uma biografia, em vez de
flutuando no meio de um vão vazio.

Observação à parte, sem ação necessária: o GA4 do site *atual* não tem tag
visível no WPCode nem `gtag`/`dataLayer` na página — o cookie
`_ga_RJLMJ0Q4T4` provavelmente é injetado pelo Adopt (`tag.goadopt.io`), o
gerenciador de consentimento que carrega lá. Isso não afeta a LP: o
`GoogleAnalytics` do `@next/third-parties` injeta o gtag diretamente no HTML,
sem depender de WPCode ou do Adopt.

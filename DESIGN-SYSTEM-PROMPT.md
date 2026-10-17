# Design System Prompt — Ink

Guia de engenharia e design, escrito para ser entregue a um modelo de linguagem como system prompt ou documento de referência. Descreve a identidade visual de abneribeiro.com de forma independente da stack, para que possa ser reproduzida com rigor em sites pessoais, blogs, dashboards analíticos ou ferramentas SaaS.

Origem: destilado de `src/app.css` (fonte única de verdade dos tokens e utilities), dos componentes Svelte em `src/components/` e das decisões documentadas no projeto. Os valores numéricos deste documento são os do código; se alguma vez divergirem, o código manda.

**Como usar este documento**

1. Os tokens da secção 1 a 4 são contratos, não sugestões. Nenhum valor fora deles entra num componente sem uma justificação escrita junto ao código.
2. Antes de criar um padrão novo, compor os existentes (secção 5). Um padrão novo só nasce quando aparece em dois ou mais sítios ou carrega lógica (pseudo-elemento, gating de hover, media query).
3. Perante uma dúvida estética, remover. Este sistema ganha por subtração.
4. A secção 7 contém o prompt de execução pronto a copiar.

---

## 1. Filosofia de design e princípios fundamentais

### 1.1 Tese visual

**Quiet authority.** A interface transmite competência pela precisão e pela contenção, não por volume, cor ou movimento. O leitor deve confiar no autor antes de terminar o primeiro parágrafo.

Princípios, por ordem de precedência:

1. **Words first, chrome last.** Tipografia e leitura são o produto. Todo o elemento que não é texto tem de justificar a sua presença ou é removido.
2. **Confidence through restraint.** Autoridade sinaliza-se com precisão e silêncio. Hierarquia constrói-se com peso, espaço e degraus de tom, nunca com tamanho, cor ou sombra.
3. **The interface is the proof.** O produto pratica os valores que afirma: a menor dependência viável, escolhas aborrecidas mas corretas, nada que siga tendências.
4. **Detail is the differentiator.** Hairlines, rótulos monoespaçados em minúsculas, uma única entrelinha base, transições curtas e consistentes. O ofício vive nas decisões pequenas, e essas decisões são iguais em todo o lado.
5. **Both jobs, effortless.** Quem chega pela primeira vez percebe em segundos quem é o autor (ou o que a ferramenta faz) e consegue começar a ler (ou a trabalhar) sem fricção, em qualquer dispositivo.

### 1.2 Anti-referências

O resultado nunca pode parecer:

- **Landing de SaaS ou startup de IA genérica:** hero com gradiente, fundo creme ou areia, grelhas de cards de funcionalidades, métricas gigantes em destaque, jargão de marketing.
- **Ruidoso ou sobre-desenhado:** animação vistosa, glassmorphism, néon, superfícies saturadas de cor, efeitos que existem para chamar a atenção.
- **Template corporativo:** fotografia de banco de imagens, botões azuis arredondados estilo Bootstrap, qualquer coisa confundível com um template de agência.
- **Cliché de terminal:** verde sobre preto, "developer = dark mode". A credibilidade vem da tipografia, não do disfarce.

### 1.3 Regras de cor

**Uma única rampa de tinta neutra sobre branco puro.** Todos os valores são `oklch` com croma 0: uma rampa pura de luminosidade. Não existe cor de marca, cor de estado, cor de sintaxe nem dark mode (`color-scheme: light` é declarado explicitamente).

| Token | oklch | Hex aproximado | Contraste em branco | Papel |
|---|---|---|---|---|
| `--color-ink` | `oklch(0.22213 0 0)` | `#1b1b1b` | ~17:1 | Texto primário: `h1`, títulos, estado ativo, fundo de `::selection`, anel de foco |
| `--color-ink-2` | `oklch(0.30557 0 0)` | `#2f2f2f` | ~13:1 | Corpo de texto longo, células de tabela, `kbd`, mensagens |
| `--color-ink-3` | `oklch(0.47421 0 0)` | `#5c5c5c` | 6.70:1 | Texto discreto: rótulos, links, ações em repouso, datas, parágrafos secundários, `h4` |
| `--color-ink-4` | `oklch(0.6901 0 0)` | `#9b9b9b` | 2.77:1 | **Apenas decorativo:** rodapé, legendas, marcadores de lista, traços, citações. Nunca links, nunca texto de leitura principal |
| `--color-surface` | `oklch(1 0 0)` | `#ffffff` | — | Fundo da página e de painéis |
| `--color-surface-2` | `oklch(0.9821 0 0)` | `#f9f9f9` | — | Preenchimento de blocos assentes na página: `pre`, linhas pares de tabela, `kbd`, skeletons |
| `--color-surface-3` | `oklch(0.9612 0 0)` | `#f2f2f2` | — | **Apenas placas de hover/foco** (`quiet-action`, `list-row`). `surface-2` como placa de hover quase não se nota |
| `--color-hair` | `oklch(0 0 0 / 5%)` | ~`#f2f2f2` sobre branco | — | Hairline por omissão: `hr`, regras de rodapé, linhas de tabela, molduras |
| `--color-hair-strong` | `oklch(0 0 0 / 10%)` | ~`#e6e6e6` sobre branco | — | Regra de `thead`, borda de `kbd`, traços de diagramas |
| `--color-accent` | `var(--color-ink)` | `#1b1b1b` | — | Anel de foco, fundo do skip link. O "acento" é a própria tinta |

**Regras estritas**

- **No hue rule.** Proibido qualquer matiz: links coloridos, verde de sucesso, vermelho de erro, amarelo de aviso, tema de sintaxe colorido, gradientes de cor. Erros, avisos e dicas distinguem-se por **rótulo e ícone**, nunca por cor. Se um callout ganhar variantes, a variante muda o ícone e o texto do rótulo, nunca a cor.
- **Escolher por papel, não a olho.** Texto que deve recuar desce um degrau na rampa. Nunca se usa `opacity` para atenuar texto.
- **Exceção única de opacidade:** `dim-group` atenua os irmãos de um item em hover/foco para `opacity: 0.32`, e é desligado em `@media (prefers-contrast: more)`.
- **`ink-4` é o piso documentado, não um precedente.** Está abaixo de AA de propósito e serve apenas elementos decorativos ou terciários. Texto discreto não "fica mais claro por elegância".
- **Hairlines:** `1px solid var(--color-hair)`. A única hairline de `0.5px` é a de um painel flutuante, que de outra forma pareceria pesada.
- **Elevação:** existe **uma** superfície elevada (painel flutuante, ex.: índice lateral, popover). Tudo o resto é plano, separado por hairlines. Hierarquia nunca se ganha com sombra.

```css
--shadow-panel:
  0 6px 18px oklch(0 0 0 / 0.02), 0 3px 9px oklch(0 0 0 / 0.04),
  0 1px 1px oklch(0 0 0 / 0.04), 0 0 0 1px oklch(0 0 0 / 0.1);
```

- **Seleção de texto:** `::selection { background: ink; color: surface }`.
- **Superfícies fora do CSS** (imagens OG, ícones gerados, manifestos) usam espelhos hex dos tokens (`#1b1b1b`, `#5c5c5c`, `#e6e6e6`, `#ffffff`). Se um token mudar, os espelhos mudam no mesmo commit.

---

## 2. Tipografia e ritmo vertical

### 2.1 Famílias

| Token | Família | Notas |
|---|---|---|
| `--font-sans` | Inter (variável, ficheiro com eixo `opsz`) | Texto e títulos. Eixo óptico fixado em `opsz 14` |
| `--font-mono` | Geist Mono (variável, eixo `wght`) | Rótulos, metadados, código, cabeçalhos de tabela, nav |

```css
--font-sans: 'Inter Variable', 'Inter Fallback', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono Variable', 'Geist Mono Fallback', ui-monospace, SFMono-Regular, monospace;
```

- Self-hosted, subconjunto latino apenas, `font-display: swap`. Pré-carregar só a fonte do LCP (Inter).
- **Fallbacks com métricas ajustadas são obrigatórios:** `local('Arial')` com `size-adjust`, `ascent-override`, `descent-override`, para que a troca de fonte não provoque reflow (Inter: 107.12% / 90.44% / 22.52%; Geist Mono: 134.59% / 74.67% / 21.92%).
- `font-feature-settings: 'calt', 'ccmp', 'locl', 'kern'`. **Não** ativar `ss01` nem `cv11`: alteram a largura de `a` e `g`.
- `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`.
- Setas são ícones SVG, nunca o glifo `→`, que cai fora do subconjunto e renderiza na fonte de fallback.

### 2.2 Escala tipográfica

Escala fixa, em **px** de propósito: não se move com `html { font-size }`. O `html` está a `93.75%` (15px), o que governa apenas utilities em rem, de modo que um leitor que aumente a fonte do browser continua a escalar o layout.

| Token | Tamanho | Entrelinha | Uso |
|---|---|---|---|
| `--text-meta` | 12px | 20px | Rótulos mono, rodapé, linha de metadados, legendas, `kbd`, blocos de apoio |
| `--text-small` | 13px | 20px (código) / 24px (links de índice) | Código (bloco e inline), células de tabela, links do índice |
| `--text-regular` | 14px | 24px | **Corpo por omissão e todos os títulos**, incluindo o `h1` |
| `--text-title2` | 24px | 28px | Numeral de display em ecrã pequeno |
| `--text-title1` | 36px | 40px | Numeral de display (404, 500, KPI único) |

Cinco degraus, todos em uso. Proibido: `text-[15px]`, `text-base`, `text-lg`, tamanhos em rem, tamanhos fluidos com `clamp()`. Um sexto degrau exige uma justificação escrita junto ao token.

### 2.3 Entrelinha

**Baseline de 24px em todo o lado** (`line-height: 24px` em `html, body`). Exceções deliberadas: 20px para `text-meta` e blocos de código; 40px/28px para o numeral de display.

### 2.4 Pesos

Os pesos aplicam-se através de `font-variation-settings`, nunca `font-weight`. Como o sistema herda `font-variation-settings` em `*`, utilities como `font-medium` ou `font-semibold` são **silenciosamente ignoradas**.

```css
:root {
  --wght-400: "wght" 400, "opsz" 14;
  --wght-450: "wght" 450, "opsz" 14;
  --wght-500: "wght" 500, "opsz" 14;
  --wght-600: "wght" 600, "opsz" 14;
  --wght-700: "wght" 700, "opsz" 14;
}
* { font-variation-settings: inherit; }
```

| Peso | Forma | Uso |
|---|---|---|
| 400 | variável `:root` | Corpo por omissão, `thead` |
| 450 | variável `:root` | Prosa de leitura longa (meio degrau de cor extra) |
| 500 | utility `wght-500` | Títulos de linhas, `h3`/`h4` de prosa, `strong` |
| 600 | utility `wght-600` | Numeral de display, marca, item de nav ativo |
| 700 | utility `wght-700` | Todo o `h1` e todo o `h2` (títulos de página e de secção) |

Os eixos `wght` e `opsz` são declarados sempre em conjunto. Nunca `font-optical-sizing: auto`: o desenho está fixado num único tamanho óptico.

### 2.5 Tracking

Existe exatamente um: `letter-spacing: 0.02em` em `text-label` (mono, minúsculas). O skip link usa `0.01em` como exceção local. Nenhum outro elemento recebe tracking; títulos nunca levam tracking negativo.

### 2.6 Títulos

A escala é plana por desenho: **todos os títulos estão a 14px**. A hierarquia vem de peso, espaçamento e degrau da rampa.

| Elemento | Tamanho | Peso | Cor | Notas |
|---|---|---|---|---|
| `h1` | 14px / 24px | 700 | `ink` | Um por página, `text-wrap: balance` |
| `h2` | 14px / 24px | 700 | `ink` | Secção; 48px acima, 12px abaixo |
| `h3` | 14px / 24px | 500 | `ink` | 32px acima, 12px abaixo |
| `h4` | 14px / 24px | 500 | `ink-3` | 32px acima, 12px abaixo |

`section-heading` (o `h2` que abre uma secção de lista) é `wght-700`, `ink`, `padding-bottom: 4px`: somado aos 12px de padding da primeira linha, dá 16px até ao primeiro título.

Títulos levam `scroll-margin-top: 128px`, emparelhado com `scroll-padding-top: 128px` no `html` e com o `top-fade` de 128px. Os três mudam juntos ou nenhum muda.

### 2.7 Texto auxiliar

```css
/* text-label: kickers, eyebrows, rótulos de metadados, nav */
.text-label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: lowercase;
  color: var(--color-ink-3);
}
```

- **Metadados** (`text-meta`): `12px / 20px`, sans, `ink-4`, separados por ` · ` (ponto médio com espaços). Ex.: "6 min read · October 5, 2026".
- Datas em listas: formato curto ("Oct 2026"), `ink-3`, `white-space: nowrap`, dentro de `<time datetime>`. Na página de detalhe: formato longo ("October 5, 2026").
- Microcopy em minúsculas e seco: "nothing published yet", "keep reading", "all writing", "failed".

### 2.8 Prosa

```css
.prose {
  font-size: 14px;
  line-height: 24px;
  font-variation-settings: var(--wght-450);
  color: var(--color-ink-2);
}
.prose strong { font-variation-settings: var(--wght-500); color: var(--color-ink); }
.prose :where(p, li) { text-wrap: pretty; overflow-wrap: break-word; }
```

- **Links em prosa:** `ink-3`, sublinhado de 1px a 20% de `currentcolor`, `text-underline-offset: 2px`; hover para `ink-2` em 200ms.
- **Listas:** marcadores desenhados à mão. `ul`: travessão "–" em `ink-4`; `ol`: numeral com `tabular-nums` em `ink-3`. Recuo de 24px, 8px entre itens.
- **Citações:** `padding-left: 16px`, `border-left: 2px dashed hair`, texto em `ink-4`.
- **`hr`:** `border-top: 1px solid hair`.
- **Imagens/vídeo:** `border-radius: 8px`. Legendas: 12px, peso 500, `ink-4`, centradas, 12px acima.
- **Tabelas:** largura total, 13px, células `8px 12px`. `thead` em mono 12px, minúsculas, `0.02em`, `ink-3`, regra `hair-strong`. Linhas do corpo com regra `hair`, texto `ink-2`, `vertical-align: top`; linhas pares em `surface-2`. Envolvidas num contentor com `overflow-x: auto`.
- **`kbd`:** mono 12px, `padding: 2px 6px`, borda `hair-strong` com `border-bottom-width: 2px`, raio 4px, fundo `surface-2`, `ink-2`.

### 2.9 Código

- **Bloco (`pre`):** fundo `surface-2`, `1px solid hair`, `border-radius: 8px`, `padding-block: 12px`, `overflow-x: auto`. O padding horizontal (16px) vive em cada linha (`[data-line]`), não no `pre`. Código a 13px / 20px em mono. Em ecrã pequeno (< 40rem), o `pre` estende-se 8px para lá da coluna de cada lado.
- **Inline (`code`):** 13px mono em `ink`, **sem placa**. A face e um degrau acima na rampa bastam; um snippet longo quebra como uma palavra. Placas existem só para `pre` e `kbd`.
- **Tema de sintaxe monocromático:**

| Escopo | Cor |
|---|---|
| Texto por omissão, identificadores | `ink-2` |
| Keywords, storage, nomes de função | `ink` |
| Strings, números, constantes | `ink-3` |
| Pontuação, operadores | `ink-3` |
| Comentários | `ink-4` |

Sem títulos de bloco, sem destaque de linhas, sem números de linha, sem cor.

---

## 3. Espaçamento e grelha

### 3.1 Unidade base

```css
--spacing: 4px; /* px, não 0.25rem */
```

Declarado em px porque, contra `html { font-size: 93.75% }`, um degrau em rem daria 3.75px e sairia da grelha. Toda a medida de padding, margem, gap, offset e dimensão aterra num múltiplo de 4. Valores arbitrários são permitidos para layout pontual (`clamp(20px, 6vw, 80px)`), desde que os extremos aterrem na grelha ou a exceção esteja comentada no código.

Degraus recorrentes: `4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 56 · 64 · 80 · 96`.

### 3.2 Coluna e shell

```css
--container-post: 640px; /* coluna única de leitura, ~75 caracteres a 14px */
```

Uma coluna para todas as páginas. O shell separa responsabilidades: o contentor exterior é dono do padding lateral, o interior da largura; cabeçalho, conteúdo e rodapé partilham a coluna e não podem desalinhar.

```html
<div class="w-full px-[clamp(20px,6vw,80px)] pt-[clamp(56px,8vw,96px)] pb-24">
  <div class="w-full max-w-[640px] mx-auto flex flex-col">
    <header class="mb-14 max-sm:mb-10">…</header>
    <main id="app" tabindex="-1">…</main>
    <footer class="mt-20 pt-6 border-t border-hair">…</footer>
  </div>
</div>
```

Páginas nunca reafirmam o padding nem a largura da coluna: herdam o shell.

### 3.3 Ritmo vertical da prosa

O contentor de prosa é **dono de todas as margens**: zera cada bloco e reconstrói o ritmo com seletores de irmão. Nenhum bloco embebido traz `margin-top`/`margin-bottom` próprio (somar-se-iam).

| Par | Distância |
|---|---|
| Parágrafo após parágrafo (`* + *`) | 20px |
| Antes de `h2` | 48px |
| Antes de `h3`/`h4` | 32px |
| Título seguido de conteúdo | 12px (o título pertence ao texto de baixo) |
| À volta de `hr`, `blockquote`, `table` | 32px |
| Após `pre` | 24px |
| À volta de `figure`, `img`, `video` | 48px |
| Bloco de apoio final | 64px, com hairline 24px acima |

### 3.4 Ritmo de página (fora da prosa)

- Entre blocos de uma página inicial: `gap: 48px`. Dentro de um bloco de bio: `gap: 12px`.
- Linhas de lista ficam a 24px umas das outras (12px de padding vertical cada), uma baseline.
- Grelha de linha: `grid-template-columns: 1fr auto; align-items: baseline; gap: 32px` (16px em ecrã pequeno). Título à esquerda, data à direita.
- Cabeçalho do detalhe: `h1` e linha de metadados com `gap: 4px`, `padding-bottom: 12px`.

### 3.5 Raios

| Token | Valor | Uso |
|---|---|---|
| `--radius-badge` | 6px | Placa de `quiet-action`, skip link, marca |
| `--radius-panel` | 8px | `pre`, imagens, placa de `list-row`, painel flutuante, molduras de diagrama |
| (local) | 4px | `kbd` |
| (local) | 2px | Arredondamento do anel de foco |

Nada de pills (`rounded-full`) em elementos de texto.

### 3.6 Breakpoints

| Nome | Valor | Uso |
|---|---|---|
| `sm` / `max-sm` | 40rem | Ajustes de telemóvel: alvos de 44px, bleeds menores, empilhamento |
| (raw) | 641px | Abaixo disto o `top-fade` desaparece |
| `rail` | 1000px | Abaixo disto não há gutter lateral para um índice fixo de 200px |

Mobile-first. Nunca scroll horizontal na página: qualquer elemento que sangre para fora da coluna (placa de hover, `pre`, figura) tem de caber dentro do padding lateral mínimo (20px).

### 3.7 `top-fade`

Gradiente branco fixo de 128px no topo do viewport, com 13 paragens numa curva (duas paragens fariam banding). `pointer-events: none`. Desativado abaixo de 641px.

### 3.8 Extrapolação para dashboards e SaaS (derivado)

As regras abaixo não existem no site de origem; são a aplicação coerente do sistema a interfaces densas.

- **Largura:** manter a coluna de 640px para texto, formulários e definições. Para vistas de dados, usar larguras múltiplas de 4 (ex.: 960px, 1200px), mas manter qualquer bloco de texto corrido limitado a ~65–75 caracteres.
- **Navegação:** rótulos `text-label` com `nav-link`; nunca uma sidebar com ícones coloridos. Uma sidebar, se existir, é uma lista de `text-label` com hairline à direita.
- **Tabelas de dados:** a receita das tabelas de prosa (thead mono minúsculo, linhas `hair`, pares `surface-2`, números com `tabular-nums` alinhados à direita). Linhas clicáveis usam a placa `surface-3` de `list-row`.
- **KPIs:** numeral em `text-title1` 600 `ink`, rótulo `text-label` por cima, variação em `ink-3` com sinal explícito (`+4.2%`, `−1.1%`), nunca verde/vermelho. Sem cards com sombra: separar por hairlines e espaço.
- **Gráficos:** séries na rampa de tinta (`ink`, `ink-3`, `ink-4`, tracejados para distinguir), eixos e grelhas em `hair`, rótulos de eixo em mono 12px `ink-3`. Distinguir séries por traço, padrão ou rótulo direto, não por matiz.
- **Formulários:** campo com `1px solid hair-strong`, raio 6px, fundo `surface`, 14px/24px, altura mínima 36px (44px abaixo de 40rem); foco com o anel padrão. Rótulo em `text-label` acima. Erro sinalizado por texto (`ink`, peso 500) e ícone, não por borda vermelha.
- **Ação primária:** continua a ser `quiet-action`. Se for indispensável uma ação de alto compromisso, a única forma tolerada é texto `surface` sobre placa `ink` com raio 6px (a mesma construção da marca e do skip link), uma por ecrã.
- **Estados de carregamento:** blocos `surface-2` com as dimensões finais (sem shimmer animado). Estado vazio: uma linha em `ink-3`, minúsculas.

---

## 4. Animação e movimento

### 4.1 Tokens

```css
--default-transition-duration: 200ms;
--default-transition-timing-function: ease;
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
```

| Duração | Curva | Uso |
|---|---|---|
| 100ms | `--ease-in-out-cubic` | Micro-estados densos: traços e links de índice, item ativo |
| 100ms | `ease` | Opacidade de entrada de um painel flutuante |
| 150ms | `ease` | Deslize do skip link |
| 200ms | `ease` | **Tudo o resto:** cor, opacidade, placas, scale, sublinhados, fade de página |
| 200ms | `--ease-in-out-cubic` | Transform de entrada de painel flutuante |

Nada acima de 200ms no chrome.

### 4.2 Vocabulário permitido

O chrome pode apenas:

1. **Fazer fade de opacidade.** Ex.: `main { animation: page-in 0.2s ease }` de `opacity: 0` para `1`, para eliminar flashes no carregamento.
2. **Fazer cross-fade de uma placa** atrás de um elemento em hover/foco.
3. **Escalar 1–2% no `:active`:** `scale: 0.98` em ações, `scale: 0.99` em linhas.
4. **Deslocar um painel para dentro:** `translateX(-8px) scale(0.96)` para `translateX(0) scale(1)`, com `transform-origin` no lado de onde vem.
5. **Mudar cor** um degrau na rampa.
6. **Fazer cross-fade de ícones** sobrepostos na mesma célula de grid (ex.: "link" para "check" ao copiar), para que o botão nunca mude de largura.

Proibido: spring, bounce, overshoot, entradas escalonadas (stagger), parallax, animações em loop decorativas, animações ligadas ao scroll, shimmer, rotações, transições de layout (`width`/`height`) em chrome.

Transições declaram as propriedades explicitamente (`transition: color 0.2s ease, scale 0.2s ease`), nunca `transition: all`. Preferir as propriedades individuais `scale`/`translate` a `transform` quando houver mais de um transform em jogo.

**Exceção: diagramas explicativos.** Num diagrama, o movimento é o conteúdo (um valor a deslocar-se num eixo, uma faixa a acender, um passo revelado). Aí permitem-se fade, `fly`/`slide` curtos e tweens com curva cúbica. Mesmo assim: sem spring, sem loops decorativos, autoplay apenas quando visível e nunca com movimento reduzido, e o frame estático inicial (sem JS) já tem de comunicar a ideia.

### 4.3 Acessibilidade de movimento (obrigatório)

Kill switch global, sempre presente:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Animações em JavaScript (transições de framework, tweens, WAAPI) não são apanhadas pelo CSS. Toda a duração em JS passa por um helper:

```ts
export function duration(ms: number): number {
  return prefersReducedMotion ? 0 : ms; // 0: o elemento aterra no estado final
}
```

Uma duração literal numa transição JS é um defeito. Qualquer informação transmitida só por movimento precisa de um equivalente estático.

`html { scroll-behavior: smooth }` é permitido porque o kill switch o anula.

---

## 5. Interatividade, estados e micro-interações

### 5.1 Regras transversais

- **Hover sempre condicionado:** todo o estilo de hover vive dentro de `@media (hover: hover) and (pointer: fine)`. Dispositivos táteis "prendem" o `:hover`. Em Tailwind v4, redefinir a variante:

```css
@custom-variant hover {
  @media (hover: hover) and (pointer: fine) {
    &:hover { @slot; }
  }
}
```

- **Hover é sempre uma transição**, nunca uma troca instantânea. Vocabulário: subir na rampa, placa a aparecer, irmãos a atenuar.
- **Foco visível com `outline`, nunca `box-shadow`** (o modo de alto contraste do Windows descarta sombras):

```css
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: 2px; }
:focus:not(:focus-visible) { outline: none; }
```

Nunca remover um anel de foco sem o substituir.
- **Foco envolve a placa:** em elementos com placa de hover, o foco por teclado mostra a placa e o anel desenha-se na placa, não numa caixa apertada à volta do texto.
- **Active:** só `scale` (0.98 / 0.99). Nada mais se move ao premir.
- **Toque:** alvos interativos com `min-height: 44px` abaixo de 40rem. Links inline em texto corrido são exceção (WCAG 2.5.8) e mantêm a linha de 24px.
- **Botões:** `cursor: pointer; user-select: none`.
- **Links:** `text-decoration: none` por omissão; sublinhado só nas receitas `text-link`/prosa.

### 5.2 `quiet-action` — o único estilo de ação

Não existe botão com borda, botão preenchido nem pill. Toda a ação (botão ou link de ação) é texto que ganha uma placa `surface-3` por trás no hover.

```css
@utility quiet-action {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-ink-3);
  cursor: pointer;
  transition: color 0.2s ease, scale 0.2s ease;
  &::before {
    content: "";
    position: absolute;
    inset: -4px -6px;
    z-index: -1;
    background: var(--color-surface-3);
    border-radius: var(--radius-badge);
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover { color: var(--color-ink); &::before { opacity: 1; } }
  }
  &:active { scale: 0.98; }
  &:focus-visible { outline: none; }
  &:focus-visible::before { opacity: 1; outline: 2px solid var(--color-accent); }
  @media (width < 40rem) { min-height: 44px; }
}
```

Uso típico: `text-meta leading-5`, com um ícone de 10–14px opcional à direita ("all writing" + seta).

### 5.3 `list-row` — linhas interativas em listas

```css
@utility list-row {
  position: relative;
  display: block;
  padding: 12px 0;
  isolation: isolate;
  cursor: pointer;
  transition: scale 0.2s ease;
  &::before {
    content: "";
    position: absolute;
    inset: 0 -24px;              /* a placa sangra para fora da coluna */
    z-index: -1;
    background: var(--color-surface-3);
    border-radius: var(--radius-panel);
    opacity: 0;
    scale: 0.98;
    transition: opacity 0.2s ease, scale 0.2s ease;
  }
  @media (hover: hover) and (pointer: fine) {
    &:hover::before { opacity: 1; scale: 1; }
  }
  @media (width < 40rem) { &::before { inset: 0 -12px; } }
  &:active { scale: 0.99; }
  &:focus-visible { outline: none; }
  &:focus-visible::before { opacity: 1; scale: 1; outline: 2px solid var(--color-accent); outline-offset: 2px; }
}
```

Anatomia de uma linha: grelha `1fr auto` em baseline; título `wght-500 ink-3`; data `ink-3` à direita; descrição opcional numa segunda linha `ink-3`, 4px abaixo. A lista lê-se discreta por omissão: o hover e o `dim-group` dão o foco.

Linha externa: sem ícone. O título ganha um sublinhado de 1px (de `transparent` para 30% de `currentcolor`, offset 2px) no hover, e um `<span class="sr-only">(opens in new tab)</span>` mantém o nome acessível honesto.

### 5.4 `dim-group`

```css
@utility dim-group {
  & > * { transition: opacity 0.2s ease; }
  &:focus-within > *:not(:focus-within) { opacity: 0.32; }
  @media (hover: hover) and (pointer: fine) {
    &:hover > *:not(:hover) { opacity: 0.32; }
  }
  @media (prefers-contrast: more) {
    &:hover > *:not(:hover),
    &:focus-within > *:not(:focus-within) { opacity: 1; }
  }
}
```

Envolve um conjunto de `list-row`. É o único uso sancionado de opacidade para desênfase.

### 5.5 Links

```css
@utility text-link {
  color: var(--color-ink-3);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: color-mix(in srgb, currentcolor 20%, transparent);
  text-underline-offset: 2px;
  transition: color 0.2s ease;
  @media (hover: hover) and (pointer: fine) { &:hover { color: var(--color-ink-2); } }
}
```

Links externos: `target="_blank" rel="noopener noreferrer"` e "(opens in new tab)" no nome acessível: `aria-label` quando o texto visível é o nome; `sr-only` quando o link envolve mais conteúdo (um `aria-label` substituiria tudo).

### 5.6 Navegação e estado ativo

```css
@utility nav-link {
  transition: color 0.2s ease;
  @media (hover: hover) and (pointer: fine) { &:hover { color: var(--color-ink); } }
  &[data-active='true'] { color: var(--color-ink); font-variation-settings: var(--wght-600); }
}
```

- Usado com `text-label` (mono minúsculo). O mono mantém a largura de avanço entre pesos, por isso o item ativo engrossa sem deslocar o layout.
- `aria-current="page"` apenas na página exata; `data-active` pode cobrir também as páginas filhas (ex.: "writing" ativo num artigo).
- A marca à esquerda: quadrado de 24px, raio 6px, fundo `ink`, letra `surface` a 13px peso 600.

### 5.7 Painel flutuante (índice lateral, popover)

A única superfície elevada. Fundo `surface`, `0.5px solid hair`, raio 8px, `--shadow-panel`. Escondido por `opacity: 0; pointer-events: none` (nunca `display: none`, para continuar alcançável por teclado) e aberto em `:hover` e `:focus-within`:

```css
opacity: 0;
transform: translateY(-50%) translateX(-8px) scale(0.96);
transition: opacity 0.1s ease, transform 0.2s var(--ease-in-out-cubic);
/* aberto */
opacity: 1;
transform: translateY(-50%) translateX(0) scale(1);
```

Indicador em repouso: traços de 12px (8px para nível 3) por 1px em `ink-4`, 12px de intervalo; o ativo passa a 1.5px em `ink`, com transições de 100ms em `--ease-in-out-cubic`. Links: 13px, peso 500, `ink-3`, ativo/hover `ink`. Sem ponteiro fino ou abaixo de 1000px, o mesmo conteúdo cai para um `<details>` nativo com links de 44px de altura mínima.

### 5.8 Feedback, vazio e erro

- **Feedback efémero** (copiar, guardar): troca de ícone por cross-fade durante ~2s; texto curto em minúsculas só em caso de falha ("failed"). Anunciado por uma região `aria-live="polite"` `sr-only`, porque um `aria-label` sobrepõe-se ao texto visível.
- **Controlos dependentes de JS** começam `hidden` ou `disabled` até o JS confirmar suporte; nunca aparecem inertes.
- **Vazio:** uma frase em `ink-3`, minúsculas ("nothing published yet").
- **Erro:** kicker `text-label` ("/404 · resource missing"), numeral `text-title1` 600 `ink`, uma frase simples em `ink-2` com `max-width: 60ch`, ações `quiet-action`. Centrado verticalmente na área de conteúdo.
- **Callout:** `border-left: 2px dashed hair`, `padding-left: 16px`, kicker `text-label` com ícone de 12–14px, corpo `ink-4`. Variantes mudam ícone e rótulo, nunca cor.
- **Carregamento:** preferir não ter nenhum (pré-renderização). Se inevitável, blocos `surface-2` estáticos com as dimensões finais.

### 5.9 Ícones

SVG inline escrito à mão, `fill="none"`, `stroke="currentColor"`, `stroke-linecap/linejoin="round"`, `aria-hidden="true"`, dimensionado por classe (10–14px no chrome). ViewBox 24 com stroke 2, ou viewBox afinado (14 com stroke 1.25) para o mesmo peso óptico em tamanho pequeno. A cor vem sempre do pai. Conjunto mínimo; nenhuma biblioteca de ícones.

### 5.10 Acessibilidade de base

- Skip link como primeiro elemento do `body`, fora do ecrã (`translateY(-150%)`), desliza para dentro no foco; fundo `accent`, texto `surface`, mono 12px, raio `0 0 6px 0`.
- Um `h1` por página; títulos descem sem saltar níveis.
- SVG decorativo com `aria-hidden`; SVG com significado com `role="img"`, `aria-label` e `<title>`.
- `prefers-reduced-motion` e `prefers-contrast: more` respeitados.
- Contraste do corpo nunca abaixo da rampa atual.

---

## 6. Checklist de revisão e anti-padrões

Antes de entregar qualquer componente ou página, verificar cada ponto. Uma resposta "não" bloqueia a entrega.

**Cor**
- [ ] Todas as cores vêm da rampa `ink`/`surface`/`hair`. Zero matiz, zero gradiente colorido.
- [ ] Nenhum texto de leitura ou link em `ink-4`.
- [ ] Nenhuma `opacity` usada para atenuar texto (exceto `dim-group`).
- [ ] Nenhuma sombra exceto a do único painel flutuante.

**Tipografia**
- [ ] Só os cinco tamanhos (12/13/14/24/36px). Títulos a 14px.
- [ ] Pesos via `font-variation-settings` (`wght-*`), nenhum `font-medium`/`font-semibold`/`font-bold`.
- [ ] Entrelinha de 24px (20px para meta e código).
- [ ] Tracking apenas em `text-label`.
- [ ] Setas e símbolos como ícones SVG.

**Espaço**
- [ ] Todas as medidas em múltiplos de 4px.
- [ ] Texto corrido limitado a 640px.
- [ ] Blocos dentro de prosa sem margens verticais próprias.
- [ ] Nenhum scroll horizontal a 320px de largura.

**Interação**
- [ ] Todo o hover dentro de `(hover: hover) and (pointer: fine)`.
- [ ] Foco visível com `outline` em todos os interativos; em placas, o anel envolve a placa.
- [ ] Ações são `quiet-action`; listas são `dim-group` + `list-row`.
- [ ] Alvos de 44px abaixo de 40rem.
- [ ] Links externos com `rel` e nome acessível completo.

**Movimento**
- [ ] Durações de 100/150/200ms; curvas `ease` ou `--ease-in-out-cubic`.
- [ ] Nada de spring, bounce, stagger, parallax, loops.
- [ ] Kill switch de `prefers-reduced-motion` presente; durações JS via `duration()`.

**Rejeitado à vista**
- `font-medium`, `font-semibold`, `text-base`, `text-lg`, `text-[15px]`, tamanhos em rem.
- Botão com borda, botão preenchido (fora da exceção única de 3.8), pill, badge com fundo.
- Link azul, sucesso verde, erro vermelho, tema de sintaxe colorido.
- Dark mode, glassmorphism, `backdrop-blur`, néon, gradiente de hero.
- Grelha de cards com sombra, métricas gigantes de marketing, fotografia de stock.
- `:hover` sem gating; `outline: none` sem substituto; anel de foco com `box-shadow`.
- Títulos maiores para sinalizar importância.
- Bibliotecas de UI, de componentes, de animação ou de ícones.
- Segunda folha de estilos, CSS modules, `style` inline para estética.
- `transition: all`; transição JS com duração literal.

---

## 7. Prompt de execução para a LLM

Copiar o bloco seguinte para o início de uma conversa (ou para o system prompt), anexando este documento completo.

```text
Age como o guardião deste Design System ("Ink") e aplica rigorosamente estas regras em
qualquer componente, página ou ecrã que crie, reveja ou altere. O documento
DESIGN-SYSTEM-PROMPT.md anexo é normativo: os seus tokens são contratos, não sugestões.

TESE
Quiet authority. Words first, chrome last. Hierarquia por peso, espaço e degrau de tom,
nunca por tamanho, cor, sombra ou movimento. Na dúvida, remover.

REGRAS INVIOLÁVEIS
1. Cor: apenas a rampa neutra oklch de croma 0 sobre branco puro.
   ink #1b1b1b (primário) · ink-2 #2f2f2f (corpo) · ink-3 #5c5c5c (discreto, links)
   · ink-4 #9b9b9b (só decorativo, nunca links nem texto principal)
   · surface #fff · surface-2 #f9f9f9 (blocos) · surface-3 #f2f2f2 (placas de hover)
   · hair 5% preto · hair-strong 10% preto · accent = ink.
   Zero matiz. Estados distinguem-se por rótulo e ícone. Sem dark mode.
   Opacidade nunca atenua texto (exceção: dim-group a 0.32).
2. Tipografia: Inter (opsz 14) + Geist Mono. Escala fixa em px: 12 / 13 / 14 / 24 / 36.
   Corpo e TODOS os títulos a 14px, entrelinha 24px (20px para 12px e código).
   Pesos via font-variation-settings: 400 corpo, 450 prosa, 500 títulos de linha e h3,
   600 numeral/ativo, 700 h1/h2. Nunca font-weight utilities.
   Tracking só em text-label: mono 12px, minúsculas, 0.02em, ink-3.
3. Espaço: grelha de 4px em tudo. Coluna de leitura de 640px. O contentor de prosa é
   dono das margens verticais (20 / 12 após título / 32 / 48 / 64).
4. Superfícies: planas, separadas por hairlines de 1px. Uma única superfície elevada.
   Raios 6px (ações) e 8px (blocos, placas, painéis). Sem pills.
5. Ações: só quiet-action (texto ink-3 que ganha placa surface-3 no hover, scale 0.98
   no active). Sem botões com borda ou preenchidos.
   Listas: dim-group + list-row (padding 12px, placa com bleed de 24px, scale 0.99).
   Links: ink-3, sublinhado 1px a 20% de currentcolor, offset 2px, hover para ink-2.
6. Estados: hover sempre dentro de @media (hover: hover) and (pointer: fine).
   Foco: outline 2px solid ink, offset 2px; em elementos com placa, o foco mostra a
   placa e o anel envolve-a. Nav ativa: aria-current="page" + ink a peso 600.
   Alvos de 44px abaixo de 40rem.
7. Movimento: 200ms ease por omissão; 100ms cubic-bezier(0.645,0.045,0.355,1) para
   micro-estados. Vocabulário fechado: fade, cross-fade de placa, scale 1-2% no active,
   painel a entrar com translateX(-8px) scale(0.96). Proibido spring, bounce, stagger,
   parallax, loops, transition: all. Obrigatório o kill switch de
   prefers-reduced-motion e durações JS a 0 nesse modo.

ORDEM DE DECISÃO
a) Usar um token e uma utility existentes.
b) Compor utilities existentes.
c) Só então criar uma nova utility, se o padrão aparecer em 2+ sítios ou carregar
   lógica, com um comentário a justificar porque os tokens não chegavam.
d) Um token novo exige justificação escrita e nunca introduz matiz.

PARA CONTEXTOS NOVOS (dashboards, SaaS, formulários)
Estender pelas regras da secção 3.8: tabelas com thead mono minúsculo e números
tabulares, KPIs em 36px/600 com variação em ink-3 e sinal explícito, gráficos na rampa
de tinta distinguidos por traço e rótulo, campos com borda hair-strong e raio 6px,
erros por texto e ícone. Nunca importar um padrão visual de outro sistema.

FORMATO DA RESPOSTA
1. Código completo e pronto a usar, só com tokens e utilities do sistema.
2. Uma lista curta das decisões de design tomadas, cada uma ligada à regra que a
   justifica.
3. O resultado do checklist da secção 6, com qualquer exceção identificada e
   justificada. Se um pedido do utilizador violar uma regra, assinalar o conflito e
   propor a alternativa conforme antes de o executar.

Não uses emojis, gradientes, sombras decorativas, cores de destaque nem bibliotecas de
UI, de animação ou de ícones.
```

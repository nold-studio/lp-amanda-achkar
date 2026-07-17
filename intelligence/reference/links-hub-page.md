# Página Central de Links (Hub / Mapa de Páginas)

Guia de referência para gerar uma **página agregadora** que reúne todas as LPs de um
projeto num só lugar: um painel de cards (bento grid) à esquerda e um mapa mental
interativo (grafo de nós, estilo Obsidian) à direita, com os dois lados sincronizados
por hover. Serve para clientes com múltiplas landing pages (ex: uma marca com vários
sócios/especialidades, ou uma marca com uma LP institucional + LPs de produto/campanha).

**Quando usar:** só depois que as outras páginas do projeto já existem e têm rota
definida. Essa página é sempre a última a ser construída — ela referencia as demais,
nunca o contrário.

---

## 1. Antes de gerar: colete os inputs

Não invente estes dados — pergunte ou extraia do projeto:

1. **Lista de páginas a agregar.** Para cada uma: rota (`/algo`), um "tag" curto
   (nome da pessoa/produto), um título (H2, pode repetir entre cards se as páginas
   forem genuinamente equivalentes — não invente diferenciação que não existe),
   uma descrição de 1 linha.
2. **Nó central.** Qual é o "hub" do mapa — geralmente o nome da marca/agência, não
   uma das páginas individuais. Pode não ter link próprio (`url: '#'`) ou apontar
   pra uma home institucional se existir.
3. **Sistema visual já estabelecido no projeto** — não crie uma paleta nova. Reaproveite:
   - Cor de fundo escura, cor de superfície/card, cor de destaque (accent) e cor de
     texto secundário já usadas nas outras LPs do mesmo projeto.
   - As mesmas famílias tipográficas (título + corpo) já carregadas no `Layout.astro`.
   - O logo já usado no header das outras páginas.
4. **Rota da própria página do hub** — convenção: `/links` (ou `/mapa`, `/central`,
   segundo preferência do cliente). Evite usar `/` — a home costuma ser a LP
   principal de conversão, não o hub.

Se qualquer um desses 4 pontos não estiver claro, pergunte antes de gerar o arquivo.

---

## 2. Arquitetura da página

Layout de **dois painéis fixos**, ocupando `100svh`, sem scroll da página (o scroll
fica isolado dentro do painel esquerdo se a lista de cards for longa):

```
┌─────────────────┬──────────────────────────────┐
│                  │                               │
│   BENTO PANEL    │        MAP PANEL              │
│   (largura fixa  │   (grafo interativo,          │
│    ~460px)       │    ocupa o resto)             │
│                  │                               │
│  logo            │   ● hub                       │
│  título          │  ╱ │ ╲                        │
│  descrição       │ ○  ○  ○  (um nó por página)   │
│                  │                               │
│  [card página 1] │                               │
│  [card página 2] │                               │
│  [card página N] │                               │
│  [card stats]    │                               │
│                  │                               │
└─────────────────┴──────────────────────────────┘
```

- `display: grid; grid-template-columns: 460px 1fr; height: 100svh;`
- **Abaixo de 960px**: empilha em coluna única — painel de cards no topo com altura
  automática, painel do mapa vira uma faixa fixa de ~400px embaixo. Ambos passam a
  scrollar a página normalmente (perde o `overflow: hidden` do desktop).

---

## 3. Painel esquerdo — Bento Grid

### 3.1 Header
Logo da marca + `<h1>` curto ("Central de Páginas" / "Mapa do Projeto" / o que
fizer sentido) + um parágrafo de 1 linha, sem enrolação.

### 3.2 Um card por página
Cada card é um `<a>` (não `<div>`) apontando pra rota real da página, com:

- `data-node="<id-do-no-correspondente-no-grafo>"` — é isso que sincroniza hover
  com o mapa; o `id` tem que bater exatamente com o `id` do node no script.
- Tag curta (nome/categoria) em destaque (cor accent).
- Título (H2).
- Descrição de **uma frase só** — nada de parágrafos. Se o cliente tiver textos
  longos prontos, corte.
- Rodapé com "Acessar página" + ícone de seta.
- Um `.card-glow` (radial-gradient decorativo, opacity 0 → 1 no hover) por trás do
  conteúdo, puramente estético.

Regra importante de conteúdo: **se duas páginas do cliente cobrem exatamente a
mesma coisa (mesmo serviço, mesma especialidade), os cards devem ter o mesmo
título/descrição.** Não invente uma diferenciação de nicho entre elas só pra
preencher o card — isso engana quem está navegando. Só diferencie o texto se as
páginas realmente forem sobre coisas diferentes.

### 3.3 Card de stats (opcional, mas recomendado)
Um card "morto" (não é link, borda tracejada, sem hover) com 2 números rápidos —
quantidade de páginas ativas, stack usada, o que for relevante mostrar de cara.

---

## 4. Painel direito — Grafo interativo

SVG com `viewBox="0 0 800 600"`, fundo com um padrão de grade sutil (estilo
Obsidian: linhas finas, ~3% de opacidade), mais 3 grupos:

- `#edgesGroup` — linhas conectando os nós
- `#nodesGroup` — círculos + labels de texto

### 4.1 Modelo de dados
```ts
interface NodeData {
  id: string; label: string; url: string;
  x: number; y: number; vx: number; vy: number;
  fx: number | null; fy: number | null; // fixado durante drag
  isCenter?: boolean; r: number;
}
interface EdgeData { source: string; target: string; }
```

- **Um nó central** (`isCenter: true`, raio maior — ~12 vs 8 dos demais, preenchido
  com a cor accent) representa a marca. Fica travado no centro do viewBox (400, 300).
- **Um nó por página**, todos conectados ao nó central (topologia estrela, não
  malha completa) — `edges` sempre tem `source: 'hub'` em todas as entradas.
- `url` de cada nó bate com a rota real da página (mesma URL do card correspondente).

### 4.2 Simulação física (rodando em `requestAnimationFrame`)
Física simplificada, sem biblioteca — só 3 forças por frame:
1. **Repulsão entre nós próximos** (< 180px de distância): empurra pra longe,
   proporcional à sobreposição.
2. **Atração ao nó central**: puxa levemente cada nó em direção ao hub, proporcional
   à distância (evita que os nós se percam pela tela).
3. **Atrito**: `velocity *= 0.85` a cada frame, senão nunca estabiliza.

Nó com `fx`/`fy` definidos (durante o drag do usuário) ignora as forças e vai
direto pra posição do mouse, clampada dentro do viewBox.

### 4.3 Interações
- **Clique num nó não-central** → `window.location.href = node.url`.
- **Drag** num nó → fixa `fx`/`fy` na posição do mouse (convertida de coordenada de
  tela pra coordenada do viewBox via `getBoundingClientRect()`); solta no mouseup.
- **Hover num nó** → adiciona `.active` no próprio nó, na edge que chega nele, e
  `.active-node` no bento card correspondente (via `data-node` casando com `id`).
- **Hover num bento card** → mesma sincronização, no sentido inverso.

---

## 5. Tokens visuais (adaptar por projeto, não inventar cor nova)

Namespace as variáveis CSS com um prefixo próprio da página (evita colisão com o
resto do site), mas os **valores** vêm do sistema já usado nas outras LPs:

```css
:root {
  --links-bg: /* mesma cor de fundo escuro das outras páginas */;
  --links-surface: /* superfície um tom acima do bg */;
  --links-card: /* fundo dos cards, mais um tom acima */;
  --links-card-hover: /* estado hover do card */;
  --links-yellow: /* cor de destaque/accent da marca — não precisa ser amarelo, é só o nome da variável */;
  --links-white: /* texto primário */;
  --links-gray: /* texto secundário */;
  --links-border: /* bordas sutis */;
  --links-mono: /* fonte de corpo já usada no projeto */;
  --links-title: /* fonte de título já usada no projeto */;
}
```

Se o projeto for **claro** (não escuro), inverta os valores mas mantenha a mesma
estrutura de 8 variáveis — o layout não depende de ser dark, só o exemplo de
referência é.

---

## 6. Checklist antes de publicar

- [ ] Cada `data-node` do card bate exatamente com o `id` do node correspondente no grafo
- [ ] Cada `url` do node bate com o `href` do card correspondente (mesma rota)
- [ ] Nenhum card tem descrição inventada / diferenciação falsa entre páginas equivalentes
- [ ] Cores/fontes reaproveitadas do projeto, não uma paleta nova
- [ ] Testado abaixo de 960px (empilha corretamente, mapa não quebra a 400px de altura)
- [ ] Rota do hub não conflita com a home do site (a menos que seja intencional)
- [ ] Link do hub/logo no header de cada LP individual, se fizer sentido, pode apontar
      de volta pro hub — avalie caso a caso, não é obrigatório

---

## 7. Instrução de geração

Ao ser acionado para criar essa página num projeto:

1. Rode o checklist da seção 1 — se faltar algum input, pergunte antes de gerar código.
2. Leia o `Layout.astro` do projeto e as outras páginas já construídas pra extrair
   paleta, fontes e path do logo reais (não peça ao usuário o que já dá pra achar no código).
3. Gere o arquivo Astro seguindo a estrutura das seções 2–5 acima, com um card e um
   node por página coletada no passo 1.
4. Rode o build local e confira o checklist da seção 6 antes de considerar pronto.

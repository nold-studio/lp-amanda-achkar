# Página Link na Bio (Instagram / redes)

Guia de referência para gerar a página **pública de "link na bio"** — aquela que vai no
campo de link do perfil de Instagram/redes. É uma página enxuta, **mobile-first**, que
funciona como um cartão de visitas digital: logo, uma frase, ícones de redes e alguns
botões grandes levando às páginas principais + um botão de contato (WhatsApp).

**Não confundir com a [Central de Links](links-hub-page.md).** As duas são agregadoras,
mas com propósitos diferentes:

| | Link na Bio (`/bio`) | Central de Links (`/links`) |
|---|---|---|
| Público | Cliente final (segue no Instagram) | Uso interno / gestão |
| Objetivo | Converter — poucos destinos, botão de contato | Mapear/organizar todas as páginas |
| Estética | Cartão vertical, botões grandes | Painel + mapa mental de nós |
| Quantidade de links | Poucos e curados (3–5) | Todos, inclusive páginas secundárias |

**Quando usar:** quando o cliente vai divulgar um link único nas redes. Geralmente
depois que as páginas de destino já existem.

---

## 1. Antes de gerar: colete os inputs

1. **Identidade do topo:** logo da marca (símbolo/wordmark já existente no projeto),
   nome da marca **escrito corretamente** e uma frase curta de posicionamento
   (ex: "Protocolo R1 · Aprovação em CTBMF").
2. **Destino principal (card destaque):** a oferta/produto mais importante — recebe um
   card grande com kicker, título, descrição de 1 linha e uma seta. Aponta pra rota real.
3. **Destinos secundários (cards menores):** 2–4 páginas em cards compactos lado a lado,
   cada um com nome + descritor curto + seta. Rotas reais.
4. **Contato:** número de WhatsApp real (formato internacional, só dígitos, ex:
   `5511997311111`) para o botão principal de contato.
5. **Redes sociais que EXISTEM:** só inclua ícone de rede que o cliente realmente tem.
   Não deixe placeholder no ar — se não tem TikTok/YouTube/e-mail, o ícone não entra.
6. **Sistema visual do projeto:** reaproveite cores e fontes já usadas nas outras LPs
   (não crie paleta nova). Mesma cor de fundo escura, mesma cor de destaque, mesmas
   fontes de título e corpo.

**Regra de conteúdo — não copie erros da referência.** Se o cliente mandar um print de
uma versão antiga (ex: feita no Framer) pra você replicar, corrija erros óbvios ao portar:
nome da marca escrito errado, título de gênero trocado (Dr./Dra.), termos técnicos
grafados errado. A cópia da referência é ponto de partida, não lei.

---

## 2. Arquitetura da página

Coluna única **centralizada**, largura máxima ~460px, centralizada vertical e
horizontalmente na viewport (no desktop vira uma coluna estreita no meio de um fundo
escuro — não estica). Ordem, de cima pra baixo:

```
        [ logo ]
   ● frase de posicionamento

     ⌾  ⌾   (ícones de redes — só os que existem)

  ┌───────────────────────────┐
  │ ✦ KICKER                   │
  │                            │
  │ Título do destaque         │
  │                            │
  │ descrição 1 linha    (↗)   │  ← card destaque (link)
  └───────────────────────────┘

  ┌────────────┐  ┌────────────┐
  │ Nome    ↗  │  │ Nome    ↗  │  ← cards secundários (grid 2 col)
  │ descritor  │  │ descritor  │
  └────────────┘  └────────────┘

  ┌───────────────────────────┐
  │  ⟶  Fale com a nossa equipe │  ← CTA WhatsApp (pill grande)
  └───────────────────────────┘

     © Marca ano · direitos
```

- Container: `min-height: 100svh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; padding-block: clamp(2.5rem, 8vh, 5rem);`
  A coluna interna tem `max-width: 460px`.
- Como usa `min-height` (não `height`) + fluxo normal, se o conteúdo passar da tela em
  telas baixas, a **página rola normalmente** (não trava). Ideal caber tudo numa tela só.

---

## 3. Componentes

### 3.1 Header
Logo centralizado (símbolo/wordmark da marca) + uma linha de posicionamento com um
pontinho na cor de destaque antes do texto.

### 3.2 Linha de redes sociais
Ícones circulares (SVG inline, outline), em linha, com hover que acende na cor de
destaque. **Só as redes que o cliente tem.** WhatsApp costuma entrar aqui também, além
do botão grande lá embaixo.

### 3.3 Card destaque (a oferta principal)
Card grande, `<a>` clicável inteiro, com fundo levemente elevado (gradiente sutil +
glow no topo na cor de destaque), borda arredondada (~20px). Dentro:
- **Kicker** com ícone (ex: sparkle) na cor de destaque, uppercase.
- **Título** grande (fonte de título da marca).
- **Descrição** de uma linha + um **botão de seta** (círculo sólido na cor de destaque)
  no canto inferior direito. O botão é decorativo (`<span>`), pois o card inteiro já é
  o link — nunca aninhe `<a>` dentro de `<a>`.
- Hover: leve `translateY(-3px)` + borda acende.

### 3.4 Cards secundários (grid)
`grid-template-columns: 1fr 1fr; gap: 1rem`. Cada card é um `<a>` compacto com:
nome no topo + seta pequena (círculo outline), e um descritor curto embaixo. Em telas
muito estreitas (≤340px), empilha em 1 coluna. Cards equivalentes usam `min-height`
igual pra alinharem mesmo que um nome quebre em duas linhas.

### 3.5 CTA de contato (WhatsApp)
Pill grande, largura total, na cor de destaque, com ícone do WhatsApp + texto. Abre
`https://wa.me/<numero>?text=<mensagem url-encoded>` em nova aba
(`target="_blank" rel="noopener"`).

### 3.6 Footer
Linha discreta de copyright: `© <Marca> <ano> · Todos os direitos reservados`.

---

## 4. Tokens visuais (adaptar por projeto)

Namespace as variáveis com um prefixo próprio (`--bio-…`), mas puxe os **valores** do
sistema já usado nas outras páginas do projeto:

```css
:root {
  --bio-bg:      /* fundo escuro do projeto */;
  --bio-card:    /* superfície dos cards */;
  --bio-border:  /* bordas sutis */;
  --bio-yellow:  /* cor de destaque da marca (o nome é só convenção) */;
  --bio-white:   /* texto primário */;
  --bio-gray:    /* texto secundário */;
  --bio-title:   /* fonte de título já usada no projeto */;
  --bio-mono:    /* fonte de corpo já usada no projeto */;
}
```

Projeto de tema claro: inverta os valores, mantenha a estrutura.

---

## 5. Integrações

- **Rastreamento:** use o mesmo `Layout` compartilhado do projeto, para herdar o
  Google Tag Manager (ou pixel) — assim os cliques da bio entram no rastreio de tráfego.
- **Rota:** convenção `/bio`. É uma URL que vai pra bio do Instagram, então é
  semi-permanente depois de publicada — confirme o slug antes de o cliente divulgar.
- **Zero JS:** a página é 100% estática (só links). Não precisa de script.

---

## 6. Checklist antes de publicar

- [ ] Nome da marca e títulos escritos corretamente (não copiou typo da referência)
- [ ] Só entraram as redes sociais que existem de verdade (sem placeholder no ar)
- [ ] Número de WhatsApp real, em formato internacional só com dígitos
- [ ] Todas as rotas de destino existem e abrem a página certa
- [ ] Card destaque não tem `<a>` aninhado (a seta é `<span>`)
- [ ] Cores/fontes reaproveitadas do projeto, não paleta nova
- [ ] Cabe idealmente em uma tela de celular sem rolar; se rolar, rola normal (não trava)
- [ ] Testado em mobile (~375px) e numa largura grande (coluna centralizada, não esticada)
- [ ] Favicon e OG do projeto configurados (herança do Layout)

---

## 7. Instrução de geração

1. Rode o checklist da seção 1 — se faltar input (logo, destinos, WhatsApp, redes),
   pergunte antes de gerar.
2. Leia o `Layout.astro` e outras páginas do projeto pra extrair paleta, fontes e o
   caminho do logo reais.
3. Gere o arquivo Astro seguindo as seções 2–4, usando o `Layout` compartilhado.
4. Rode o build, publique e **verifique ao vivo em mobile e desktop** antes de dar
   como pronto — conferindo os links de destino e se cabe numa tela.

# Site da Enactus Campus São Carlos (esboço)

Site estático feito só com HTML, CSS e um pouco de JavaScript. Não precisa instalar nada: dá para abrir o `index.html` direto no navegador e editar os arquivos em qualquer editor de texto (recomendado: VS Code).

## Estrutura

```
index.html          Início
sobre.html          Sobre (trajetória, rede Enactus, pilares, ODS, ENEB, prêmios)
projetos.html       Lista de projetos (ativos e encerrados)
projetos/*.html     Uma página por projeto (domus, kairos, pontape, athena, melius,
                    dulocal, ghelena, madrechef, mulheresaobra, proximopasso)
valores.html        Sigla, missão, visão e valores PREVE
time.html           Membros, conselheiros e ciclos
recrutamento.html   Etapas, áreas e perguntas frequentes
galeria.html        Mosaico de fotos com filtro e foto ampliada
css/style.css       Todo o visual do site (um arquivo só)
js/main.js          Menu no celular, filtros e foto ampliada da galeria
img/                Fotos (img/projetos/<projeto>/ tem as fotos de cada projeto)
```

## Como editar

- **Textos:** abra o `.html` da página e troque o texto entre as tags.
- **Fotos:** coloque a imagem em `img/` e troque o `src="..."` da tag `<img>`. Sempre preencha o `alt` com uma descrição curta da foto.
- **Cores e fontes:** ficam no começo do `css/style.css`, na seção "1. VARIÁVEIS". Mudando ali, muda no site todo.
  - As fontes (Archivo nos títulos e Roboto no texto) são **provisórias**. Para trocar, altere o `<link>` do Google Fonts no `<head>` de cada página e as variáveis `--font-display` e `--font-text`.

- **Menu e rodapé:** são iguais em todas as páginas. Se mudar um item, mude em todos os arquivos (no VS Code: Ctrl+Shift+H, "Substituir em arquivos").
- **Nova página de projeto:** copie um arquivo de `projetos/`, renomeie e troque textos e fotos. Depois adicione o card dele em `projetos.html` (e na home, se quiser).
- **Nova foto na galeria:** em `galeria.html`, copie um bloco `<figure>` e troque `src`, `data-project` e o texto do `<figcaption>`. O `data-project` precisa ser igual ao nome de um botão de filtro.

## Visual (inspirado no site global da Enactus)

- Cabeçalho e rodapé em grafite (`--slate`), botões amarelos em caixa alta.
- Títulos de seção no formato "NOSSA **REDE**": a última palavra fica larga e pesada. No HTML é assim:
  `<h2 class="display">Nossa <em>rede</em></h2>` seguido de `<p class="statement">frase de apoio</p>`.
- Faixas de fundo: `section--gray` (cinza claro), `section--pale` (amarelo claro), `section--dark` (grafite).
- Cortes diagonais amarelos na foto de abertura da home (`hero-photo`) e no topo das páginas internas (`page-head`).

## Animações (como no enactus.org)

- **Números que contam:** todo número com a classe `stat__num` conta de 0 até o valor em 2 segundos quando aparece na tela. Basta escrever o número final no HTML (ex.: `230+`, `1.600+`, `~13 mi`). Anos como `2013` não contam.
- **Carrossel de fotos (home):** troca uma foto a cada 5 segundos, mostra 5 fotos no computador, 2 no tablet e 1 no celular, e pausa quando o mouse ou o teclado estão nele. Para adicionar fotos, inclua outra `<img>` dentro de `carousel__track` no `index.html`.
- **Hover:** links, botões e cards mudam de cor ou sobem de leve ao passar o mouse.
- Quem ativou "reduzir movimento" no sistema vê os números prontos e o carrossel parado (as setas continuam funcionando).
- O código está em `js/main.js` (seções 4 e 5) e os tempos em `css/style.css` (variáveis `--ease-out`, `--ease-in-out` e `--hover`).

## Celular

- No celular, os cards de projeto viram linhas compactas (foto à esquerda), a galeria fica em 2 colunas e os filtros e abas rolam para o lado.
- O carrossel da home pode ser arrastado com o dedo.
- Botões têm pelo menos 48px de altura para facilitar o toque, e os efeitos de "passar o mouse" só existem em computador.
- O site respeita o entalhe/câmera dos iPhones (`viewport-fit=cover` e `env(safe-area-inset-*)`) e a barra do navegador fica preta (`theme-color`).
- Os ajustes ficam no fim do `css/style.css`, na seção "9. CELULAR".
- Teste sempre num celular de verdade: abra o site pelo celular na mesma rede Wi-Fi do computador.

## O que ainda falta (procure por `TROCAR` nos arquivos)

- Logo oficial no cabeçalho e logos dos parceiros na home
- Fotos e páginas do **Mirus** e da **Prospecção 5.0**
- Nomes, cargos, cursos e fotos do time e dos conselheiros; foto do time completo
- Datas e link do formulário do recrutamento, PDF do manual do candidato
- Respostas das perguntas frequentes marcadas como "[A definir pelo time]"
- Link do LinkedIn e do PDF do Histórico de Impacto
- Fotos em alta resolução (as atuais vieram do site antigo e estão pequenas)

## Ver no computador

Abrir o `index.html` com dois cliques já funciona. Para simular um servidor (opcional), rode na pasta do site:

```
python -m http.server 8000
```

e acesse http://localhost:8000.

## Publicar

Por ser um site estático, dá para publicar de graça em serviços como GitHub Pages, Netlify ou Cloudflare Pages: basta enviar esta pasta inteira.

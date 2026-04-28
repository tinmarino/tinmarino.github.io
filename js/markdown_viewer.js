/*
TODO: v0.02
  Get interactive ToC, can fold
  Load with require
  Create a loader taking a md file in input (whose path is defined in URL)

Link:
https://enzedonline.com/en/tech-blog/use-javascript-to-add-a-dynamic-table-of-contents-to-your-pages/
https://github.com/showdownjs/showdown/wiki/Tutorial:-Markdown-editor-using-Showdown
* Better Yaml header parsing: https://github.com/jxson/front-matter/blob/master/index.js
* https://github.com/nodeca/js-yaml/blob/master/dist/js-yaml.min.js
* My parsing is from https://github.com/markedjs/marked/issues/485#issuecomment-497492664
* List of meta: https://gist.github.com/whitingx/3840905

* TOC nested: https://stackoverflow.com/questions/187619/is-there-a-javascript-solution-to-generating-a-table-of-contents-for-a-page

*/

//require.config({
//  paths: {
//      "prism": "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js",
//      "marked": "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
//  },
//  waitSeconds: 5,
//});

let title = ""  // Maybe change title according to yaml header
let subtitle = ""  // A small description to see what there is there
var meta_attribute = {}  // All meta key and content

// Load, fetch and render the markdown page from the ?page= URL parameter
async function onLoad() {
  console.log('Markdown viewer is loading');

  // Init variable in this scope (not in try)
  var inputUrl = "Error"  // The input url to read the markdown file
  var markdown = "Error"  // The input markdown content to convert
  var html = "Error"  // The output html converted text

  // Get input markdown url
  const rootUrl = new URL(window.location);
  inputUrl = rootUrl.searchParams.get("page");
  if (null == inputUrl) {
    var message = (
      "Error: You must set a 'page' url parameter!\n"
      + "Tip: https://tinmarino.github.io/markdown_viewer.html?page=/blog/bash_pipe.md"
    )
    alert(message)
    throw new Error(message)
  }

  // Read markdown content
  try {
    markdown = await getHttp(inputUrl)
  } catch (exception) {
    var message = (
      "Error: Cannot open file!\n"
      + "Tip: Verify the input URL below, set from the window location parameter\n"
      + "url: " + inputUrl + "\n"
      + "error: " + exception
    )
    alert(message)
    throw new Error(message)
  }

  // Convert markdown
  html = convertMarkdown(markdown)

  // Set page
  await setPageBody(html);
}


// Convert a github.com/<user>/<repo>/blob/<ref>/<path> URL into the
// matching raw.githubusercontent.com URL that serves the plain text.
function githubBlobToRaw(url) {
  return url
    .replace(/^https?:\/\/github\.com\//, 'https://raw.githubusercontent.com/')
    .replace(/\/blob\//, '/');
}


// Guess a Prism/marked language tag from the file extension.
function languageFromExtension(url) {
  const path = url.split('?')[0].split('#')[0];
  const ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
  const map = {
    py: 'python', sh: 'bash', bash: 'bash', zsh: 'bash',
    js: 'javascript', mjs: 'javascript', cjs: 'javascript',
    ts: 'typescript', tsx: 'typescript', jsx: 'jsx',
    md: 'markdown', markdown: 'markdown',
    json: 'json', jsonc: 'json',
    yaml: 'yaml', yml: 'yaml',
    html: 'html', htm: 'html',
    css: 'css', scss: 'scss',
    c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', hpp: 'cpp',
    go: 'go', rs: 'rust', rb: 'ruby', php: 'php',
    vim: 'vim', lua: 'lua', pl: 'perl',
    dockerfile: 'dockerfile', makefile: 'makefile',
    sql: 'sql', diff: 'diff', patch: 'diff',
    toml: 'toml', ini: 'ini',
  };
  return map[ext] || ext || 'plaintext';
}


// Extract a [start, end] inclusive line range from a GitHub-style
// fragment (#L10, #L10-L30, #L10-L30:). Returns null for no range.
function parseLineRange(fragment) {
  if (!fragment) return null;
  const m = fragment.match(/^L(\d+)(?:-L?(\d+))?/);
  if (!m) return null;
  const start = parseInt(m[1], 10);
  const end = m[2] ? parseInt(m[2], 10) : start;
  return [start, end];
}


// Instantiate an asciinema-player inside every
// `<div data-asciinema-cast="URL">` placeholder. Optionally reads a
// JSON options blob from `data-asciinema-opts`. Safe to call even if
// the global `AsciinemaPlayer` has not loaded yet: the function
// retries on the window.load event when the player script finishes
// downloading (it is declared `defer` in markdown_viewer.html).
function renderAsciinemaPlayers(root) {
  const divs = root.querySelectorAll('div[data-asciinema-cast]');
  if (divs.length === 0) return;

  const spawn = () => {
    if (typeof AsciinemaPlayer === 'undefined') return false;
    divs.forEach((div) => {
      if (div.dataset.asciinemaRendered === '1') return;
      const url = div.dataset.asciinemaCast;
      let opts = {};
      try {
        if (div.dataset.asciinemaOpts) {
          opts = JSON.parse(div.dataset.asciinemaOpts);
        }
      } catch (err) {
        console.warn('Bad data-asciinema-opts on', div, err);
      }
      AsciinemaPlayer.create(url, div, opts);
      div.dataset.asciinemaRendered = '1';
    });
    return true;
  };

  if (!spawn()) {
    window.addEventListener('load', spawn, { once: true });
  }
}


// Walk `root` for `<pre><code class="language-embed">` blocks whose
// content is a GitHub URL, fetch the file (honouring #Lstart-Lend),
// replace the block with the actual code, and syntax-highlight it.
async function expandGithubEmbeds(root) {
  const blocks = root.querySelectorAll('pre > code.language-embed');
  for (const block of blocks) {
    const raw_text = block.textContent.trim();
    const url = raw_text.split(/\s+/)[0];
    if (!url) continue;

    // Split URL and optional #L10-L30 fragment.
    const hash_idx = url.indexOf('#');
    const base_url = hash_idx >= 0 ? url.slice(0, hash_idx) : url;
    const fragment = hash_idx >= 0 ? url.slice(hash_idx + 1) : '';
    const range = parseLineRange(fragment);
    const raw_url = githubBlobToRaw(base_url);

    // Prepend a tiny header linking back to the source on GitHub.
    const source_link = document.createElement('a');
    source_link.href = url;
    source_link.target = '_blank';
    source_link.rel = 'noopener';
    source_link.className = 'github-embed-source';
    source_link.textContent =
      'source: ' + base_url.replace(/^https?:\/\/github\.com\//, '') +
      (range ? ' L' + range[0] + '-L' + range[1] : '');
    block.parentElement.insertAdjacentElement('beforebegin', source_link);

    // Fire the fetch; swap placeholder text for real content on arrival.
    block.textContent = 'Loading ' + url + ' ...';
    try {
      const response = await fetch(raw_url);
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      let code = await response.text();
      if (range) {
        const lines = code.split('\n');
        code = lines.slice(range[0] - 1, range[1]).join('\n');
      }
      const lang = languageFromExtension(base_url);
      block.className = 'language-' + lang;
      block.textContent = code;
      if (window.Prism && Prism.languages[lang]) {
        Prism.highlightElement(block);
      }
    } catch (err) {
      block.textContent = 'Error embedding ' + url + ': ' + err.message;
    }
  }
}


// Convert markdown string to HTML, extracting YAML front matter into globals
function convertMarkdown(markdown) {
  console.log('Markdown viewer is converting the page (v0.01)')

  // New at markd v9, simplified
  const markedRenderer = new marked.Marked(
    markedHighlight.markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'language-',
      highlight(code, lang) {
        console.log(`Highlight ${lang}: ${code}`);
        if (Prism.languages[lang]) {
          //res = '<script type="text/plain" class="language-markup">'

          console.log(`Prism converting as ${lang}: ${code}`)
          const res = Prism.highlight(code, Prism.languages[lang], lang);
          return res
        } else {
          console.log(`Warning: lang ${lang} is unknown to Prism`)
          return code;
        }
      }
    })
  );

  // Allow raw HTML passthrough in markdown
  markedRenderer.setOptions({
    sanitizer: null,
    sanitize: false,
  });

  // Extract yaml header and body
  var yaml_extractor = extractor(markdown, {allowUnsafe: true})
  meta_attribute = yaml_extractor.attributes
  title = meta_attribute.title
  subtitle = meta_attribute.subtitle
  markdown = yaml_extractor.body

  // Parse markdown body to HTML
  var html = markedRenderer.parse(markdown);


  return html
}


// Build and inject the full page DOM: title, content, ToC, styles and scroll spy
async function setPageBody(html) {
  // Set title
  if (title){
    document.title = title
  }

  // Set all meta attributes: description, keywords, authors, etc
  for (const meta_key in meta_attribute) {
    var meta = document.createElement('meta');
    meta.name = meta_key;
    meta.content = meta_attribute[meta_key];
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  // Create main container (full viewport)
  var div_main = document.createElement("div")
  div_main.style = `
    position:absolute;
    left: 0;
    margin: 0;
    padding: 0;
    border: 0;
    width: 100%;
    height: 100%;
  `

  // Create div text (left)
  const div_text = document.createElement("div")
  div_text.id = "div_text"

  // Clear content before writing
  div_text.innerHTML = '';

  // Add title
  if (title){
    // Title head
    var style = '';
    if (subtitle) { style = ' style="margin-bottom: 5pt;"'} 
    var titlebox = `
      <div class="title-box">
          <h1${style}>${title}</h1>
    `
    // Add subtitle
    if (subtitle){
      titlebox += `<div class="subtitle-box">
          ${subtitle}
        </div>
      `
    }

    // Title tail
    titlebox+= `
      </div>
    `
    div_text.innerHTML += titlebox;
  }

  div_text.innerHTML += html;

  addCopyButtons(div_text);

  // Replace ```embed ... ``` fenced blocks with the actual file content
  // fetched from GitHub (or any raw-accessible URL). Runs async; each
  // block updates in place when the fetch resolves.
  expandGithubEmbeds(div_text);

  // Turn every <div data-asciinema-cast="…"> placeholder into a real
  // asciinema-player instance using the self-hosted JS loaded from
  // /res/ascinema/asciinema-player.min.js (see markdown_viewer.html).
  renderAsciinemaPlayers(div_text);


  // Add the toc opener
  var html_toc_opener = `<input
    type="checkbox"
    id="input_toc_opener"
    role="button"
    style= "display: none;"
    checked
    >

    <!-- Label: fix opacity Vs hanoi TODO maybe change hanoi.css -->
    <label for="input_toc_opener" id="toc_opener" class="w3-hover-black"
      style="opacity: 1;"
      tabindex=1
    >
      <img src="/img/fa/bars-light-white.svg"
        style="height:36px; width:auto;"
        alt="Open nav" class="w3-xxlarge">
    </label>
  `

  div_main.innerHTML += html_toc_opener;

  // Create div toc (right)
  const div_toc = document.createElement("div");
  div_toc.id = "div_toc";
  div_toc.style = `
    position: absolute;
    width: 20%;
    height: 100%;
    left: 70%;
    padding-left: 3%;
    overflow-x: hidden;
    overflow-y: auto;
  `

  // Add title
  const tocHeader = document.createElement("h2");
  tocHeader.innerText = "Table of contents";
  tocHeader.style = `
    padding-left:30px;
  `
  div_toc.appendChild(tocHeader); // Get the h3 tags — ToC entries

  // nest ToC inside nav element
  div_toc.appendChild(document.createElement("nav"));

  // add ToC list to nav, add css classes
  //const list = div_toc.appendChild(document.createElement("ul"));
  //const list = document.createElement("ul");
  //list.classList.add("div_toc", "toc-list");
  //list.setAttribute('role', 'list')
  var toc = `<ol class="div_toc toc-list toc-ul" role="list" type="1">`


  // determine which heading tags to search by slicing list 'levels' deep
  const levels = 3;
  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"].slice(0, levels).join();

  // find the relevant heading tags contained within the scope element
  const headings = div_text.querySelectorAll(tags);

  // loop through headings in order
  var openLevel = 0
  for (let i = 0; i < headings.length; i++) {
    // determine nesting level (h2->1, h3->2 etc)
    const level = Number(headings[i].nodeName[1]) - 1;

    if (openLevel < level) {
      toc += (new Array(level - openLevel + 1)).join("<ul class=\"toc-ul\">");
    } else if (openLevel > level) {
      toc += (new Array(openLevel - level + 1)).join("</ul>");
    }
    openLevel = level

    // if heading has no id, create one from slugified title and assign to heading
    // pre-fix id with index to avoid duplicate id's
    if (!headings[i].id) {
      headings[i].id = `${i + 1}-${slugify(headings[i].innerText)}`;
    }

    // create element to hold link, add css including level specific css class
    //if (0 == i){ list.innerHTML += '<ol type="1">' }
    //const linkLine = list.appendChild(document.createElement("li"));
    //if (0 == i){ list.innerHTML += '</ol>' }

    toc += `
      <li class="toc toc-item-l${level}">
        <a href="#${headings[i].id}">${headings[i].innerText}</a>
      </li>
    `
    //linkLine.classList.add(`toc`, `toc-item-l${level}`);
    //// create link to point to ID of heading
    //const link = linkLine.appendChild(document.createElement("a"));
    //link.appendChild(document.createTextNode(headings[i].innerText));
    //link.href = `#${headings[i].id}`;
  }
  toc += `</ol>`
  div_toc.innerHTML += toc

  // Render LaTeX equations with KaTeX
  console.log("Markdown viewer is converting equations");
  renderMathInElement(div_text, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    // This helps prevent KaTeX from re-processing already rendered elements
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
    throwOnError: false
  });

  div_main.appendChild(div_text);
  div_main.appendChild(div_toc);

  // Inject page styles
  addCss(`
    body {
      /* Not changing */
      --block: 120px;
      /* Position */
      margin: 0;
      padding: 0;
      border: 0;
      height: 100%;
    }

    pre {
      position: relative;
      padding-top: 2rem;
      width: min(100%, 1000px);
      line-height: 15px;
    }
    .github-embed-source {
      display: block;
      width: min(100%, 1000px);
      margin: 0.8rem 0 -0.3rem 0;
      padding: 0.15rem 0.5rem;
      font-size: 0.85em;
      font-family: monospace;
      color: #888;
      text-decoration: none;
      border-left: 3px solid #555;
    }
    .github-embed-source:hover {
      color: #fff;
      border-left-color: #5fa;
    }
    .code-copy-button {
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      z-index: 1;
      border: 0;
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font: inherit;
      opacity: 0.8;
      line-height: 1;
    }
    .code-copy-button:hover {
      opacity: 1;
    }
    .toc {
      font-family: var(--font-family-headings);
      text-align: left;
    }
    .toc a {
      text-decoration: none;
    }
    .toc-title {
      font-family: var(--font-family-headings);
      font-size: var(--font-size-2);
      margin-bottom: 0;
    }
    .toc-list {
      padding-bottom: 1rem;
      padding-left: 10px;
      /* list-style: none; */
    }

    .toc-ul {
      padding: 0
    }
    .toc-ul > li > a.active {
      box-shadow: 2px 2px 5px #fc894d;
      color: 'red';
    }

    .toc-item-l0::marker {
      /* content: '▪ '; */
    }

    .toc-item-l0 {
      font-size: clamp( 1.25rem, 1.2232rem + 0.1127vw, 1.35rem );
      margin-left: 1.8rem;
      margin-bottom: 0;
    }
    .toc-item-l1::marker {
      content: '• ';
    }
    .toc-item-l1 {
      font-size: clamp( 1.15rem, 1.1099rem + 0.169vw, 1.3rem );
      margin-left: 3rem;
      margin-bottom: 0;
      padding-top: 0.15rem;
    }
    .toc-item-l2::marker {
      content: '◦ ';
    }
    .toc-item-l2 {
      font-size: clamp( 1.05rem, 1.0099rem + 0.169vw, 1.2rem );
      margin-left: 4.1rem;
      margin-bottom: 0;
      padding-top: 0.125rem;
    }
    .toc-item-l3::marker {
      content: '− ';
    }
    .toc-item-l3 {
      font-size: clamp( 1rem, 0.9732rem + 0.1127vw, 1.1rem );
      margin-left: 5.1rem;
      margin-bottom: 0;
      padding-top: 0.1rem;
    }

    #div_text {
      position:absolute;
      left: 0;
      height: 100%;
      padding-left: 3%;
      /* Include padding in the width so 70%/100% don't overflow the
         parent (the 3% padding was adding horizontal scroll). */
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
    }
    #div_text img {
      display: block;
      max-width: 800px;
      width: 100%;
      height: auto;
    }
    /* Interactive hide */
    input[type=checkbox]:checked ~ #div_toc {
        display: none;
    }
    input[type=checkbox] ~ #div_text {
        width: 70%;
    }
    input[type=checkbox]:checked ~ #div_text {
        width: 100%;
    }
    input[type=checkbox]:checked ~ * {
      --sidebar-width: 0px;
    }
    input[type=checkbox]:checked ~ #toc_opener > img {
        display: none;
    }
    input[type=checkbox]:checked ~ #toc_opener:hover > img
    /* Anoying when using mouse : the descirption remains
    input[type=checkbox]:checked ~ #toc_opener:focus > img
    */
      {
        display: block;
    }

    #toc_opener {
      position: absolute;
      color: white;
      top: 0;
      right: 0;
      width: var(--block);
      height: var(--block);
      z-index: 5;
      outline: none;
    }

    /* Center the old way */
    #toc_opener img {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }

    /* Wrap code line
     * With white-space: pre-wrap;
     * in css/prism_dark_twilight.css
     * Ugly patch but works
     * https://github.com/PrismJS/prism/issues/1247
     */
  `);

  //var destination = Prism.highlight(destination, Prism.languages["bash"], "bash");
  document.body.innerHTML = "";
  document.body.appendChild(div_main);


  // Collect ToC links for scroll-spy highlighting
  const links = div_toc.querySelectorAll('.toc-ul > li > a');

  // Highlight the active ToC entry on scroll
  div_text.addEventListener('scroll', () => {
    const scrollTop = div_text.scrollTop;

    // highlight the last scrolled-to: set everything inactive first
    links.forEach((link) => {
      link.classList.remove("active");
    });

    // then iterate backwards, on the first match highlight it and break
    for (let i = headings.length - 1; i >= 0; i--) {
      if (scrollTop > headings[i].offsetTop - 80) {
        links[i].classList.add('active');
        break;
      }
    }
  });
}


// Inject a CSS string into a new <style> element appended to <head>
function addCss(css){
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}


function addCopyButtons(root) {
  const codeBlocks = root.querySelectorAll('pre > code');

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;
    if (!pre || pre.querySelector('.code-copy-button')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy-button';
    button.textContent = '📋';
    button.setAttribute('aria-label', 'Copy code');
    button.title = 'Copy code';

    button.addEventListener('click', async () => {
      const text = codeBlock.textContent || '';

      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      button.textContent = '✓';
      window.setTimeout(() => {
        button.textContent = '📋';
      }, 1500);
    });

    pre.appendChild(button);
  });
}


// Fetch URL content via async XHR GET, resolve with text or reject with status
async function getHttp(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.responseText);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}


// Read the ?page= query parameter from the current window URL
function getPageLocation(){
  const url = new URL(window.location);
  const page = url.searchParams.get("page");
  return page
}


// Convert text to a lowercase, hyphen-separated, URL-safe slug
function slugify(text){
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}


window.onload = onLoad;

/*
TODO: v0.001
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
//      "prism": "https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min",
//      "marked": "https://cdn.jsdelivr.net/npm/marked/marked.min",
//  },
//  waitSeconds: 5,
//});

//let prism;
//let marked;

let title = ""  // Maybe change title according to yaml header
var meta_attribute = {}  // All meta key and content

async function onLoad() {
  // Hi
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
  html = convertShowdown(markdown)

  // Set page
  setPageBody(html);
}


function convertShowdown(markdown) {
  // Hi
  console.log('Markdown viewer is converting the page')

  marked.setOptions({
    sanitizer: null,
    sanitize: false,
    highlight: function(code, lang) {
      if (Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } else {
        return code;
      }
    },
  });

  // Clean markdown input
  // -- Remove yaml header
  // markdown = markdown.replace(/^---$.*^---$/ms, '')
  // safe is deprecated, so must force unsafe
  var yaml_extractor = extractor(markdown, {allowUnsafe: true})
  meta_attribute = yaml_extractor.attributes
  title = meta_attribute.title
  markdown = yaml_extractor.body

  // Let marked do its normal token generation.
  var tokens = marked.lexer( markdown );

  // Mark all code blocks as already being escaped.
  // This prevents the parser from encoding anything inside code blocks
  tokens.forEach(function( token ) {
    if ( token.type === "code" ) {
      token.escaped = true;
      token.sanitize = false;
    }
  });

  // Convert
  var html = marked.parser(tokens);

  return html
}

async function setPageBody(html) {
  // Set title
  if (title){
    document.title = title
  }

  // Set all meta attributes: description, keywords, authors, etc
  for (meta_key in meta_attribute) {
    var meta = document.createElement('meta');
    meta.name = meta_key;
    meta.content = meta_attribute[meta_key];
    document.getElementsByTagName('head')[0].appendChild(meta);
  }

  // Create div text (left)
  var div_main = document.createElement("div")
  div_main.style = `
    position:absolute;
    left:0;
    margin:0;
    padding:0;
    border:0;
    width:100%;
    height:100%;
  `

  // Create div text (left)
  div_text = document.createElement("div")
  div_text.id = "div_text"

  // var html = markdown;
  div_text.innerHTML = html;


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
  div_toc = document.createElement("div");
  div_toc.id = "div_toc";
  div_toc.style = `
    position:absolute;
    left:70%;
    width:20%;
    padding-left:3%;
    overflow-x: hidden;
    overflow-y: auto;
  `

  // Add title
  tocHeader = document.createElement("h2");
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

  div_main.appendChild(div_text);
  div_main.appendChild(div_toc);

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
      line-height: 15px;
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
      //list-style: none;
    }

    .toc-ul {
      padding: 0
    }
    .toc-ul > li > a.active {
      box-shadow: 2px 2px 5px #fc894d;
      color: 'red';
    }

    .toc-item-l0::marker {
      // content: '▪ ';
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
      overflow-x: hidden;
      overflow-y: auto;
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
  `);

  //var destination = Prism.highlight(destination, Prism.languages["bash"], "bash");
  document.body.innerHTML = "",
  document.body.appendChild(div_main);


  // TODO
  // Show active heading
  // From: https://stackoverflow.com/questions/65954297/highlighting-item-in-table-of-contents-when-section-is-active-on-page-as-scrolli
  //const links = document.querySelectorAll('nav > ul > li > a');
  const links = div_toc.querySelectorAll('.toc-ul > li > a');

  div_text.addEventListener('scroll', (event) => {
    if (typeof(headings) != 'undefined' && headings != null && typeof(links) != 'undefined' && links != null) {
      let scrollTop = div_text.scrollTop;

      // highlight the last scrolled-to: set everything inactive first
      links.forEach((link, index) => {
        link.classList.remove("active");
      });

      // then iterate backwards, on the first match highlight it and break
      for (var i = headings.length-1; i >= 0; i--) {
        console.log(i)
        if (scrollTop > headings[i].offsetTop - 80) {
          links[i].classList.add('active');
          break;
        }
      }
    }
  });

}


function addCss(css){
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
}


async function getHttp(url) {
  // Helper for HTTP GET content
  // The sync version
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open("GET", theUrl, false); // false for synchronous request
  // xmlHttp.send(null);
  // return xmlHttp.responseText;
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


function getPageLocation(){
  const url = new URL(window.location);
  const page = url.searchParams.get("page");
  return page
}

window.onload = onLoad;

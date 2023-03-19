/*
TODO: v0.001
  Get interactive ToC, can fold
  Load with require
  Create a loader taking a md file in input (whose path is defined in URL)

Link:
https://enzedonline.com/en/tech-blog/use-javascript-to-add-a-dynamic-table-of-contents-to-your-pages/
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

async function onLoad() {
  console.log('Loading is called');

  convertShowdown()
}


async function loadDep() {
  // Load
  //prism = require(['prism']);
  //marked = require(['marked']);
}

async function convertShowdown() {
  console.log('Showdown is converting page')

  // Read markdown content
  var markdown = document.body.innerHTML;

  //await loadDep();

  console.log(marked);
  marked.setOptions({
    highlight: function(code, lang) {
      console.log(lang);
      if (Prism.languages[lang]) {
        return Prism.highlight(code, Prism.languages[lang], lang);
      } else {
        return code;
      }
    }
  });

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
  div_text.style = `
    position:absolute;
    left:0;
    width:70%;
    height:90%;
    padding-left:3%;
    overflow-x: hidden;
    overflow-y: auto;
  `;

  // Convert
  var html = marked.parse(markdown);
  div_text.innerHTML = html;


  // Create div toc (right)
  div_toc = document.createElement("div")
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
  div_toc.appendChild(document.createElement("NAV"));

  // add ToC list to nav, add css classes
  const list = div_toc.appendChild(document.createElement("UL"));
  list.classList.add("div_toc", "toc-list");
  list.setAttribute('role', 'list')


  // determine which heading tags to search by slicing list 'levels' deep
  const levels = 3;
  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"].slice(0, levels).join();

  // find the relevant heading tags contained within the scope element
  const headings = div_text.querySelectorAll(tags);

  // loop through headings in order
  for (let i = 0; i < headings.length; i++) {
    // determine nesting level (h2->1, h3->2 etc)
    const level = Number(headings[i].nodeName[1]) - 1;

    // if heading has no id, create one from slugified title and assign to heading
    // pre-fix id with index to avoid duplicate id's
    if (!headings[i].id) {
      headings[i].id = `${i + 1}-${slugify(headings[i].innerText)}`;
    }

    // create element to hold link, add css including level specific css class
    const linkLine = list.appendChild(document.createElement("LI"));
    linkLine.classList.add(`toc`, `toc-item-l${level}`);

    // create link to point to ID of heading
    const link = linkLine.appendChild(document.createElement("A"));
    link.appendChild(document.createTextNode(headings[i].innerText));
    link.href = `#${headings[i].id}`;
  }

  //// Create a list for the ToC entries
  //tocList = document.createElement("ul");

  //$('h3').each(function () {
  //    tocListItem = document.createElement("li");
  //    // a link for the h3
  //    tocEntry = document.createElement("a");
  //    tocEntry.setAttribute("href", "#" + $(this).attr('id'));
  //    tocEntry.innerText = $(this).text();
  //    tocListItem.appendChild(tocEntry);
  //    tocList.appendChild(tocListItem);
  //});
  //div_toc.appendChild(tocList);

  div_main.appendChild(div_text);
  div_main.appendChild(div_toc);

  addCss(`
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
      list-style: none;
    }
    ul > li > a.active {
      box-shadow: 2px 2px 5px #fc894d;
      color: 'red';
    }
    .toc-item-l0::marker {
      content: '•';
      letter-spacing: 0.5em;
    }
    .toc-item-l0 {
      font-size: clamp( 1.25rem, 1.2232rem + 0.1127vw, 1.35rem );
      margin-left: 1.8rem;
      margin-bottom: 0;
    }
    .toc-item-l1::marker {
      content: '◦';
      letter-spacing: 0.5em;
    }
    .toc-item-l1 {
      font-size: clamp( 1.15rem, 1.1099rem + 0.169vw, 1.3rem );
      margin-left: 3rem;
      margin-bottom: 0;
      padding-top: 0.15rem;
    }
    .toc-item-l2::marker {
      content: '▪';
      letter-spacing: 0.5em;
    }
    .toc-item-l2 {
      font-size: clamp( 1.05rem, 1.0099rem + 0.169vw, 1.2rem );
      margin-left: 4.1rem;
      margin-bottom: 0;
      padding-top: 0.125rem;
    }
    .toc-item-l3::marker {
      content: '−';
      letter-spacing: 0.5em;
    }
    .toc-item-l3 {
      font-size: clamp( 1rem, 0.9732rem + 0.1127vw, 1.1rem );
      margin-left: 5.1rem;
      margin-bottom: 0;
      padding-top: 0.1rem;
    }
  `);

  //var destination = Prism.highlight(destination, Prism.languages["bash"], "bash");
  document.body.innerHTML = "",
  document.body.appendChild(div_main);


  // Show active heading
  // From: https://stackoverflow.com/questions/65954297/highlighting-item-in-table-of-contents-when-section-is-active-on-page-as-scrolli
  //const links = document.querySelectorAll('nav > ul > li > a');
  const links = div_toc.querySelectorAll('ul > li > a');
  
  div_text.addEventListener('scroll', (event) => {
    if (typeof(headings) != 'undefined' && headings != null && typeof(links) != 'undefined' && links != null) {
      let scrollTop = div_text.scrollTop;
      console.log(links);
      
      // highlight the last scrolled-to: set everything inactive first
      links.forEach((link, index) => {
        link.classList.remove("active");
      });
      
      // then iterate backwards, on the first match highlight it and break
      for (var i = headings.length-1; i >= 0; i--) {
        console.log(scrollTop, headings[i].offsetTop);
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

console.log(window.onload)
window.onload = onLoad;

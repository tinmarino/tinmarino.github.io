/*
TOREAD:
 * Discussion marked vs showdown
   * https://github.com/pioul/Minimalist-Online-Markdown-Editor/issues/8

# Ref
  * Marked plus prism to highlight: https://gist.github.com/lightpohl/f7786afa86ff2901ef40b1b1febf14e0

### RequireJs
  * Git: 
  <script src="https://requirejs.org/docs/release/2.3.6/minified/require.js"></script>

### Marked
  * Site: https://marked.js.org/
  * Git: https://github.com/markedjs/marked
  * a Markdown parser
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

### Showdown:
  <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js"></script>

### Prism
  * Site: https://prismjs.com/
  * Git: https://github.com/PrismJS/prism
  * <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/themes/prism-dark.min.css" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/prism.min.js"></script>
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
  var source = document.body.innerHTML;

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


  var destination = marked.parse(source);
  //var destination = Prism.highlight(destination, Prism.languages["bash"], "bash");
  document.body.innerHTML = destination;
}



console.log(window.onload)
window.onload = onLoad;

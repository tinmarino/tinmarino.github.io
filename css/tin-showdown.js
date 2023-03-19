/*

Ref:
  * Marked plus prism to highlight: https://gist.github.com/lightpohl/f7786afa86ff2901ef40b1b1febf14e0
  * Code: Marked: https://github.com/markedjs/marked
    * a Markdown parser
    * <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  * Code: Showdown:
    * <script src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.0.0/showdown.min.js"></script>

*/


async function onLoad() {
  console.log('Loading is called');

  convertShowdown()
}


function convertShowdown() {
  console.log('Showdown is converting page')

  var converter = new showdown.Converter({extensions: ['codetagsearchline']});

  var source = document.body.innerHTML;
  console.log(source);
  var target = document.body;

  var html = converter.makeHtml(source);
    
  target.innerHTML = html;
}


/*
showdown.extension('codetagsearchline', function() {
  var myext = {
    type: 'listener',
    listeners: {
      'makehtml.codeBlocks.after': function(event, text, converter, options, globals) {
        console.log('test: ' + text); // doesnt work

        text = text.replace(/Memory/g, 'jbsgfjfdhbg');
        return text;
      }
    }
  };
  return [myext];
});
*/

showdown.extension('codetagsearchline', function() {
  return [{
    type: 'output',
    filter: function (text, converter, options) {
      text = text.replace(/<pre><code>([\s\S]+?)<\/code><\/pre>/g, function (fullMatch, inCode) {
        // first split by newline, so we have an array of code lines
        var codeLines = inCode.split('\n');
        
        // pop the last element since it's an empty line
        if (codeLines[codeLines.length - 1] === '') {
          codeLines.pop();
        }
        
        codeLines = codeLines
          // then loop through the array of lines of code and wrap it in code tags
          .map(function(line) {
            return '<code>' + line + '</code>';
          })
          
          // then rejoin the array into a string
          .join('\n');
        
        // lastly wrap everything in pre tags again
        return '<pre>' + codeLines + '</pre>';
      });
      text = text.replace(/<pre><code class=\"([\s\S]+?)\">([\s\S]+?)?<\/code><\/pre>/g, function (fullMatch, codeClass, inCode) {
        // first split by newline, so we have an array of code lines
        var codeLines = inCode.split('\n');
        
        // pop the last element since it's an empty line
        if (codeLines[codeLines.length - 1] === '') {
          codeLines.pop();
        }
        
        codeLines = codeLines
          // then loop through the array of lines of code and wrap it in code tags
          .map(function(line) {
            return '<code class="' + codeClass + '">' + line + '</code>';
          })
          
          // then rejoin the array into a string
          .join('\n');
        
        // lastly wrap everything in pre tags again
        return '<pre>' + codeLines + '</pre>';
      });
      return text;
    }
  }];
});


window.onload = onLoad;

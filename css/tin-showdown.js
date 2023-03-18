
async function onLoad() {
  console.log('Loading is called');

  // Comment out, gets this is undefined, must load in html header
  //await import('https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js')

  convertShowdown()
}


function convertShowdown() {
  console.log('Showdown is converting page')

  var converter = new showdown.Converter();

  var source = document.body.innerText;
  var target = document.body;

  var html = converter.makeHtml(source);
    
  target.innerHTML = html;
}


window.onload = onLoad;

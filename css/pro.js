function hideHome(){
  document.getElementById("id_welcome_iframe").style.display = "none";
}

function showHome(){
  document.getElementById("id_welcome_iframe").style.display = "block";
  document.getElementById("id_iframe").src = "";
}

function openOne(id) {
  closeAll(true);
  document.getElementById(id).style.display = "flex";
  document.getElementById("id_main").style.marginLeft = "240px";
}

function closeOne(id) {
  var elt = document.getElementById(id);
  if (elt == null) { return; }
  elt.style.display = "none";
}

function closeAll(b_keep_open) {
  for (id of [
    "id_web",
    "id_astro",
    "id_cyber",
    "id_contact",
  ]){ closeOne(id); }
  if (!b_keep_open) {
    document.getElementById("id_main").style.marginLeft = "120px";
  }
}

function handleMouseOver(event) {
  // Get item
  var item = event.target || event.srcElement;

  // Get description (child)
  var descriptionItem = item.querySelector('.description');
  if (null == descriptionItem) { return; }
  
  // grab the menu item's position relative to its positioned parent
  // var menuItemPos = descriptionItem.position();
  
  // place the submenu in the correct position relevant to the menu item
  var i_top = item.getBoundingClientRect().top
  var s_top = Math.floor(i_top.toString()) + 'px';
  descriptionItem.style.top = s_top;
}

// Set description position <- https://css-tricks.com/popping-hidden-overflow/
// Translated to js <- https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/ (awesome page)
function setDescriptionSizeHandler() {
  // whenever we hover over a menu item (TODO that has a description)
  var buttons = document.querySelectorAll('.sidebar > *')
  buttons.forEach(item => {
    item.addEventListener('mouseover', handleMouseOver);
  });
}

// Set delayed image src
function setImageSrc () {
  var imgs = document.getElementsByClassName('delayed');
  for (let img of imgs){
    if (null == img.dataset) { continue }
    img.src = img.dataset.src;
  }
}


// Read params from URL to show what I want
function readUrlParameters () {
  const url = window.location.href;
  const params = new URL(url).searchParams;
  params.forEach(function(value, key) {
    // Check start with show
    if (key.startsWith('show')) {
      // Click on value
      var elt = document.getElementById(value);
      if (null == elt) { return }
      elt.click();
    }
  });
}

function main() {
  readUrlParameters();
  setDescriptionSizeHandler();
  setImageSrc();

}

window.onload = main;

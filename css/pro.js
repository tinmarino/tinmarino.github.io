// Declare globals (array of openable navigation ids)
const aNavId = [
  "id_cv",
  "id_web",
  "id_astro",
  "id_cyber",
  "id_contact",
]

const Key = {
  TAB: 9,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}


function hideHome(){
  document.getElementById("welcome").style.display = "none";
}

function showHome(){
  document.getElementById("welcome").style.display = "block";
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
  for (id of aNavId){ closeOne(id); }
  if (!b_keep_open) {
    document.getElementById("id_main").style.marginLeft = "120px";
  }
}

// Open description label on mouse over
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

// Add handler on mouse over sidebar element
function addDescriptionHandler() {
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


//////////////////////
// Keybard arrow input
//////////////////////


// Helper: focus next Sibling
function focusOtherElement(item, iDir) {
  // Check
  if (!item || !(iDir == 1 || iDir == -1)) { return ; }

  // Add all elements we want to include in our selection
  var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  var focussable = Array.prototype.filter.call(document.querySelectorAll(focussableElements),
  function (element) {
      //check for visibility while always include the current activeElement
      return element.offsetWidth > 0 || element.offsetHeight > 0 || element === item
  });

  var index = focussable.indexOf(document.activeElement);
  if(index > -1) {
     var otherElement = focussable[index + iDir] || focussable[0];
     otherElement.focus();
  }
}

// Handle keyboard down on focused navigation item
function handleKeyDownNav(event) {
  // Get item
  const item = event.target || event.srcElement;

  switch (event.keyCode) {
    case Key.RIGHT:
      const s_open = 'id_' + item.id;
      if (! aNavId.includes(s_open)) { return }
      openOne(s_open);
      const eltNav = document.getElementById(s_open);
      if (null == eltNav){ return; }
      const first = eltNav.firstElementChild;
      if (null == first){ return; }
      first.focus();
      return;
    case Key.LEFT:
      closeAll(false);
      const button1s = document.querySelectorAll('.sidebar1 > *');
      button1s.forEach(item1 => {
        if( item1.id == item.parentElement.id.substring(3) ){
          item1.focus();
        }
      });
      return;
    case Key.UP:
      focusOtherElement(item, -1);
      return;
    case Key.DOWN:
      focusOtherElement(item, 1);
      return;
  }
}

function addHandlerKeyboardArrow() {
  const buttons = document.querySelectorAll('.sidebar > *');
  buttons.forEach(item => {
    item.addEventListener('keydown', handleKeyDownNav);
  });

}


function main() {
  readUrlParameters();
  addDescriptionHandler();
  setImageSrc();
  addHandlerKeyboardArrow();

}

window.onload = main;

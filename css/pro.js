// Declare globals (array of openable navigation ids)
function declareGlobal() {
  window.aNavId = [
    "id_cv",
    "id_web",
    "id_astro",
    "id_cyber",
    "id_contact",
  ]

  window.Key = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  }

  window.buttonSidebars = document.querySelectorAll('.sidebar > *');

  window.buttonSidebar1s = document.querySelectorAll('.sidebar1 > *');
}


function hideHome(){
  document.getElementById("welcome").style.display = "none";
}


function showHome(){
  document.getElementById("welcome").style.display = "block";
  document.getElementById("id_iframe").src = "";
}


function openOne(id) {
  // Restore
  closeAll(true);
  // document.getElementById("id_main").style.marginLeft = "calc( 2 * var(--sidebar-width) )";

  // Show
  const nextNav = document.getElementById(id);
  if (null == nextNav) { return; }
  nextNav.style.display = "flex";

  // Color me black
  const elt  = document.getElementById(id.substring(3));
  elt.classList.add("js-black");

  // Return opened nav
  return nextNav;
}


// Focus first child: used for keyboard movement (but not mouse)
function focusFirstChild(nextNav){
  const first = nextNav.firstElementChild;
  if (null == first){ return; }
  first.focus();
}


function closeOne(id) {
  var elt = document.getElementById(id);
  if (elt == null) { return; }
  elt.style.display = "none";
}

function closeAll(b_keep_open) {
  for (id of aNavId){
    // Close
    closeOne(id);
    // Uncolor
    const buttonId = id.substring(3)
    const elt = document.getElementById(buttonId);
    if (null == elt) { continue; }
    elt.classList.remove('js-black');
  }
  if (!b_keep_open) {
    // document.getElementById("id_main").style.marginLeft = "var(--sidebar-width)";
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
  buttonSidebars.forEach(item => {
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
//   If I give a link with ?show=....
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
    case Key.ENTER:
    case Key.RIGHT:
      // Click if on home or cv
      if ("home" == item.id || "cv" == item.id) {
        item.click();
        return;
      }
      // If want to open nav, open
      const s_open = 'id_' + item.id;
      if (aNavId.includes(s_open)) {
        const nextNav = openOne(s_open);
        focusFirstChild(nextNav);
      }
      return;

    case Key.BACKSPACE:
    case Key.LEFT:
      closeAll(false);
      buttonSidebar1s.forEach(item1 => {
        if( item1.id == item.parentElement.id.substring(3) ){
          item1.focus();
        }
      });
      return;

    case Key.UP:
      // Pass if first in childList
      function doPassFirst (){
        const parent = item.parentElement;
        if (null == parent) { return false; }
        const firstElement = parent.firstElementChild;
        if (null == firstElement) { return false; }
        if (firstElement == item){ return true; }
        return false;
      }
      if (doPassFirst()) { return }

      // Prev
      focusOtherElement(item, -1);
      return;

    case Key.DOWN:
      // Pass if last in childList
      function doPassLast (){
        const parent = item.parentElement;
        if (null == parent) { return false; }
        const lastChild = parent.lastElementChild;
        if (null == lastChild) { return false; }
        if (lastChild == item){ return true; }
        return false;
      }
      if (doPassLast()) { return }

      // Next
      focusOtherElement(item, 1);
      return;
  }
}

function addHandlerKeyboardArrow() {
  buttonSidebars.forEach(item => {
    item.addEventListener('keydown', handleKeyDownNav);
  });
}

function addHandlerHider() {
  function handleBar(e) {
    if (e.keyCode == Key.ENTER
      || e.keyCode == Key.RIGHT
      || e.keyCode == Key.SPACE) {
        const elt = e.srcElement;
        elt.click();
        elt.blur();
    }
  }
  const barOpener =  document.getElementById('bar_opener');
  barOpener.addEventListener('keydown', handleBar);
}


function mainPro() {
  declareGlobal();
  readUrlParameters();
  addDescriptionHandler();
  setImageSrc();
  addHandlerKeyboardArrow();
  addHandlerHider();
  document.getElementById("home").focus();
}

window.onload = mainPro;

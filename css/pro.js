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
  welcome_elt = document.getElementById("welcome")
  if (welcome_elt != null) {
    welcome_elt.style.display = "none";
  }
}


function showHome(){
  // Create if not present
  var frame_elt = document.getElementById("id_iframe");
  var welcome_elt = document.getElementById("welcome")
  if (welcome_elt == null) {
    welcome_elt = document.createElement('iframe');
    welcome_elt.id="welcome";
    welcome_elt.src="./pro/welcome.html";
    welcome_elt.rel="prefetch";
    welcome_elt.height="100%";
    welcome_elt.width="100%";
    welcome_elt.tabindex="-1";
    welcome_elt.allowfullscreen;
    welcome_elt.style="z-index:3;";
    welcome_elt.name="welcome_iframe";
    document.getElementById("id_main").prepend(welcome_elt);
  }

  // Show home && Hide iframe
  welcome_elt.style.display = "block";
  frame_elt.src = "";
}

// Change sidebar visibility
// :param: <boolean> true: show
function showBar(bol) {
  document.getElementById("input_opener").checked = !bol;
}

function openOne(id) {
  // Restore
  closeAll(true);
  // document.getElementById("id_main").style.marginLeft = "calc( 2 * var(--sidebar-width) )";

  // Show
  const nextNav = document.getElementById(id);
  if (null == nextNav) { return; }
  nextNav.style.display = "flex";

  // Color my parent button black (see main sidebar ids)
  const elt  = document.getElementById(id.substring(3));
  elt.classList.add("js-black");

  // Return opened nav
  return nextNav;
}


function closeOne(id) {
  var elt = document.getElementById(id);
  if (elt == null) { return; }
  elt.style.display = "none";
}


// Focus first child: used for keyboard movement (but not mouse)
function focusFirstChild(nextNav){
  const first = nextNav.firstElementChild;
  if (null == first){ return; }
  first.focus();
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
  var b_show = false;

  // Loop parameters
  params.forEach(function(value, key) {
    // Check start with show
    if (key.startsWith('show')) {
      b_show = true;
      // Click on value
      var elt = document.getElementById(value);
      if (null == elt) { return }
      elt.click();
      // Hide side bar
      showBar(false);
    };
  });
  // Load welcome if there were no page to show
  if (!b_show) {
    showHome();
    // Show side bar
    showBar(true);
  }
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
      // Click if on home
      if ("home" == item.id) {
        item.click();
        return;
      }
      // If want to open nav, open
      const s_open = 'id_' + item.id;
      if (aNavId.includes(s_open)) {
        const nextNav = openOne(s_open);
        focusFirstChild(nextNav);
      }
      // If CV, load first
      if ("cv" == item.id) {
        document.getElementById('cv_en').click();
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

function handleOnScroll(e) {
  // TODO work better
  console.log(e);
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

function addHandlerOnScroll() {
  var iframe_elt = document.getElementById("id_iframe");
  var welcome_elt = document.getElementById("welcome")
  iframe_elt.contentWindow.onscroll = console.log
  welcome_elt.contentWindow.onscroll = console.log
}


function mainPro() {
  declareGlobal();
  readUrlParameters();
  addDescriptionHandler();
  setImageSrc();
  addHandlerKeyboardArrow();
  addHandlerHider();
  addHandlerOnScroll();
  document.getElementById("home").focus();
}

window.onload = mainPro;
// vim:sw=2:ts=2:

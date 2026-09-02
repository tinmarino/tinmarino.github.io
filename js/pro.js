/* Javascript utitlities for main page, TODO:
* Some document getter, get_iframe, get_welcome ...
* Press right on righter => enter
* Press left on lefter => hide and focus on bar_opener
* remove focus when hidden: seems like a bug
*
* IDEA:
*   * Handle onScroll event
*/


function declareGlobal() {
  // Declare globals (array of openable navigation ids)
  window.aNavId = [
    "id_cv",
    "id_web",
    "id_astro",
    "id_cyber",
    "id_blog",
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
    H: 72,
    J: 74,
    K: 75,
    L: 76,
    O: 79,
  }

  // Multilanguage pages
  window.International = {
    cv: ['fr', 'en', 'es'],
    cosmo_obs_cheat: ['fr', 'en', 'es'],
    aperture_guide: ['fr', 'en', 'es'],
  }

  window.buttonSidebars = document.querySelectorAll('.sidebar > *');

  window.buttonSidebar1s = document.querySelectorAll('.sidebar1 > *');
}


function hideHome(btn) {
  // Hide home frame: callback for all iframe button
  // :param: <element> button calling me: used to set title
  // Hide welcome element
  var welcome_elt = document.getElementById("welcome")
  if (welcome_elt != null) {
    welcome_elt.style.display = "none";
  }

  // Change title <- Id
  var title = btn.id.replace(/_/g,' ');
  document.title = toTitleCase(title) + ' @ Tin';

  // Change URL <= id
  window.history.pushState(document.title, "",
    "?show=" + btn.id);  // + "&lang=" + btn.hreflang);

  // Try change title <- Iframe title
  var iframe_elt = document.getElementById("id_iframe");
  if (iframe_elt && iframe_elt.contentDocument && iframe_elt.contentDocument.title) {
    document.title = iframe_elt.contentDocument.title;
  }
}


function showHome(){
  // Create if not present
  var frame_elt = document.getElementById("main_iframe");
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
    if (null != window.swipeAttachToFrame) { window.swipeAttachToFrame(welcome_elt); }
  }

  // Show home && Hide iframe
  welcome_elt.style.display = "block";
  frame_elt.src = "";

  // Change title <- Tinmarino
  document.title = 'Tinmarino';
}

function showBar(bol) {
  // Change sidebar visibility
  // :param: <boolean> true: show
  document.getElementById("input_opener").checked = !bol;
}

function openOne(id) {
  // Remember it, so a swipe right can bring back the dash the user was on
  // instead of leaving them on a bare icon bar.
  window.lastNavId = id;
  try { sessionStorage.setItem('tin_last_nav', id); } catch (err) { /* private mode */ }

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
  // Close one element: set its display to none
  var elt = document.getElementById(id);
  if (elt == null) { return; }
  elt.style.display = "none";
}


function focusFirstChild(nextNav){
  // Focus first child: used for keyboard movement (but not mouse)
  const first = nextNav.firstElementChild;
  if (null == first){ return; }
  first.focus();
}


function closeAll(b_keep_open) {
  // Close all sidebar2
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


function handleMouseOver(event) {
  // Open description label on mouse over
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


function addDescriptionHandler() {
  // Add handler on mouse over sidebar element
  // whenever we hover over a menu item (TODO that has a description)
  buttonSidebars.forEach(item => {
    item.addEventListener('mouseover', handleMouseOver);
  });
}


function setImageSrc () {
  // Set delayed image src
  var imgs = document.getElementsByClassName('delayed');
  for (let img of imgs){
    if (null == img.dataset) { continue }
    img.src = img.dataset.src;
  }
}


function readUrlParameters () {
  // Read params from URL to show what I want
  //   If I give a link with ?show=....
  const url = window.location.href;
  const params = new URL(url).searchParams;
  var s_show = '';
  var s_lang = '';
  var s_exercice = '';

  // Loop parameters
  params.forEach(function(value, key) {
    // Save show param
    if (key.startsWith('show')) {
      s_show = value;
    };
    // Save lang
    if (key.startsWith('lang')) {
      s_lang = value;
    }
    // Save the classroom deep-link: ?show=python_exercises&exercice=a4-fibonacci
    if (key == 'exercice' || key == 'exercise') {
      s_exercice = value;
    }
  });

  // Create id
  var s_id = s_show;
  if (s_lang != '') {
    s_id += '_' + s_lang;
  }

  // Click on Id if exists
  if (s_id) {
      var elt = document.getElementById(s_id);
      if (null == elt) { return }
      // The classroom shim forwards ?exercice= to the app, which opens it
      if (s_exercice && s_id == 'python_exercises') {
        elt.href = '/class/python-exercices/?exercice=' + encodeURIComponent(s_exercice);
      }
      elt.click();
      // Hide side bar
      showBar(false);

  // Else: Load welcome <= there were no page to show
  } else {
    showHome();
    // Show side bar
    showBar(true);
  }
}


//////////////////////
// Helpers
//////////////////////
function toTitleCase(str) {
  // From: https://stackoverflow.com/a/196991/2544873
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}


//////////////////////
// Keybard arrow input
//////////////////////


function focusOtherElement(item, iDir) {
  // Helper: focus next Sibling
  // Check
  if (!item || !(iDir == 1 || iDir == -1)) { return ; }

  // Add all elements we want to include in our selection
  var focussableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
  var focussable = Array.prototype.filter.call(
    document.querySelectorAll(focussableElements),
    function (element) {
      // Remove tabIndex programmatically <= bug in css selector
      b_select = element.tabIndex != -1;
      // Check for visibility while always include the current activeElement
      b_select &= element.offsetWidth > 0 || element.offsetHeight > 0 || element === item;
      return b_select;
    }
  );

  var index = focussable.indexOf(document.activeElement);
  if(index > -1) {
     var otherElement = focussable[index + iDir] || focussable[0];
     otherElement.focus();
  }
}

function handleKeyDownBody(event) {
  // Get item
  const item = event.target || event.srcElement;
  if (item != document.body) { return }
  handleKeyDownNav(event);
}

function handleKeyDownNav(event) {
  // Handle keyboard down on focused navigation item
  // Get item
  const item = event.target || event.srcElement;

  switch (event.keyCode) {
    case Key.ENTER:
    case Key.RIGHT:
    case Key.L:
    case Key.O:
      // TODO bugm right key idk why, but defautl ssems to harass me
      if ("bar_opener" == item.id) {
        item.click();
        document.getElementById('bar_opener').focus();
        event.preventDefault();
        event.stopPropagation();
        showBar(true);
        return false;
      }
      // If on bar_opener, show sidebar
      if ("bar_opener" == item.id || item == document.body) {
        event.preventDefault();
        showBar(true);
        return;
      }
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
      // Else click
      } else {
        item.click();
      }
      // If CV, load first
      if ("cv" == item.id) {
        document.getElementById('cv_en').click();
        return;
      }
      return;

    case Key.BACKSPACE:
    case Key.LEFT:
    case Key.H:
      if ("bar_opener" == item.id) {
        item.click();
        return;
      }
      closeAll(false);
      var i_sidebar_num = 1
      buttonSidebar1s.forEach(item1 => {
        if( item1.id == item.parentElement.id.substring(3) ){
          item1.focus();
          i_sidebar_num = 2
        }
      });
      // If on first bar or bar opener: hide bar
      if (i_sidebar_num == 1 || 'bar_opener' == item.id || document.body == item) {
        showBar(false);
        document.body.focus();
        return;
      }
      return;

    case Key.UP:
    case Key.K:
      if ("bar_opener" == item.id) {
        showBar(false);
        document.getElementById('bar_opener').focus();
        //document.body.focus();
        return;
      }
      // If on home: Focus bar_opener
      if ("home" == item.id) {
        document.getElementById('bar_opener').focus();
        return;
      }
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
    case Key.J:
      // If on bar_opener: Focus home
      if ("bar_opener" == item.id) {
        showBar(true);
        document.getElementById('home').focus();
        return;
      }
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
  var buttons = [].concat(
    Array.from(buttonSidebars),
    document.getElementById('bar_opener'),
  );
  buttons.forEach(item => {
    item.addEventListener('keydown', handleKeyDownNav);
  });
  document.body.addEventListener('keydown', handleKeyDownBody);
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

function addHandlerSwipe() {
  // Mobile: swipe right opens the left sidebar, swipe left closes it
  const MIN_DISTANCE = 60;   // px, minimum horizontal travel
  const MAX_VERTICAL = 60;   // px, above this it is a scroll, not a swipe
  const MAX_DURATION = 800;  // ms, above this it is a drag, not a swipe

  function isSidebar2Open() {
    for (id of aNavId) {
      const elt = document.getElementById(id);
      if (null != elt && elt.style.display == "flex") { return true; }
    }
    return false;
  }

  function isBarOpen() {
    const opener = document.getElementById("input_opener");
    return null != opener && !opener.checked;
  }

  function getLastNavId() {
    if (null != window.lastNavId) { return window.lastNavId; }
    try { return sessionStorage.getItem('tin_last_nav'); } catch (err) { return null; }
  }

  // Right reveals, one layer at a time, and remembers where the user was:
  //   1. bar hidden (only the iframe)  -> bring the icon bar back
  //   2. bar shown, no dash open       -> reopen the dash last used
  //   3. everything already open       -> nothing left to reveal
  function swipeRight() {
    if (!isBarOpen()) { showBar(true); return true; }
    if (isSidebar2Open()) { return false; }
    const last = getLastNavId();
    if (null == last) { return false; }
    const elt = document.getElementById(last);
    if (null == elt) { return false; }
    openOne(last);
    return true;
  }

  // Left hides in the mirror order: dash first, then the icon bar, so an
  // embedded page can ask whether there was still one outer layer to close.
  function swipeLeft() {
    if (isSidebar2Open()) { closeAll(false); return true; }
    if (isBarOpen()) { showBar(false); return true; }
    return false;
  }

  function addTo(doc) {
    if (null == doc) { return; }
    let xStart = null, yStart = null, tStart = 0;

    doc.addEventListener('touchstart', function(e) {
      if (e.touches.length != 1) { xStart = null; return; }
      xStart = e.touches[0].clientX;
      yStart = e.touches[0].clientY;
      tStart = Date.now();
    }, { passive: true });

    doc.addEventListener('touchend', function(e) {
      if (null == xStart) { return; }
      const touch = e.changedTouches[0];
      const dx = touch.clientX - xStart;
      const dy = touch.clientY - yStart;
      const dt = Date.now() - tStart;
      xStart = null;
      if (dt > MAX_DURATION) { return; }
      if (Math.abs(dy) > MAX_VERTICAL) { return; }
      if (Math.abs(dx) < MIN_DISTANCE) { return; }
      if (dx > 0) { swipeRight(); } else { swipeLeft(); }
    }, { passive: true });
  }

  // Native PDF viewers and cross-origin iframes swallow every touch that lands
  // on them, so a swipe started "on the iframe" never reaches us. Two thin,
  // transparent catch strips pinned over the left and right screen edges sit
  // *above* the iframe (higher stacking context), so an edge swipe is caught by
  // the parent page whatever the frame is showing -- a PDF included.
  function addEdgeSwipe() {
    const host = document.getElementById('id_main');
    if (null == host) { return; }
    // Only worth the dead strips on a touch device; a mouse has the icon bar.
    if (!window.matchMedia('(pointer: coarse)').matches) { return; }
    host.style.position = 'relative';

    function makeStrip(side) {
      const strip = document.createElement('div');
      strip.setAttribute('aria-hidden', 'true');
      strip.style.cssText =
        'position:absolute;top:0;bottom:0;width:28px;z-index:3;'
        + 'background:transparent;touch-action:pan-y;' + side + ':0;';
      host.appendChild(strip);

      let xStart = null, yStart = null, tStart = 0;
      strip.addEventListener('touchstart', function(e) {
        if (e.touches.length != 1) { xStart = null; return; }
        xStart = e.touches[0].clientX;
        yStart = e.touches[0].clientY;
        tStart = Date.now();
      }, { passive: true });
      strip.addEventListener('touchend', function(e) {
        if (null == xStart) { return; }
        const touch = e.changedTouches[0];
        const dx = touch.clientX - xStart;
        const dy = touch.clientY - yStart;
        const dt = Date.now() - tStart;
        xStart = null;
        if (dt > MAX_DURATION) { return; }
        if (Math.abs(dy) > MAX_VERTICAL) { return; }
        if (Math.abs(dx) < MIN_DISTANCE) { return; }
        if (dx > 0) { swipeRight(); } else { swipeLeft(); }
      }, { passive: true });
    }

    makeStrip('left');
    makeStrip('right');
  }

  // Main page
  addTo(document);
  addEdgeSwipe();

  // A cross-origin iframe eats its own touch events, so our own embedded pages
  // (the classroom, the IPyodide shell) forward the gesture with postMessage
  // instead. Same-origin frames are still handled directly by addToFrame below;
  // this is the path that also works when they are not.
  window.addEventListener('message', function(e) {
    const data = e.data;
    if (null == data) { return; }
    // Only accept messages from our own origin (embedded iframes)
    if (e.origin !== location.origin) { return; }
    if (data.type == 'tinmarino-swipe-request') {
      let handled = false;
      if (data.dir == 'right') { handled = swipeRight(); }
      else if (data.dir == 'left') { handled = swipeLeft(); }
      try {
        e.source.postMessage({
          type: 'tinmarino-swipe-result',
          requestId: data.requestId,
          handled: handled,
        }, e.origin);
      } catch (err) { /* iframe went away */ }
      return;
    }
    // The classroom reports the exercise it opened: keep it in the address
    // bar so the link can be shared and reloaded (replace, not push: the
    // Back button should leave the classroom, not walk the exercise list).
    if (data.type == 'tinmarino-exercice') {
      const url = new URL(location.href);
      url.searchParams.set('show', 'python_exercises');
      url.searchParams.set('exercice', String(data.exercice));
      window.history.replaceState(document.title, '', url.search);
      return;
    }
    if (data.type != 'tinmarino-swipe') { return; }
    if (data.dir == 'right') { swipeRight(); }
    else if (data.dir == 'left') { swipeLeft(); }
  });

  // Same origin iframes: else the swipe is eaten by the frame
  function addToFrame(frame) {
    if (null == frame) { return; }
    frame.addEventListener('load', function() {
      try {
        // Our own apps (classroom, IPyodide shell) drive their own gestures and
        // forward the leftovers by postMessage; injecting here too would make
        // every swipe fire twice, so leave those frames alone.
        if (frame.contentWindow && frame.contentWindow.__tinSwipeSelfManaged) {
          return;
        }
        addTo(frame.contentDocument);
      } catch (err) { /* cross origin */ }
    });
  }
  addToFrame(document.getElementById('main_iframe'));
  // Exposed as the welcome iframe is created later, by showHome
  window.swipeAttachToFrame = addToFrame;
  addToFrame(document.getElementById('welcome'));
}

function mainPro() {
  declareGlobal();
  readUrlParameters();
  addDescriptionHandler();
  setImageSrc();
  addHandlerKeyboardArrow();
  addHandlerHider();
  addHandlerSwipe();
  document.getElementById("home").focus();
}

window.onload = mainPro;

// vim:sw=2:ts=2:

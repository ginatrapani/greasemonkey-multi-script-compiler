// ==UserScript==
// @name           Colorful List View
// @namespace      http://google.reader.colorful.list.view/kepp
// @include        htt*://www.google.*/reader/view*
// @description    Colorizes the item headers in Google Reader list view. (Doesn't work with Google Gears enabled.)

// @enabledbydefault false
// @author kepp
// @homepage http://userscripts.org/scripts/show/8782
// ==/UserScript==

const BASE_CSS =
".gm-color-ui .collapsed,\
.gm-color-ri .collapsed {\
  border-color: transparent !important;\
}\
#entries.list.gm-color-ui #current-entry .collapsed,\
#entries.list.gm-color-ri #current-entry .collapsed {\
  border: 2px solid #8181DC !important;\
}\
#entries.list.gm-color-ui #current-entry.expanded .collapsed,\
#entries.list.gm-color-ri #current-entry.expanded .collapsed {\
  border-bottom-color: transparent !important;\
  border-width: 2px 0 !important;\
}\
#entries .entry {\
  padding: 5px 0;\
}";

// used to keep track of all the calculated colors
var colors = {};

function $x(q, c) {
  // doc = iframe contentDoc || context node's owner doc || the context node / document
  var doc = c ? (c.contentDocument || c.ownerDocument || c) : document;
  c = (c && c.contentDocument) ? c.contentDocument : c; // if c is an iframe, set c to its contentDoc element
  return doc.evaluate(q, (c || doc), null, 
         XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function $xa(q, c) {
  var doc = c ? (c.contentDocument || c.ownerDocument || c) : document;
  c = (c && c.contentDocument) ? c.contentDocument : c;
  var r = doc.evaluate(q, (c || doc), null,
          XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
  var e, a = [];
  while (e = r.iterateNext()) {
    a.push(e);
  }
  return a;
}



// calculate item hue
function getHue(title) {
    var h = 0;

    for each (var c in title) {
        h += c.charCodeAt(0);
    }
    h = h % 360;

    colors[title] = h;
    return h;
}

function getColorCss(title) {
  var hue = getHue(title);

  return ".gm-color-ev div[colored='" + title + "'],\
  .gm-color-ui div[colored='" + title + "'] .collapsed {\
	background: hsl(" + hue + ",70%,80%) !important; }\
  .gm-color-ui .read[colored='" + title + "'] .collapsed {\
	background: #E8EEF7 !important; }\
  .gm-color-ev div[colored='" + title + "']:hover,\
  .gm-color-ui div[colored='" + title + "']:hover .collapsed {\
	background: hsl(" + hue + ",90%,85%) !important; }\
  .gm-color-ui .read[colored='" + title + "']:hover .collapsed {\
	background: #E8EEF7 !important; }\
  .gm-color-ev div.read[colored='" + title + "'],\
  .gm-color-ri div.read[colored='" + title + "'] .collapsed {\
	background: hsl(" + hue + ",50%,90%) !important; }\
  .gm-color-ev div[colored='" + title + "'].read:hover,\
  .gm-color-ri div.read[colored='" + title + "']:hover .collapsed {\
	background: hsl(" + hue + ",70%,95%) !important; }"
}

// inject color css into the page
function setColor(entries) {
  var uncolored = $x("id('entries')/" +
                  "div[contains(@class,'entry')][not(@colored)]");
  if (!uncolored) {
    return;
  }

  var title = $x(".//*[contains(@class,'entry-source-title')][not(*)]",
              uncolored).textContent.replace(/\W/g, "-");

  uncolored.setAttribute("colored", title);

  if (colors[title] == undefined) {
    GM_addStyle(getColorCss(title));
  }
}

// helper to create and insert setting
function addPref(e, id, text, d) {
  var label = document.createElement("label");
  label.setAttribute("style", "margin-bottom: 1em; display: block; " +
                              ((d) ? "margin-left: 2em;" : ""));
  label.innerHTML = "<input id=\"" + id + "\" type=\"checkbox\" " +
                    ((d && !d.checked) ? "disabled=\"true\"" : "") +
                    (GM_getValue(id, id + " ") ? "checked=\"on\"" : "") +
                    "\"/>" + text + "</label>";
  e.appendChild(label);
  label.firstChild.addEventListener("change", function(e) {
    toggleColors(e.target.id)
  }, false);

  if (d) {
    d.addEventListener("change", function() {
      label.firstChild.disabled = !d.checked;
    }, false);
  }
  return label.firstChild;
}

// insert page color options into the settings page
function addSettings() {
  var e = document.createElement("div");
  e.className = "extra";

  e.innerHTML = "<div class=\"extra-header\">Colors</div>";
  $x("id('setting-extras-body')").appendChild(e);

  var d = addPref(e, "gm-color-lv", "Color list view headers.");
  addPref(e, "gm-color-ri", "Read items.", d);
  addPref(e, "gm-color-ui", "Unread items.", d);
  addPref(e, "gm-color-ev", "Color expanded view background.");
}

function toggleColors(id) {
  var re, cn = "";
  GM_setValue(id, (!GM_getValue(id, id + " ")) ? id + " " : "");

  if (id == "gm-color-lv") {
    re = /gm-color-ui |gm-color-ri /g;
    cn += GM_getValue("gm-color-ui", "gm-color-ui ");
    cn += GM_getValue("gm-color-ri", "gm-color-ri ");
  } else {
    re = new RegExp(id + " ", "g");
    cn = id + " ";
  }

  var es = $x("id('" + id + "')");
  var msg;
  if (re.test(es.className)) {
    es.className = es.className.replace(re, "");
    msg = "<em>will</em>";
  } else {
    es.className = cn + es.className;
    msg = "<em>will not</em>";
  }

  setMessage(id, msg);
}

function setMessage(id, msg) {
  var ma = $x("id('message-area-inner')");
  var type = {"gm-color-lv": "List view headers ",
              "gm-color-ui": "Unread items ",
              "gm-color-ri": "Read items ",
              "gm-color-ev": "Expanded view background "}[id];
  ma.innerHTML = type + msg + " be colored.";
  $x("id('message-area-outer')").className = "info-message";
}

function initColors(entries) {
  var cn = "";

  if (GM_getValue("gm-color-lv", "gm-color-lv ")) {
    cn += GM_getValue("gm-color-ui", "gm-color-ui ");
    cn += GM_getValue("gm-color-ri", "gm-color-ri ");
  }
  cn += GM_getValue("gm-color-ev", "gm-color-ev ");

  entries.className = cn + entries.className;
}

(function() {

  var entries = $x("id('entries')");

  if (!entries) { // no entries, this is the settings page
    addSettings();
    return;
  }

  initColors(entries); // initial toggle on

  GM_addStyle(BASE_CSS);

  $x("id('entries')").addEventListener("DOMNodeInserted", setColor, false);

})();

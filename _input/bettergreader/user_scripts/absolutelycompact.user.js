// ==UserScript==
// @name          Absolutely Compact
// @namespace     http://userstyles.org
// @description	  Maximizes the area for displaying articles.
// @author        DJBullwinkle
// @homepage      http://userstyles.org/styles/12691
// @include       htt*://www.google.*/reader/*

// @tab Skins
// @versionorlastupdate Nov 12 2009
// ==/UserScript==

(function() {
var css = "#entries .entry-body,\n.entry .entry-title {\n    max-width: none !important; }\n\n\n\n#logo-container,\n#gbar,\n#global-info,\n.gbh,\n#lhn-add-subscription-section,\n#chrome-view-links {\n    display: none !important; }\n\n#main,\n#settings-frame,\n#settings {\n    top:0 !important;\n    margin: 0 !important; }\n\n\n#loading-area,\n#message-area-outer {\n    width: auto !important;\n    left: auto !important;\n    right: 0 !important;\n    top: 26px !important; }\n\n\n#search {\n    left: auto !important;\n    right: 10px !important;\n    top: 1px !important;\n    width: 210px !important;\n    height:23px !important;\n    overflow: hidden !important; }\n#search:hover {\n    width: 403px !important;\n    height:323px !important;\n    overflow: visible !important; }\n#search-restrict-button .goog-menu {\n    left: auto !important;\n    right: 0 !important; }\n#chrome.search-stream #viewer-search-parent {\n    text-align: left !important; }\n\n\n\n#lhn-selectors {\n    display: none !important; }\n\n\n\n#your-items-tree-container, \n#lhn-friends,\n.entry-likers,\n.like,\n.broadcast,\n.broadcast-with-note {\n    display: none !important; }\n\n\n\n#lhn-recommendations {\n    display: none !important; }\n\n\n\na:hover .tree-item-action-container, \n.menu-open .tree-item-action-container {\n    display: none !important; }\n\n\n\n#viewer-footer {\n    display: none !important; }\n\n\n\n#nav,\n#nav * {\n    max-width: 175px !important; }\n#nav {\n    width: 175px !important; }\n#chrome {\n    margin-left: 175px !important; }\n.lhn-hidden #chrome {\n    margin-left: 1px !important; }\n\n\n\n.scroll-tree .icon {\n    display: none !important; }\n.scroll-tree .expanded .toggle {\n    background-position: 3px -58px !important; }\n.scroll-tree .collapsed .toggle {\n    background-position: -20px -58px !important; }\n#lhn-subscriptions .scroll-tree li a {\n    padding-left: 0 !important; }\n#lhn-subscriptions #sub-tree ul ul li a {\n    padding-left: 10px !important; }\n#lhn-subscriptions .scroll-tree .toggle {\n    width: 16px !important; }\n\n\n\n.entry .entry-title .entry-title-go-to,\n#entries.list .collapsed .entry-main .entry-original,\n#chrome-title .chevron {\n    display: none !important; }\n\n#entries.list .collapsed .entry-secondary {\n    margin-right: 0 !important;\n    margin-right: 7em !important; }\n\n#entries .collapsed .entry-date {\n    margin: 0 2px 0 0 !important; }\n\n\n\n.card-common .card-actions,\n#entries.list .entry .entry-actions {\n    height: 0 !important; }\n\n#entries.list #current-entry.expanded {\n    border-bottom-width: 2px !important; }\n\n\n\n#chrome-lhn-toggle {\n    display: none !important; }\n\n\n\n#viewer-top-controls,\n#chrome-header {\n    padding: 2px 0 2px 5px !important; }\n\n#viewer-footer {\n    padding: 2px 0 2px 0 !important; }\n#entries-status {\n    top: auto !important; }\n\n.entry .entry-title {\n    font-size: 100% !important; }\n.entry .entry-title .entry-title-link {\n    text-decoration: underline !important; }\n\n\n#entries .entry {\n    padding: 0 !important;\n    margin: 0 !important; }\n#entries .card-content {\n    padding: 2px !important; }\n#entries #current-entry .card-content {\n    padding: 1px !important; }\n#entries .card-common {\n    padding: 0 !important;\n    margin: 0 !important;\n    }\n\n#entries.list .collapsed {\n    padding: 0 !important;\n     }\n#entries.list .collapsed .entry-icons,\n#entries.list .collapsed .entry-main .entry-original {\n    top: 1px !important; }\n#entries.list .collapsed .entry-secondary {\n    top: 0px !important; }\n#entries.list .collapsed .entry-source-title {\n    top: 0px !important; }\n#entries.list .collapsed .entry-title {\n    text-decoration: none !important; }\n\n#entries.list #current-entry.expanded .entry-container .entry-title, \n#entries.list #current-entry.expanded .entry-secondary-snippet {\n    display: none !important; }\n\n\n\n\n.entry .card,\n.card .card-bottom {\n    -moz-border-radius: 0 !important; }";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		heads[0].appendChild(node); 
	}
}
})();

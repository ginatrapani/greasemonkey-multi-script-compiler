// ==UserScript==
// @name          Hide Unread Item Count
// @namespace     http://userstyles.org
// @description	  Removes all unread numbers from Google Reader (except the window title count).
// @author        rcphq
// @homepage      http://userstyles.org/styles/11843
// @include             htt*://www.google.*/reader/*
// @versionorlastupdate Nov 05 2008
// ==/UserScript==
(function() {
var css = ".unread-count { display: none; } #reading-list-unread-count { display: none; }";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
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

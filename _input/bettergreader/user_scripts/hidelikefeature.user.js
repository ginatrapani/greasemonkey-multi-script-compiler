// ==UserScript==
// @name          Hide "X people liked this"
// @namespace     http://userstyles.org
// @description	  Disables the new "Like" features - both the button and the "100 users liked this"
// @author        The How-To Geek
// @homepage      http://userstyles.org/styles/19590
// @include       htt*://www.google.*/reader/*

// @versionorlastupdate Jul 17 2009
// @tab View
// ==/UserScript==

(function() {
var css = "@namespace url(http://www.w3.org/1999/xhtml); .entry-likers, .entry-actions > .like { display: none !important } .like { display: none !important; }";
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

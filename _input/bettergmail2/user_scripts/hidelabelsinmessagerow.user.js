// ==UserScript==
// @name          Hide Labels in Message Row
// @namespace     http://userstyles.org
// @description	  Hides the labels that appear in a message row unless the user hovers over the message.
// @author        palswim
// @homepage      http://userstyles.org/styles/15849

// @include        https://mail.google.com/*
// @include        http://mail.google.com/*

// @versionorlastupdate Mar 12 2009
// @tab Messages
// ==/UserScript==
(function() {
var css = "@namespace url(http://www.w3.org/1999/xhtml); /* Hides the label section on email rows (in an email list), unless the user hovers over it. */ tr.zA div.yi { display:none !important; } tr.zA:hover div.yi { display:block !important; }";
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

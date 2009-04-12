// ==UserScript==
// @name          Hide Invites Box
// @namespace     http://userstyles.org
// @description	  Hides the Gmail invites box on the sidebar.
// @author        stasnikiforov
// @homepage      http://userstyles.org/styles/4724
// @include       http://mail.google.com/*
// @include       https://mail.google.com/*

// @tab Sidebar
// @enabledbydefault true
// ==/UserScript==
var css = "@namespace url(http://www.w3.org/1999/xhtml); div.pY { display: none !important; }";
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

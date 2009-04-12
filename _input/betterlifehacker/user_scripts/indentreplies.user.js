// ==UserScript==
// @name          Indent Comment Replies
// @namespace     http://userstyles.org
// @description	  Indents comment replies 15 pixels to the right.
// @author        Gina Trapani
// @homepage      http://userstyles.org/styles/10715
// @include       http://lifehacker.com/*
// @include       http://io9.com/*
// @include       http://jezebel.com/*
// @include       http://valleywag.com/*
// @include       http://fleshbot.com/*
// @include       http://defamer.com/*
// @include       http://gawker.com/*
// @include       http://kotaku.com/*
// @include       http://jalopnik.com/*
// @include       http://deadspin.com/*
// @include       http://consumerist.com/*
// @include       http://gizmodo.com/*

// @enabledbydefault false
// ==/UserScript==
var css = "@namespace url(http://www.w3.org/1999/xhtml); .commentChildren, .strayComments {margin-left:15px !important}";
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

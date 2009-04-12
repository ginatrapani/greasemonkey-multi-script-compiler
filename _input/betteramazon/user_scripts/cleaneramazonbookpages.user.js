// ==UserScript==
// @name          Cleaner Amazon Book Pages
// @namespace     http://userstyles.org
// @description	  Hides all the unnecessary bells and whistles on a book page on Amazon.
// @author        timepiece
// @homepage      http://userstyles.org/styles/4328
// @include       htt*amazon.*/*



// ==/UserScript==
(function() {
var css = "@namespace url(http://www.w3.org/1999/xhtml); .h1, .otherEditions, .fionaPublishTable, .tiny, .simsWrapper, .EBBdivider, .bucketDivider, .moreBuyingChoices, .flashPlayer, .qpTableTop, .qpTableLeft, .qpTableCenter, .qpImage, .qpTableRight, .qpTableBottom, #nonmemberStripe, #goKindleStaticPopDiv, #ftMessage, #specialOffersDiv, #primaryUsedAndNew, #secondaryUsedAndNew, #view-dpv-rich-media, #quickPromoBucketContent, #AutoBuyXGetY, #ManualBuyXGetY, #productDescription { display: none ! important; }";
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

// ==UserScript==
// @name           Auto Add to Reader (Bypass iGoogle Choice)
// @namespace      http://lieschke.net/projects/greasemonkey/
// @description    Bypasses choice between iGoogle and Reader when subscribing to feeds.
// @include        http://www.google.com/ig/add?feedurl=*

// @author Simon Lieschke
// @homepage http://lieschke.net/projects/greasemonkey/
// @versionorlastupdate Dec 22 2007
// ==/UserScript==

(function() {
	var anchors = document.getElementsByTagName('a');
	for (var i = 0; i < anchors.length; i++) {
		if (anchors[i].innerHTML == "Add to Google Reader") {
			document.location.href = anchors[i].href;
		}
	}
})();
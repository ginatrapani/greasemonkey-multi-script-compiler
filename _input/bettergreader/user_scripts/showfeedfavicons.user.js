// ==UserScript==
// @name           Show Feed Favicons (Firefox 3.1 only)
// @namespace      http://henrah.googlepages.com
// @include        htt*://www.google.*/reader/view*

// @author henrah
// @description Displays site favicons for each feed inside Reader. (Not compatible with OS X skin.)
// @homepage  http://userscripts.org/scripts/show/24371
// @enabledbydefault true
// ==/UserScript==


// ==UserScript==
// @name           Favicons for Google Reader
// @namespace      henrah.googlepages.com
// @include        htt*://www.google.*/reader/view*
// ==/UserScript==

function fetch(url, callback) {
	var xhr = new XMLHttpRequest;
	xhr.open('get', url);
	xhr.onload = function () {
		callback(xhr.responseText);
	};
	xhr.send(null);
};

function each(list, callback) {
	Array.prototype.forEach.call(list, callback);
};

function filter(list, callback) {
	return Array.prototype.filter.call(list, callback);
};

// --

var EXPORT_URL = '/reader/subscriptions/export',
	ICON_CLASS = 'sub-icon',	
	UNFIXED_ICONS = '.' + ICON_CLASS + ':not([iconbase])',
	ICON_CLASS = new RegExp('\b' + ICON_CLASS + '\b'),
	POLL_INTERVAL = 1000,
	FAVICON_TEMPLATE = ['background-position:0px; background-image:url(/s2/favicons?domain=', ')'],
	SOURCE_URL_PREFIX = ['xmlUrl="', '" htmlUrl="'];

function drawFavicon(node) {
	node.style.cssText = FAVICON_TEMPLATE.join(node.getAttribute('iconbase').split('/')[2]);
};

function getSourceUrlFromOpml(feedUrl, opml) {
	return (opml.split(SOURCE_URL_PREFIX.join(feedUrl))[1] || '').split('"')[0];
};

function getIconNodes() {
	if (document.querySelectorAll)
		return document.querySelectorAll(UNFIXED_ICONS);
		
	return filter(document.getElementsByTagName('span'), function (span) {
		return ICON_CLASS.test(span.className)
			&& ! span.hasAttribute('iconbase');
	});
};


(function () {
	setTimeout(arguments.callee, POLL_INTERVAL);
	
	var iconNodes = document.querySelectorAll(UNFIXED_ICONS);
	
	if (! iconNodes.length)
		return;

	each(iconNodes, function(icon){
		icon.setAttribute('iconbase', unescape(icon.parentNode.href.split('/')[6]));
		
		drawFavicon(icon);
	});


	fetch(EXPORT_URL, function(opml) {
		each(iconNodes, function(icon){
			var iconbase = icon.getAttribute('iconbase');
			
			icon.setAttribute('iconbase', getSourceUrlFromOpml(iconbase, opml));
			
			drawFavicon(icon);
		});
	});
})();
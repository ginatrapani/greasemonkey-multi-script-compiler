// ==UserScript==
// @name           Show Feed Favicons
// @namespace      http://henrah.googlepages.com
// @include        htt*://www.google.*/reader/view*

// @author henrah
// @description Displays site favicons for each feed inside Reader. (Not compatible with OS X skin.)
// @homepage  http://userscripts.org/scripts/show/24371
// @enabledbydefault true
// ==/UserScript==

var Favicons = {
	UNFIXED_ICON_XPATH: '//img[contains(@src, "tree-view-subscription") and not(@favicon-domain)]',
	EXPORT_URL: '/reader/subscriptions/export',
	FAVICON_URL: ['http://', '/favicon.ico'],
	PARSE_DOMAIN: /:\/\/([a-z.]+)/,
	
	domains: {},
	
	loadDomains: function () {
		var xhr = new XMLHttpRequest();
		xhr.open('get', this.EXPORT_URL, true);
		xhr.onload = function(){
			Favicons.setDomains(xhr.responseXML);
		};
		xhr.send('');
	},
	
	parseDomain: function(url) {
		var match = this.PARSE_DOMAIN.exec(url);
		return match && match[1];
	},
	
	setDomains: function (opmlDoc) {
		var outline, i = 0,
			outlines = opmlDoc.getElementsByTagName('outline');
			
		while (outline = outlines[i++]) {
			if (! outline.hasAttribute('htmlUrl')) continue;
			var title = outline.getAttribute('title');
					
			if (title.length > 24)
				title = title.substr(0, 21) + '...';
				
			this.domains[title] =
				this.parseDomain(outline.getAttribute('htmlUrl'))
				|| this.parseDomain(outline.getAttribute('xmlUrl'));
		}
		
		setInterval(function () {
			Favicons.fixAllIcons();
		}, 2000);
	},
	
	fixAllIcons: function () {
		var icon, i = 0, label;
		var uncorrectedIcons
			= document.evaluate(this.UNFIXED_ICON_XPATH, document, null, 6, null);
		while (icon = uncorrectedIcons.snapshotItem(i++)) {
			label = icon.nextSibling.firstChild.textContent;
			icon.setAttribute('favicon-domain', this.domains[label]);
			this.fixIcon(icon);
		}
	},
	
	fixIcon: function (icon) {
		this.defaultIcon = icon.src;
		icon.addEventListener('error', this.revertIcon, false);
		icon.src = this.FAVICON_URL.join(icon.getAttribute('favicon-domain'));
	},
	
	revertIcon: function (event) {
		event.target.src = Favicons.defaultIcon;
	}
};

Favicons.loadDomains();

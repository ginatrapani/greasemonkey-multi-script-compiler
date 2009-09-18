// ==UserScript==
// @name          Add Buddy Icon Reply Options
// @description	  Add a reply link to each comment which will generate the buddy icon code or bold username code in the add comment textarea on flickr.
// @namespace     http://www.flickr.com/photos/doc18/
// @include       http://*flickr.com/*
// @exclude       http://*flickr.com/messages_write.gne*

// @author doc18 and Eric Martin
// @enabledbydefault true
// @homepage http://www.bobochu.com/files/greasemonkey/flickrbuddyiconreply3_5.user.js
// @versionorlastupdate Version 3.3

// @tab Comments

// ==/UserScript==

(function() {

	textareas = document.evaluate("//textarea",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	textArray = new Array();
	messageIndex = 0;

	function tagIt (tagOpen,tagClose,i) {
		var v = textArray[i].value;
		var selLength = textArray[i].textLength;
		var selStart = textArray[i].selectionStart;
		var selEnd = textArray[i].selectionEnd;
		if (selEnd==1 || selEnd==2) selEnd=selLength;
		var start = (v).substring(0,selStart);
		var middle = (v).substring(selStart, selEnd)
			var end = (v).substring(selEnd, selLength);
		textArray[i].value = start + tagOpen + middle + tagClose + end;
	
		textArray[i].selectionStart = textArray[i].value.length;
		textArray[i].selectionEnd = textArray[i].value.length;
		textArray[i].focus();
	}


	function imgItAuto (imgSRC, i) {
		if (imgSRC != null) {
			tagIt('<img src="' + imgSRC + '" height="24" width="24"> ','', i);
		}
	}

	function usernameItAuto (username, i) {
		if (username != null) {
			tagIt('<b>'+ username +'</b> ','', i);
		}
	}
        
        function bothItAuto (username, imgSRC, i) {
            if (username != null && imgSRC != null) {
                tagIt('<img src="' + imgSRC + '" height="24" width="24"> <b>'+ username +'</b> ','', i);
            }
                
        }

	//FlickrLocalisation, script to help localise user script for Flickr
	//version 0.2
	//release 26 Jun 2007
	//author: Pierre Andrews

	// --------------------------------------------------------------------
	// Copyright (C) 2007 Pierre Andrews
	// This script can be redistributed under the terms of the GNU LGPL, without
	// modification of this licence and copyright notice. Attribution to the author should be
	// kept at least in the source of the scripts.
	// For reference: http://6v8.gamboni.org/Localising-Flickr-Greasemonkey.html
	// 
	// This program is free software; you can redistribute it and/or
	// modify it under the terms of the GNU Lesser General Public License
	// as published by the Free Software Foundation; 
	// 
	// This program is distributed in the hope that it will be useful,
	// but WITHOUT ANY WARRANTY; without even the implied warranty of
	// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	// GNU General Public License for more details.
	// 
	// The GNU Lesser General Public License is available by visiting
	//   http://www.gnu.org/copyleft/lgpl.html
	// or by writing to
	//   Free Software Foundation, Inc.
	//   51 Franklin Street, Fifth Floor
	//   Boston, MA  02110-1301
	//   USA


	var FlickrLocaliser = function(locals) {
		this.init(locals);
	}
	FlickrLocaliser.prototype = {
		selectedLang: undefined,
		localisations: undefined,
		getLanguage: function() {
			if(!this.selectedLang) {
				var langA = document.evaluate(
								 "//p[@class='LanguageSelector']//a[contains(@class,'selected')]",
								 document,
								 null,
								 XPathResult.FIRST_ORDERED_NODE_TYPE, null
								 ).singleNodeValue;
				if(langA) {
					var matches = /\/change_language.gne\?lang=([^&]+)&.*/.exec(langA.href);
					if(matches && matches[1]) {
						this.selectedLang = matches[1];
						return this.selectedLang;
					}
				}
				return false;
			} else return this.selectedLang;
		},

		init: function(locals) {
			this.localisations = locals;
		},

		localise: function(string, params) {
			if(this.localisations && this.getLanguage()) {
				var currentLang = this.localisations[this.selectedLang];
				if(!currentLang) currentLang = this.localisations[this.localisations.defaultLang];
				var local = currentLang[string];
				if(!local) {
					local = this.localisations[this.localisations.defaultLang][string];
				} 
				if(!local) return string;
				for(arg in params) {
					var rep = new RegExp('@'+arg+'@','g');
					local = local.replace(rep,params[arg]);
				}
				local =local.replace(/@[^@]+@/g,'');
				return local;
			} else return undefined;
		}

	}

	/*****************************Flickr Localisation**********************/


	var localiser = new FlickrLocaliser({
			'en-us' : {
				'reply with': 'reply with',
				'name' : 'name',
				'icon' : 'icon',
				'icon&name': 'icon&name'
			},
			'fr-fr' : {
				'reply with': 'repondre avec',
				'name' : 'nom',
				'icon' : 'icone',
				'icon&name': 'icone&nom'
			},
			'pt-br' : {
				'reply with': 'responder com',
				'name' : 'nome',
				'icon' : 'icone',
				'icon&name': 'icone&nome'
			},
			'it-it' : {
				'reply with': 'rispondere con',
				'name' : 'nome',
				'icon' : 'icone',
				'icon&name': 'icone&nome'
			},
			'es-us' : {
				'reply with': 'responder con',
				'name' : 'nombre',
				'icon' : '&iacute;cono',
				'icon&name': '&iacute;cono y nombre'
			},
			defaultLang: 'en-us'
		});

	for (i=0; i<textareas.snapshotLength; i++) {
		textArray[i] = textareas.snapshotItem(i);
		//GM_log('doc18' + textArray[i].parentNode.innerHTML);
		if (textArray[i].name == 'message') {
			messageIndex = i;
			//GM_log('doc18 > textarea index' + messageIndex);
		}
	}

	comments = document.evaluate("//td[@class='Who']",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
	var el = 'td';
	if (comments.snapshotLength == 0) {
		comments = document.evaluate("//div[contains(@class,'Who')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null),
			el = 'div';
	}

	for (i=0; i< comments.snapshotLength; i++) {
		var who = comments.snapshotItem(i);
		var imgSrc = who.getElementsByTagName('img')[0].src;

		var said = who.parentNode.getElementsByTagName(el)[1];
		var small = said.getElementsByTagName('small')[0];
		var permalink = small.getElementsByTagName('a')[0];
		var h4 = said.getElementsByTagName('h4')[0];
		if (h4 && h4.getElementsByTagName('a').length > 0) {
			var username = h4.getElementsByTagName('a')[0].textContent;
			if (username == '') {
				//admin username
				username = h4.getElementsByTagName('a')[1].textContent;	
			}
			small.insertBefore(document.createTextNode(localiser.localise('reply with') + ' '),permalink);
			var nameA = small.insertBefore(document.createElement('a'),permalink);
			nameA.href='javascript:;';
			nameA.innerHTML = localiser.localise('name');
			nameA.className = 'Plain';
			nameA.addEventListener('click', (function(a,b) { return function(){usernameItAuto(a,b)};})(username,messageIndex),false);
			if (imgSrc.indexOf('http://l.yimg.com/g/images/buddyicon.jpg') == -1) {
				small.insertBefore(document.createTextNode(' / '),permalink);
				var iconA = small.insertBefore(document.createElement('a'),permalink);
				iconA.href='javascript:;';
				iconA.innerHTML = localiser.localise('icon');
				iconA.className = 'Plain';
				iconA.addEventListener('click',(function(a,b) {return function() {imgItAuto(a,b)};})(imgSrc,messageIndex),false);
				small.insertBefore(document.createTextNode(' / '),permalink);
                                
				var mix = small.insertBefore(document.createElement('a'),permalink);
				mix.href='javascript:;';
				mix.innerHTML = localiser.localise('icon&name');
				mix.className = 'Plain';
				mix.addEventListener('click',(function(a,b,c) {return function() {bothItAuto(a,b,c)};})(username,imgSrc,messageIndex),false);
			}
			small.insertBefore(document.createTextNode(' | '),permalink);
		}	
	}
})();
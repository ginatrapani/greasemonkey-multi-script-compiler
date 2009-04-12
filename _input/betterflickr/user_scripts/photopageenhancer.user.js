// ==UserScript==
// @name          Flickr Photo Page Enhancer
// @description	  Adds links to different sizes directly to a Flickr photo page, generates html code to easily copy'n paste thumbnail & description, and automatically loads your 20 most used tags when you click "Add Tag."
// @namespace     http://www.rhyley.org/gm/
// @include       http://*flickr.com/photos/*

// Based upon the original by Fabricio Zuardi (http://www.mamata.com.br/greasemonkey/)
// By Jason Rhyley (jason AT rhyley DOT org)

// @author Jason Rhyley
// @enabledbydefault true
// @homepage http://userscripts.org/scripts/show/1030
// ==/UserScript==

(function() {

	//if a photo page
	if (document.getElementById("button_bar")) {
	
	pid = location.pathname.split('/')[3];
	
	var self = this;
	var listener = {
		flickr_photos_getSizes_onLoad: function(success, responseXML, responseText, params){
			makeObject(responseText);
		}
	};
	
	var makeObject = function (rsp) {
		var rsp = rsp.replace(/<\?xml.*\?>/,'');
		rsp = new XML(rsp);
		gSizes = new Object();
		for each (i in rsp.sizes.size) {
			eval ("gSizes." + i.@label +" = new Object();");
			eval ("gSizes." + i.@label +".w = i.@width; ");
			eval ("gSizes." + i.@label +".h = i.@height; ");
			eval ("gSizes." + i.@label +".src = i.@source; ");
		}
		doPPEsetup();
	}
	
	doUpdateWithXHR = function() {
		unsafeWindow.F.API.callMethod('flickr.photos.getSizes', {
			photo_id: pid
		}, listener);
	}
	
	function doPPEsetup() {
		var containerA = document.createElement("li");
		containerA.setAttribute("class","Stats");
		var linkA = 'View sizes: ';
		if (gSizes.Original) linkA += '<a href="' + gSizes.Original.src + '" style="text-decoration: none;">Original</a>, ';
		if (gSizes.Large) linkA += '<a href="' + gSizes.Large.src + '" style="text-decoration: none;">Large</a>, ';
		if (gSizes.Medium) linkA += '<a href="' + gSizes.Medium.src + '" style="text-decoration: none;">Medium</a>, ';
		if (gSizes.Small) linkA += '<a href="' + gSizes.Small.src + '" style="text-decoration: none;">Small</a>, ';
		if (gSizes.Thumbnail) linkA += '<a href="' + gSizes.Thumbnail.src + '" style="text-decoration: none;">Thumbnail</a>, ';
		if (gSizes.Square) linkA += '<a href="' + gSizes.Square.src + '" style="text-decoration: none;">Square</a>';
		containerA.innerHTML = linkA;

		//This next bit inserts a 'Copy HTML' link which shows a textarea
		//with the thumbnail & description suitble for copy & paste.

		var containerB = document.createElement("li");
		containerB.setAttribute("class","Stats");
		containerB.innerHTML = '<span id="showHide">Show Quicklink</span>: '+
			'<a id="thLink" href="javascript:showQuick(0)" style="text-decoration:none">Thumbnail</a>, ' +
			'<a id="smLink" href="javascript:showQuick(1)" style="text-decoration:none">Small</a>, ' +
			'<a id="sqLink" href="javascript:showQuick(2)" style="text-decoration:none">Square</a>';

		var texty = document.createElement("textarea");
		texty.setAttribute("rows","6");
		texty.setAttribute("cols","25");
		texty.setAttribute("style","display:none");
		texty.setAttribute("id","texty");

		//get various attributes of the image for use in the generated HTML 
		if (document.getElementById("title_div" + pid)) 
			ptitle = document.getElementById("title_div" + pid).innerHTML;
			else ptitle = 'Flickr - photo sharing!';

		if (document.getElementById("description_div" + pid))
			pdescription = ' ' + document.getElementById("description_div" + pid).innerHTML;
			else pdescription = '';

		pOwnerName = location.pathname.split('/')[2];
		(pOwnerName.indexOf('@') != -1) ? pOwnerName = '' : pOwnerName = ', by ' + pOwnerName;

		imglink = '<a title="' + ptitle  + pOwnerName + '" href="' + document.location + '">'

		unsafeWindow.thumb_html = imglink + '<img src="' + gSizes.Thumbnail.src +
			'" width="'+ gSizes.Thumbnail.w +
			'" height="'+ gSizes.Thumbnail.h +'"></a>' + pdescription;
		unsafeWindow.small_html = imglink + '<img src="' + gSizes.Small.src +
			'" width="'+ gSizes.Small.w +
			'" height="'+ gSizes.Small.h +'"></a>' + pdescription;
		unsafeWindow.squar_html = imglink + '<img src="' + gSizes.Square.src +
			'" width="'+ gSizes.Square.w +
			'" height="'+ gSizes.Square.h +'"></a>' + pdescription;

		addlInfo = document.evaluate("//li[contains(@class,'Stats')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).parentNode;	// This broke before, let's see
		addlInfo.appendChild(containerA);
		addlInfo.appendChild(containerB);
		addlInfo.parentNode.insertBefore(texty, addlInfo.nextSibling);
	} // end PPEsetup()
	
	unsafeWindow.showQuick = function (size){			// By request from striatic (whom I do remember from lurking on mefi way back in the day)
		texty = document.getElementById("texty");
		texty.style['display'] = 'block';
		if (size == 0) {
			texty.value = unsafeWindow.thumb_html;
			unsafeWindow.setWeight("thLink",'bold');
			unsafeWindow.setWeight("smLink",'normal');
			unsafeWindow.setWeight("sqLink",'normal');
		} else if (size == 1) {
			texty.value = unsafeWindow.small_html;
			unsafeWindow.setWeight("thLink",'normal');
			unsafeWindow.setWeight("smLink",'bold');
			unsafeWindow.setWeight("sqLink",'normal');
		} else if (size == 2) {
			texty.value = unsafeWindow.squar_html;
			unsafeWindow.setWeight("thLink",'normal');
			unsafeWindow.setWeight("smLink",'normal');
			unsafeWindow.setWeight("sqLink",'bold');
		}
		texty.select();
		document.getElementById("showHide").innerHTML = '<a href="javascript:hideQuick()" style="text-decoration:none">[Hide Quicklink]</a>'
	}

	unsafeWindow.hideQuick = function (){
		texty = document.getElementById("texty");
		texty.style['display'] = 'none';
		unsafeWindow.setWeight("thLink",'normal');
		unsafeWindow.setWeight("smLink",'normal');
		unsafeWindow.setWeight("sqLink",'normal');
		document.getElementById("showHide").innerHTML = 'Show Quickink';
	}
	
	unsafeWindow.setWeight = function (what,weight) {
		document.getElementById(what).setAttribute('style','text-decoration:none;font-weight:' + weight );
	}
	
	// 'ZILLA BUG 249843 - 3 years old and going strong!
	unsafeWindow.setTimeout(doUpdateWithXHR, 1);
	
	// This bit makes clicking the "Add Tag" link automatically populate your most popular tags
	tagadderlink = document.getElementById('tagadderlink');	
	if(tagadderlink) tagadderlink.firstChild.setAttribute("onclick", "tagrs_showForm(); tagrs_showPopular(20, '"+pid+"'); return false;");

	}//close if a photo page

})();
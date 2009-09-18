// ==UserScript==
// @name          Helvetireader
// @namespace      http://helvetireader.com/
// @description    Minimal, Helvetica-based skin.
// @homepage       http://helvetireader.com/
// @include        htt*://www.google.*/reader/view*

// @tab Skins
// @author Jon Hicks
// @versionorlastupdate Sept 17 2009
// ==/UserScript==

var favvy = document.createElement('link');
favvy.setAttribute('type', 'image/x-icon');
favvy.setAttribute('rel', 'shortcut icon');
favvy.setAttribute('href', 'http://www.helvetireader.com/favicon.png');
var head = document.getElementsByTagName('head')[0];
head.appendChild(favvy);

var cssNode = document.createElement('link');
cssNode.type = 'text/css';
cssNode.rel = 'stylesheet';
cssNode.href = 'http://www.helvetireader.com/css/helvetireader.css';
cssNode.media = 'screen';
cssNode.title = 'dynamicLoadedSheet';
document.getElementsByTagName("head")[0].appendChild(cssNode);

// ==UserScript==
// @name YouTube Download
// @description Adds a small download button to every video on YouTube
// @author KayKay
// @namespace kk.tools
// @version 1.5cm
// @include        http://*.youtube.*/watch?v=*
// @include        http://youtube.*/watch?v=*

// @homepage http://userscripts.org/scripts/show/28918
// @enabledbydefault true
// @conflict youtubetheater
// ==/UserScript==

var pnl_qs = document.getElementById("watch-video-quality-setting");
if(! pnl_qs) {
	pnl_qs = document.createElement("div");
	pnl_qs.setAttribute("id","watch-video-quality-setting");
	var pnl_views = document.getElementById("watch-views-div");
	pnl_views.insertBefore(pnl_qs,pnl_views.lastChild.previousSibling);
}
var pnl_dl = document.createElement("div");
var lnk_dl = document.createElement("a");
pnl_dl.appendChild(lnk_dl);
pnl_qs.insertBefore(pnl_dl,pnl_qs.firstChild);

switch(self.location.host.split(".")[0]) {
case "ru": lnk_txt = "скачать это видео"; break; //Russia
case "jp": lnk_txt = "このビデオをダウンロード"; break; //Japan
case "kr": lnk_txt = "이 동영상을 다운로드"; break; //Korea
case "br": lnk_txt = "baixar o vídeo"; break; //Brasil
case "de": lnk_txt = "dieses video herunterladen"; break; //Germany
case "fr": lnk_txt = "télécharger cette vidéo"; break; //France
case "in": lnk_txt = "इस वीडियो डाउनलोड"; break; //India
case "it": lnk_txt = "scaricare questo video"; break; //Italia
case "nl": lnk_txt = "download deze video"; break; //Dutch
case "pl": lnk_txt = "pobierz ten film wideo"; break; //Poland
case "hk": case "tw": lnk_txt = "下載該視頻"; break; //Taiwan, Hong Kong
case "es": case "mx": lnk_txt = "descargar este vídeo"; break; //Spain, Mexico
default: lnk_txt = "download this video"; break; //Australia, United Kingdom, Canada, Ireland, New Zealand, Global
}

lnk_dl.setAttribute("id","download-link");
lnk_dl.setAttribute("href","#");
lnk_dl.setAttribute("class","hLink");
lnk_dl.addEventListener('click', function() { var link = "http://www.flashload.net/popup.php?url=" + escape(window.document.location.href) + "&direct"; window.open(link,'FlashLoader','fullscreen=no,toolbar=no,status=no,menubar=no,scrollbars=yes,resizable=yes,directories=no,location=no,width=800,height=600,top=100,left=100'); }, false);
lnk_dl.appendChild(document.createTextNode(lnk_txt));


// ==UserScript==
// @name          Optimized
// @namespace     http://userstyles.org
// @description	  Maximize viewing area, cleaner font.
// @author        paikia
// @homepage     http://userscripts.org/scripts/show/16975
// @include       htt*://www.google.*/reader/view*


// @tab Skins
// ==/UserScript==
var css = "body, html { font-family:Corbel, arial, sans-serif !important; }#home { margin:6px 0px 0px 10px !important; } h1, h2, #chrome-stream-title a { font-weight: bold; font-family: \"Trebuchet MS\", sans-serif !important; }#chrome-stream-title a, #nav *, #viewer-top-links *{ text-decoration:none !important; border:0px !important; } #chrome {  !important; padding:0px 0px 0px 0px !important; }  #body, #html, .mozilla { margin:0px !important; padding:0px !important; background:#fff !important; } #main { margin:0px !important; padding:0px !important; border:0px !important; } #no-entries-msg { /*margin-top:30px !important;*/ } #chrome-footer-container { margin:0px !important; height:18px !important; } #viewer-top-links { margin:30px 0px 0px -1px !important; padding:4px 0px 2px 8px !important; -moz-border-radius-topleft:5px !important; } #chrome-stream-title { background:#C3D9FF !important; font-size:1.2em !important; text-align:right; margin-right: 5px; margin-top:25px; margin-left:120px !important;} #message-area-inner { padding:2px 6px !important; } #message-area-outer .c { border:1px solid #fff !important; -moz-border-radius:5px !important; } #message-area-outer { float:left !important; margin-top:2px !important; z-index:100 !important; } #viewer-header { background:#C3D9FF !important; width:500px !important; float:right !important; margin-top:7px !important; height:20px !important; } #stream-prefs-menu { margin:1px 8px 0px 0px !important; -moz-opacity:0.7 !important; } #viewer-controls-container-main { margin:0px !important; } #loading-area { border:1px solid #fff !important; background:#C3D9FF !important; -moz-border-radius:5px !important; width:100px !important; height:29px !important; text-align:center !important; } #loading-area p { padding:4px 0 0 0 !important; } .entry-body { clear:both !important; } .entry-body div:first-child { !important; margin:0px !important; padding:0px !important; } .item-body img { padding:4px !important; border:solid #ccc 1px !important; margin:8px !important; } .item-body a img { border:solid #b7b7d0 1px !important; background:#f5f5fb !important; } .item-body a img:hover { border:solid #9595bf 1px !important; } #logo-container, #footer, #viewer-box .s,  .entry-title img, #view-cards .s, #view-list .s, #gbh, #message-area, #message-area-outer .s, #gbar, #global-info { display:none !important; visibility:hidden !important; margin:0px !important; padding:0px !important; border:0px !important; } .entry-main .entry-title {float:left !important; } .entry-main .entry-author { float:left !important; line-height:2.1em !important; margin-left:6px !important; } #view-list * { background:#C3D9FF !important; } .entry-container { margin:0px 0px 5px 5px !important; } #search {float:left !important; margin-top: -25px; margin-left: 10px !important; z-index:100 !important;} #add-subs { margin:2px 0 0 0 !important; padding:0px !important; border:0px !important; background:none !important; } .entry .entry-body, .entry .entry-title { max-width: 1000px; } ";


if (typeof GM_addStyle != "undefined") {
	
	GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
	
	addStyle(css);

} else {
	
	var heads = document.getElementsByTagName("head");
	
	if (heads.length > 0){
		
		var node = document.createElement("style");

		node.type = "text/css";

		node.innerHTML = css;

		heads[0].appendChild(node); 
	
	}

}



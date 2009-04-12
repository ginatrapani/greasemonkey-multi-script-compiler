// ==UserScript==
// @name          Colorize Weekends (on calendars that start on Monday)
// @namespace     http://userstyles.org
// @description	  Colorizes Saturdays and Sundays on calendars that start on Monday.
// @author        margin
// @homepage      http://userstyles.org/styles/1101
// @include        htt*://*google.*/calendar/*

// @conflict colorizeweekendsun
// ==/UserScript==
var css = "@namespace url(http://www.w3.org/1999/xhtml); #decowner > [style*=\"left: 7\"] > div:not(.currentDayDec) { background-color: #D8E2F2 !important; } #decowner > [style*=\"left: 7\"] > .dayOfMonth { color: #6A6AFF !important; } #decowner > [style*=\"left: 7\"] > .dayNotInMonth { color: #BABDFF !important; } #decowner > [style*=\"left: 8\"] > div:not(.currentDayDec) { background-color: #F6E4E4 !important; } #decowner > [style*=\"left: 8\"] > .dayOfMonth { color: #FF6A6B !important; } #decowner > [style*=\"left: 8\"] > .dayNotInMonth { color: #FFBDC4 !important; } #decowner > div > .currentDay { background-color: #FFFF99 !important; } .chead[style*=\"left: 7\"] { color: #22F !important; } .chead[style*=\"left: 8\"] { color: #E22 !important; } [id^=\"dp_0_day_\"][id$=\"_5\"] { color: #22F !important; } [id^=\"dp_0_day_\"][id$=\"_5\"].DP_offmonth { color: #88F !important; } [id^=\"dp_0_day_\"][id$=\"_6\"] { color: #E22 !important; } [id^=\"dp_0_day_\"][id$=\"_6\"].DP_offmonth { color: #E88 !important; }";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.innerHTML = css;
		heads[0].appendChild(node); 
	}
}

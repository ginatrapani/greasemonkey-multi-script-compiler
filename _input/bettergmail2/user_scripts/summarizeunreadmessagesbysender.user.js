// ==UserScript==
// @name          Summarize Unread Messages by Sender
// @description   Displays a summary of unread emails in Gmail's current view, grouped by sender with unread count.
// @copyright     2009+, Winston Teo Yong Wei (http://www.winstonyw.com)
// @version       0.0.2

// @include       http://mail.google.com/mail/*
// @include       https://mail.google.com/mail/*
// @include       http://mail.google.com/a/*
// @include       https://mail.google.com/a/*

// @author Winston Teo Yong Wei
// @enabledbydefault false
// @homepage http://www.winstonyw.com/2009/08/08/greasemonkey-script-gmail-unreads-summary/
// @versionorlastupdate v.0.0.3, modified to add jQuery by G.Trapani
// @tab General
// ==/UserScript==

var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://code.jquery.com/jquery-latest.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
function GM_wait() {
    if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
	else { $ = unsafeWindow.jQuery; letsJQuery(); }
}
GM_wait();

// All your GM code must be inside this function
function letsJQuery() {
	$(document).ready(function() {

	  var GMAIL = null;

	  // Loads Gmail-Greasemonkey API (http://code.google.com/p/gmail-greasemonkey/wiki/GmailGreasemonkey10API)
	  if (unsafeWindow.gmonkey) {
	    unsafeWindow.gmonkey.load('1.0', init);
	  }

	  function init(obj) {

	    GMAIL = obj;

	    GMAIL.registerViewChangeCallback(create_view);
	    create_view();

	  };

	  function create_view() {

	    window.setTimeout(function() {

	      // Display Views
	      switch(GMAIL.getActiveViewType()) {
	        case 'tl' : break;
	        default: return false;
	      }

	      // Gmail API
	      var head  = GMAIL.getMastheadElement();
	      var body  = GMAIL.getActiveViewElement();

	      // jQuerised JS Elements
	      var jhead = $(head);
	      var jbody = $(body);

	      // Reset
	      var jxist = jhead.find('div#gmus');
	      jxist.remove();

	      // Summarise
	      var unreads = new Array();
	      var cnt     = 0;

	      var items = jbody.find('tr.zE'); // Class for Unread Emails

	      for (var i=0; i<items.length; i++) {

	        var item = items[i];

	        var sname = $(item).find('span.zF').html();
	        var email = $(item).find('span.zF').attr('email');
	        var query = location.protocol + "//" + location.host + location.pathname + '#search/in:inbox+label:unread+from:' + email;

	        if (unreads[email] == null) {
	          unreads[email] = new Array(sname, email, query, 1);
	        } else {
	          unreads[email][3] += 1;
	        }
	        cnt++;

	      }

	      if (cnt > 0) {

	        // Create Elements
	        var jelem = $('<div id="gmus" style="display: block; overflow: hidden; background: #E0ECFF; border: 4px solid #C3D9FF; margin: 10px; padding: 10px; ">&nbsp;</div>');
	        jelem.append('<h5 class="header" style="display: block; float: left; padding: 0px; margin: 2px 0;">Summary of Unread Emails in Current View' + ' (Total Items: ' + cnt + ')' + '</h5>');
	        jelem.append('<span id="gmus_minmax" style="float: right; cursor: pointer; font-family: Courier; font-size: 12px; color: #0000CC;">[-]</span>');

	        var contents = '<div id="gmus_content"><ul style="list-style-type: none; padding: 0px; margin 0px;">'
	        for (var email in unreads) {
	          var unread = unreads[email];
	          contents  += '<li style="display: block; float: left; margin: 2px 10px 2px 5px; width: 185px; font-size: 12px; font-weight: bold;"><a href="' + unread[2] + '" title="' + unread[1] + '">' + unread[0] + ' (' + unread[3] + ')' + '</a></li>';
	        }
	        contents    += '</ul></div>';
	        jelem.append(contents);

	        // Append to Head
	        jhead.append(jelem);

	        // Minimize and Maximize Binding
	        minmax_bind(jhead);

	      }

	    }, 200);

	  };

	  function minmax_bind(jhead) {

	    var jspan = jhead.find('span#gmus_minmax');
	    var jcont = jhead.find('div#gmus_content');

	    jspan.toggle(
	      function() {
	        jspan.html('[+]');
	        jcont.hide();
	      },
	      function() {
	        jspan.html('[-]');
	        jcont.show();
	      }

	    );

	  };

	});
}


// ==UserScript==
// @name          Bottom Post in Reply (Plain Text only)
// @namespace     http://robwilkerson.org
// @description   Inserts cursor after the quoted message in plain text replies automatically.
// @include       https://mail.google.com/*
// @include       http://mail.google.com/*
// @author Henrik N. and Rob Wilkerson
// @homepage http://userscripts.org/scripts/show/14256
// @tab Compose
// ==/UserScript==

document.addEventListener(
	'focus',
	function(event) {

		// Bail if the focused element is not a reply form
		if ( !event.target.id || event.target.name != 'body' ) {
 			return;
		}

		var textarea = event.target;
		var body     = textarea.value;
	
		// Bail if contents don't match the default top-posting (e.g. if we modified it already)
		if ( !body.match(/^\n\n\w.*?:\n>/) ) {
			return;  // Matches e.g. "\n\nOn 1/2/3, Foo wrote:\n>"
		}
	
		textarea.value = body.replace(/^\n\n/, '');  // Strip initial line breaks
	
		var signatureBegins = body.lastIndexOf("\n-- \n");
		var endOfContent    = caretPosition = (signatureBegins == -1 ? body.length : signatureBegins);
	
		if (signatureBegins != -1) {  // There is a signature
			endOfContent -= 2;
			textarea.value = body.substring(0, endOfContent) + "\n" + body.substring(endOfContent);  // Add line break before signature
		} 

		textarea.scrollTop = textarea.scrollHeight;  // Scroll to bottom
	
		setTimeout(
			function() {  
				// A tiny timeout is necessary, or the caret won't move
				textarea.setSelectionRange(caretPosition, caretPosition);  // Place caret at end
			}, 
			1
		);
	
	}, 
	true
);

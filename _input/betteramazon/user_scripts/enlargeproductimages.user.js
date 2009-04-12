// This user script makes product images on Amazon.com as large as possible.
// This is primarily useful for gathering album art for your music collection, 
// but is also effective eye candy.  As a side effect all those tacky "search
// inside this book" tags are eliminated.  If you like, you can apply a custom
// formatting string, as described at http://aaugh.com/imageabuse.html.  Just 
// set the "format" pref for this script in about:config to your format string.
// This might be useful if you have a small monitor and want to limit the size
// of the images (now that would be a bit ironic, wouldn't it ;-p).
//
// This script has been tested on amazon.com, amazon.co.uk, and amazon.co.jp.

// ==UserScript==
// @name           Enlarge Product Images
// @version        2
// @namespace      http://freecog.net/2006/
// @description    Makes product images on Amazon.com as large as possible.
// @include        htt*amazon.*/*

// @author Tom W.M.
// @homepage http://userscripts.org/scripts/show/7613
// ==/UserScript==


/* Changelog:

Version 3, 17 April 2007:
* Updated the @includes--Amazon doesn't seem to require the www prefix anymore.

Version 2, 27 Feb 2007:
* Fixed a bug that caused certain customer images to not be resized.
* Fixes the issue with the text overlapping a large image.

Version 1: Initial public release

*/

const ali_DEBUG = GM_getValue("debug", false);

// If you want to set a custom format, set this with about:config.  The default
// simply shows the largest image available.  For more on these codes go to 
// http://aaugh.com/imageabuse.html
var ali_format = GM_getValue("format", "_SCLZZZZZZZ_");

// Function to replace an image URL's format specifier with `ali_format`.
function src_to_large(src) {
	var replacement = "." + ali_format + "$1.$2$3";
	return src.replace(/\._[^\.]+?_(\.L)?\.(jpe?g|gif|png)("|'|$)/, replacement);
}

// Find the product image and change it's size.
var img = document.getElementById('prodImage');
if (img) {
	img.removeAttribute('width');
	img.removeAttribute('height');
	img.src = src_to_large(img.src);
	if (ali_DEBUG) GM_log("Image fixed.");
} else if (ali_DEBUG) {
	GM_log("Product image not found.");
}


// A function to eval JS in the document's untrusted scope.
function window_eval(js) {
	window.location = "javascript:" + encodeURIComponent(js + "; void null;");
}

// If there are alternate images, large amounts of shifting can occur 
// when they are switched between.  So we traverse the registeredImages
// object, which contains all of the alternate images and changing it to suit
// our fancy and doing some preloading.  As the images load, we change the 
// size of the container to accomidate the largest among them.

// Export ali_DEBUG and ali_format
window_eval("ali_DEBUG = " + ali_DEBUG);
window_eval("ali_format = " + uneval(ali_format));

// Export src_to_large
window_eval("src_to_large = " + uneval(src_to_large));

// Do it.
window_eval(uneval(function() {
	var container = document.getElementById("prodImageCell");
	var image_grid = null;
	
	// Find the image_grid, removing size restrictions
	var node = container;
	while ((node = node.parentNode)) {
		[node.width, node.height] = ['', ''];
		[node.style.width, node.style.height] = ['auto', 'auto'];
		if (node.className == 'productImageGrid') {
			image_grid = node;
			break;
		}
	}
	
	if (image_grid) { 
		image_grid.style.width = '350px'; // Temporary, until images load.
		image_grid.style.minWidth = '350px';
	}
	
	var current_width = 0;
	var current_height = 0;
	var preload_count = 0; // When reaches zero, all images have been preloaded.
	if (!registeredImages) return;
	for (id in registeredImages) {
		preload_count++;
		(function(){
			var debug_id = id;
			var img = registeredImages[id];
			// Remove the width and height attributes from the images so that they assume their
			// true dimensions upon load.
			img.html = src_to_large(img.html).replace(/width="\d*?"/, '').replace(/height="\d*?"/, '');
			img.image = src_to_large(img.image);
			var preload = img.preload = new Image;
			preload.addEventListener('load', function(evt) {
				if (ali_DEBUG) console.log("Image " + debug_id + " preloaded.");
				preload_count--;
				if (!preload_count) allPreloaded = 1;
				function check_sizes() {
					if (ali_DEBUG) console.log("Checking sizes for " + debug_id);
					if (current_width < preload.width) {
						container.width = current_width = preload.width;
						if (image_grid) {
							image_grid.style.width = current_width + 'px';
						}
						if (ali_DEBUG) console.log("  Width: " + current_width);
					}
					if (current_height < preload.height) {
						container.height = current_height = preload.height;
						if (ali_DEBUG) console.log("  Height: " + current_height);
					}
				}
				check_sizes();
				window.setTimeout(check_sizes, 100);
			}, false);
			preload.src = img.image; // Load it.
		})();
	}
	if (ali_DEBUG) console.log("Done traversing registeredImages.  Container: %o", container);
	
	//if (image_grid) {
		//image_grid.style.cssFloat = 'left';
	//}
}) + "();");

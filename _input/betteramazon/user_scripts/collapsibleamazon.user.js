// ==UserScript==
// @name           Collapsible Amazon
// @author         Ben Hollis
// @namespace      http://brh.numbera.com/software/greasemonkeyscripts
// @description    Collapse any section of the Amazon.com web site by clicking on the orange section header.
// @include        http://*.amazon.*
// @version        3.0

// @homepage http://brh.numbera.com/software/greasemonkeyscripts/
// @enabledbydefault true
// ==/UserScript==

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ""); };

function findContent(bucket, header) {
    if(header == null)
        return null;
        
    var current = header;    
    var contents = [];
    
    while(current != bucket) {
        while(current.nextSibling) {
            current = current.nextSibling;
                
            if(current.style)
                contents.push(current);
        }    
        
        current = current.parentNode;
        
        if(current.className == "amabot_endcap")
           return null;
    }

    return contents;
}

function findHeader(bucket) {
    var header = document.evaluate('.//b[contains(@class, "h1")] | .//h2 | .//strong[contains(@class, "h1")] | .//h1[contains(@class, "h1")]', bucket, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	
	if(header.snapshotLength > 0) {
		return header.snapshotItem(0);
	}
	else {
		return null;
	}
}

function headerClickHandler(header, contents, key) {
	return function () {
		var opened = GM_getValue(key, true);
		
		if(opened == true) {
			opened = false;
            closeSection(contents);
			header.className = header.className.replace("brhgmopened", "brhgmclosed");
		}
		else {
			opened = true;
			openSection(contents);
			header.className = header.className.replace("brhgmclosed", "brhgmopened");
		}

		GM_setValue(key, opened);
	};
}

function setupHandlers() {
	GM_addStyle(".brhgmopened { cursor:pointer; }\n" +
				".brhgmclosed { cursor:pointer; }\n" +
				".brhgmopened:before { content:\"-\"; color: black; font-weight: bold; border: 1px solid black; padding:0 3px; font-size:10px; margin-right: 4px;}\n" +
				".brhgmclosed:before { content:\"+\"; color: black; font-weight: bold; border: 1px solid black; padding:0 3px; font-size:10px; margin-right: 4px;}");

	var allBuckets = document.evaluate('//div[contains(@class, "bucket")] | //td[contains(@class, "bucket")] | //div[contains(@class, "acc")] | //div[contains(@class, "graybox")] | //div[contains(@class, "cmPage")]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	for(var i = 0; i < allBuckets.snapshotLength; i++) {
		var bucket = allBuckets.snapshotItem(i);
		
		var header = findHeader(bucket);
		var contents = findContent(bucket, header);
				
		if(header && contents) {
			var key = header.innerHTML.trim();
			
			var opened = GM_getValue(key, true);
			
			header.addEventListener("click", headerClickHandler(header, contents, key), false);
			
			if(opened == false) {
                closeSection(contents);
				header.className += " brhgmclosed";
			}
			else {
				header.className += " brhgmopened";
			}
		}
	}
	
}

function closeSection(contents) {
    for each(var content in contents) {
		content.style.display = "none";
    }
}

function openSection(contents) {
    for each(var content in contents) {
		content.style.display = "";
    }
}

setupHandlers();
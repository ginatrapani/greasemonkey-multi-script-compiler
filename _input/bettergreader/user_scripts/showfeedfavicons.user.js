// ==UserScript==
// @name           Show Feed Favicons
// @include        htt*://www.google.*/reader/view*

// @author red.october
// @description Displays site favicons for each feed inside Reader.
// @homepage  http://userscripts.org/scripts/show/54805
// @enabledbydefault true
// @versionorlastupdate Aug 15 2009
// @tab  General
// ==/UserScript==


/*
 * This script attempts to find the favicon for each feed in your Google Reader list.  If it can find it,
 * the favicon will appear beside the feed in the feed list (replacing the default image).
 *
 * It looks for a feed's favicon URL using a 2-step process:
 * 1) try "favicon.ico" in the feed's root directory
 * 2) if it isn't there, then use YQL to search the webpage
 *
 * Of course, doing this every time is overkill, because the location of a site's favicon isn't likely to change.
 * Therefore, once I find a feed's favicon, I store its URL.  Because of this optimization, the 2-step process becomes:
 *
 * 1) If there is a stored favicon URL, use it.  Otherwise try "favicon.ico" in the feed's root directory.
 * 2) if it isn't there, then use YQL to search the webpage.
 */

const EXPORT_URL = '/reader/subscriptions/export';
const REG_ICON_XPATH = "/html/body/div[8]/div/div[4]/div[4]/ul/li/ul/li/a/span[starts-with(@class,'icon sub-icon')]";
const FOLDER_ICON_XPATH = "/html/body/div[8]/div/div[4]/div[4]/ul/li/ul/li/ul/li/a/span[starts-with(@class,'icon sub-icon')]";
const ICON_XPATH_PREFIX = ["/opml/body/outline[@xmlUrl='", "/opml/body/outline/outline[@xmlUrl='"];
var prefixIdx = {reg:0, folder:1};
const YQL_BASE_URL = 'http://query.yahooapis.com/v1/public/yql?q=';
const YQL_GET_HTML = 'select%20*%20from%20html%20where';	// URI-encoded
const YQL_HTML_QUERY = YQL_BASE_URL+YQL_GET_HTML;
const FAVICON_XPATH = "/html/head/link[@rel='icon' or @rel='shortcut icon']";

// The OPML file is the file you get when you try to export your Google Reader subscriptions.
// It contains (amongst other things) the mapping between each site's URL and feed URL.
function fetchOPML(url, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('get', url);
	xhr.onload = function(){callback(xhr.responseXML)};
	xhr.send(null);
}

function drawFavicon(iconNode, imgNode)
{
	var parent = iconNode.parentNode;
	parent.replaceChild(imgNode, iconNode);
}

function replaceAllFeedIcons(opml)
{
	function replaceIcons(iconNodes, type)
	{
		for (var i=0; i<iconNodes.snapshotLength; i++)
		{
			var currIcon = iconNodes.snapshotItem(i);
			var feedURL = unescape(currIcon.parentNode.href.split('/reader/view/feed/')[1]);
			var srcURL = opml.evaluate(ICON_XPATH_PREFIX[type]+feedURL+"']/@htmlUrl", opml, null,
				XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
			srcURL = "http://"+srcURL.split("/", 3)[2];	// get the root URL
			
			var imgNode = document.createElement("img");
			imgNode.style.borderWidth = "0px";
			/* By setting the class attribute to be the same, we can ensure that the same CSS styles get applied.
			 * You can remove the line to see what it looks like without those styles */
			imgNode.className = currIcon.className;
			// remove the default feed icon
			imgNode.style.backgroundImage = "none";
		
			var defaultFaviconURL;	// our first guess at the correct URL
			var faviconURL = GM_getValue(srcURL);
		
			if (faviconURL == undefined || faviconURL == "")
				defaultFaviconURL = srcURL + "/favicon.ico";
			else
				defaultFaviconURL = faviconURL;
			
			imgNode.src = defaultFaviconURL;
			// if the image loads correctly, then the favicon is in the default location
			imgNode.addEventListener("load",
				(function(srcURL, defaultFaviconURL)
				{
					return function() {GM_setValue(srcURL, defaultFaviconURL);};
				})(srcURL, defaultFaviconURL),
				true);
			// otherwise, its in a non-default location and we have to hunt for it
			imgNode.addEventListener("error",
				(function(currIcon, imgNode, srcURL)
				{
					return function()
						{
							/* make use of the YQL service from Yahoo! which will:
							 * 1) convert HTML into well-formed XML
							 * 2) lets us retrieve selective parts of a webpage, based on an XPath query -
							 *    the benefit is that we have to do less client-side processing
							 *    
							 * Here we are only requesting the part of the webpage which specifies the favicon location   
							 */
							var queryURL = YQL_HTML_QUERY+encodeURIComponent(' url="'+srcURL+'"'+' and xpath="'+FAVICON_XPATH+'"');
							GM_xmlhttpRequest({
								method: "GET",
								url: queryURL,
								onload:
									function(response)
									{
										if (response.status == '200')
										{
											// remove XML opening declaration before passing to constructor (apparently required)
											var urlResultDoc = new XML(response.responseText.replace(/^<\?xml [^>]*>\s*/,''));
											var urlResult = urlResultDoc.results;
											var url, faviconURL;
											
											if (urlResult.link.length() == 0)	//	no favicons :(
											{
												/* therefore, go back to using the generic icon provided by Google Reader,
												 * so that the icon isn't just blank/broken
												 */
												drawFavicon(imgNode, currIcon);
												/* create the entry, so the user can manually fill it in (if desired) via about:config
												 * (e.g., with the URL of some other site's favicon)
												 */
												GM_setValue(srcURL, "");
												return;
											}
											else if (urlResult.link.length() == 1)
												url = urlResult.link.@href;
											else if (urlResult.link.length() == 2)
												/* this should rarely happen, but some websites will specify 2 link tags:
												 * one with rel="shortcut-icon" and one with rel="icon".  I've arbitrarily
												 * chosen to select the former.
												 */
												url = urlResult.link.(@rel == "shortcut-icon").@href;
											
											if (url.charAt(0) == '/')	// relative path
												faviconURL = srcURL+url;
											else
												faviconURL = url;
		
											imgNode.src = faviconURL;
											drawFavicon(currIcon, imgNode);
											GM_setValue(srcURL, faviconURL.toString());
										}
										else
											GM_log("YQL query for "+srcURL+" returned with error " + response.status);
									}
							});
						}
				})(currIcon, imgNode, srcURL),
				true);
			drawFavicon(currIcon, imgNode);
		}
	}
	
	var regIconNodes = document.evaluate(REG_ICON_XPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	replaceIcons(regIconNodes, prefixIdx.reg);
	
	var folderIconNodes = document.evaluate(FOLDER_ICON_XPATH, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	replaceIcons(folderIconNodes, prefixIdx.folder);
}

//	here we draw the favicons when our script first loads
fetchOPML(EXPORT_URL, replaceAllFeedIcons);

/*  But there are 2 times when we will have to redraw the favicons:
 *  
 *  1) When the user drag-and-drops feeds to re-order them
 *  2) When the user navigates to the Settings and back 
 *  
 *  This is because these two operations don't reload the page (I think Google is using AJAX for them).
 *  The current means of detecting when these events is fairly crude, but Google doesn't
 *  provide notifications for them currently.
 */	

//	I detect that drag-and-drop ends when the "Saved changes to [feed-name]" message appears
var msg = document.evaluate("/html/body/div[4]/div/span[@id='message-area-inner']", document, null,
				XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	
msg.addEventListener("DOMNodeInserted", 
	function(event) 
	{
		if (this.textContent.search("Saved changes") == 0)
			/*
			 * I don't actually need to fetch the opml file here, but the replaceAllFeedIcons() function
			 * makes calls to GM_getValue()/GM_setValue(), which cannot be made in the context of the 
			 * webpage (a security error occurs when this happens).  Thus, I have to call the function
			 * in the context of a GreaseMonkey XmlHttpRequest. 
			 */
			fetchOPML(EXPORT_URL, replaceAllFeedIcons);
	},
	true);
	
//	I detect when the user navigates back from the Settings page when the class attribute of the 
//	left-hand side navigation bar is modified in a certain way
var navBar = document.evaluate("/html/body/div[8]/div[@id='nav']", document, null, 
	XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var unhide = false;

navBar.addEventListener("DOMAttrModified", 
	function(event) 
	{
		//	we're coming back from the Settings page 
		if (event.attrName == "class" && event.prevValue == "hidden" && event.newValue == "")
			unhide = true;
			
		/*	I only re-draw the first time the class attribute is changed after coming back from the
		 *	Settings page.  I used the flag because this type of change to the class
		 *	attribute occurs often.  For example, it occurs every time you click on a feed/subscription
		 *	in the left panel.
		 */
		if (unhide && event.attrName == "class" && event.newValue == "link tree-link-selected")
		{
			fetchOPML(EXPORT_URL, replaceAllFeedIcons);
			unhide = false;
		}
	}, 
	true);
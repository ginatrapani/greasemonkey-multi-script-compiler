// ==UserScript==
// @name           Super Saver Snooper
// @author		   Ben Hollis
// @namespace      http://brh.numbera.com/software/greasemonkey/
// @description    Highlights items in Amazon search results eligible for Super Saver Shipping / Amazon Prime.
// @include        http://*amazon.*/s*

// @homepage http://brh.numbera.com/software/greasemonkeyscripts/
// @enabledbydefault true
// ==/UserScript==

function snoopSearchResults() {
	var highlightColor = '#FFFFDA';

  var sites = {
    "\.ca$": "ecs.amazonaws.ca",
    "\.de$": "ecs.amazonaws.de",
    "\.fr$": "ecs.amazonaws.fr",
    "\.(co)?\.jp$": "ecs.amazonaws.jp",
    "\.co\.uk$": "ecs.amazonaws.co.uk",
    "\.com$": "ecs.amazonaws.com"
  }
  
  var site = "ecs.amazonaws.com";
  
  for(var siteRegex in sites) {
    if(window.location.hostname.match(siteRegex)) {
      site = sites[siteRegex];
      break;
    }
  }

	var requestString = "http://" + site + "/onca/xml?Service=AWSECommerceService&Version=2007-01-15&Operation=ItemLookup&ContentType=text%2Fxml&AWSAccessKeyId=08SZDNA2M9QX04X0Z202&IdType=ASIN&MerchantId=Featured&ResponseGroup=Offers&ItemId=";

	var asinRegex = /\/([0-9A-Z]{10})\//;

	//Find the ASINs of the search results and save their HTML blocks
	var savedItems = new Object();
	var searchResults = document.evaluate('//td[@class="searchitem"]|//div[@class="result"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		
	for(var i = 0; i < searchResults.snapshotLength; i++) {
		var searchItem = searchResults.snapshotItem(i);
		
		var productLink = document.evaluate('.//span[@class="srTitle"]/../@href|.//span[@class="small"]/a/@href|.//div[@class="productTitle"]/a/@href', searchItem, null,  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  
		if(productLink.snapshotLength > 0) {
			var possibleAsin = asinRegex.exec(productLink.snapshotItem(0).value);

			if(possibleAsin) {
				var asin = possibleAsin[1];
				savedItems[asin] = searchItem;					
			}
		}
	}
	
  //create the argument lists, but break them into groups of 10 to trick AWS
	var asinlist = new Array();
	var listNum = 0;
	var index = 0;
	for (var x in savedItems) {
		if(index % 10 == 0) {
			asinlist[Math.floor(index / 10)] = "";
		}
		asinlist[Math.floor(index / 10)] += x + ",";
		index++;
	}

	//make a series of 10-ASIN AWS calls
	for(var i=0;i<asinlist.length;i++) {
		GM_xmlhttpRequest({
		method: 'GET',
		url: requestString + asinlist[i],
		onload: function(response) {
			//Parse an XML DOM from the response
			var parser = new DOMParser();
			var doc = parser.parseFromString( response.responseText, 'text/xml' );
			
			//For each item...
			var items = doc.getElementsByTagName('Item');
			
			for(var j=0; j < items.length; j++) {
				var product = items[j];
				
			   var offers = product.getElementsByTagName('Offer');
			   var asin = product.getElementsByTagName('ASIN')[0].firstChild.nodeValue;

				//For each offer...
				for (var k=0; k < offers.length; k++) {
					var offer = offers[k];
					var iseligible = offer.getElementsByTagName('IsEligibleForSuperSaverShipping');
					if(iseligible && iseligible.length > 0 && (!iseligible[0].firstChild || iseligible[0].firstChild.nodeValue == "1")) {
					   	var panel = savedItems[asin];
						
						//Highlight the background if it's super-saverable
						panel.style.backgroundColor = highlightColor;
						
						//Correct the price to the price of the first prime-able offer
						var price = offer.getElementsByTagName('FormattedPrice');
						if(price && price.length > 0) {
							price = price[0].firstChild.nodeValue;
							
							var priceHtml = document.evaluate('.//span[@class="sr_price"]|.//span[@class="saleprice"]|.//div[class="newPrice"]/span', panel, null,  XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
							if(priceHtml.snapshotLength > 0) {
								var thePrice = priceHtml.snapshotItem(0);
								
								thePrice.innerHTML = price;
							}
						}
						
						//We've already found a good offer, skip to the next item
						break;
					}
			   }
			   
			}

		}
		});
	}
}

snoopSearchResults();

// ==UserScript==
// @name	Smart Subscriber (Comte)
// @namespace	http://userscripts.org/scripts/show/33600
// @description	Display a small icon for subscribing to the feeds of the current page. 
// @version	S-2.0
// @author Jasper de Vries and Sylvain Comte

// @homepage http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber

// @enabledbydefault false
// @include *
// @exclude htt*://www.google.*/reader/view*
// @versionorlastupdate Jun 04 2009
// @tab Subscribing
// @conflict smartsubscriber
// ==/UserScript==.
/******* PARAMETERS ********/

/********* About ***********
Change for version 0.4 and S-* by Sylvain Comte :
	see http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber for more informations
Change for version 0.3 by Mihai Parparita :
	Check if the user is already subscribed, and modify the appearance of the image accordingly.
First release by Jasper de Vries
	jepsar@gmail.com	Date:2006-04-13
****************************/

/********* CUSTOMIZATION **************/
// if you like to tweak your GM scripts

/* colorpalettes */
// feel free to create your own. color in this order : back, highlight, front, light.
// You may like to share them by commenting
// http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber
var SGSColPal=new Array();
SGSColPal["Chrome"]=new colorPalette("#E1ECFE","#FD2","#4277CF","#FFF");	// but for Firefox ;-)
SGSColPal["Userscripts"]=new colorPalette("#FFF","#F80","#000","#EEE");		// javascrgeek only
SGSColPal["Flickr"]=new colorPalette("#FFF","#FF0084","#0063DC","#FFF");	// pink my blue
// enable default. You don't have to touch this as there is now a setting options menu...
var SGSdefaultPalette="Userscripts";
// declare color palette
var colPal=SGSColPal[GM_getValue("palette",SGSdefaultPalette)];


/****************/
/* MAIN PROGRAM */
/****************/
/*********** VARIABLES ****************/
var item;					// a feed found under <link>
var control="";				// used to avoid multiple occurence for one unique feed (specialy <a href...)
var Feeds=new Array();		// all  feeds detected in the page
var FeedLinks=new Array(); 	// links to the feeds subscriber
var UrlList=new Array();	// all url used in the links
var subStatus="";			// global subscription status

/********* MAIN WINDOW ONLY ********/
// avoid the logo to be displayed in each iframe of the page

 if(self.location==top.location) {
/********* CONSTANTES ****************/
// the waiting image
const waitLogo = 'data:image/png;base64,R0lGODlhEAAQAPQAALGxsWdnZ6ysrI+Pj6ioqHp6eoqKimdnZ4CAgHFxcZiYmJ2dnWtra5OTk2dnZ3Z2doSEhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA==';
// the four logos...
const logoRssOrange = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAANbY1E9YMgAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJnSURBVDiNpdNPSNNhHMfxj66SLFcOMis6dAoPXYooPIUdgqCi0Z8RK2gsDEcpVmSkJUZoGWJQEUURpNEfSjxElygiorLSLmW2X/ZbOjeVqTndouXeHbbGj6AI+sKH57k8r8/l+wjQ/0TD15Y6Bk7O7TYrs/CXCX+ZMP6QQGUWwZNzetqPLC6UZAOkgbq87pHG2YTbNhF80sDQs1NMvqxh4t5KErcWkryzCCwZbZyNeTzvk6QFkmwyfWLqegH+Vhe/T7zvKeN31zDVMh9aU0m2FGD6hKQiSTNkeEXyioPwucV0NK3l+ZkSOlsqiJhdGShyfy/fL+XDVQdcdWB4haRlKcAjuGgncd7OQH0uofpZxM7mEW7IJdBWSTw6CkD/HS9TF+xw0Y7hsQK7BM25hGpzMo2xYBdfb29l8vRMehqXEx8fAWDs8kqSzbkYu6yAW3A6h+EaGyPvHxH++CYDDT+oJVo3jcDN8hRsPCbRMB3DbQV2CE5kk6zLJnYsi0CFeFRVTCzdOnRlE+GDImKk4LFTSzB2WAGXSFaLeJUIl4vEURE/LF5UrwYgar5h4pAItvoA+HpvH4bLCmwT0Qrx7Uuq4Ud/J4mDIlgqBj+8BqBvjxg8UwxA6O5R/NuswBZh7J+HdQa9IlYmIm8fAvDKKSabVgEQvFmF32kBTKcIucW4/xUA33pfE/OKH6Wiz5fPQO0Kxj1i7ICDdzfqCZ510msFgi71jLjEkEt0rBNRt0h6BJ7U+es+tVvEdorh7cLYokAGaF+vws9O9ZobhbHh7zE3CmOzAmsWqCSzypJs6Y9RlFb/JUXpN7afIVhSDdLWIM4AAAAASUVORK5CYII=';

const logoRssVert = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDicM/u2nkQAAAnNJREFUeNqlk0tIVGEUx3/f3O/eGXXGJjN1ohaF6Wha0iLxxUQIRbXJlUYLayEtokW4iLYu3NQuMILCTa16gEqFCBGi0EvNNHxBND2cGR8zdzTHnDv3azEUDiUEHThndTjn8Dv/P/xniNKwL0+PrQ0lNuJ+mVQA6Fs0W7pA0z0zG6OewGzL1wUgJR3mytC6S/n3ewJUJ6vBANMd5zkDhJzzCAlKqN9Dcr+kSrRKcwioByJUjKN8KadqnjqpTNPMyJ6Vh6ohVqV8KafyqXQW2YaqGEcBZYAhpQVCJBl3vqV58jgkBSWucpr2tBDIaSQgGmlfbuOp+xHKZYMAaQEgNxWbROES0xtxhBDMbh+jN3afpsRZLnmvcd24jYpYDPgeY0s7g4tDBwwLtM8ao0UhRgrnuWP0UJdfT1/OPVrnTxFNLXDDe5d9q8UYP0QGZAeAboEmLYbX+3kffU0VR7jpeMA5LhLOm6Mr2gFAu96B+K5lvqZ2BOWPo/xRoUrDQvknUGd6q9XHxTllmqZqDR1VZTOowW/9yjRN1RDdoWpHUEAlYKQvsEEmFU5Toe+CT9UvuTLWDMAF4youN/RZ3emFnMhkACDXoCv7GYOFJrfcT0BCcPcbJmKvOKTVIGIwp78DwLPq/RPitkg+B1M1AFQk6nAuQ5YXEs5o+l8RkJ5kWroqlQFRCgm2a5FJa5gDspYP2hBZbhAGdIbayM8tILsYItEw3UudhPLmEI5NXjg2xbTmosS2wAqC0w9a9t+9YK9Dag2SMYIvDnMamJbhMQI7yxnWYa/uBTsE9lbOk5C0CI5f5jxgAQhAAwoA7y9l/kNYQAyI/AQmfwNkA+F+mQAAAABJRU5ErkJggg==';

const logoRssBleu = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1gsPDigBB8TH4wAAAoBJREFUeNqlk11Ik2EUx3/P8z7bdK41XToCNe1jKRKKBUIIRlCXYUIEURcVIX0ggUh33tdF4lV6IUEQBBH0CUFXUQaFpUlbHxTZLMvpcpvOOfe879OFYWgFQefqcDic8///OAf+M0TDsdGSeZMcnM3lahyhl6rqz83SKHzS/c49HW2J3js1ZYyx1aydGsR4anZWFNOwRSKki0yukMejC8TTCiEsDGJ5iOZbOFu8dRBoFkLE1ZxYqPE5lXg8X+k4UPtr3SE/jyOL9N6Y4UPcA0ICYEyIjJXcCASAhEJqtIFX43CwexBh8oTLfbTt3kxzXYDmuhDnBia5PyJBun960ctGFYBtCVImSDq+iBTwNh3g9kiM1p3f6Wgt5/zxEPn+MR68kTirAEkUYGnIT/Cyr57hS/VcPruepob13ByGwxeiJGbzXGyvYkNpDiFzKyBLAGPZ2JbFw0iK4fdTNFS76W8v5ciuImIZHz13xgHo2h9EONkVChQK0Bo8AU4OJLAXE2wLPqW/cw+d+0JEvua5/jRBW1OSltoA/hLF1PwqBSgHR2hsMYvlCxHJ13Gi5xEAp/cGkV4v15+lANhVU7BKAWDIcvVMNY2ViuefBUf6PhHJBHnxYZrtm9bh6DSvJ4MArHFnf4e4Vs3QWLlEZnu5wSGJ9PlJ66WabSewPUVLOWYFRIVUzOBhKDbPjkovQ180wluEsFx0XftIWYkfVVLF5PQMvXfjjCW9y0cFoITleieUK3z4ynv03ASu4k2IwkIAMu5SPmqQRTAH9EVzmHwGjBNbHpAfi7SoivATFNWywI+dnYLsX17PUrCoY8lb3UcBDSCEEBZQ9vO21T9+sQaSQPwH/oTte3BfqX4AAAAASUVORK5CYII=';

const logoRssTransp = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9gLDhUULdQqmHsAAAH3SURBVCjPjZBNS+NQGIWf9947wZqWWisWXAyCzcJaiXT+Qf+G6O/UvVtBMLa1XyLFD3QRpWk1SZM7CzHDwCzmwOGFA4fz8sjp6akDtK21DqAAKyL8Q99hDFwboF2tVitpmnJ0dESSJLy/vxOGIVprjDEopdBaA2Ct/XF/f39orLWlPM+p1+t0u92/JkajEVdXV6RpitYaESHLMoCyERExxiAinJ+fIyK4rsvOzg6e5+F5Hjc3NwRBgIiglALAABZgPp+ztrZGHMekacrt7S3D4ZBOp8PBwQFaa4IgKL7Rvu//LJVKqlwuc3x8jO/71Ot1kiTh+fmZ6XRKo9Fgd3eXIAhYLpfM5/OvYqVSUY7jEMcxYRjieR57e3skScLd3R0vLy+0222yLGM2m7FYLL6KtVpNAcXCeDxmY2ODVqvFw8MDj4+PiAidTofLy0sWiwXKWstqtWK5XJKmKcYYwjDk7OwMAN/3+WYAsLm5+QXHWksURXS7XXzfp9/vc3FxwcfHB71ej1arxfr6Op+fnwA4jgOAyvNc8jyn2WwCsL+/X2B/e3sDwHXdgubW1tYfqq7rqmq1SqPRoNfrMZvNAAo4T09PrFYrJpMJg8GAJEmQk5OTX9vb22UR4dvWWqy15Hle3CzLijyKosiIyPXr6+shUOb/FAHXvwGFg/gbBn5+xQAAAABJRU5ErkJggg==';

/*************** GO! ******************/
// check <link rel="alternate">
var xpathResult=document.evaluate('//link[@rel="alternate" or @rel="chapter" or @rel="section" or @rel="subsection"][contains(@type, "rss") or contains(@type, "atom") or contains(@type, "rdf") or contains(@type, "xml")]', document, null, 0, null);
while(item=xpathResult.iterateNext()) {
	Feeds.push(item);
	control+=", "+item.href;
	}
	
// check direct links to rss feeds not declared as <link>	
if(Feeds.length==0) {
	var xpathResult=document.evaluate('//a[contains(@href,".rss") or contains(@href,"=rss") or contains(@href,".atom") or contains(@href,"=atom") or ((contains(@href,"feed") or contains(@href,"rss")) and (contains(@href,"rdf") or contains(@href,"xml")))]',document,null,0,null);
	while(item=xpathResult.iterateNext()) {
		Feeds.push(item);
		control+=", "+item.href;
		}
	}		

// styling
applyColor();

if (Feeds.length>0) {
	/* CONTEXTUAL STYLES */
	GM_addStyle('#SGSmain.partSubscribed {background:2px 2px url('+logoRssVert+') no-repeat;}');
	GM_addStyle("#SGSmain.partSubscribed:hover {background: transparent;}");
	// create list of link to subscribe to feeds
	var SGSmain=document.createElement('div');
		SGSmain.setAttribute('id','SGSmain');
	document.body.appendChild(SGSmain);
	var SGSfeeds=document.createElement('div');
	SGSmain.appendChild(SGSfeeds);
		var SGSheader=document.createElement('div');
			SGSheader.setAttribute('id','SGSheader');
			SGSheader.innerHTML="powered by <a href=\"http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber\">Smart Subscriber by Sylvain Comte</a> (in <a href=\"https://addons.mozilla.org/en-US/firefox/addon/6424\">Better GReader</a>)";
		SGSfeeds.appendChild(SGSheader);
	for(var f in Feeds) {
		var feed=Feeds[f];	
		UrlList[f]=encodeURIComponent(feed.href);
		var feedTitle=feed.title;
		if(feedTitle=="") feedTitle=feed.textContent;
		FeedLinks[f]=document.createElement("a");
		FeedLinks[f].setAttribute("href","https://www.google.com/reader/view/feed/"+UrlList[f]);
		FeedLinks[f].setAttribute("id",UrlList[f]);
		FeedLinks[f].innerHTML=feedTitle;
		SGSfeeds.appendChild(FeedLinks[f]);
		}
	// verify if feed is already subscribed
	verifyFeed(0);
	addFooter();
	}
	
else {
// create an artificial feed
	if(GM_getValue("diffbot",true)==true) {
		/* CONTEXTUAL STYLES */
		GM_addStyle('#SGSmain.noFeed {background:2px 2px url('+logoRssTransp+') no-repeat;}');
		GM_addStyle("#SGSmain.noFeed:hover {background: transparent;}");
		//create an artificial feed link through diffbot (http://www.diffbot.com)
		var SGSmain=document.createElement('div');
			SGSmain.setAttribute('id','SGSmain');
		document.body.appendChild(SGSmain);
		var SGSfeeds=document.createElement('div');
		SGSmain.appendChild(SGSfeeds);
			var SGSheader=document.createElement('div');
				SGSheader.setAttribute('id','SGSheader');
				SGSheader.innerHTML="powered by <a href=\"http://sylvain.comte.online.fr/AirCarnet/?post/Smart-Google-Subscriber\">Smart Google Subscriber</a>";
				SGSfeeds.appendChild(SGSheader);
	 	createdFeedUrl="http://api.diffbot.com/rss/"+window.location.href;
		createdFeedTitle=document.title;
		var encodedFeedUrl=encodeURIComponent(createdFeedUrl);
		var thisFeed=document.createElement("a");
			thisFeed.setAttribute("href","https://www.google.com/reader/view/feed/"+encodedFeedUrl);
			thisFeed.setAttribute("id",encodedFeedUrl);
			thisFeed.innerHTML=createdFeedTitle;
			SGSfeeds.appendChild(thisFeed);
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.google.com/reader/api/0/subscribed?s=feed%2F"+encodedFeedUrl,
			onload: function(response) {
				if (response.responseText=="true") {
					document.getElementById(encodedFeedUrl).className="abonne";
					subStatus="subscribed";
					}
				else {
					subStatus="noFeed";
					}
				SGSmain.className=subStatus;
				},
			});
		addFooter();
		}
	}
	} // end of Main Window only control

function verifyFeed(n) {
	if(n<FeedLinks.length) {
		GM_xmlhttpRequest({
			method:"GET",
			url:"https://www.google.com/reader/api/0/subscribed?s=feed%2F"+UrlList[n],
			onload: function(resp) {
				if (resp.responseText=="true") {
					if(subStatus=="notSubscribed" || subStatus=="partSubscribed") subStatus="partSubscribed";
					else subStatus="subscribed";
					FeedLinks[n].className="abonne";
					}
				else {
					if(subStatus=="subscribed" ||subStatus=="partSubscribed") subStatus="partSubscribed";
					else subStatus="notSubscribed";
					}
				n=n+1;
				verifyFeed(n);
				SGSmain.className=subStatus;			
				},});}}

function addFooter() {
	/*

	// create a footer zone with options and hide buttons				
	var SGSfooter=document.createElement('div');
		SGSfooter.setAttribute('id','SGSfooter');
		SGSfeeds.appendChild(SGSfooter);
	// create options button to hide and show options zone	
	var SGSoptionsButton=document.createElement('a');
		SGSoptionsButton.addEventListener("click",options,false);
		SGSoptionsButton.innerHTML="options";
		SGSfooter.appendChild(SGSoptionsButton);
	// create button to hide SGS	
	var SGShideButton=document.createElement('a');
		SGShideButton.addEventListener("click",hide,false);
		SGShideButton.innerHTML="hide";
		SGSfooter.appendChild(SGShideButton);	
	// create options zone	
	var SGSoptions=document.createElement('div');
		SGSoptions.setAttribute('id','SGSoptions');
		//activate, deactivate feedbot
		var SGSdbButton=document.createElement('p');
			SGSdbButton.setAttribute('id','SGSdbButton');
			SGSdbButton.addEventListener("click",diffbotOnOff,false);
			if(GM_getValue("diffbot",true)==true) SGSdbButton.innerHTML="<ul><li><a href=\"http://www.diffbot.com/\">diffbot</a> is <strong>On</strong></li></ul>";
			else SGSdbButton.innerHTML="<ul><li><a href=\"http://www.diffbot.com/\">diffbot</a> is <strong>Off</strong></li></ul>";		
		var SGScpActive=document.createElement('div');
			SGScpActive.innerHTML="active colorpalette is <strong>"+GM_getValue("palette",SGSdefaultPalette)+"</strong>.<br/>Select another for next time?";
		var SGScpList=document.createElement('ul');
		for(var cp in SGSColPal) {
			var SGScpButton=document.createElement('li');
				SGScpButton.setAttribute('id',cp);
				if(cp==GM_getValue("palette",SGSdefaultPalette)) SGScpButton.setAttribute('class',cp+" active");
				else SGScpButton.setAttribute('class',cp);
				SGScpButton.innerHTML="<span class=\"back\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"high\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"front\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span class=\"light\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;"+cp;
				SGScpButton.addEventListener("click",setColor,false);
			SGScpList.appendChild(SGScpButton);	
			}
		var SGSinfo=document.createElement('div');
			SGSinfo.setAttribute("id","SGSinfo");
			SGSinfo.setAttribute("class","hidden");
			SGSinfo.innerHTML="nothing to tell you now";
		SGSoptions.appendChild(SGSdbButton);
		SGSoptions.appendChild(SGScpActive);	
		SGSoptions.appendChild(SGScpList);
		SGSoptions.appendChild(SGSinfo);
		SGSfeeds.appendChild(SGSoptions);
	// hide options zone	
	document.getElementById("SGSoptions").setAttribute("class","hidden");
*/
	}

/*	
function diffbotOnOff() {
	if(GM_getValue("diffbot",true)==true) {
		GM_setValue("diffbot",false);
		document.getElementById("SGSdbButton").innerHTML="<ul><li><a href=\"http://www.diffbot.com/\">diffbot</a> is <strong>Off</strong></li></ul>";
		}
	else {
		GM_setValue("diffbot",true);
		document.getElementById("SGSdbButton").innerHTML="<ul><li><a href=\"http://www.diffbot.com/\">diffbot</a> is <strong>On</strong></ul></li>";
		}
	aknowledged();
	}
*/	
function setColor() {
	GM_setValue("palette",this.getAttribute("id"));
	aknowledged();
	}
	
function aknowledged() {
	document.getElementById("SGSinfo").innerHTML="got it. parameter will apply next time";
	document.getElementById("SGSinfo").setAttribute("class","view");
	setTimeout(function() {document.getElementById("SGSinfo").setAttribute("class","hidden");},3000);
	}
	
function options() {
	if(document.getElementById("SGSoptions").getAttribute("class")=="hidden") document.getElementById("SGSoptions").setAttribute("class","");
	else document.getElementById("SGSoptions").setAttribute("class","hidden");
	}
	
function hide() {
	document.getElementById("SGSmain").setAttribute("class","hidden");
	}

/* COMMON STYLES */
// styles	
function applyColor() {
	GM_addStyle('#SGSmain {position:fixed;z-index:32767;top:0;right:0;padding: 0 0 0 20px;min-height:20px;background:2px 2px url('+waitLogo+') no-repeat;}');
	GM_addStyle('#SGSmain.subscribed {background:2px 2px url('+logoRssBleu+') no-repeat;}');
	GM_addStyle("#SGSmain.subscribed:hover {background: transparent;}");
	GM_addStyle('#SGSmain.notSubscribed {background:2px 2px url('+logoRssOrange+') no-repeat;}');
	GM_addStyle("#SGSmain.subscribed:hover {background: transparent;}");	
	GM_addStyle('#SGSmain:hover {padding:0;}');	
	GM_addStyle('#SGSmain > div {display:none;}');
	GM_addStyle('#SGSmain:hover > div {display:block;padding:1px 0;background:'+colPal.back+';-moz-border-radius: 0 0 0 5px;border:solid '+colPal.front+';border-width:0 0 2px 2px;}');
	GM_addStyle('#SGSmain a {display:block;margin:0 0 0 3px;padding:2px 10px 2px 7px;font-family:"Verdana";font-size:12px;line-height:14px;font-weight:normal;text-decoration:none;color:'+colPal.front+';text-align:left;background:'+colPal.back+';border:0;}');
	GM_addStyle('#SGSmain a:hover {background-color:'+colPal.high+';color:'+colPal.front+';}');
	GM_addStyle('#SGSmain a.abonne {background-color:'+colPal.front+';color:'+colPal.light+';}');
	GM_addStyle('#SGSmain a.abonne:hover {padding:0px 10px 0px 6px;background-color:'+colPal.light+';color:'+colPal.front+';border:solid '+colPal.high+'; border-width:2px 0 2px 2px}');
	GM_addStyle('#SGSheader {margin:-2px 0 0 0;font-size:9px;font-family:sans-serif;background-color:'+colPal.front+';color:'+colPal.back+'} #SGSheader a {display:inline!important;font-size:9px;font-family:sans-serif;text-decoration:underline;padding:0;margin:0;background-color:'+colPal.front+';color:'+colPal.back+'}');
	GM_addStyle('#SGSfooter {text-align:right;margin-right:2px;font-size:12px;font-family:sans-serif;color:'+colPal.front+'} #SGSfooter a {display:inline!important;font-size:9px;padding:1px;margin:0 2px;color:'+colPal.back+';background-color:'+colPal.front+'} #SGSfooter a:hover {color:'+colPal.front+';background-color:'+colPal.high+'}');
	GM_addStyle('#SGSoptions {margin:0 2px;font-family:sans-serif;} #SGSoptions, #SGSoptions * {color:'+colPal.front+'} #SGSoptions div {margin:0 2px} #SGSoptions a {display:inline;text-decoration:underline;background-color:none!important;margin:0;padding:0} #SGSoptions p {color:'+colPal.front+';margin:0 2px} #SGSoptions ul {margin:0 0 0 1.25em} #SGSoptions li {margin-bottom:3px} #SGSoptions li span {height:9px} #SGSoptions p:hover, #SGSoptions p:hover a, #SGSoptions li:hover {background-color:'+colPal.high+'} #SGSoptions li.active {font-weight:bold} #SGSoptions li.active td {font-weight:normal} #SGSoptions .back, #SGSoptions .light, #SGSoptions .front, #SGSoptions .high {border:solid thin '+colPal.front+'}');
	GM_addStyle('#SGSinfo {text-align:center!important;background-color:'+colPal.high+';color:'+colPal.front+';-moz-border-radius:2px}');
	for(var col in SGSColPal) {
		GM_addStyle('#'+col+' .front {background-color:'+SGSColPal[col].front+';} #'+col+' .back {background-color:'+SGSColPal[col].back+';} #'+col+' .light {background-color:'+SGSColPal[col].light+';} #'+col+' .high {background-color:'+SGSColPal[col].high+';}');
		}
	GM_addStyle('.hidden {display:none}');
	GM_addStyle('@media print {#SGSmain{display:none}}');
	}
	
function colorPalette(b,h,f,l) {this.back=b;this.high=h;this.front=f;this.light=l;}
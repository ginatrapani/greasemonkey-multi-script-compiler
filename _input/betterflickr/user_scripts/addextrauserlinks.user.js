// ==UserScript==
// @name          Add Extra User Links (Popular, Scout, Fav'ed, etc)
// @description	  Adds useful links to external services to the user sub-menu. Based on Browse by Interesting script by steeev and Scout Link by netomer.
// @version	      0.5
// @author        scragz
// @namespace     http://scragz.com/tech/mozilla/greasemonkey/
// @include       http://www.flickr.com/photos/*
// @include       http://flickr.com/photos/*

// @homepage http://userscripts.org/scripts/show/21605
// @enabledbydefault false

// @versionorlastupdate Version 0.7, Dec 02 2008
// ==/UserScript==

/* begin configuration */
var doShowPopularLink = true;
var doShowScoutLink = true;
var doShowLeechLink = false;
var doShowYourFavsOfTheirs = true;
var doShowTheirFavsOfYours = true;
/* end configuration */

(function() {

/* begin scragz' GM utility functions */
var _gt = function(e) { return document.getElementsByTagName(e); }
var _gi = function(e) { return document.getElementById(e); }
var _ce = function(e) { return document.createElement(e); }
var _ct = function(e) { return document.createTextNode(e); }
var _gc = function(clsName)
{
    var elems = document.getElementsByTagName('*');
    var j = 0;
    var arr = new Array();
    for (var i=0; (elem = elems[i]); i++) {
        if (elem.className == clsName) {
            arr[j] = elem;
            j++;
        }
    }
    return (arr.length > 0) ? arr : false;
}
var xpath = function(query, startingPoint)
{
    if (startingPoint == null) {
        startingPoint = document;
    }
    var retVal = document.evaluate(query, startingPoint, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    return retVal;
}
var xpathFirst = function(query, startingPoint)
{
    var res = xpath(query, startingPoint);

    if (res.snapshotLength == 0) return false;
    else return res.snapshotItem(0);
}
var swapNode = function(node, swap)
{
    var nextSibling = node.nextSibling;
    var parentNode = node.parentNode;
    swap.parentNode.replaceChild(node, swap);
    parentNode.insertBefore(swap, nextSibling);
}
var addGlobalStyle = function(css)
{
    var head, style;
    head = _gt('head')[0];
    if (!head) { return; }
    style = _ce('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
/* end scragz' GM utility functions */

var userId; // fake static
var getUserId = function()
{
    if (userId) return userId;
    var subNav, widget, buddyImage, userIdMatch;
    if (subNav = _gi('SubNav')) {
        buddyImage = subNav.rows[0].cells[0].getElementsByTagName('img')[0];
    } else if (widget = xpathFirst("//div[@class='Widget']")) {
        buddyImage = widget.getElementsByTagName('img')[0];
    }

    userIdMatch = /buddyicons\/(.*)\.jpg/gi.exec(buddyImage.src);

    if (userIdMatch) {
        userId = userIdMatch[1];
        return userId;
    }

    userIdMatch = /images\/buddyicon\.jpg\?(.*)/gi.exec(buddyImage.src);

    if (userIdMatch) {
        userId = userIdMatch[1];
        return userId;
    }

    userId = false;
    return userId;
}

var username; // fake static
var getUsername = function()
{
    if (username) return username;
    if (getIsItMe()) return getMyUsername();
    var header, headerMatch;
    if (header = _gt('h1')) {
        // headerMatch = /\s*<a href="[^"]+">(.*)('s|') photos.*/gi.exec(header[0].innerHTML);
        headerMatch = /\s*(.*)('s|') photos.*/gi.exec(header[0].innerHTML);
        // GM_log(headerMatch);
        if (headerMatch) {
            username = headerMatch[1];
            return username;
        } else {
            username = false;
        }
    } else {
        username = false;
    }
    return username;
}

var myUsername; // fake static
var getMyUsername = function()
{
    if (myUsername) return myUsername;
    var whoIs;
    if (whoIs = _gc('Pale')) {
        myUsername = whoIs[0].innerHTML;
        return myUsername;
    } else {
        myUsername = false;
    }
    return myUsername;
}

var isItMe; // fake static
var getIsItMe = function()
{
    if (isItMe) return isItMe;
    var header;
    if ((header = _gt('h1')) && header[0].innerHTML.match(/\s*Your photos\s*/)) isItMe = true;
    else isItMe = false;

    return isItMe;
}

var subMenu = false; // fake static
var appendSubMenuLink = function(label, href, nosep)
{
    if (!subMenu) subMenu = xpathFirst("//table[@id='SubNav']//p[@class='LinksNewP']//span[@class='LinksNew']");
    if (!subMenu) return false;

    if (typeof href == 'function') {
        link = _ce('a');
        link.href = '';
        link.addEventListener('click', href, true);
        link.innerHTML = label;
    } else {
        link = _ce('a');
        link.href = href;
        link.innerHTML = label;
    }
    
    span = _ce('span');
    span.appendChild(link)
    
    /*
    if (!nosep) {
        img = _ce('img');
        img.src = '/images/subnavi_dots.gif';
        img.alt = '';
        img.width = '1';
        img.height = '11';

        subMenu.appendChild(img);
    }
    */
    
    subMenu.appendChild(span);
}

var appendSubMenuNewline = function()
{
    if (!subMenu) subMenu = xpathFirst("//table[@id='SubNav']//p[@class='LinksNewP']//span[@class='LinksNew']");
    if (!subMenu) return false;

    // subMenu.appendChild(_ce('br'));
}

var go = function()
{
    // the include wildcards match too many pages. we don't want individual photo pages or some other sub pages.
    //var noPhotosRE = /.*\/photos\/([^\/]+)(\/|\/sets\/|\/tags\/|\/archives\/.*|\/favorites\/)/gi;
    //if (!document.location.href.match(noPhotosRE)) return;

    // nevermind the above; any page with the subnav should be fine
    if (!_gi('SubNav')) return;

    if (getUserId()) {
        GM_log("doShowYourFavsOfTheirs: "+doShowYourFavsOfTheirs);
        GM_log("doShowTheirFavsOfYours: "+doShowTheirFavsOfYours);
        GM_log("getIsItMe(): "+getIsItMe());
        GM_log("getMyUsername(): "+getMyUsername());
        GM_log("getUsername(): "+getUsername());
        appendSubMenuNewline();
        //if (doShowPopularLink && !getIsItMe()) appendSubMenuLink('Popular', 'http://interestingby.isaias.com.mx/pm.php?id=' + getUserId() + '&theme=white', true);
        if (doShowPopularLink && !getIsItMe()) appendSubMenuLink('Popular', 'http://fiveprime.org/hivemind/User/' + getUsername() + '/Interesting', true);
        if (doShowScoutLink) appendSubMenuLink('Scout', 'http://flagrantdisregard.com/flickr/scout.php?username=' + getUserId() + '&sort=date&year=0', !(doShowPopularLink && !getIsItMe()));
        if (doShowLeechLink) appendSubMenuLink('Leech', 'http://www.flickrleech.net/nsid/' + getUserId(), !doShowScoutLink);
        if (!getIsItMe() && (doShowYourFavsOfTheirs || doShowTheirFavsOfYours)) appendSubMenuNewline();
        if (doShowYourFavsOfTheirs && !getIsItMe() && getMyUsername() && getUsername()) appendSubMenuLink(getUsername() + '\'s&nbsp;Fav\'d&nbsp;by&nbsp;You', 'http://flagrantdisregard.com/flickr/favorites.php?user1=' + getUserId() + '&user2=' + getMyUsername() + '&button=Go', true);
        if (doShowTheirFavsOfYours && !getIsItMe() && getMyUsername() && getUsername()) appendSubMenuLink('Yours&nbsp;Fav\'d&nbsp;by&nbsp;' + getUsername(), 'http://flagrantdisregard.com/flickr/favorites.php?user1=' + getMyUsername() + '&user2=' + getUserId() + '&button=Go', !doShowYourFavsOfTheirs);
    } else {
        GM_log("Could not determine user's ID.");
    }
}

go();

})();
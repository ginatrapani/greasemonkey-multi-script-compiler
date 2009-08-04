// ==UserScript==
// @name           Hide Spam Count
// @description    Hides Gmail's Spam message count.
// @include        https://mail.google.com/*
// @include        http://mail.google.com/*
// @namespace      http://userscripts.org/scripts/show/22660
// @version        1.21 2009-03-13

// @homepage http://userscripts.org/scripts/show/22660
// @author Arend v. Reinersdorff
// @tab Sidebar
// @versionorlastupdate Jul 5 2009
// ==/UserScript==

/* Written 2008 by Arend v. Reinersdorff, arendvr.com
 * Original version by daniel Rozenberg, http://userscripts.org/scripts/show/2210
 * This script is Public Domain.
 */
GM_addStyle("span#ds_spam b, tr.Alfa2e a[href$='#spam']{visibility:hidden;} span#ds_spam b:before, tr.Alfa2e a[href$='#spam']:before{content:'Spam';visibility:visible;font-weight:400;text-decoration:underline;}");
GM_addStyle("tr.Alfa2e.ol a[href$='#spam']{visibility:visible;} tr.Alfa2e.ol a[href$='#spam']:before{content: normal;}");


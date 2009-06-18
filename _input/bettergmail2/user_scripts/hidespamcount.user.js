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
// ==/UserScript==

/* Written 2008 by Arend v. Reinersdorff, arendvr.com
 * Original version by daniel Rozenberg, http://userscripts.org/scripts/show/2210
 * This script is Public Domain.
 */
GM_addStyle("span#ds_spam b,.pX a[href$='#spam']{visibility:hidden;}span#ds_spam b::before,.pX a[href$='#spam']::before{content:'Spam';visibility:visible;font-weight:400;}");


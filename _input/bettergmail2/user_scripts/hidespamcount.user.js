// ==UserScript==
// @name           Hide Spam Count
// @namespace      http://userscripts.org/scripts/show/22660
// @homepage      http://userscripts.org/scripts/show/22660
// @description    Hides Gmail's Spam message count.
// @include        https://mail.google.com/*
// @include        http://mail.google.com/*

// @author Arend v. Reinersdorff 
// @tab Sidebar
// @version        1.2 2009-03-03

// ==/UserScript==

/* Written 2008 by Arend v. Reinersdorff, arend-von-reinersdorff.com
 * Original version by daniel Rozenberg, http://userscripts.org/scripts/show/2210
 */
GM_addStyle("span#ds_spam b,.pX div[id=':qq'] a.qh{visibility:hidden;}span#ds_spam b::before,.pX div[id=':qq'] a.qh::before{content:'Spam';visibility:visible;font-weight:400;text-decoration:underline;}");

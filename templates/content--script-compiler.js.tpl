


var {$data.shortname}_gmCompiler={$smarty.ldelim}

// getUrlContents adapted from Greasemonkey Compiler
// http://www.letitblog.com/code/python/greasemonkey.py.txt
// used under GPL permission
//
// most everything else below based heavily off of Greasemonkey
// http://greasemonkey.mozdev.org/
// used under GPL permission

getUrlContents: function(aUrl){$smarty.ldelim}
	var	ioService=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	var	scriptableStream=Components
		.classes["@mozilla.org/scriptableinputstream;1"]
		.getService(Components.interfaces.nsIScriptableInputStream);

	var	channel=ioService.newChannel(aUrl, null, null);
	//alert("opening " + aUrl);
	var	input=channel.open();
	scriptableStream.init(input);
	var	str=scriptableStream.read(input.available());
	scriptableStream.close();
	input.close();

	return str;
},

isGreasemonkeyable: function(url) {$smarty.ldelim}
	var scheme=Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService)
		.extractScheme(url);
	return (
		(scheme == "http" || scheme == "https" || scheme == "file") &&
		!/hiddenWindow\.html$/.test(url)
	);
},

contentLoad: function(e) {$smarty.ldelim}
	var unsafeWin=e.target.defaultView;
	if (unsafeWin.wrappedJSObject) unsafeWin=unsafeWin.wrappedJSObject;

	var unsafeLoc=new XPCNativeWrapper(unsafeWin, "location").location;
	var href=new XPCNativeWrapper(unsafeLoc, "href").href;


		if ( !{$data.shortname}_getBooleanPreference("{$data.shortname}.loaded") ) {$smarty.ldelim}
			{$data.shortname}_getEnabledScripts({$data.shortname}_scripts);
		}
		//we're inside the app, iterate through script array
		if ( {$data.shortname}_gmCompiler.isGreasemonkeyable(href) ) {$smarty.ldelim}
			var scriptSrc = null;

			for (var i = 0; i < {$data.shortname}_enabledScripts.length; i++) {$smarty.ldelim}

				if (  {$data.shortname}_isScriptApplicable({$data.shortname}_enabledScripts[i].id, href) )  {$smarty.ldelim}
				    //bettergmail2_gmCompiler.log("inserting: "+'chrome://{$data.shortname}/content/user_scripts/' + {$data.shortname}_enabledScripts[i].filename);
					scriptSrc = {$data.shortname}_gmCompiler.getUrlContents('chrome://{$data.shortname}/content/user_scripts/' + {$data.shortname}_enabledScripts[i].filename);
					{$data.shortname}_gmCompiler.injectScript(scriptSrc, href, unsafeWin);
				}
			}
		}
},

injectScript: function(script, url, unsafeContentWin) {$smarty.ldelim}
	var sandbox, logger, storage, xmlhttpRequester;
	var safeWin=new XPCNativeWrapper(unsafeContentWin);

	sandbox=new Components.utils.Sandbox(safeWin);

	var storage=new {$data.shortname}_ScriptStorage();
	xmlhttpRequester=new {$data.shortname}_xmlhttpRequester(
		unsafeContentWin, window//appSvc.hiddenDOMWindow
	);

	sandbox.window=safeWin;
	sandbox.document=sandbox.window.document;
	sandbox.unsafeWindow=unsafeContentWin;

	// patch missing properties on xpcnw
	sandbox.XPathResult=Components.interfaces.nsIDOMXPathResult;

	// add our own APIs
	sandbox.GM_addStyle=function(css) {$smarty.ldelim} {$data.shortname}_gmCompiler.addStyle(sandbox.document, css) };
	sandbox.GM_setValue={$data.shortname}_gmCompiler.hitch(storage, "setValue");
	sandbox.GM_getValue={$data.shortname}_gmCompiler.hitch(storage, "getValue");
	sandbox.GM_openInTab={$data.shortname}_gmCompiler.hitch(this, "openInTab", unsafeContentWin);
	sandbox.GM_xmlhttpRequest={$data.shortname}_gmCompiler.hitch(
		xmlhttpRequester, "contentStartRequest"
	);
	//unsupported
	sandbox.GM_registerMenuCommand=function(){$smarty.ldelim}};
	sandbox.GM_log=function(){$smarty.ldelim}};

	sandbox.__proto__=sandbox.window;

	try {$smarty.ldelim}
		this.evalInSandbox(
			"(function(){$smarty.ldelim}"+script+"})()",
			url,
			sandbox);
	} catch (e) {$smarty.ldelim}
		var e2=new Error(typeof e=="string" ? e : e.message);
		e2.fileName=script.filename;
		e2.lineNumber=0;
		//bettergmail2_gmCompiler.log(e2);
	}
},

log: function (message)  {$smarty.ldelim}
	var ConsSrv = Components.classes['@mozilla.org/consoleservice;1'].getService(Components.interfaces.nsIConsoleService);
	ConsSrv.logStringMessage(message);
	ConsSrv=null;
},


evalInSandbox: function(code, codebase, sandbox) {$smarty.ldelim}
	if (Components.utils && Components.utils.Sandbox) {$smarty.ldelim}
		// DP beta+
		Components.utils.evalInSandbox(code, sandbox);
	} else if (Components.utils && Components.utils.evalInSandbox) {$smarty.ldelim}
		// DP alphas
		Components.utils.evalInSandbox(code, codebase, sandbox);
	} else if (Sandbox) {$smarty.ldelim}
		// 1.0.x
		evalInSandbox(code, sandbox, codebase);
	} else {$smarty.ldelim}
		throw new Error("Could not create sandbox.");
	}
},

/* New Greasemonkey code 
GM_BrowserUI.openInTab = function(domWindow, url) {$smarty.ldelim}
  if (this.isMyWindow(domWindow)) {$smarty.ldelim}
    document.getElementById("content").addTab(url);
  }
}

Old Compiler code
openInTab: function(unsafeContentWin, url) {$smarty.ldelim}
	var unsafeTop = new XPCNativeWrapper(unsafeContentWin, "top").top;

	for (var i = 0; i < this.browserWindows.length; i++) {$smarty.ldelim}
		this.browserWindows[i].openInTab(unsafeTop, url);
	}
},
*/
openInTab: function(domWindow, url) {$smarty.ldelim}
    document.getElementById("content").addTab(url);
},

hitch: function(obj, meth) {$smarty.ldelim}
	if (!obj[meth]) {$smarty.ldelim}
		throw "method '" + meth + "' does not exist on object '" + obj + "'";
	}

	var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);

	return function() {$smarty.ldelim}
		// make a copy of staticArgs (don't modify it because it gets reused for
		// every invocation).
		var args = staticArgs.concat();

		// add all the new arguments
		for (var i = 0; i < arguments.length; i++) {$smarty.ldelim}
			args.push(arguments[i]);
		}

		// invoke the original function with the correct this obj and the combined
		// list of static and dynamic arguments.
		return obj[meth].apply(obj, args);
	};
},

addStyle:function(doc, css) {$smarty.ldelim}
	var head, style;
	head = doc.getElementsByTagName('head')[0];
	if (!head) {$smarty.ldelim} return; }
	style = doc.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
},

onLoad: function() {$smarty.ldelim}
	//{$data.shortname}_DefaultPreferences(false);
	var	appcontent=window.document.getElementById("appcontent");
	if (appcontent && !appcontent.greased_{$data.shortname}_gmCompiler) {$smarty.ldelim}
		appcontent.greased_{$data.shortname}_gmCompiler=true;
		appcontent.addEventListener("DOMContentLoaded", {$data.shortname}_gmCompiler.contentLoad, false);
	}
},

onUnLoad: function() {$smarty.ldelim}
	//remove now unnecessary listeners
	window.removeEventListener('load', {$data.shortname}_gmCompiler.onLoad, false);
	window.removeEventListener('unload', {$data.shortname}_gmCompiler.onUnLoad, false);
	if (window.document.getElementById("appcontent")) {$smarty.ldelim}
		window.document.getElementById("appcontent").removeEventListener("DOMContentLoaded", {$data.shortname}_gmCompiler.contentLoad, false);
	}
	{$data.shortname}_scripts = null;
},

configure: function() {$smarty.ldelim}
	window.openDialog("chrome://{$data.shortname}/content/options.xul", "{$data.shortname}-options-dialog", "centerscreen,chrome,modal,resizable");
}
                  

}; //object {$data.shortname}_gmCompiler


function {$data.shortname}_ScriptStorage() {$smarty.ldelim}
	this.prefMan=new {$data.shortname}_PrefManager();
}
{$data.shortname}_ScriptStorage.prototype.setValue = function(name, val) {$smarty.ldelim}
	this.prefMan.setValue(name, val);
}
{$data.shortname}_ScriptStorage.prototype.getValue = function(name, defVal) {$smarty.ldelim}
	return this.prefMan.getValue(name, defVal);
}


window.addEventListener('load', {$data.shortname}_gmCompiler.onLoad, false);
window.addEventListener('unload', {$data.shortname}_gmCompiler.onUnLoad, false);
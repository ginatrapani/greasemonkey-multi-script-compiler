var {$data.shortname}_bundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var {$data.shortname}_usLabels = {$data.shortname}_bundle.createBundle("chrome://{$data.shortname}/locale/userscript.properties");


var {$data.shortname}_tabs = {$smarty.ldelim}
{foreach from=$data.tabs key=tabId item=t name=tfe}
	{$t|upper}:{$smarty.foreach.tfe.index} {if $smarty.foreach.tfe.last}  {else},{/if}
{/foreach}

}


function {$data.shortname}_userScript(id, enabled, full_name, author, homepage, filename, description, enabled_by_default, tab, conflicts, versionorlastupdate ) {$smarty.ldelim}
	this.id = id;
	this.enabled = enabled;
	this.full_name = full_name;
	this.author = author;
	this.homepage = homepage;
	this.filename = filename;
	this.description = description;
	this.enabled_by_default = enabled_by_default;
	this.tab = tab;
	this.conflicts = conflicts;
	this.versionorlastupdate = versionorlastupdate;
}


function {$data.shortname}_makeNewUserScript(id, author, homepage, enabled_by_default, tab, versionorlastupdate ) {$smarty.ldelim}
	//alert("making " + id);
	return new {$data.shortname}_userScript(id, 
				 {$data.shortname}_getOrElseSet(id, enabled_by_default), 
				 {$data.shortname}_usLabels.GetStringFromName(id+"_title"), 
				author, 
				homepage, 
				id+".user.js",
				 {$data.shortname}_usLabels.GetStringFromName(id+"_desc"),
				enabled_by_default,
				tab,
				null,
				versionorlastupdate);
}

function {$data.shortname}_makeNewUserScriptWithConflicts(id, author, homepage, enabled_by_default, tab, conflicts, versionorlastupdate) {$smarty.ldelim}
	return new {$data.shortname}_userScript(id, 
				 {$data.shortname}_getOrElseSet(id, enabled_by_default), 
				 {$data.shortname}_usLabels.GetStringFromName(id+"_title"), 
				author, 
				homepage, 
				id+".user.js",
				 {$data.shortname}_usLabels.GetStringFromName(id+"_desc"),
				enabled_by_default,
				tab,
				conflicts,
				versionorlastupdate);
}

function {$data.shortname}_makeNewSkin(id, author, homepage, versionorlastupdate ) {$smarty.ldelim}
	return new {$data.shortname}_userScript(id, 
				 {$data.shortname}_getOrElseSet(id, false), 
				 {$data.shortname}_usLabels.GetStringFromName(id+"_title"), 
				author, 
				homepage, 
				id+".user.js",
				 {$data.shortname}_usLabels.GetStringFromName(id+"_desc"),
				false,
				 {$data.shortname}_tabs.SKINS,
				null,
				versionorlastupdate);
}


function {$data.shortname}_getOrElseSet(script, defaultValue) {$smarty.ldelim}
	var k = "{$data.shortname}.enabled." + script ;
	
	if ( ! {$data.shortname}_isPreferenceSet(k) ) {$smarty.ldelim}
		 {$data.shortname}_setBooleanPreference(k,  defaultValue);
	} 		
	return {$data.shortname}_getBooleanPreference(k);

}

var {$data.shortname}_scripts = new Array(

{foreach from=$scripts key=scriptId item=s name=sfe}
	{if $s.conflict eq '' }
		{if $s.tab neq "Skins"}
		new {$data.shortname}_makeNewUserScript('{$s.id}', 
					'{$s.author}', 
					'{$s.homepage}', 
					{$s.enabledbydefault},
					 {$data.shortname}_tabs.{$s.tab|upper},
					'{$s.versionorlastupdate}'){if $smarty.foreach.sfe.last}  {else},{/if}
		{else}
		new {$data.shortname}_makeNewSkin('{$s.id}', 
					'{$s.author}', 
					'{$s.homepage}',
					'{$s.versionorlastupdate}'){if $smarty.foreach.sfe.last}  {else},{/if}
			{assign var='has_skins' value='yes'}
		{/if}
	{else}
		new {$data.shortname}_makeNewUserScriptWithConflicts('{$s.id}', 
					'{$s.author}', 
					'{$s.homepage}', 
					{$s.enabledbydefault},
					 {$data.shortname}_tabs.{$s.tab|upper},
					 new Array({$s.conflict}),
					'{$s.versionorlastupdate}' ){if $smarty.foreach.sfe.last}  {else},{/if}
	{/if}	 
				 
{/foreach}
	{if $has_skins eq "yes"}
			,
			new {$data.shortname}_userScript('none', 
						{$data.shortname}_getOrElseSet('none', true), 
						{$data.shortname}_usLabels.GetStringFromName("none_title"),  
						'', 
						'', 
						'',
						'',
						true,
						{$data.shortname}_tabs.SKINS,
						'')
	{/if}


);


var {$data.shortname}_enabledScripts = null;

function {$data.shortname}_getEnabledScripts( {$data.shortname}_scripts) {$smarty.ldelim}
	 {$data.shortname}_enabledScripts = new Array();
	for (var i = 0; i < {$data.shortname}_scripts.length; i++) {$smarty.ldelim}
		if ( {$data.shortname}_getBooleanPreference("{$data.shortname}.enabled."+ {$data.shortname}_scripts[i].id) ) {$smarty.ldelim}
			 {$data.shortname}_enabledScripts.push( {$data.shortname}_scripts[i]);
			//alert( {$data.shortname}_scripts[i].id + "enabled");
		}
	}

	 {$data.shortname}_setBooleanPreference("{$data.shortname}.loaded",  true);
}

 {$data.shortname}_getEnabledScripts( {$data.shortname}_scripts);



function {$data.shortname}_isScriptApplicable(script, href) {$smarty.ldelim}
	var result = false;
	switch (script) {$smarty.ldelim}
	{foreach from=$scripts key=scriptId item=s name=sfe}
		case '{$s.id}':  result = {$s.include} && {$s.exclude}; break;
	{/foreach}
	}	
	return result;
}


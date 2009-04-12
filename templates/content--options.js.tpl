	
// Initializes the options
function {$data.shortname}_initializeOptions() {$smarty.ldelim}
    var pageDocument     = document;
    
    {foreach from=$data.tabs key=tabId item=t name=tfe}
    {if $t eq "Skins"}
	var skinsRgroup       = pageDocument.getElementById("{$data.shortname}-gbox-skins-radiogroup");
	{else}
    var {$t|lower}Gbox       = pageDocument.getElementById("{$data.shortname}-gbox-{$t|lower}");
    {/if}
	{/foreach}

    var cbItem;
    var radioItem;
    
    var textItem;
    
   	var script;
   	var enabled = false;

	var dependents = '';
    	
    var totalScripts = {$data.shortname}_scripts.length;
    for (var i = 0; i < totalScripts; i++) {$smarty.ldelim}
		   	script = {$data.shortname}_scripts[i].id;
		   	enabled = {$data.shortname}_getBooleanPreference('{$data.shortname}.enabled.'+script, true);
		   	cbItem = pageDocument.createElement("checkbox");
			cbItem.setAttribute("id", script);
			cbItem.setAttribute("label", {$data.shortname}_scripts[i].full_name );
			cbItem.setAttribute("checked", enabled);
			if ({$data.shortname}_scripts[i].conflicts ) {$smarty.ldelim}
				dependents = 'new Array(';
				for(var j = 0; j < {$data.shortname}_scripts[i].conflicts.length; j++) {$smarty.ldelim}
					dependents += "'"+{$data.shortname}_scripts[i].conflicts[j]+"'";
					if ( j < ({$data.shortname}_scripts[i].conflicts.length-1) ) {$smarty.ldelim}
						dependents += ", ";
					} else {$smarty.ldelim}
						dependents += ")";
					}
				}
				cbItem.setAttribute("oncommand", "uncheckDependents(this.checked, "+dependents+" );");
			}
			
    {foreach from=$data.tabs key=tabId item=t name=tfe}
    
    {if $t neq "Skins"}
    
	 {if $smarty.foreach.tfe.first}  {else}else {/if}if ({$data.shortname}_scripts[i].tab == {$data.shortname}_tabs.{$t|upper} ) 
			{$t|lower}Gbox.appendChild(cbItem);
	{else}
			else if ( {$data.shortname}_scripts[i].tab == {$data.shortname}_tabs.SKINS ) {$smarty.ldelim}
				radioItem = pageDocument.createElement("radio");	   								
				radioItem.setAttribute("id", script);
				({$data.shortname}_scripts[i].description == "")? (textItem = "") : (textItem = ": " + {$data.shortname}_scripts[i].description)
				radioItem.setAttribute("label", {$data.shortname}_scripts[i].full_name + textItem );
				radioItem.setAttribute("selected", enabled);
				skinsRgroup.appendChild(radioItem);
			}
	{/if}
	{/foreach}			

	}

	{$data.shortname}_describescripts();

}


function {$data.shortname}_saveOptions() {$smarty.ldelim}

    {foreach from=$data.tabs key=tabId item=t name=tfe}
    {if $t neq "Skins"}
   	{$data.shortname}_savePrefs( document.getElementById("{$data.shortname}-gbox-{$t|lower}").childNodes, "checked");
   	{else}
   	{$data.shortname}_savePrefs( document.getElementById("{$data.shortname}-gbox-skins-radiogroup").childNodes, "selected");
   	{/if}
	{/foreach}

	{$data.shortname}_setBooleanPreference("{$data.shortname}.loaded", false); 
}


function {$data.shortname}_savePrefs(cbArray, trueAttrib) {$smarty.ldelim}
    for(var i = 0; i < cbArray.length; i++) {$smarty.ldelim}
    	if (cbArray[i]) {$smarty.ldelim}
    		if (cbArray[i].getAttribute("id")) {$smarty.ldelim}
    			if (cbArray[i].getAttribute(trueAttrib) == 'true') {$smarty.ldelim}
					{$data.shortname}_setBooleanPreference("{$data.shortname}.enabled."+cbArray[i].getAttribute("id"), true);
	    		} else {$smarty.ldelim}
	    			{$data.shortname}_setBooleanPreference("{$data.shortname}.enabled."+cbArray[i].getAttribute("id"), false);
	    		}
    		}
    	}
    }
}

function {$data.shortname}_describescripts() {$smarty.ldelim}
	document.getElementById("script-listing").contentDocument.write('<html><head><style type="text/css">body {$smarty.ldelim} font-family:arial; font-size:9pt; background-color:white; } ul {$smarty.ldelim} margin:0; padding:0 } li {$smarty.ldelim} margin:0 0 10px 0} a {$smarty.ldelim} color:blue; border-bottom:solid blue 1px; } </style></head><body id="script-listing-body"><ul>');
	var totalScripts = {$data.shortname}_scripts.length;
    for (var i = 0; i < totalScripts; i++) {$smarty.ldelim}
    	if ( {$data.shortname}_scripts[i].homepage != '') {$smarty.ldelim}
			document.getElementById("script-listing").contentDocument.write('<li><b><a href="'+ {$data.shortname}_scripts[i].homepage+'" onclick="javascript:window.open(\''+ {$data.shortname}_scripts[i].homepage+'\');return false;">'+ {$data.shortname}_scripts[i].full_name +'</a></b><br />'+{$data.shortname}_scripts[i].description+'<br />'+{$data.shortname}_usLabels.GetStringFromName("script_by")+' '+{$data.shortname}_scripts[i].author+'</li>');
		}
	}
	document.getElementById("script-listing").contentDocument.write("</ul></body></html>");
	document.getElementById("script-listing").contentDocument.close();
	return true;
}


function uncheckDependents(checked, dep) {$smarty.ldelim}
    for(var i = 0; i < dep.length; i++) {$smarty.ldelim}
		if (checked) {$smarty.ldelim}
			document.getElementById(dep[i]).checked=false;
		}
	}
}

function {$data.shortname}_initAdvancedPrefs() {$smarty.ldelim}
	//document.getElementById("pref-your_domain").value = {$data.shortname}_getStringPreference("{$data.shortname}.pref.your_domain");
	//document.getElementById("pref-attach_trigger").value = {$data.shortname}_getStringPreference("{$data.shortname}.pref.attach_trigger");
}

function {$data.shortname}_saveAdvancedPrefs() {$smarty.ldelim}
	//{$data.shortname}_setStringPreference("{$data.shortname}.pref.your_domain", document.getElementById("pref-your_domain").value);
	//{$data.shortname}_setStringPreference("{$data.shortname}.pref.attach_trigger", document.getElementById("pref-attach_trigger").value);
}
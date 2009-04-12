<?xml version="1.0"?>
<?xml-stylesheet href="chrome://global/skin/" type="text/css"?>
<?xml-stylesheet href="chrome://{$data.shortname}/skin/classic/options.css" type="text/css"?>
<!DOCTYPE page SYSTEM "chrome://{$data.shortname}/locale/options.dtd">


<dialog buttons="accept, cancel" id="{$data.shortname}-options-dialog" ondialogaccept="{$data.shortname}_saveOptions()" onload="{$data.shortname}_initializeOptions(true)" title="&{$data.shortname}.options.title;" 
xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
<script type="application/x-javascript" src="chrome://{$data.shortname}/content/common/preferences.js"/> 
<script type="application/x-javascript" src="chrome://{$data.shortname}/content/common/defaults.js"/> 
<script type="application/x-javascript" src="chrome://{$data.shortname}/content/script-compiler.js"/>
<script type="application/x-javascript" src="chrome://{$data.shortname}/content/options.js"/>



<tabbox id="tablist" xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">
<tabs>
{foreach from=$data.tabs key=tabId item=t name=tfe}
<tab label="&{$data.shortname}.tab.label.{$t|lower};" />
{/foreach}

<tab label="&{$data.shortname}.tab.label.help;" />

</tabs>
<tabpanels>
{foreach from=$data.tabs key=tabId item=t name=tfe}
<tabpanel id="tb_{$t|lower}" >
		<groupbox id="{$data.shortname}-gbox-{$t|lower}" flex="1">
{if $t eq "Skins"}<radiogroup id="{$data.shortname}-gbox-skins-radiogroup"></radiogroup>{/if}
		</groupbox>
</tabpanel>
{/foreach}


<tabpanel id="tb_help" >
	<iframe flex="1" id="script-listing" src="chrome://{$data.shortname}/content/help.html" />
</tabpanel>

</tabpanels>

{if $data.helpMsg neq ''}<vbox id="vb_reminder"><hbox><caption label="&{$data.shortname}.label.refreshreminder;" /></hbox></vbox>{/if}


</tabbox>

</dialog>
<!ENTITY {$data.shortname}.options.title "{$data.name}">
<!ENTITY {$data.shortname}.label.moreinfo "Click on the script homepage for more info:" >
<!ENTITY {$data.shortname}.label.options "Enable {$data.name} features:" >

{foreach from=$data.tabs key=tabId item=t name=tfe}
<!ENTITY {$data.shortname}.tab.label.{$t|lower} "{$t}" >
{/foreach}

<!ENTITY {$data.shortname}.tab.label.help "Help" >



{if $data.helpMsg neq ''}
<!ENTITY {$data.shortname}.label.refreshreminder "{$data.helpMsg}" >
{/if}

<?xml version="1.0"?>
<RDF:RDF xmlns:em="http://www.mozilla.org/2004/em-rdf#"
         xmlns:NC="http://home.netscape.com/NC-rdf#"
         xmlns:RDF="http://www.w3.org/1999/02/22-rdf-syntax-ns#">

  <RDF:Description RDF:about="urn:mozilla:install-manifest"
                   em:name="{$data.name}"
                   em:id="{$data.guid}"
                   em:version="{$data.version}"
                   em:description="{$data.description}"
                   em:creator="{$data.creator}"
                   em:optionsURL="chrome://{$data.shortname}/content/options.xul"
                   {if $data.icon} em:iconURL="chrome://{$data.shortname}/skin/classic/icon.png" 
                   {/if}
                   {if $data.updateURL} em:updateURL="{$data.updateURL}" 
                   {/if}
                   em:homepageURL="{$data.homepage}">


{foreach from=$scripts key=scriptId item=s name=sfe}
    <em:contributor>{$s.name} by {$s.author} ({$s.homepage})</em:contributor>
{/foreach}


    <em:contributor>Greasemonkey Multi-Script Compiler by Gina Trapani (http://www.ginatrapani.org/)</em:contributor>

    <em:targetApplication RDF:resource="rdf:#$djS7s"/>
 
  </RDF:Description>
   <RDF:Description RDF:about="rdf:#$djS7s"
                   em:id="{$smarty.ldelim}ec8030f7-c20a-464f-9b0e-13a3a9e97384}"
                   em:minVersion="{$data.minVersion}"
                   em:maxVersion="{$data.maxVersion}" />

</RDF:RDF>
<?php
$jar=array();
$xpi=array();


$jar['content/script-compiler-overlay.xul']=$smarty->fetch('content--script-compiler-overlay.xul.tpl');
$jar['content/script-compiler.js']=$smarty->fetch('content--script-compiler.js.tpl');
$jar['content/prefman.js']=$smarty->fetch('content--prefman.js.tpl');
$jar['content/xmlhttprequester.js']=$smarty->fetch('content--xmlhttprequester.js.tpl');
$jar['content/common/defaults.js']=$smarty->fetch('content--common--defaults.js.tpl');
$jar['content/common/preferences.js']=$smarty->fetch('content--common--preferences.js.tpl');
$jar['content/help.html']="";
$jar['content/options.js']=$smarty->fetch('content--options.js.tpl');
$jar['content/options.xul']=$smarty->fetch('content--options.xul.tpl');
$jar['locale/en-US/options.dtd']=$smarty->fetch('locale--en-US--options.dtd.tpl');
$jar['locale/en-US/userscript.properties']=$smarty->fetch('locale--en-US--userscript.properties.tpl');
$jar['skin/classic/options.css']=$smarty->fetch('skin--classic--options.css.tpl');
if ( $data['icon'] ) $jar['skin/classic/icon.png']=$iconcontents;
foreach ($GMSC['scriptfilenames'] as $script) {
	$jar['content/user_scripts/'.$script]=$GMSC['scripts'][$script];
}

unset($GMSC['scripts']); //for efficiency

$zipjar=new CreateZip();
foreach ($jar as $k=>$v) {
    $zipjar->addFile($v, $k);
}


$xpi['chrome/'.$data['shortname'].".jar"]=$zipjar->getZippedfile();
$xpi['chrome.manifest']=$smarty->fetch('chrome.manifest-jar.tpl');
$xpi['install.rdf']=$smarty->fetch('install.rdf.tpl');


$zipxpi=new CreateZip();
foreach ($xpi as $k=>$v) {
    $zipxpi->addFile($v, $data['shortname']."/".$k);
}

$myxpi=fopen($data['shortname'].'_'.$data['version'].'.xpi', 'wb');
fwrite($myxpi, $zipxpi->getZippedfile() );
fclose($myxpi);
?>
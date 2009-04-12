<?php
$xpi=array();

$xpi['content/script-compiler-overlay.xul']=$smarty->fetch('content--script-compiler-overlay.xul.tpl');
$xpi['content/script-compiler.js']=$smarty->fetch('content--script-compiler.js.tpl');
$xpi['content/prefman.js']=$smarty->fetch('content--prefman.js.tpl');
$xpi['content/xmlhttprequester.js']=$smarty->fetch('content--xmlhttprequester.js.tpl');
$xpi['content/common/defaults.js']=$smarty->fetch('content--common--defaults.js.tpl');
$xpi['content/common/preferences.js']=$smarty->fetch('content--common--preferences.js.tpl');
$xpi['content/help.html']="";
$xpi['content/options.js']=$smarty->fetch('content--options.js.tpl');
$xpi['content/options.xul']=$smarty->fetch('content--options.xul.tpl');
$xpi['locale/en-US/options.dtd']=$smarty->fetch('locale--en-US--options.dtd.tpl');
$xpi['locale/en-US/userscript.properties']=$smarty->fetch('locale--en-US--userscript.properties.tpl');
$xpi['skin/classic/options.css']=$smarty->fetch('skin--classic--options.css.tpl');
if ( $data['icon'] ) $xpi['skin/classic/icon.png']=$iconcontents;
foreach ($GMSC['scriptfilenames'] as $script) {
	$xpi['content/user_scripts/'.$script]=$GMSC['scripts'][$script];
}

unset($GMSC['scripts']); //for efficiency

$xpi['chrome.manifest']=$smarty->fetch('chrome.manifest-nojar.tpl');
$xpi['install.rdf']=$smarty->fetch('install.rdf.tpl');


$zip=new CreateZip();
foreach ($xpi as $k=>$v) {
    $zip->addFile($v, $data['shortname']."/".$k);
}

$myxpi=fopen($data['shortname'].'_'.$data['version'].'.xpi', 'wb');
fwrite($myxpi, $zip->getZippedfile() );
fclose($myxpi);
?>
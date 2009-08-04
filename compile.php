<?php

// Greasemonkey Multi-Script Compiler
// by Gina Trapani (http://ginatrapani.org), based heavily on code from Anthony Lieuallen located at:
// http://arantius.com/misc/greasemonkey/script-compiler 
//
// From Anthony Lieuallen:
// This compiler is currently in beta status.
// The code is quick and dirty, but it works as far as I know.
// Feedback welcome:
//  http://www.arantius.com/contact.php
//
// Released under GPL license.
//
date_default_timezone_set('America/Los_Angeles');

require('Smarty.class.php');

$input_dir = $argv[1];
$short_name = $argv[2];
$version = $argv[3];
$package_mode = $argv[4];
$templates_compile_dir = $argv[5];

//debug
echo "Compiling the files located in ".$input_dir."/".$short_name.".\n";
echo "Attempting to package version ".$version." in ".$package_mode." mode.\n\n";


include_once($input_dir."/".$short_name."/config.inc.php");
include_once("inc/functions.inc.php");


error_reporting(E_ALL);

//undo magic quotes if necessary
if (get_magic_quotes_gpc()) {
	$GMSC=array_map('stripslashes', $GMSC);
}

//build data .. start from include
$data=array(
	'guid'        => genGUID(),
	'name'        => 'Compiled User Scripts',
	'shortname' => '',
	'description' => '',
	'creator'     => 'Anonymous',
	'homepage'    => '',
	'version'     => $version,
	'minVersion'  => '1.5',
	'maxVersion'  => '3.0.*',
	'updateURL' => '',
	'icon' => false,
	'tabs' => array("General"),
	'helpMsg' => '',
);
foreach (array(
	'guid', 'name', 'description', 'creator', 'homepage', 'minVersion', 'maxVersion', 'updateURL', 'helpMsg'
) as $k) {
	if (!empty($GMSC[$k])) $data[$k]=$GMSC[$k];
}

echo "Extension Name: ".$data['name']."\n";
echo "Extension Description: ".$data['description']."\n\n";

//load user scripts into data
$workingdir = $input_dir."/".$short_name."/";  
$GMSC['workingdir']=$workingdir;

if ( file_exists($GMSC['workingdir'].'icon.png')) {
	$data['icon']=true;
}

$dirhandle=opendir($GMSC['workingdir'] . 'user_scripts');
 while (false !== ($file = readdir($dirhandle))) {
	if ($file != "." && $file != "..") {
		$fhandle = fopen($GMSC['workingdir'] . 'user_scripts/'.$file, "r");
		$contents = fread($fhandle, filesize($GMSC['workingdir'] . 'user_scripts/'.$file));
		fclose($fhandle);

		$GMSC["scripts"][$file] = $contents;
		$GMSC['scriptfilenames'][]=$file;
		
//		print $contents;
	}
}
closedir($dirhandle);

$scripts=array();
echo "Parsing user scripts...\n";
//continue build data .. grok values from script
foreach ($GMSC['scriptfilenames'] as $script) {

	$m=array();
	$start=strpos($GMSC['scripts'][$script], '==UserScript==');
	$end=strpos($GMSC['scripts'][$script], '==/UserScript==');
	if ($start>0 && $end>$start) {
		$scriptData=substr($GMSC['scripts'][$script], $start+15, $end-$start-15);
		$scriptData=preg_split('/[\n\r]+/', $scriptData);

		
		$scripts[$script] = array( 'name'=>'', 'description'=>'', 'include'=>array(), 'exclude'=>array(), 'conflict'=>array(), 'id'=>'', 'enabledbydefault'=>'');
		
		$scripts[$script]['id']=substr($script, 0, strlen($script)-strlen(".user.js"));
		
		echo "Starting ".$script."...\n"; 

		foreach ($scriptData as $line) {
			$m=array();
			if (preg_match('/@name\b(.*)/', $line, $m)) {
				$scripts[$script]['name']=trim($m[1]);
			}
			if (preg_match('/@author\b(.*)/', $line, $m)) {
				$scripts[$script]['author']=trim($m[1]);
			}
			if (preg_match('/@homepage\b(.*)/', $line, $m)) {
				$scripts[$script]['homepage']=trim($m[1]);
			}
			if (preg_match('/@enabledbydefault\b(.*)/', $line, $m)) {
				$scripts[$script]['enabledbydefault']=trim($m[1]);
			}
			if (preg_match('/@versionorlastupdate\b(.*)/', $line, $m)) {
				$scripts[$script]['versionorlastupdate']=trim($m[1]);
			}
			if (preg_match('/@description\b(.*)/', $line, $m)) {
				$scripts[$script]['description']=trim($m[1]);
			}
			if (preg_match('/@include\b(.*)/', $line, $m)) {
				$scripts[$script]['include'][]=trim($m[1]);
			}
			if (preg_match('/@exclude\b(.*)/', $line, $m)) {
				$scripts[$script]['exclude'][]=trim($m[1]);
			}
			
			if (preg_match('/@conflict\b(.*)/', $line, $m)) {
				$scripts[$script]['conflict'][]=trim($m[1]);
			}
			if (preg_match('/@tab\b(.*)/', $line, $m)) {
				$data["tabs"][]=trim($m[1]);
				$scripts[$script]['tab']=trim($m[1]);
			}
			

		}
		
		// set conflicts array
		if (empty($scripts[$script]['conflict'])) {
			$scripts[$script]['conflict']='';
		} else {
			$scripts[$script]['conflict']="'".implode($scripts[$script]['conflict'], "','")."'";
			echo "CONFLICTING SCRIPT(S):".$scripts[$script]['conflict']."\n";
		}


 		//set enabledbydefault
 		if ( $scripts[$script]['enabledbydefault']=='' ) $scripts[$script]['enabledbydefault']='false';
 		
 		echo "ENABLED BY DEFAULT:".$scripts[$script]['enabledbydefault']."\n";

		//set default tab
		if (empty($scripts[$script]['tab'])) $scripts[$script]['tab']="General";
 		echo "LOCATED ON TAB:".$scripts[$script]['tab']."\n";

		//set version or last update
		if (empty($scripts[$script]['versionorlastupdate'])) $scripts[$script]['versionorlastupdate']="";
  		echo "LAST UPDATE:".$scripts[$script]['versionorlastupdate']."\n";
 		
		 //convert includes/excludes
		$scripts[$script]['include']=array_map('convertToRegExp', $scripts[$script]['include']);
		$scripts[$script]['exclude']=array_map('convertToRegExp', $scripts[$script]['exclude']);
	
		//js-ify includes/excludes
		if (empty($scripts[$script]['include'])) {
			$scripts[$script]['include']='true';
		} else {
			$scripts[$script]['include']='( /'.implode('/.test(href) || /', $scripts[$script]['include']).'/.test(href) )';
		}
		if (empty($scripts[$script]['exclude'])) {
			$scripts[$script]['exclude']='true';
		} else {
			$scripts[$script]['exclude']='!( /'.implode('/.test(href) || /', $scripts[$script]['exclude']).'/.test(href) )';
		}
		
  		echo "INCLUDE:".$scripts[$script]['include']."\n";
  		//echo $script ." EXCLUDE:".$scripts[$script]['exclude']."\n";
		echo "Completed ".$script.".\n";
	
	}
	echo "\n";
}

echo "User script parsing complete.\n\n";

//make extension short name from name
$data['shortname']=strtolower(substr(
	preg_replace('/[^a-zA-Z0-9]/', '', $data['name']),
	0, 32
));

//set tabs in $data array
$data["tabs"] = array_unique($data["tabs"]);
echo "The complete ".$data['name']." extension tab list is: ".implode($data["tabs"], ", ")."\n";
		


$smarty = new Smarty();

$smarty->template_dir = 'templates';
$smarty->compile_dir = $templates_compile_dir;
$smarty->caching=false;

if ($package_mode=="amo") {
	// Mozilla Add-ons mode is just like dist mode except without the updateURL
	$package_mode="dist";
	$data["updateURL"]="";
} 

$smarty->assign('data', $data);
$smarty->assign('scripts', $scripts);

if ( $data['icon']) {
	$icon = $GMSC['workingdir'].'icon.png';
	$handle = fopen($icon, "rb");
	$iconcontents = fread($handle, filesize($icon));
	fclose($handle);
}

include_once("inc/setup-". $package_mode.".inc.php");

?>

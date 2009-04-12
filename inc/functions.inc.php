<?php
/**
 * Class to dynamically create a zip file (archive)
 *
 * @author Rochak Chauhan
 * http://www.phpclasses.org/browse/package/2322.html
 */
class CreateZip  {
    var $compressedData = array();
    var $centralDirectory = array();
    var $endOfCentralDirectory = "\x50\x4b\x05\x06\x00\x00\x00\x00";
    var $oldOffset = 0;
    function addDirectory($directoryName){$directoryName=str_replace("\\","/",$directoryName);$feedArrayRow="\x50\x4b\x03\x04";$feedArrayRow.="\x0a\x00";$feedArrayRow.="\x00\x00";$feedArrayRow.="\x00\x00";$feedArrayRow.="\x00\x00\x00\x00";$feedArrayRow.=pack("V",0);$feedArrayRow.=pack("V",0);$feedArrayRow.=pack("V",0);$feedArrayRow.=pack("v",strlen($directoryName));$feedArrayRow.=pack("v",0);$feedArrayRow.=$directoryName;$feedArrayRow.=pack("V",0);$feedArrayRow.=pack("V",0);$feedArrayRow.=pack("V",0);$this->compressedData[]=$feedArrayRow;$newOffset=strlen(implode("",$this->compressedData));$addCentralRecord="\x50\x4b\x01\x02";$addCentralRecord.="\x00\x00";$addCentralRecord.="\x0a\x00";$addCentralRecord.="\x00\x00";$addCentralRecord.="\x00\x00";$addCentralRecord.="\x00\x00\x00\x00";$addCentralRecord.=pack("V",0);$addCentralRecord.=pack("V",0);$addCentralRecord.=pack("V",0);$addCentralRecord.=pack("v",strlen($directoryName));$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$ext="\x00\x00\x10\x00";$ext="\xff\xff\xff\xff";$addCentralRecord.=pack("V",16);$addCentralRecord.=pack("V",$this->oldOffset);$this->oldOffset=$newOffset;$addCentralRecord.=$directoryName;$this->centralDirectory[]=$addCentralRecord;}
    function addFile($data,$directoryName){$directoryName=str_replace("\\","/",$directoryName);$feedArrayRow="\x50\x4b\x03\x04";$feedArrayRow.="\x14\x00";$feedArrayRow.="\x00\x00";$feedArrayRow.="\x08\x00";$feedArrayRow.="\x00\x00\x00\x00";$uncompressedLength=strlen($data);$compression=crc32($data);$gzCompressedData=gzcompress($data);$gzCompressedData=substr(substr($gzCompressedData,0,strlen($gzCompressedData)-4),2);$compressedLength=strlen($gzCompressedData);$feedArrayRow.=pack("V",$compression);$feedArrayRow.=pack("V",$compressedLength);$feedArrayRow.=pack("V",$uncompressedLength);$feedArrayRow.=pack("v",strlen($directoryName));$feedArrayRow.=pack("v",0);$feedArrayRow.=$directoryName;$feedArrayRow.=$gzCompressedData;$feedArrayRow.=pack("V",$compression);$feedArrayRow.=pack("V",$compressedLength);$feedArrayRow.=pack("V",$uncompressedLength);$this->compressedData[]=$feedArrayRow;$newOffset=strlen(implode("",$this->compressedData));$addCentralRecord="\x50\x4b\x01\x02";$addCentralRecord.="\x00\x00";$addCentralRecord.="\x14\x00";$addCentralRecord.="\x00\x00";$addCentralRecord.="\x08\x00";$addCentralRecord.="\x00\x00\x00\x00";$addCentralRecord.=pack("V",$compression);$addCentralRecord.=pack("V",$compressedLength);$addCentralRecord.=pack("V",$uncompressedLength);$addCentralRecord.=pack("v",strlen($directoryName));$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("v",0);$addCentralRecord.=pack("V",32);$addCentralRecord.=pack("V",$this->oldOffset);$this->oldOffset=$newOffset;$addCentralRecord.=$directoryName;$this->centralDirectory[]=$addCentralRecord;}
    function getZippedfile(){$data=implode("",$this->compressedData);$controlDirectory=implode("",$this->centralDirectory);return$data.$controlDirectory.$this->endOfCentralDirectory.pack("v",sizeof($this->centralDirectory)).pack("v",sizeof($this->centralDirectory)).pack("V",strlen($controlDirectory)).pack("V",strlen($data))."\x00\x00";}
    function forceDownload($archiveName){$headerInfo='';if(ini_get('zlib.output_compression')){ini_set('zlib.output_compression','Off');}$data=$this->getZippedFile();header("Pragma:public");header("Expires:0");header("Cache-Control:must-revalidate,post-check=0,pre-check=0");header("Cache-Control:private",false);header("Content-Type:application/zip");header("Content-Disposition:attachment;filename={$archiveName}.xpi;");header("Content-Transfer-Encoding:binary");header("Content-Length:".strlen($data));print("$data");exit;}
}

// from http://jasonfarrell.com/misc/guid.php
// Generates a random GUID per http://www.ietf.org/rfc/rfc4122.txt
// e.g. output: 372472a2-d557-4630-bc7d-bae54c934da1
// word*2-, word-, (w)ord-, (w)ord-, word*3
function genGUID(){$guidstr="";for($i=1;$i<=16;$i++){$b=(int)rand(0,0xff);if($i==7){$b&=0x0f;$b|=0x40;}if($i==9){$b&=0x3f;$b|=0x80;}$guidstr.=sprintf("%02s",base_convert($b,10,16));if($i==4||$i==6||$i==8||$i==10){$guidstr.='-';}}return$guidstr;}

function insertValues(&$str, $data) {
    foreach ($data as $k=>$v) {
        $str=str_replace(
            '$'.$k, $v, $str
        );
    }
    return $str;
}

function convertToRegExp($str) {
    $str=preg_replace('/([][\\/.?^$+{\|)(])/', '\\\\\1', $str);
    $str=str_replace('*', '.*', $str);
    return $str;
}


function printNestedArray($a) {
    echo "+\n";
    foreach ($a as $key => $value) {
      echo $key."\n";
      if (is_array($value)) {
        printNestedArray($value);
      } else {
        echo $value."\n";
      }
    }
    echo "-\n";
}
?>
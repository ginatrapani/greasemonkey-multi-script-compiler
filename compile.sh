#! /bin/bash

# BEGIN DEFAULT CONFIGURATION, EDIT VARS BELOW
TPL_DIR="_templates_c" 
OUTPUT_DIR="_output"
INPUT_DIR="_input"
DEFAULT_PACKAGE_MODE="dist"
# END DEFAULT CONFIGURATION

usage()
{
	curcmd=`basename $0`
    sed -e 's/^    //' <<EndUsage 
    Usage: $curcmd extension_short_name version_number [package_mode]
    Example: 
      $curcmd bettergmail2 1.8 dist
    Short name:
      Extension "short name" is also the name of the folder where its files live, 
      all lower case, without spaces (ie, bettergmail2)
    Version number:
      Version number (ie, 1.0 or 2.3)
    Package mode: dist | test | amo
      dist for installable xpi (most common)
      test for deflated version for testing
      amo for installable xpi without an updateURL (for uploading to Mozilla Add-ons)
EndUsage
    exit 1
}

die()
{
    echo "$*"
    exit 1
}

package_mode=$3
[ -z "$1" ]         && usage
[ -z "$2" ]         && usage
[ -z "$3" ]         && package_mode=$DEFAULT_PACKAGE_MODE
[ -d "$TPL_DIR" ]  || die "GMSC Fatal Error: $TPL_DIR is not a directory"  
[ -d "$OUTPUT_DIR" ]  || die "GMSC Fatal Error: $OUTPUT_DIR is not a directory"  
[ -d "$INPUT_DIR" ]  || die "GMSC Fatal Error: $INPUT_DIR is not a directory"  

case $package_mode in
"dist" | "amo" | "test")
	;;
* )
	echo "GMSC Error: package_mode must be either dist, test, or amo."
    usage
    ;;
esac

shortname=$1
version=$2
filename="$shortname"'_'"$version"

workingdir=$INPUT_DIR/$shortname
[ -d "$workingdir" ] || die "Fatal Error: $workingdir is not a directory"  


# Clean up the compiled templates directory and the output directory first
rm -rf $TPL_DIR/*.*
rm -Rf $OUTPUT_DIR/$shortname

# Call PHP compiler to do its thing and drop off the results in the output directory
php compile.php $INPUT_DIR $shortname $version $package_mode $TPL_DIR 

# Unzip the package compile.php produced
# This is kind of roundabout, but the .jar straight from PHP doesn't work and this does
mv $filename.xpi $OUTPUT_DIR/$filename.xpi
cd $OUTPUT_DIR
unzip $filename.xpi
rm $filename.xpi

case $package_mode in
"dist" | "amo")
	mkdir build
	cp -R $shortname/*.* build/
	mkdir build/chrome
	cp -R $shortname/chrome/*.* build/chrome/
	cd build
	zip -r $filename.xpi .
	mv $filename.xpi ../$filename.xpi
	cd ..
	rm -rf build
	final_output=$OUTPUT_DIR/$filename.xpi
	;;
"test" )
	final_output=$OUTPUT_DIR/$shortname
	;;
* )
    usage
    ;;
esac

echo "Extension compilation complete. Double-check output for any errors."
echo "Compilation results are located in $final_output."


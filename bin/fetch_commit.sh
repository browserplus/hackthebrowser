#!/bin/sh

for x in /usr/local/www/hackthebrowser.org/projects/*/meta.json; do
    dir=`dirname $x`
    dir=`basename $dir`
    curl -s http://hackthebrowser.org/fetch/$dir/commit > /dev/null
done

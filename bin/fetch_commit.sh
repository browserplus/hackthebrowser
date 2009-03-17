#!/bin/sh

for x in ../projects/*/meta.json; do
    dir=`dirname $x`
    dir=`basename $dir`
    echo "******* $dir *******"
    curl http://hackthebrowser.org/fetch/$dir/commit
done

#!/bin/sh

for x in ../projects/*/meta.json; do
    dir=`dirname $x`
    dir=`basename $dir`
    curl -s http://localhost/fetch/$dir/commit > /dev/null
done    
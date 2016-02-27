'use strict';
// var build = require('./build/');
// build.compilator({
//     entry: './src/app',
//     outName: 'js/app.js'
// }) //
// .pipe(build.dest('./dist')) //
// // .pipe(build.minify()) //
// // .pipe(build.dest('./prod')) //
// ;


// var express = require('express');
// var app = express();
// app.use(express.static('./dist'));
// app.listen(80);
var fs = require("fs");
var ts = require("typescript");
var fileName = 'src/app.ts';
var sourceFile = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
function fnc(o,l) {
    var l=l|0;
    if(l>5) return undefined;
    if (!o) return o;
    var r = {};
    var flag = false;
    try {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flag = true;
                r[i] = fnc(o[i],l+1);
            }
        }
        if (flag)
            return r;
        return o;
    } catch (e) {
        return 'err:' + String(e);

    }

}
var out = JSON.stringify(fnc(sourceFile));

fs.writeFileSync('out.json', out);

    
'use strict';
var build = require('./build/');
build.compilator({
    entry: './src/app',
    outName: 'js/app.js'
}) //
.pipe(build.dest('./dist')) //
// .pipe(build.minify()) //
// .pipe(build.dest('../../prod')) //
;
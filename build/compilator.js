'use strict';
var acorn = require('acorn');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var Path = require('./path');
var IndexedArray = require('./indexed-array');
var watch = require('./watch');
var ts = require("typescript");
//-----------------------------------------------
function addTsExt(fn) {
    return fn.match(/\.js$/g) ? fn : (fn.match(/\/$/g) ? fn + 'index' : fn) + '.ts';
}

function render(deps) {
    return [ //
        '(function(){\n', //
        'var __require__=Array(' + deps.length + ');[', //
        deps.map(function(d, i) {
            var m = ['\nfunction(module,exports){\n', //
                '/*(' + i + ') => ' + d.fn + ' */\n'
            ];
            m.push(d.code);
            m.push('\n}\n\n');
            return m.join('');
        }).join(','), '].map(function(d,i){\n', //
        'var exports={},m={exports:exports};\n', //
        'd(m,exports);\n', //
        '__require__[i]=m.exports;});\n', //
        '})()' //
    ].join('');
}
//-------------------------------------
function makeRequireNode(depId) {
    return {
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: '__require__'
        },
        property: {
            type: 'Literal',
            value: depId
        },
        computed: true
    };
}

function compile(getFile, opts) {
    var deps = new IndexedArray(function(v) {
        return v.fn;
    });

    function addDep(basedir, fname) {
        var fn = Path.relative('.', fname[0] === '.' ? Path.resolve(basedir, fname) : Path.normalize(require.resolve(fname)));
        fn = addTsExt(fn);
        var id = deps.index[fn];
        if (id >= 0) {
            return id;
        }
        var data = getFile(fn);
        var newbasedir = Path.dirname(fn);
        return deps.push(getCode(newbasedir, data, fn)) - 1;
    }

    //-------------------------------------
var TypeScriptSimple = require('typescript-simple').TypeScriptSimple;
var tss = new TypeScriptSimple({target: ts.ScriptTarget.ES7,experimentalDecorators:true,module:"commonjs"});

    function getCode(basedir, data, fn) {

        data=tss.compile(data);
        console.log(data);    
        var ast = acorn.parse(data, {
            ecmaVersion: 7
        });
        var hasExports = false;

        estraverse.replace(ast, {
            enter: function(node, parent) {
                if (node.type == 'CallExpression' //
                    && node.callee.type == 'Identifier' //
                    && node.callee.name == 'require' //
                ) {
                    if (node.arguments.length >= 1) {
                        var a0 = node.arguments[0];
                        if (a0.type == 'Literal') {
                            var requirefn = a0.value;
                            return makeRequireNode(addDep(basedir, requirefn));
                        }
                    }
                }
            }
        });
        var code = escodegen.generate(ast);
       
        return {
            hasExports: hasExports,
            code: code,
            fn: fn
        }
    }
    addDep(Path.resolve('.'), opts.entry);
    var code = render(deps);
    var ret = {};
    ret[opts.outName] = code;
    return ret;
};
//-----------------------------------------------
var Compilator = function(opts) {
    return watch().pipe(function(getFile) {
        return compile(getFile, opts);
    });
};
module.exports = Compilator;
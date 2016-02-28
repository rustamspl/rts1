/// <reference path="node.d.ts" />

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";




var ts1:any=ts;
function delint(sourceFile: ts.SourceFile) {
    delintNode(sourceFile);

    function delintNode(node: ts.Node) {
        
        console.log(ts.SyntaxKind[node.kind]);
        
        //console.log(node);
        switch (node.kind) {
            case ts.SyntaxKind.StringLiteral:
                var n=(<ts.StringLiteral>node);
                n.text='qwe';
                break;
                
            
            case ts.SyntaxKind.Identifier:
                var p=(<ts.Identifier>node);
                p.text='zzz';
              //  console.log(p);
                break;
                
            default:
                break;
        }
        console.log(ts1.getTextOfNode(node));
        ts.forEachChild(node, delintNode);
    }
}
var fileName = "./src/app.ts";
let f = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES5, /*setParentNodes */ true);
delint(f);
//console.log(f);






function fileExtensionIs(path: string, extension: string) {
    var pathLen = path.length;
    var extLen = extension.length;
    return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
}
function transpileModule(sourceFile: ts.SourceFile) {
    var transpileOptions = <ts.TranspileOptions>{
        compilerOptions: {
            target: ts.ScriptTarget.ES5,// module: ts.ModuleKind.CommonJS,
            isolatedModules: true,
            suppressOutputPathCheck: true,//non std
            allowNonTsExtensions: true,
            noLib: true,
            noResolve: true
        }
        //,
      //  moduleName: 'm'
    };
  
    var options = transpileOptions.compilerOptions;
   
    if (transpileOptions.moduleName) {
        sourceFile.moduleName = transpileOptions.moduleName;
    }


    var outputText;
    var sourceMapText;
    // Create a compilerHost object to allow the compiler to read and write files
    var compilerHost = {
        getSourceFile: function(fileName, target) { return sourceFile; },
        writeFile: function(name, text, writeByteOrderMark) {
            if (fileExtensionIs(name, ".map")) {
                sourceMapText = text;
            }
            else {
                outputText = text;
            }
        },
        getDefaultLibFileName: function() { return "lib.d.ts"; },
        useCaseSensitiveFileNames: function() { return false; },
        getCanonicalFileName: function(fileName) { return fileName; },
        getCurrentDirectory: function() { return ""; },
        getNewLine: function() { return "\r\n"; },
        fileExists: function(fileName) { return true },
        readFile: function(fileName) { return ""; },
        directoryExists: function(directoryExists) { return true; }
    };
    var program = ts.createProgram([sourceFile.fileName], options, compilerHost);
    var diagnostics;
    // Emit
    program.emit();

    return { outputText: outputText, diagnostics: diagnostics, sourceMapText: sourceMapText };
}
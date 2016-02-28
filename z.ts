/// <reference path="node.d.ts" />

import fs = require("fs");
import path = require("path");
import ts = require("typescript");


function createCompilerHost(options: ts.CompilerOptions): ts.CompilerHost {
    return {
        getSourceFile,
        getDefaultLibFileName: () => "lib.d.ts",
        writeFile: (fileName, content) => ts.sys.writeFile(fileName, content),
        getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
        getCanonicalFileName: fileName => ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
        getNewLine: () => ts.sys.newLine,
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        fileExists,
        readFile,

        resolveModuleNames
    }

    function fileExists(fileName: string): boolean {
        return ts.sys.fileExists(fileName);
    }

    function readFile(fileName: string): string {
        return ts.sys.readFile(fileName);
    }

    function getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) {
        const sourceText = ts.sys.readFile(fileName);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
    }

    function resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
        return moduleNames.map(moduleName => {
            // try to use standard resolution
            let result = ts.resolveModuleName(moduleName, containingFile, options, { fileExists, readFile });

            if (result.resolvedModule) {
                console.log(moduleName, result.resolvedModule);
                return result.resolvedModule;
            }

            return undefined;
        });
    }
}

function compile(sourceFiles: string[]): void {
    const options: ts.CompilerOptions = { module: ts.ModuleKind.AMD, target: ts.ScriptTarget.ES5 };
    options.outFile = 'dist/js/app.js';

    const host = createCompilerHost(options);
    const program = ts.createProgram(sourceFiles, options, host);
    program.emit();
}

compile(['./src/app']);

var p= new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve(2425352)
    },1000);
});

p.then((d)=>{
    console.log(d);
});
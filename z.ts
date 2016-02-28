/// <reference path="node.d.ts" />

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
var fileName="./src/app.ts";

// function delint(sourceFile: ts.SourceFile) {
//     delintNode(sourceFile);

//     function delintNode(node: ts.Node) {
//         console.log(ts.SyntaxKind[node.kind]);
        
// //         ImportEqualsDeclaration
// // 224
// // Identifier
// // 69
// // ExternalModuleReference
        
//         switch (node.kind) {
            
//              case ts.SyntaxKind.ExternalModuleReference:
//                 let n=(<ts.ExternalModuleReference>node);
//                 console.log(n);
//             // case ts.SyntaxKind.ForStatement:
//             // case ts.SyntaxKind.ForInStatement:
//             // case ts.SyntaxKind.WhileStatement:
//             // case ts.SyntaxKind.DoStatement:
//             //     if ((<ts.IterationStatement>node).statement.kind !== ts.SyntaxKind.Block) {
//             //         report(node, "A looping statement's contents should be wrapped in a block body.");
//             //     }
//             //     break;

//             // case ts.SyntaxKind.IfStatement:
//             //     let ifStatement = (<ts.IfStatement>node);
//             //     if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
//             //         report(ifStatement.thenStatement, "An if statement's contents should be wrapped in a block body.");
//             //     }
//             //     if (ifStatement.elseStatement &&
//             //         ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
//             //         ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
//             //         report(ifStatement.elseStatement, "An else statement's contents should be wrapped in a block body.");
//             //     }
//             //     break;

//             // case ts.SyntaxKind.BinaryExpression:
//             //     let op = (<ts.BinaryExpression>node).operatorToken.kind;
//             //     if (op === ts.SyntaxKind.EqualsEqualsToken || op == ts.SyntaxKind.ExclamationEqualsToken) {
//             //         report(node, "Use '===' and '!=='.")
//             //     }
//             //     break;
//             default:
//                 break;
//         }
      
//         ts.forEachChild(node, delintNode);
//     }

//     function report(node: ts.Node, message: string) {
//         let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
//         console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
//     }
// }


// let f = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
// delint(f);
// console.log('zzz');



function createCompilerHost(options: ts.CompilerOptions, moduleSearchLocations: string[]): ts.CompilerHost {
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
        console.log(fileName);
        const sourceText = ts.sys.readFile(fileName);
        console.log(sourceText);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
    }

    function resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
        return moduleNames.map(moduleName => {
            // try to use standard resolution
            let result = ts.resolveModuleName(moduleName, containingFile, options, {fileExists, readFile});
            if (result.resolvedModule) {
                return result.resolvedModule;
            }

            // check fallback locations, for simplicity assume that module at location should be represented by '.d.ts' file
            for (const location of moduleSearchLocations) {
                const modulePath = path.join(location, moduleName + ".d.ts");
                if (fileExists(modulePath)) {
                    return { resolvedFileName: modulePath }
                }
            } 

            return undefined;
        });
    }
}

    const options: ts.CompilerOptions = { module: ts.ModuleKind.AMD, target: ts.ScriptTarget.ES5 };
    const host = createCompilerHost(options, ['.']);
    const program = ts.createProgram([fileName], options, host);
   
    var r=program.emit();
    console.log(r);
    /// do something with program...

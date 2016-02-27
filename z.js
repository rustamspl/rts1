/// <reference path="node.d.ts" />
"use strict";
var fs = require("fs");
var ts = require("typescript");
var fileName = "./src/app.ts";
function delint(sourceFile) {
    delintNode(sourceFile);
    function delintNode(node) {
        console.log(ts.SyntaxKind[node.kind]);
        //         ImportEqualsDeclaration
        // 224
        // Identifier
        // 69
        // ExternalModuleReference
        switch (node.kind) {
            case ts.SyntaxKind.ExternalModuleReference:
                var n = node;
                console.log(n);
            // case ts.SyntaxKind.ForStatement:
            // case ts.SyntaxKind.ForInStatement:
            // case ts.SyntaxKind.WhileStatement:
            // case ts.SyntaxKind.DoStatement:
            //     if ((<ts.IterationStatement>node).statement.kind !== ts.SyntaxKind.Block) {
            //         report(node, "A looping statement's contents should be wrapped in a block body.");
            //     }
            //     break;
            // case ts.SyntaxKind.IfStatement:
            //     let ifStatement = (<ts.IfStatement>node);
            //     if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
            //         report(ifStatement.thenStatement, "An if statement's contents should be wrapped in a block body.");
            //     }
            //     if (ifStatement.elseStatement &&
            //         ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
            //         ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement) {
            //         report(ifStatement.elseStatement, "An else statement's contents should be wrapped in a block body.");
            //     }
            //     break;
            // case ts.SyntaxKind.BinaryExpression:
            //     let op = (<ts.BinaryExpression>node).operatorToken.kind;
            //     if (op === ts.SyntaxKind.EqualsEqualsToken || op == ts.SyntaxKind.ExclamationEqualsToken) {
            //         report(node, "Use '===' and '!=='.")
            //     }
            //     break;
            default:
                break;
        }
        console.log(node.kind);
        ts.forEachChild(node, delintNode);
    }
    function report(node, message) {
        var _a = sourceFile.getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
        console.log(sourceFile.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
    }
}
var f = ts.createSourceFile(fileName, fs.readFileSync(fileName).toString(), ts.ScriptTarget.ES6, /*setParentNodes */ true);
delint(f);
console.log('zzz');

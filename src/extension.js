/**
 * vscode plugin for highlighting TODOs and FIXMEs within your code
 *
 * NOTE: each decoration type has a unique key, the highlight and clear highight functionality are based on it
 */

var vscode = require('vscode');
var window = vscode.window;
var workspace = vscode.workspace;

function activate(context) {

    var timeout = null
    var activeEditor = window.activeTextEditor


    if (activeEditor) {
        triggerUpdateDecorations()
    }

    window.onDidChangeActiveTextEditor(function (editor) {
        activeEditor = editor;
        if (editor) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    workspace.onDidChangeTextDocument(function (event) {
        if (activeEditor && event.document === activeEditor.document) {
            triggerUpdateDecorations();
        }
    }, null, context.subscriptions);

    const stylings = [
        {
            regexp: /@validation/g,
            decoration: window.createTextEditorDecorationType({
                color: "#6c71c4",
                overviewRulerLane: vscode.OverviewRulerLane.Right,
            })
        },
        {
            regexp: /@[crud]+c?r?u?d?\(/g,
            decoration: window.createTextEditorDecorationType({
                color: "#268bd2",
                overviewRulerLane: vscode.OverviewRulerLane.Right,
            }),
            offsetEnd: 1,
        },
    ]
    function updateDecorations() {
        if (!activeEditor || !activeEditor.document) {
            return
        }

        var text = activeEditor.document.getText()
        stylings.forEach(styling => {
            const ranges = []
            while (match = styling.regexp.exec(text)) {
                const startPos = activeEditor.document.positionAt(match.index);
                const endPos = activeEditor.document
                    .positionAt(match.index + match[0].length - (styling.offsetEnd || 0))
                const range = {
                    range: new vscode.Range(startPos, endPos)
                }

                ranges.push(range)
            }
            activeEditor.setDecorations(styling.decoration, ranges)
        })
    }

    function triggerUpdateDecorations() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(updateDecorations, 0);
    }
}

exports.activate = activate;

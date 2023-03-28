import * as vscode from "vscode";

import { BracketSelector } from "./bracket-selector";
import { BRACKET_MAPPING } from "./bracket-mapping";
import { BNKN_MENU } from "./bnkn";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("bnkn");
  const skipUnselected: boolean = config.get("skipUnselected") || false;

  const getLineRange = (editor: vscode.TextEditor, cursorLine: number): vscode.Range => {
    const line = editor.document.lineAt(cursorLine).range;
    return new vscode.Range(line.start, line.end);
  };

  const formatSelections = (editor: vscode.TextEditor, formatter: Function) => {
    editor.edit((editBuilder) => {
      editor.selections
        .map((sel) => {
          if (sel.isEmpty) {
            if (skipUnselected) {
              return null;
            }
            return getLineRange(editor, sel.active.line);
          }
          return sel;
        })
        .forEach((sel) => {
          if (!sel) {
            return;
          }
          const text = editor.document.getText(sel);
          const newText = formatter(text);
          if (text != newText) {
            editBuilder.replace(sel, newText);
          }
        });
    });
  };

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("bnkn.mainMenu", (editor: vscode.TextEditor) => {
      const commands = Array.from(BNKN_MENU.keys());
      vscode.window.showQuickPick(commands).then((cmd) => {
        if (cmd) {
          const func = BNKN_MENU.get(cmd);
          formatSelections(editor, func);
        }
      });
    })
  );

  const BRACKET_SELECTOR = new BracketSelector();
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("bnkn.selectBracket", (editor: vscode.TextEditor) => {
      editor.selections = BRACKET_SELECTOR.getSelections(editor);
    })
  );

  const wrapSelection = (editor: vscode.TextEditor, pair: string) => {
    const prefix = pair.charAt(0);
    const suffix = pair.charAt(1);
    formatSelections(editor, (s: string) => prefix + s + suffix);
  };

  Array.from(BRACKET_MAPPING.keys()).forEach((cmdName) => {
    const pair = BRACKET_MAPPING.get(cmdName);
    const callback = (editor: vscode.TextEditor) => {
      wrapSelection(editor, pair);
    };
    const cmdId = "bnkn." + cmdName;
    context.subscriptions.push(vscode.commands.registerTextEditorCommand(cmdId, callback));
  });
}

export function deactivate() {}

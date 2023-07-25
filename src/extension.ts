import * as vscode from "vscode";

import { BracketSelector } from "./bracket-selector";
import { BRACKET_MAPPING } from "./bracket-mapping";
import { BNKN_MENU } from "./bnkn-menu";
import { TextFormatter } from "./text-formatter";

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("bnkn");
  const skipUnselected: boolean = config.get("skipUnselected") || false;

  Array.from(BNKN_MENU.keys()).forEach((commandName: string) => {
    const commandId = "bnkn." + commandName;
    const func = BNKN_MENU.get(commandName);
    context.subscriptions.push(
      vscode.commands.registerTextEditorCommand(commandId, (editor: vscode.TextEditor) => {
        new TextFormatter(editor, skipUnselected).executeFormat(func);
      })
    );
  });

  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand("bnkn.mainMenu", (editor: vscode.TextEditor) => {
      const commands = Array.from(BNKN_MENU.keys());
      vscode.window.showQuickPick(commands).then((cmd) => {
        if (cmd) {
          const func = BNKN_MENU.get(cmd);
          new TextFormatter(editor, skipUnselected).executeFormat(func);
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
    new TextFormatter(editor, skipUnselected).executeFormat((s: string) => prefix + s + suffix);
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

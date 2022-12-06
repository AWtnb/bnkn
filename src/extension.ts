import * as vscode from "vscode";

import { Bnkn, BRACKET_SELECTOR } from "./bnkn";

const config = vscode.workspace.getConfiguration("bnkn");
const skipUnselected: boolean = config.get("skipUnselected") || false;

const getLineRange = (editor: vscode.TextEditor, cursorLine: number): vscode.Range => {
  const lineStart = new vscode.Position(cursorLine, 0);
  const lineEnd = new vscode.Position(cursorLine, editor.document.lineAt(cursorLine).text.length);
  return new vscode.Range(lineStart, lineEnd);
};

const formatSelections = (formatter: Function) => {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
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

const mainMenu = () => {
  const funcMap = new Map();

  funcMap.set("fix dumb-quotes", Bnkn.fixDumbQuotes);
  funcMap.set("swap familyname position", Bnkn.swapHumanNamePosition);
  funcMap.set("to double-brackets", Bnkn.toDouble);
  funcMap.set("to full-width", Bnkn.toFullWidth);
  funcMap.set("to full-width-brackets", Bnkn.toFullWidthBracket);
  funcMap.set("to half-width", Bnkn.toHalfWidth);
  funcMap.set("to half-width-brackets", Bnkn.toHalfWidthBracket);
  funcMap.set("to single-brackets", Bnkn.toSingle);
  funcMap.set("to to-tortoise-brackets", Bnkn.toTortoiseBracket);
  funcMap.set("trim brackets", Bnkn.trimBrackets);

  const commands = Array.from(funcMap.keys());
  vscode.window.showQuickPick(commands).then((cmd) => {
    if (cmd) {
      const func = funcMap.get(cmd);
      formatSelections(func);
    }
  });
};

const wrapSelection = (pair: string) => {
  const prefix = pair.charAt(0);
  const suffix = pair.charAt(1);
  return () => {
    formatSelections((s: string) => prefix + s + suffix);
  };
};

const WRAPPER_MAP = new Map();
WRAPPER_MAP.set("bnkn.wrapByFullWidthDoubleQuote", wrapSelection("“”"));
WRAPPER_MAP.set("bnkn.wrapByFullWidthSingleQuote", wrapSelection("‘’"));
WRAPPER_MAP.set("bnkn.wrapByFullWidthParen", wrapSelection("（）"));
WRAPPER_MAP.set("bnkn.wrapByTortoiseParen", wrapSelection("〔〕"));
WRAPPER_MAP.set("bnkn.wrapByCornarBracket", wrapSelection("「」"));
WRAPPER_MAP.set("bnkn.wrapByDoubleCornarBracket", wrapSelection("『』"));
WRAPPER_MAP.set("bnkn.wrapByFullWidthBracket", wrapSelection("［］"));
WRAPPER_MAP.set("bnkn.wrapBlackBracket", wrapSelection("【】"));

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand("bnkn.mainMenu", mainMenu));
  context.subscriptions.push(vscode.commands.registerCommand("bnkn.selectBracket", () => BRACKET_SELECTOR.expand()));

  WRAPPER_MAP.forEach((func, name) => {
    context.subscriptions.push(vscode.commands.registerCommand(name, func));
  });
}

export function deactivate() {}

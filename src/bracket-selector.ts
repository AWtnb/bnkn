import * as vscode from "vscode";

class ActiveCursor {
  readonly selStartPos: vscode.Position;
  readonly selEndPos: vscode.Position;
  readonly curLine: vscode.TextLine;
  constructor(editor:vscode.TextEditor) {
    this.selStartPos = editor.selection.start;
    this.selEndPos = editor.selection.end;
    this.curLine = editor.document.lineAt(editor.selection.active.line);
  }
}

export class BracketSelector {
  readonly pairs: string[]
  constructor(extras:string[] = []) {
    this.pairs = ["()", "[]", "{}", "''", '""', "（）", "［］", "〔〕", "《》", "〈〉", "「」", "『』", "【】", "“”", "‘’"].concat(extras);
  }

  private getRightChar(leftChar: string): string {
    const found = this.pairs.filter((x) => x.charAt(0) == leftChar);
    if (found.length) {
      return found[0].charAt(1);
    }
    return "";
  }

  private getLeftChar(rightChar: string): string {
    const found = this.pairs.filter((x) => x.charAt(1) == rightChar);
    if (found.length) {
      return found[0].charAt(0);
    }
    return "";
  }

  private searchBack(s: string): number {
    const lefts = this.pairs.map((p) => p.charAt(0));
    const rights = this.pairs.map((p) => p.charAt(1));
    const stack = [];
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(s.length - i - 1);
      if (rights.includes(c) && this.getLeftChar(c) != c) {
        stack.push(c);
        continue;
      }
      if (lefts.includes(c)) {
        const right = this.getRightChar(c);
        if (stack.includes(right)) {
          stack.splice(stack.indexOf(right), 1);
          continue;
        }
        return i;
      }
    }
    return -1;
  }

  private searchFore(s: string, leftChar: string, rightChar: string): number {
    let skip = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (c == leftChar && leftChar != rightChar) {
        skip += 1;
        continue;
      }
      if (c == rightChar) {
        if (skip > 0) {
          skip -= 1;
          continue;
        }
        return i;
      }
    }
    return -1;
  }

  expand(editor:vscode.TextEditor) {
    const ac = new ActiveCursor(editor);
    const beforeCursor = ac.curLine.text.substring(0, ac.selStartPos.character);
    const deltaBack = this.searchBack(beforeCursor);
    if (deltaBack < 0) {
      return;
    }
    const leftChar = ac.curLine.text.charAt(ac.selStartPos.character - deltaBack - 1);
    const rightChar = this.getRightChar(leftChar);
    const afterCursor = ac.curLine.text.substring(ac.selEndPos.character);
    const deltaFore = this.searchFore(afterCursor, leftChar, rightChar);
    if (deltaFore < 0) {
      return;
    }
    const startPos = new vscode.Position(ac.curLine.lineNumber, ac.selStartPos.character - deltaBack - 1);
    const endPos = new vscode.Position(ac.curLine.lineNumber, ac.selEndPos.character + deltaFore + 1);
    editor.selection = new vscode.Selection(startPos, endPos);
  }
}

import * as vscode from "vscode";

class ActiveCursor {
  readonly selStartPos: vscode.Position;
  readonly selEndPos: vscode.Position;
  private readonly curLine: vscode.TextLine;
  constructor(editor: vscode.TextEditor, sel: vscode.Selection) {
    this.selStartPos = sel.start;
    this.selEndPos = sel.end;
    this.curLine = editor.document.lineAt(sel.active.line);
  }

  textBeforeCursor(): string {
    return this.curLine.text.substring(0, this.selStartPos.character);
  }

  textAfterCursor(): string {
    return this.curLine.text.substring(this.selEndPos.character);
  }

  makeSelection(start: number, end: number): vscode.Selection {
    const startPos = new vscode.Position(this.curLine.lineNumber, start);
    const endPos = new vscode.Position(this.curLine.lineNumber, end);
    return new vscode.Selection(startPos, endPos);
  }
}

export class BracketSelector {
  readonly pairs: string[];
  constructor(extras: string[] = []) {
    this.pairs = ["()", "[]", "{}", "''", '""', "（）", "［］", "〔〕", "《》", "〈〉", "「」", "『』", "【】", "“”", "‘’"].concat(extras);
  }

  private rightCharFromLeft(leftChar: string): string {
    const found = this.pairs.filter((x) => x.charAt(0) == leftChar);
    if (found.length) {
      return found[0].charAt(1);
    }
    return "";
  }

  private leftCharFromRight(rightChar: string): string {
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
      if (rights.includes(c) && this.leftCharFromRight(c) != c) {
        stack.push(c);
        continue;
      }
      if (lefts.includes(c)) {
        const right = this.rightCharFromLeft(c);
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

  getSelections(editor: vscode.TextEditor): vscode.Selection[] {
    return editor.selections.map((sel) => {
      if (!sel.isSingleLine) {
        return sel;
      }
      const ac = new ActiveCursor(editor, sel);
      const beforeCursor = ac.textBeforeCursor();
      const deltaBack = this.searchBack(beforeCursor);
      if (deltaBack < 0) {
        return sel;
      }
      const leftChar = beforeCursor.charAt(beforeCursor.length - 1 - deltaBack);
      const rightChar = this.rightCharFromLeft(leftChar);
      const deltaFore = this.searchFore(ac.textAfterCursor(), leftChar, rightChar);
      if (deltaFore < 0) {
        return sel;
      }
      return ac.makeSelection(beforeCursor.length - 1 - deltaBack, ac.selEndPos.character + deltaFore + 1);
    });
  }
}

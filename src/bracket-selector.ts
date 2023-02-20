import * as vscode from "vscode";

class ActiveCursor {
  private readonly startPos: vscode.Position;
  private readonly endPos: vscode.Position;
  private readonly curLine: vscode.TextLine;
  constructor(editor: vscode.TextEditor, sel: vscode.Selection) {
    this.startPos = sel.start;
    this.endPos = sel.end;
    this.curLine = editor.document.lineAt(sel.active.line);
  }

  textBeforeCursor(): string {
    return this.curLine.text.substring(0, this.startPos.character);
  }

  textAfterCursor(): string {
    return this.curLine.text.substring(this.endPos.character);
  }

  charBeforeStart(offset: number): string {
    return this.curLine.text.charAt(this.startPos.character - offset);
  }

  charAfterEnd(offset: number): string {
    return this.curLine.text.charAt(this.endPos.character + offset);
  }

  expand(deltaBack: number, deltaFore: number): vscode.Selection {
    const startPos = new vscode.Position(this.curLine.lineNumber, this.startPos.character - deltaBack);
    const endPos = new vscode.Position(this.curLine.lineNumber, this.endPos.character + deltaFore);
    return new vscode.Selection(startPos, endPos);
  }
}

export const BRACKETS = ["()", "[]", "{}", "''", '""', "（）", "［］", "〔〕", "《》", "〈〉", "「」", "『』", "【】", "“”", "‘’"];

class BracketPair {
  private readonly leftChar: string;
  private readonly rightChar: string;
  constructor(leftChar: string) {
    this.leftChar = leftChar;
    const found = BRACKETS.filter((brc) => brc.charAt(0) == this.leftChar);
    this.rightChar = found.length ? found[0].charAt(1) : "";
  }
  searchForwardRightChar(s: string): number {
    if (this.rightChar.length < 1) {
      return -1;
    }
    let skip = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (c == this.leftChar && this.leftChar != this.rightChar) {
        skip += 1;
        continue;
      }
      if (c == this.rightChar) {
        if (skip > 0) {
          skip -= 1;
          continue;
        }
        return i;
      }
    }
    return -1;
  }
}

export class BracketSelector {
  readonly leftChars: string[];
  readonly rightChars: string[];
  constructor() {
    this.leftChars = BRACKETS.map((p) => p.charAt(0));
    this.rightChars = BRACKETS.map((p) => p.charAt(1));
  }

  private rightCharFromLeft(leftChar: string): string {
    const found = this.leftChars.indexOf(leftChar);
    if (found != -1) {
      return this.rightChars[found];
    }
    return "";
  }

  private leftCharFromRight(rightChar: string): string {
    const found = this.rightChars.indexOf(rightChar);
    if (found != -1) {
      return this.leftChars[found];
    }
    return "";
  }

  private searchBackLeftChar(s: string): number {
    const stack = [];
    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(s.length - i - 1);
      if (this.rightChars.includes(c) && this.leftCharFromRight(c) != c) {
        stack.push(c);
        continue;
      }
      if (this.leftChars.includes(c)) {
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

  getSelections(editor: vscode.TextEditor): vscode.Selection[] {
    return editor.selections.map((sel) => {
      if (!sel.isSingleLine) {
        return sel;
      }
      const ac = new ActiveCursor(editor, sel);
      const beforeCursor = ac.textBeforeCursor();
      const deltaBack = this.searchBackLeftChar(beforeCursor);
      if (deltaBack < 0) {
        return sel;
      }
      const leftChar = ac.charBeforeStart(deltaBack + 1);
      const pair = new BracketPair(leftChar);
      const deltaFore = pair.searchForwardRightChar(ac.textAfterCursor());
      if (deltaFore < 0) {
        return sel;
      }
      return ac.expand(deltaBack + 1, deltaFore + 1);
    });
  }
}

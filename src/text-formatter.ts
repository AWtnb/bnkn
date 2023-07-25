import * as vscode from "vscode";

export class TextFormatter {
  readonly editor: vscode.TextEditor;
  readonly skipUnselected: boolean;
  constructor(editor: vscode.TextEditor, skipUnselected: boolean) {
    this.editor = editor;
    this.skipUnselected = skipUnselected;
  }

  private lineAsRange(lineNum: number): vscode.Range {
    return this.editor.document.lineAt(lineNum).range;
  }

  private getSelectionRanges(): vscode.Range[] {
    const stack: vscode.Range[] = [];
    this.editor.selections.forEach((sel) => {
      if (sel.isEmpty) {
        if (this.skipUnselected) {
          return;
        }
        stack.push(this.lineAsRange(sel.active.line));
      } else {
        stack.push(sel);
      }
    });
    return stack;
  }

  /**
   * When the cursor is on the same line in multi-cursor mode, `lineAsRange()` causes a completely overlapping Range.
   * This method reduces overlapping Ranges and solves the problem.
   */
  private getUniqueRanges(): vscode.Range[] {
    const ranges = this.getSelectionRanges();
    const sortedRanges = ranges.sort((a, b) => {
      if (a.start.isBefore(b.start)) {
        return -1;
      }
      if (a.start.isAfter(b.start)) {
        return 1;
      }
      return 0;
    });
    const stack: vscode.Range[] = [];
    for (let i = 0; i < sortedRanges.length; i++) {
      const range = sortedRanges[i];
      if (i == 0) {
        stack.push(range);
        continue;
      }
      const last = sortedRanges[i - 1];
      if (range.intersection(last)) {
        continue;
      }
      stack.push(range);
    }
    return stack;
  }

  executeFormat(formatter: Function) {
    this.editor.edit((editBuilder) => {
      this.getUniqueRanges().forEach((range) => {
        const text = this.editor.document.getText(range);
        const newText = formatter(text);
        if (text != newText) {
          editBuilder.replace(range, newText);
        }
      });
    });
  }
}

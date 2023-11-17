export const toHalfWidthBracket = (s: string): string => {
  return s.replace(/[（）［］]/g, (m: string) => {
    if (m == "（") return "(";
    if (m == "）") return ")";
    if (m == "［") return "[";
    return "]";
  });
};

export const toFullWidthBracket = (s: string): string => {
  return s.replace(/[\(\)\[\]]/g, (m: string) => {
    if (m == "(") return "（";
    if (m == ")") return "）";
    if (m == "[") return "［";
    return "］";
  });
};

export const toSingle = (s: string): string => {
  return s.replace(/[“”『』"]/g, (m: string) => {
    if (m == "“") return "‘";
    if (m == "”") return "’";
    if (m == "『") return "「";
    if (m == "』") return "」";
    return "'";
  });
};

export const toDouble = (s: string): string => {
  return s.replace(/[‘’「」']/g, (m: string) => {
    if (m == "‘") return "“";
    if (m == "’") return "”";
    if (m == "「") return "『";
    if (m == "」") return "』";
    return '"';
  });
};

export class BracketTransformer {
  private readonly line: string;
  constructor(s: string) {
    this.line = s;
  }

  private startsWithAlphabet(): boolean {
    const c = this.line.charCodeAt(0);
    return 0x41 <= c && c <= 0x7a;
  }

  formatWidth(): string {
    return this.startsWithAlphabet() ? toHalfWidthBracket(this.line) : toFullWidthBracket(this.line);
  }
}

export const insertPeriodOfYear = (s: string): string => {
  return s.replace(/\(\d{4}\).|（\d{4}）./g, (m: string) => {
    if (m.endsWith(".") || m.endsWith("．")) {
      return m;
    }
    const period = m.startsWith("(") ? "." : "．";
    return m.substring(0, 6) + period + m.charAt(m.length - 1);
  });
};

export const removePeriodOfYear = (s: string): string => {
  return s.replace(/\(\d{4}\).|（\d{4}）./g, (m: string) => {
    if (m.endsWith(".") || m.endsWith("．")) {
      return m.substring(0, 6);
    }
    return m;
  });
};

class BracketNestHandler {
  private readonly _open: string = "「";
  private readonly _close: string = "」";
  private readonly _openAlt: string = "『";
  private readonly _closeAlt: string = "』";
  constructor(primary: string = "「」", alternative: string = "『』") {
    if (primary.length === 2) {
      this._open = primary.charAt(0);
      this._close = primary.charAt(1);
    }
    if (alternative.length === 2) {
      this._openAlt = alternative.charAt(0);
      this._closeAlt = alternative.charAt(1);
    }
  }
  isOpen(s: string): boolean {
    return s === this._open || s === this._openAlt;
  }
  isClose(s: string): boolean {
    return s === this._close || s === this._closeAlt;
  }
  getAlternative(s: string): string {
    if (s === this._open) return this._openAlt;
    if (s === this._openAlt) return this._open;
    if (s === this._close) return this._closeAlt;
    if (s === this._closeAlt) return this._close;
    return s;
  }
  getCorrespond(s: string): string {
    if (s === this._open) return this._close;
    if (s === this._openAlt) return this._closeAlt;
    if (s === this._close) return this._open;
    if (s === this._closeAlt) return this._openAlt;
    return s;
  }
}

export class LineWithNestedBracket {
  private _line: string;
  private readonly _handler: BracketNestHandler;
  private readonly _openCharsStack: string[] = [];
  constructor(line: string, primary: string = "「」", alternative: string = "『』") {
    this._line = line;
    this._handler = new BracketNestHandler(primary, alternative);
  }

  private openChar(s: string): string {
    if (this._openCharsStack.length < 1) {
      this._openCharsStack.push(s);
      return s;
    }
    const last = this._openCharsStack.slice(-1)[0];
    if (!last) {
      return s;
    }
    const alt = this._handler.getAlternative(last);
    this._openCharsStack.push(alt);
    return alt;
  }

  private closeChar(s: string): string {
    if (this._openCharsStack.length < 1) {
      return s;
    }
    const last = this._openCharsStack.pop();
    if (!last) {
      return s;
    }
    const correspond = this._handler.getCorrespond(last);
    return correspond;
  }

  private onChar(idx: number): string {
    const c = this._line.charAt(idx);
    if (this._handler.isOpen(c)) {
      return this.openChar(c);
    }
    if (this._handler.isClose(c)) {
      return this.closeChar(c);
    }
    return c;
  }

  format(): string {
    const stack = [];
    for (let i = 0; i < this._line.length; i++) {
      stack.push(this.onChar(i));
    }
    return stack.join("");
  }
}

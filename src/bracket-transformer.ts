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

export class NestedBracketHandler {
  private readonly _openChar: string = "「";
  private readonly _openAlt: string = "『";
  private readonly _closeChar: string = "」";
  private readonly _closeAlt: string = "』";
  constructor(pair: string = "「」", altPair: string = "『』") {
    if (pair.length == 2) {
      this._openChar = pair.charAt(0);
      this._closeChar = pair.charAt(1);
    }
    if (altPair.length == 2) {
      this._openAlt = altPair.charAt(0);
      this._closeAlt = altPair.charAt(1);
    }
  }
  private getAlternative(s: string | undefined): string {
    if (!s) return "";
    if (s === this._openChar) return this._openAlt;
    if (s === this._openAlt) return this._openChar;
    if (s === this._closeChar) return this._closeAlt;
    if (s === this._closeAlt) return this._closeChar;
    return s;
  }
  private getCorrespond(s: string | undefined): string {
    if (!s) return "";
    if (s === this._openChar) return this._closeChar;
    if (s === this._openAlt) return this._closeAlt;
    if (s === this._closeChar) return this._openChar;
    if (s === this._closeAlt) return this._openAlt;
    return s;
  }
  format(s: string): string {
    const stackToJoin: string[] = [];
    const openChars: string[] = [];

    for (let i = 0; i < s.length; i++) {
      const c = s.charAt(i);
      if (c === this._openChar || c === this._openAlt) {
        if (openChars.length < 1) {
          openChars.push(c);
          stackToJoin.push(c);
          continue;
        }
        const last = openChars.slice(-1)[0];
        const alt = this.getAlternative(last);
        if (alt) {
          openChars.push(alt);
          stackToJoin.push(alt);
        }
        continue;
      }
      if (c === this._closeChar || c === this._closeAlt) {
        if (openChars.length < 1) {
          stackToJoin.push(c);
          continue;
        }
        const last = openChars.pop();
        const correspond = this.getCorrespond(last);
        if (correspond) {
          stackToJoin.push(correspond);
        }
        continue;
      }
      stackToJoin.push(c);
    }

    return stackToJoin.join("");
  }
}

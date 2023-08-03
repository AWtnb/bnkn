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

  private checkNumberDigit = (idx: number): boolean => {
    const c = this.line.charCodeAt(idx);
    return 0x30 <= c && c <= 0x39;
  };

  private startsWithAlphabet(): boolean {
    const c = this.line.charCodeAt(0);
    return 0x41 <= c && c <= 0x7a;
  }

  private checkYearStarts(idx: number): boolean {
    const target = this.line.substring(idx, idx + 4);
    return target.replace(/\d/g, "").length === 0;
  }

  private getYearOffset(): number {
    let offset = 0;
    for (let i = 0; i < this.line.length; i++) {
      if (this.checkNumberDigit(i) && this.checkYearStarts(i)) {
        offset = i;
        break;
      }
    }
    return offset;
  }

  formatWidth(): string {
    const offset = this.getYearOffset();
    if (offset < 1) {
      return this.line;
    }
    const prefix = this.line.substring(0, offset - 1);
    const left = this.line.charAt(offset - 1);
    const year = this.line.substring(offset, offset + 4);
    const right = this.line.charAt(offset + 4);
    const suffix = this.line.substring(offset + 4 + 1);
    const formatLeft = this.startsWithAlphabet() ? toHalfWidthBracket(left) : toFullWidthBracket(left);
    const formatRight = this.startsWithAlphabet() ? toHalfWidthBracket(right) : toFullWidthBracket(right);
    if (left === formatLeft || right === formatRight) {
      return this.line;
    }
    return prefix + formatLeft + year + formatRight + suffix;
  }
}

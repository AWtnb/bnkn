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

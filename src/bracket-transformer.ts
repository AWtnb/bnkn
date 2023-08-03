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

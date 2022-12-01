const toWords = (s: string): string[] => {
  return s
    .split(/\s/)
    .filter((x) => x.length)
    .map((x) => x.trim());
};

export class TitleCase {
  readonly exceptions: string[];
  constructor(exceptions: string[]) {
    this.exceptions = exceptions;
  }

  private formatHyphened(s: string): string {
    return s
      .split("-")
      .map((x) => this.format(x))
      .join("-");
  }

  format(s: string): string {
    const words = toWords(s);
    return words
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .map((s, i) => {
        if (i == 0 || words[i - 1].endsWith(":")) {
          return s;
        }
        if (this.exceptions.includes(s)) {
          return s.toLowerCase();
        }
        if (s.indexOf("-") != -1) {
          return this.formatHyphened(s);
        }
        return s;
      })
      .join(" ")
      .replace(/\s+:\s*/g, ": ");
  }
}

const isASCII = (s: string): boolean => {
  const c = s.charCodeAt(0);
  return 0x20 < c && c <= 0x7e;
};

class Punctuation {
  private readonly _fullwidth_chars: string;
  private readonly _halfwidth_chars: string;
  constructor(full: string = "\uff0e\uff0c\uff1a\uff1b", half: string = ".,:;") {
    this._fullwidth_chars = full;
    this._halfwidth_chars = half;
  }
  check(s: string): boolean {
    return (this._fullwidth_chars + this._halfwidth_chars).includes(s);
  }
  checkHalfwidth(s: string): boolean {
    return this._halfwidth_chars.includes(s);
  }
  checkFullwidth(s: string): boolean {
    return this._fullwidth_chars.includes(s);
  }
  toFullWidth(s: string): string {
    const idx = this._halfwidth_chars.indexOf(s);
    if (idx < 0) {
      return s;
    }
    return this._fullwidth_chars.charAt(idx);
  }
  toHalfWidth(s: string): string {
    const idx = this._fullwidth_chars.indexOf(s);
    if (idx < 0) {
      return s;
    }
    return this._halfwidth_chars.charAt(idx);
  }
}

export class PuncHandler {
  private readonly _punc: Punctuation;
  private readonly _stack: string[];
  private readonly _line: string;
  constructor(line: string) {
    this._stack = [];
    this._punc = new Punctuation("\uff0e\uff0c\uff1a\uff1b", ".,:;");
    this._line = line;
  }
  private getLastChar(): string {
    return this._stack.slice(-1)[0] || "";
  }
  private formatPunc(s: string) {
    const last = this.getLastChar();
    if (last === "\r" || last === "\n") {
      this._stack.push(s);
      return;
    }
    if (isASCII(last)) {
      this._stack.push(this._punc.toHalfWidth(s));
    } else {
      this._stack.push(this._punc.toFullWidth(s));
    }
  }
  private formatChar(idx: number) {
    const c = this._line.charAt(idx);
    if (idx === 0 || c === "\r" || c === "\n") {
      this._stack.push(c);
      return;
    }
    const last = this.getLastChar();
    if (c === " " && last === " ") {
      return; // never multiple spaces. space is always single.
    }
    if (this._punc.checkFullwidth(last) && c === " ") {
      return;
    }
    if (this._punc.check(c)) {
      const last = this.getLastChar();
      if (last === " ") {
        this._stack.pop();
      }
      this.formatPunc(c);
      return;
    }
    this._stack.push(c);
  }
  format(): string {
    for (let i = 0; i < this._line.length; i++) {
      this.formatChar(i);
    }
    return this._stack.join("").trimEnd();
  }
}

import { HumanName } from "./human-name";
import { BRACKETS } from "./bracket-selector";
import { BracketTransformer, LineWithNestedBracket } from "./bracket-transformer";
import { PuncHandler } from "./punctuation";

export const formatBracketWidth = (s: string): string => {
  const bt = new BracketTransformer(s);
  return bt.formatWidth();
};

export const toTortoiseBracket = (s: string): string => {
  return s.replace(/[（）\(\)]/g, (m: string) => {
    if (["（", "("].includes(m)) {
      return "〔";
    }
    return "〕";
  });
};

export const swapHumanNamePosition = (s: string): string => {
  return new HumanName(s).swap();
};

export const fixDumbQuotes = (s: string): string => {
  return s.replace(/["'].+?["']/g, (m: string) => {
    const prefix = m.startsWith('"') ? "\u201c" : "\u2018";
    const suffix = prefix == "\u201c" ? "\u201d" : "\u2019";
    return prefix + m.substring(1, m.length - 1) + suffix;
  });
};

export const trimBrackets = (s: string): string => {
  const lefts = BRACKETS.map((p) => p.charAt(0));
  const c = s.charAt(0);
  if (lefts.includes(c)) {
    const found = BRACKETS.filter((x) => x.charAt(0) == c);
    if (found.length) {
      const right = found[0].charAt(1);
      if (s.endsWith(right)) {
        return s.substring(1, s.length - 1);
      }
    }
  }
  return s;
};

export const toHalfWidth = (s: string): string => {
  return s.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g, (m: string) => {
    return String.fromCharCode(m.charCodeAt(0) - 0xfee0);
  });
};

export const toFullWidth = (s: string): string => {
  return s.replace(/[A-Za-z0-9]/g, (m: string) => {
    return String.fromCharCode(m.charCodeAt(0) + 0xfee0);
  });
};

export const formatPunctuation = (s: string): string => {
  const handler = new PuncHandler(s);
  return handler.format();
};

export const toggleOxfordComma = (s: string): string => {
  if (s.match(/, &/)) {
    return s.replace(/, &/g, " &");
  }
  return s.replace(/ &/g, ", &");
};

export const toggleCommaType = (s: string): string => {
  return s.replace(/[、\uff0c]/g, (m: string) => {
    if (m == "\uff0c") {
      return "、";
    }
    return "\uff0c";
  });
};

export const formatHorizontalBars = (s: string): string => {
  return s.replace(/(?<=\d)-(?=\d)/g, "\u2013").replace(/(?<=[A-Za-z])-(?=[A-Za-z])/g, "\u2010");
};

class NestedBracketFormatter {
  private _formatted: string;
  constructor(line: string) {
    this._formatted = line;
  }
  apply(primary: string, alternative: string) {
    const l = new LineWithNestedBracket(this._formatted, primary, alternative);
    this._formatted = l.format();
  }
  getFormattedText(): string {
    return this._formatted;
  }
}

export const formatNestedBrackets = (s: string): string => {
  const formatter = new NestedBracketFormatter(s);
  formatter.apply("「」", "『』");
  formatter.apply("（）", "〔〕");
  return formatter.getFormattedText();
};

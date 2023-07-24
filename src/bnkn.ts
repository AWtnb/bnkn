import { HumanName } from "./human-name";
import { BRACKETS } from "./bracket-selector";

const isASCII = (s: string): boolean => {
  return Boolean(s.match(/[\x00-\x7f]/));
};

const FULLWIDTH_PUNC = "\uff0e\uff0c\uff1a\uff1b";
const HALFWIDTH_PUNC = ".,:;";

const toFullWidthPunc = (s: string): string => {
  const idx = HALFWIDTH_PUNC.indexOf(s);
  if (idx < 0) {
    return s;
  }
  return FULLWIDTH_PUNC.charAt(idx);
};
const toHalfWidthPunc = (s: string): string => {
  const idx = FULLWIDTH_PUNC.indexOf(s);
  if (idx < 0) {
    return s;
  }
  return HALFWIDTH_PUNC.charAt(idx);
};

const formatPunctuationWidth = (s: string): string => {
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const cur = s.charAt(i);
    if (i == 0 || [",", ".", ":", "\uff0c", "\uff0e", "\uff1a"].indexOf(cur) == -1) {
      stack.push(cur);
      continue;
    }
    const last = stack.slice(-1)[0];
    if (last == " ") {
      stack.pop();
    }
    if (cur == "." || cur == "," || cur == ":") {
      if (isASCII(last)) {
        stack.push(cur);
        stack.push(" ");
        continue;
      }
      stack.push(toFullWidthPunc(cur));
      continue;
    }
    if (isASCII(last)) {
      stack.push(toHalfWidthPunc(cur));
      stack.push(" ");
      continue;
    }
    stack.push(cur);
  }
  return stack.join("");
};

export class Bnkn {
  static toTortoiseBracket(s: string): string {
    return s.replace(/[（）\(\)]/g, (m: string) => {
      if (["（", "("].includes(m)) {
        return "〔";
      }
      return "〕";
    });
  }

  static swapHumanNamePosition(s: string): string {
    return new HumanName(s).swap();
  }

  static fixDumbQuotes(s: string): string {
    return s.replace(/["'].+?["']/g, (m: string) => {
      const prefix = m.startsWith('"') ? "\u201c" : "\u2018";
      const suffix = prefix == "\u201c" ? "\u201d" : "\u2019";
      return prefix + m.substring(1, m.length - 1) + suffix;
    });
  }

  static trimBrackets(s: string): string {
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
  }

  static toHalfWidth(s: string): string {
    return s.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g, (m: string) => {
      return String.fromCharCode(m.charCodeAt(0) - 0xfee0);
    });
  }

  static toFullWidth(s: string): string {
    return s.replace(/[A-Za-z0-9]/g, (m: string) => {
      return String.fromCharCode(m.charCodeAt(0) + 0xfee0);
    });
  }

  static toHalfWidthBracket(s: string): string {
    return s.replace(/[（）［］]/g, (m: string) => {
      if (m == "（") return "(";
      if (m == "）") return ")";
      if (m == "［") return "[";
      return "]";
    });
  }

  static toFullWidthBracket(s: string): string {
    return s.replace(/[\(\)\[\]]/g, (m: string) => {
      if (m == "(") return "（";
      if (m == ")") return "）";
      if (m == "[") return "［";
      return "］";
    });
  }

  static toSingle(s: string): string {
    return s.replace(/[“”『』"]/g, (m: string) => {
      if (m == "“") return "‘";
      if (m == "”") return "’";
      if (m == "『") return "「";
      if (m == "』") return "」";
      return "'";
    });
  }

  static toDouble(s: string): string {
    return s.replace(/[‘’「」']/g, (m: string) => {
      if (m == "‘") return "“";
      if (m == "’") return "”";
      if (m == "「") return "『";
      if (m == "」") return "』";
      return '"';
    });
  }

  static formatPunctuation(s: string): string {
    return formatPunctuationWidth(s)
      .replace(/[\.,\uff0e\uff0c]./g, (m: string) => {
        if (m == ".,") {
          return m;
        }
        const punc = m.charAt(0);
        const suffix = m.charAt(1);
        if (punc == "." || punc == ",") {
          if ([")", "'", '"'].includes(suffix)) {
            return m;
          }
          return suffix == " " ? m : punc + " " + suffix;
        }
        return suffix == " " ? m.trim() : m;
      })
      .replace(/\.,(?! )/g, "., ");
  }

  static toggleOxfordComma(s: string): string {
    if (s.match(/, &/)) {
      return s.replace(/, &/g, " &");
    }
    return s.replace(/ &/g, ", &");
  }

  static toggleCommaType(s: string): string {
    return s.replace(/[、\uff0c]/g, (m: string) => {
      if (m == "\uff0c") {
        return "、";
      }
      return "\uff0c";
    });
  }

  static formatHorizontalBars(s: string): string {
    return s.replace(/(?<=\d)-(?=\d)/g, "\u2013").replace(/(?<=[A-Za-z])-(?=[A-Za-z])/g, "\u2010");
  }
}

export const BNKN_MENU = new Map();
BNKN_MENU.set("fix dumb-quotes", Bnkn.fixDumbQuotes);
BNKN_MENU.set("format horizontal bars", Bnkn.formatHorizontalBars);
BNKN_MENU.set("format period and comma", Bnkn.formatPunctuation);
BNKN_MENU.set("swap familyname position", Bnkn.swapHumanNamePosition);
BNKN_MENU.set("to double-brackets", Bnkn.toDouble);
BNKN_MENU.set("to full-width", Bnkn.toFullWidth);
BNKN_MENU.set("to full-width-brackets", Bnkn.toFullWidthBracket);
BNKN_MENU.set("to half-width", Bnkn.toHalfWidth);
BNKN_MENU.set("to half-width-brackets", Bnkn.toHalfWidthBracket);
BNKN_MENU.set("to single-brackets", Bnkn.toSingle);
BNKN_MENU.set("to to-tortoise-brackets", Bnkn.toTortoiseBracket);
BNKN_MENU.set("toggle Comma type", Bnkn.toggleCommaType);
BNKN_MENU.set("toggle Oxford-comma", Bnkn.toggleOxfordComma);
BNKN_MENU.set("trim brackets", Bnkn.trimBrackets);

import { HumanName } from "./human-name";
import { BracketSelector } from "./bracket-selector";

export const BRACKET_SELECTOR = new BracketSelector();

const formatPunctuationWidth = (s: string): string => {
  const isASCII = (s: string): boolean => {
    return Boolean(s.match(/[\x00-\x7f]/));
  };
  const toFullWidth = (s: string): string => {
    return s == "." ? "\uff0e" : "\uff0c";
  };
  const toHalfWidth = (s: string): string => {
    return s == "\uff0e" ? "." : ",";
  };

  return s.replace(/.[\,\.\uff0c\uff0e]/g, (m: string) => {
    const prefix = m.charAt(0);
    const punc = m.charAt(1);
    if (punc == "." || punc == ",") {
      return isASCII(prefix) ? m : prefix + toFullWidth(punc);
    }
    return isASCII(prefix) ? prefix + toHalfWidth(punc) : m;
  });
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
    const pairs = BRACKET_SELECTOR.pairs;
    const lefts = pairs.map((p) => p.charAt(0));
    const c = s.charAt(0);
    if (lefts.includes(c)) {
      const found = pairs.filter((x) => x.charAt(0) == c);
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
    return formatPunctuationWidth(s).replace(/[\.\uff0e,\uff0c]./g, (m: string) => {
      const punc = m.charAt(0);
      const suffix = m.charAt(1);
      if (punc == "." || punc == ",") {
        return suffix == " " ? m : punc + " " + suffix;
      }
      return suffix == " " ? m.trim() : m;
    });
  }

  static toggleOxfordComma(s: string): string {
    if (s.match(/, &/)) {
      return s.replace(/, &/g, " &");
    }
    return s.replace(/ &/g, ", &");
  }
}

import * as vscode from "vscode";

import { HumanName } from "./human-name";
import { BracketSelector } from "./bracket-selector";

export const BRACKET_SELECTOR = new BracketSelector();

export class Bnkn {

  static toDoubleCornerBracket(s: string): string {
    return s.replace(/「/g, "『").replace(/」/g, "』");
  }

  static swapHumanNamePosition(s: string): string {
    return new HumanName(s).swap();
  }

  static fixDumbQuotes(s: string): string {
    return s.replace(/["'].+?["']/, (m: string) => {
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
    return s.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g, (s: string) => {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  }

  static toFullWidth(s: string): string {
    return s.replace(/[A-Za-z0-9]/g, (s: string) => {
      return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
    });
  }

  static toHalfWidthBracket(s: string): string {
    return s.replace(/[（）［］]/g, (s: string) => {
      if (s == "（") return "(";
      if (s == "）") return ")";
      if (s == "［") return "[";
      return "]";
    });
  }

  static toFullWidthBracket(s: string): string {
    return s.replace(/[\(\)\[\]]/g, (s: string) => {
      if (s == "(") return "（";
      if (s == ")") return "）";
      if (s == "[") return "［";
      return "］";
    });
  }

  static toSingle(s: string): string {
    return s.replace(/[“”『』"]/g, (s: string) => {
      if (s == "“") return "‘";
      if (s == "”") return "’";
      if (s == "『") return "「";
      if (s == "』") return "」";
      return "'";
    });
  }

  static toDouble(s: string): string {
    return s.replace(/[‘’「」']/g, (s: string) => {
      if (s == "‘") return "“";
      if (s == "’") return "”";
      if (s == "「") return "『";
      if (s == "」") return "』";
      return '"';
    });
  }
}

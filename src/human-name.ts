export class HumanName {
  readonly origin: string;
  readonly familyName: string;
  readonly restName: string;
  readonly isFamilyNameFirst: boolean;
  constructor(s: string) {
    this.origin = s.trim();
    if (s.indexOf(",") != -1) {
      this.isFamilyNameFirst = true;
      const [familyName, ...rest] = this.origin.split(",");
      this.familyName = familyName;
      this.restName = rest.join("");
      return;
    }
    this.isFamilyNameFirst = false;
    const elems = this.origin
      .replace(/\./g, ". ")
      .split(" ")
      .filter((x) => x.length);
    this.restName = elems.filter((x) => x.endsWith(".")).join("");
    this.familyName = elems.filter((x) => !x.endsWith(".")).join("");
  }

  formatFamilyName(): string {
    return this.familyName.trim();
  }

  formatRestName(): string {
    return this.restName.replace(/\./g, ". ").replace(/\s+/g, " ").trim();
  }

  getText(): string {
    if (this.isFamilyNameFirst) {
      return this.formatFamilyName() + ", " + this.formatRestName();
    }
    return this.formatRestName() + " " + this.formatFamilyName();
  }

  swap(): string {
    if (this.isFamilyNameFirst) {
      return this.formatRestName() + " " + this.formatFamilyName();
    }
    return this.formatFamilyName() + ", " + this.formatRestName();
  }
}

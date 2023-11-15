export class HumanName {
  private readonly _origin: string;
  private readonly _familyName: string;
  private readonly _restName: string;
  private readonly _isFamilyNameFirst: boolean;
  constructor(s: string) {
    this._origin = s.trim();
    if (s.indexOf(",") != -1) {
      this._isFamilyNameFirst = true;
      const [familyName, ...rest] = this._origin.split(",");
      this._familyName = familyName;
      this._restName = rest.join("");
      return;
    }
    this._isFamilyNameFirst = false;
    const elems = this._origin
      .replace(/\./g, ". ")
      .split(" ")
      .filter((x) => x.length);
    this._restName = elems.filter((x) => x.endsWith(".")).join("");
    this._familyName = elems.filter((x) => !x.endsWith(".")).join("");
  }

  private formatFamilyName(): string {
    return this._familyName.trim();
  }

  private formatRestName(): string {
    return this._restName.replace(/\./g, ". ").replace(/\s+/g, " ").trim();
  }

  getText(): string {
    if (this._isFamilyNameFirst) {
      return this.formatFamilyName() + ", " + this.formatRestName();
    }
    return this.formatRestName() + " " + this.formatFamilyName();
  }

  swap(): string {
    if (this._isFamilyNameFirst) {
      return this.formatRestName() + " " + this.formatFamilyName();
    }
    return this.formatFamilyName() + ", " + this.formatRestName();
  }
}

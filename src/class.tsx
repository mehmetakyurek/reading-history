
export type RDateType = {
  year: number,
  month: number,
  date: number
}
// Değişken türü ve isimleri karışıklığı düzeltilecek
export class RDate {
  private year: number;
  private month: number;
  private date: number;

  constructor(dateprop?: Date | RDateType) {
    const prop = dateprop || new Date();
    if (prop instanceof Date) {
      this.year = prop.getFullYear();
      this.month = prop.getMonth();
      this.date = prop.getDate();
    } else {
      this.year = prop.year;
      this.month = prop.month;
      this.date = prop.date;
    }
  }
  get Date(): RDateType {
    return { year: this.year, month: this.month, date: this.date };
  }
  get defaultDate(): Date {
    return new Date(this.year, this.month, this.date);
  }
  static isEqual(date?: RDateType, date2?: RDateType): boolean {
    return (date !== undefined && date2 !== undefined) && date.year === date2.year && date.month === date2.month && date.date === date2.date;
  }
  static parse(date: RDateType): number {
    return Date.parse(new RDate(date).defaultDate.toISOString())
  }
}


export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
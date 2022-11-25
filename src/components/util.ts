import { RDateType } from "../class";

export function createDateString(date: RDateType): string {
    return date.date + "." + (date.month + 1) + "." + date.year
}

export type FilterData = {
    text: string,
    book?: {
        name: string,
        list: number
    },
    date?: RDateType,
    tags?: string[]
}
export function FilterAlgorithm(data: FilterData, searchText?: string, tags?: string[]) {
    const s = searchText?.toLowerCase() || "";
    return ((
        (s === "" && !tags) ||
        data.text.toLowerCase().includes(s) ||
        data.book?.name.toLowerCase().includes(s) ||
        s.includes(data.book?.list === 0 ? "to read" : data.book?.list === 1 ? "reading" : "read") ||
        (data.date && createDateString(data.date).includes(s))) &&
        (
            (tags === undefined || tags?.length === 0) ||
            (tags?.filter(e => data.tags?.includes(e)).length || 0) > 0
        )) || false
}



export function getFirstDay(year: number, month: number) {
    var date = new Date(new Date().setFullYear(year, month, 1)).getDay();
    if (date === 0) return 7; else return date;
}
export function getPrevLastDate(year: number, month: number) {
    if (month === 0) { month = 12; year--; }
    return new Date(year, month, 0).getDate();
}


export function getDates(year: number, month: number) {
    const prevLast = getPrevLastDate(year, month);
    const first = getFirstDay(year, month);
    const last = new Date(year, month + 1, 0).getDate();
    let dates: Array<{
        next?: boolean,
        current?: boolean,
        prev?: boolean,
        date: number
    }> = [];
    for (let i = prevLast - (first - 2); i <= prevLast; i++) { dates.push({ prev: true, date: i }) }
    for (let i = 1; i <= last; i++) { dates.push({ current: true, date: i }) }
    for (let i = 1; i <= 42 - last - (first - 1); i++) { dates.push({ next: true, date: i }) }
    return dates;
}

export function splitAuthor(bookName?: string): string[] {
    return bookName ? bookName?.split(" - ") : ["", ""];
}
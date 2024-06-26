import store, { RootState } from "."
import { addBook } from "./reducers/lists"
import { addLog, updateDiaryText } from "./reducers/diary"

import faker from "faker/locale/en"
import { randomInteger, RDate, RDateType } from "../class"
import { QuoteField, addQuote } from "./reducers/quotes"
import { addSummary } from "./reducers/summaries"

let st: RootState;



setTimeout(() => {
    st = store.getState() as any as RootState;
}, 500);

const tags = faker.lorem.words(30).split(" ").map(e => "#" + e);

export const generate = () => {
    lilGenerateBook();
    setTimeout(() => st = store.getState() as any as RootState, 1000)
    setTimeout(() => CreateDiaryLog(), 2000);
    setTimeout(() => createQuotes(100), 2000);
    setTimeout(() => createSummaries(20), 2000);
}

export const generateBook = () => {
    const date = new Date();
    const year = date.getFullYear();
    date.setMonth(0, 1);

    while (date.getFullYear() < year + 1) {
        const count = randomInteger(0, 7) === 0 ? randomInteger(1, 5) : 0;
        for (let i = 0; i < count; i++) {
            store.dispatch(addBook({
                name: toTitleCase(faker.lorem.words(2) + " - " + faker.name.findName()),
                date: new RDate(date).Date,
                list: randomInteger(0, 2),
                pages: randomInteger(50, 600)
            }))
        }
        date.setDate(date.getDate() + 1)
    }
}

const lilGenerateBook = () => {
    const count = randomInteger(5, 15);
    for (var i = 0; i < count; i++) {
        const date = faker.date.between(new Date(new Date().setDate(-30)), new Date());
        const finishDate = faker.date.between(new Date(), new Date(new Date().setDate(60)));
        store.dispatch(addBook({
            name: toTitleCase(faker.lorem.words(2) + " - " + faker.name.findName()),
            date: new RDate(date).Date,
            finishDate: new RDate(finishDate).Date,
            list: randomInteger(0, 2),
            pages: randomInteger(50, 600),
        }))
    }
}

const generateDiary = (date: RDateType) => {
    const r = randomInteger(0, 5);
    for (let i = 0; i < r; i++) store.dispatch(addLog({ book: st.lists.flat()[randomInteger(0, st.lists.flat().length - 1)].id, date, read: randomInteger(0, 10) }));
    store.dispatch(updateDiaryText({ date, text: faker.lorem.paragraphs(randomInteger(0, 3)) }));
}

const generateQuote = (store: RootState): Omit<QuoteField, "id"> => {
    const set = new Set<string>();
    const n = randomInteger(0, 5)
    while (set.size < n) set.add(tags[randomInteger(0, tags.length - 1)])

    const tgs = [...set].reduce((prev, current) => { return prev + " " + current }, "")


    return {
        book: store.lists.flat()[randomInteger(0, store.lists.flat().length - 1)].id,
        date: new RDate(faker.date.past()).Date,
        text: faker.lorem.paragraph(randomInteger(1, 5)) + "\r\n" + tgs,
        page: randomInteger(0, 100)
    }
}

export const CreateDiaryLog = () => {
    return new Promise(res => {
        const year = new Date().getFullYear();
        const d = new Date(year, 0, 1);
        while (d.getFullYear() !== year + 1) {
            generateDiary(new RDate(d).Date);
            d.setDate(d.getDate() + 1);
        }
        res(null);
    })
}

export const CreateBookLogs = (count: number = 1) => {
    for (let i = 1; i <= count; i++) generateBook();
}

export const createQuotes = (count: number = 1) => {
    return new Promise(res => {
        for (let i = 0; i <= count; i++) store.dispatch(addQuote(generateQuote(st)));
        res(null);
    })
}

export const createSummaries = (count: number = 1) => {
    return new Promise(res => {
        for (let i = 0; i <= count; i++) {
            store.dispatch(addSummary({
                book: st.lists.flat()[randomInteger(0, st.lists.flat().length - 1)].id,
                date: new RDate(faker.date.past()).Date,
                rating: randomInteger(0, 5),
                text: faker.lorem.paragraphs(randomInteger(1, 5))
            }))
        }
        res(null);
    })
}

function toTitleCase(str: string) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

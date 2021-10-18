import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { nanoid } from "nanoid";
import { RootState } from "..";
import { RDateType } from "../../class";
import { getTags } from "./utilities";
import { BookState } from "./main";

export type QuoteField = {
    id: string
    book?: BookState["id"],
    date: RDateType,
    text: string,
    page?: number,
    customName?: string,
    tags?: Array<string>
}
export type Quote = Omit<QuoteField, "book"> & { book?: BookState };




const quotesSlice = createSlice({
    name: "quotes",
    initialState: [] as QuoteField[],
    reducers: {
        addQuote: {
            reducer: (state, action: PayloadAction<QuoteField>) => { state.push(action.payload) },
            prepare: (quote: Omit<QuoteField, "id">) => {
                return { payload: { id: nanoid(), tags: getTags(quote.text), ...quote } }
            }
        },
        updateQuote(state, action: PayloadAction<{ id: string, text: string, book?: string, author?: string, page?: number, customName?: string }>) {
            const logIndex = state.findIndex(e => e.id === action.payload.id);

            state[logIndex] = {
                ...state[logIndex],
                ...(action.payload.page && { page: action.payload.page }),
                text: action.payload.text,
                book: action.payload.book || undefined,
                customName: !action.payload.book ? action.payload.customName ?? undefined : undefined,
                tags: getTags(action.payload.text)
            }
        },
        deleteQuote(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(e => e.id === action.payload.id);
            if (index > -1) state.splice(index, 1);
        },
        empty: (state) => []
    }
});

const getBooks = (state: RootState) => state.main.books;
const getQuotes = (state: RootState) => state.quotes;

export const quotesSelector = createSelector([getBooks, getQuotes], (books, quotes) => {
    const data: Array<Quote> = [];
    for (let e of quotes) {
        const book = books.find(q => q.id === e.book);
        if (book) data.push({ ...e, book: book })
        else data.push({ ...e, book: undefined })

    }

    return data.reverse();
})

export default quotesSlice.reducer;
export const { addQuote, empty, updateQuote, deleteQuote } = quotesSlice.actions;

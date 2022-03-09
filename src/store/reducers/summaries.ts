import { createSlice, PayloadAction, nanoid, createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { RDateType } from "../../class"
import { BookState } from "./main"
import { getTags } from "./utilities"

type SummaryField = {
    id: string,
    book?: BookState["id"], //Change to id
    date: RDateType,
    rating?: number,
    text: string,
    source?: string
    page?: number,
    tags?: string[]
}

export type Summary = Omit<SummaryField, "book"> & { book?: BookState };

const initialState: SummaryField[] = []


const SummariesSlice = createSlice({
    name: "summaries",
    initialState,
    reducers: {
        addSummary: {
            reducer: (state, action: PayloadAction<SummaryField>) => { state.push(action.payload) },
            prepare: (summary: Omit<SummaryField, "id">) => ({
                payload: { id: nanoid(), tags: getTags(summary.text || ""), ...summary }
            })
        },
        updateSummary(state, action: PayloadAction<Partial<SummaryField>>) {
            const id = state.findIndex(e => e.id === action.payload.id)
            state[id].tags = getTags(action.payload.text || "");
            state[id].text = action.payload.text || "";
        },
        updateBook(state, action: PayloadAction<Pick<SummaryField, "id" | "book" | "source">>) {
            const id = state.findIndex(e => e.id === action.payload.id);
            if (id > -1) {
                state[id].book = action.payload.book;
                state[id].source = action.payload.source;
            }
        },
        deleteSummary(state, action: PayloadAction<{ id: string }>) {
            const index = state.findIndex(e => action.payload.id === e.id);

            if (index > -1) state.splice(index, 1);
        },
        empty: (state) => state = []
    }
})


export const SummariesSelector = createSelector([
    (state: RootState) => state.main.books,
    (state: RootState) => state.summaries],
    (books, summaries) => {
        const data: Array<Summary> = [];
        for (const e of summaries) {
            const book = books.find(q => q.id === e.book);
            data.push({ ...e, book: book });
        }
        return data;
    })

export const { addSummary, updateBook, updateSummary, deleteSummary } = SummariesSlice.actions;
export default SummariesSlice.reducer;
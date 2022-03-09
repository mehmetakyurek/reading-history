import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "../index"
import { nanoid } from "nanoid"
import { RDateType } from "../../class";

export type BookList = "toRead" | "reading" | "read";

export type BookState = {
    id: string
    name: string,
    author?: string,
    pages?: number,
    list?: BookList,
    date?: RDateType
}

const books: Array<BookState> = []
const initialState = {
    target: 50,
    completed: 0,
    books: books
}

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        addBook: {
            reducer(state, action: PayloadAction<BookState>) {
                state.books.push(action.payload);
            },
            prepare: (book: Omit<BookState, "id">) => ({ payload: { id: nanoid(), ...book } })
        },
        updateBook(state, action: PayloadAction<Partial<BookState>>) {
            const id = state.books.findIndex(e => e.id === action.payload.id);
            state.books[id] = { ...state.books[id], ...action.payload }
        },
        deleteBook(state, action: PayloadAction<string>) {
            const index = state.books.findIndex(e => e.id === action.payload);
            if (index > -1) state.books.splice(index, 1);
        },
        setTarget(state, action) {
            state.target = action.payload;
        },
        setCompleted(state, action) {
            state.completed = action.payload;
        },
        empty(state) {
            state.books = [];
        }
    }
});
export const completedSelector = (state: RootState) => {
    return state.main.books.filter(e => e.list === "read")
};

export const { setTarget, setCompleted, addBook, empty, updateBook, deleteBook } = mainSlice.actions;
export default mainSlice.reducer;
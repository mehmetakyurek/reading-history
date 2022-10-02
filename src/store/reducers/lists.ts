import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { RDateType } from "../../class";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type BookState = {
    id: string
    name: string,
    pages?: number,
    list: number,
    finishDate?: RDateType
    date?: RDateType
}

const ListsSlice = createSlice({
    name: "Lists",
    initialState: [[],[],[]] as Array<Array<BookState>>,
    reducers: {
        addBook: {  
            reducer(state, action: PayloadAction<BookState>) {
                if(!state[action.payload.list]) state[action.payload.list] = [];
                state[action.payload.list].push(action.payload);
            },
            prepare: (book: PartialBy<Omit<BookState, "id">, "list">) => {
                const list = (!book.list || !(book.list in [0, 1, 2])) ? 0 : book.list
                return { payload: { id: nanoid(), list, ...book } }
            }
        },
        updateBook(state, action: PayloadAction<BookState>) {
            const index = state[action.payload.list].findIndex(e => e.id === action.payload.id);
            state[action.payload.list][index] = { ...state[action.payload.list][index], ...action.payload }
        },
        deleteBook(state, action: PayloadAction<{ list: number, id: string }>) {
            const index = state[action.payload.list].findIndex(e => e.id === action.payload.id);
            if (index > -1) state[action.payload.list].splice(index, 1);
        },
        move(state, action: PayloadAction<{ id: string, list: number, order?: number }>) {
            console.log(action.payload.order);
            
        }
    }
})
export const { addBook, deleteBook, move, updateBook } = ListsSlice.actions;

export default ListsSlice.reducer;
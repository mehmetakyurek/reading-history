import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { RDateType } from "../../class";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type BookState = {
    id: string
    name: string,
    pages?: number,
    list: number,
    finishDate?: RDateType
    date?: RDateType,
    note?: string
}

const ListsSlice = createSlice({
    name: "Lists",
    initialState: [[], [], []] as Array<Array<BookState>>,
    reducers: {
        addBook: {
            reducer(state, action: PayloadAction<BookState>) {
                if (!state[action.payload.list]) state[action.payload.list] = [];
                state[action.payload.list].push(action.payload);
            },
            prepare: (book: PartialBy<Omit<BookState, "id">, "list">) => {
                const list = (!book.list || !(book.list in [0, 1, 2])) ? 0 : book.list
                return { payload: { id: nanoid(), list, ...book } }
            }
        },
        setNote(state, action: PayloadAction<{ bookId: string, text: string }>) {
            const [list, index] = state.reduce((result, value, index) => {
                const i = value.findIndex(e => e.id === action.payload.bookId);
                if (i > 0) return [index, i];
                else return result;
            }, [0, 0])
            if (state[list][index]) state[list][index].note = action.payload.text;
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

            if (action.payload.list <= 2 && action.payload.list >= 0) {
                let OldId = -1;
                const oldList = state.findIndex(list =>
                    list.findIndex((item, index) => {
                        if (item.id === action.payload.id) {
                            OldId = index;
                            return true;
                        }
                    }) >= 0
                )
                const oldItem = state[oldList].splice(OldId, 1)[0];
                if (action.payload.order && typeof Number(action.payload.order) === 'number' && action.payload.order > -1)
                    state[action.payload.list].splice(action.payload.order!, 0, oldItem)
                else
                    state[action.payload.list].push(oldItem);
            }
        }
    }
})
export const { addBook, deleteBook, move, updateBook, setNote } = ListsSlice.actions;

export default ListsSlice.reducer;

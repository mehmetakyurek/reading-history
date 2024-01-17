import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RDate, RDateType } from "../../class";


type TempType = {
    date: RDateType,
    content: {
        view: 'main'
    } | { id: string, view: 'note' | 'quotes' },
    editList: Array<string>
}

const initialState: TempType = {
    date: new RDate().Date,
    content: {
        view: 'main'
    },
    editList: []
}

const temp = createSlice({
    name: "temp",
    initialState,
    reducers: {
        setDate(state, action: PayloadAction<RDateType>) { state.date = action.payload; },
        setContent(state, action: PayloadAction<TempType["content"]>) {
            if (state.content.view !== 'main' && state.content.view === action.payload.view && state.content.id === action.payload.id) {
                state.content = { view: 'main' }
            } else state.content = action.payload;
        },
        toggleBook(state, action: PayloadAction<string>) {
            const index = state.editList.indexOf(action.payload);
            index >= 0 ? state.editList.splice(index, 1) : state.editList.push(action.payload);
        },
        setEditList(state, action: PayloadAction<Array<string>>) {
            state.editList = action.payload
        }
    }
});

export const { setDate, setContent, toggleBook, setEditList } = temp.actions;
export default temp.reducer;
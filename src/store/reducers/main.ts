import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "../index"

export type BookList = "toRead" | "reading" | "read";



const initialState = {
    target: 50,
    completed: 0
}

const mainSlice = createSlice({
    name: "main",
    initialState,
    reducers: {
        
        setTarget(state, action) {
            state.target = action.payload;
        },
        setCompleted(state, action) {
            state.completed = action.payload;
        }
    }
});
export const completedSelector = (state: RootState) => {
    return state.lists[2];
};

export const { setTarget, setCompleted } = mainSlice.actions;
export default mainSlice.reducer;
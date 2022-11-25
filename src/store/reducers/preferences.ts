import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Prefs = {
    dailyReadingTarget: number
    spellcheck: boolean
}

const initialState: Prefs = {
    dailyReadingTarget: 50,
    spellcheck: true
}

const prefSlice = createSlice({
    name: "prefs",
    initialState,
    reducers: {
        setDailyReadingTarget(state, action: PayloadAction<number>) { state.dailyReadingTarget = action.payload },
        setSpellcheck(state, action: PayloadAction<boolean>) { state.spellcheck = action.payload }
    }
})

export default prefSlice.reducer;

export const { setDailyReadingTarget, setSpellcheck } = prefSlice.actions;
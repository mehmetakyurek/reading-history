import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Prefs = {
    dailyReadingTarget: number
    spellcheck: boolean,
    selectType: 'range' | 'list'
}

const initialState: Prefs = {
    dailyReadingTarget: 50,
    spellcheck: true,
    selectType: 'list'
}

const prefSlice = createSlice({
    name: "prefs",
    initialState,
    reducers: {
        setDailyReadingTarget(state, action: PayloadAction<number>) { state.dailyReadingTarget = action.payload },
        setSpellcheck(state, action: PayloadAction<boolean>) { state.spellcheck = action.payload },
        setSelectType(state, action: PayloadAction<'list' | 'range'>) { state.selectType = action.payload }
    }
})

export default prefSlice.reducer;

export const { setDailyReadingTarget, setSpellcheck, setSelectType } = prefSlice.actions;
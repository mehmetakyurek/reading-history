import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { RDate, RDateType } from "../../class"
import { BookState } from "./lists"

export type DiaryField = {
    id: string
    date: RDateType,
    readBooks: Array<{ id: string, book?: BookState["id"], read: number, customName?: string }>
    text: string
}

/**
 * @param date Date object id of the log
 */
type AddLogParameters = DiaryField["readBooks"][0] & { date: RDateType | string };

const DiarySlice = createSlice({
    name: "diary",
    initialState: [] as Array<DiaryField>,
    reducers: {
        addLog: {
            reducer: (state, action: PayloadAction<AddLogParameters & { idforLog: string }>) => {
                const log = state.find(e => dayPredicator(e, action.payload.date))
                if (log) log.readBooks.push(action.payload);
                else if (typeof action.payload.date === "object")
                    state.push({
                        date: action.payload.date,
                        id: action.payload.idforLog,
                        readBooks: [action.payload],
                        text: ""
                    });
            },
            prepare: (data: Omit<AddLogParameters, "id">) => {
                return { payload: { idforLog: nanoid(), id: nanoid(), ...data } }
            }
        },
        updateDiaryText: {
            reducer: (state, action: PayloadAction<{ date: RDateType | string, text: string, id: string }>) => {
                const log = state.findIndex(e => dayPredicator(e, action.payload.date))
                if (log >= 0) {
                    state[log].text = action.payload.text;
                } else if (typeof action.payload.date === "object")
                    state.push({
                        date: action.payload.date,
                        id: action.payload.id,
                        readBooks: [],
                        text: action.payload.text
                    })
            },
            prepare: (data: { date: RDateType | string, text: string }) => {
                return { payload: { id: nanoid(), ...data } }
            }
        },
        addDay: {
            reducer: (state, action: PayloadAction<DiaryField>) => { state.push(action.payload) },
            prepare: (data: Omit<DiaryField, "id">) => ({ payload: { id: nanoid(), ...data } })
        },
        updateLog(state, action: PayloadAction<{ date: RDateType | string, id?: string, data: { book?: string, read?: number, customName?: string } }>) {
            let index = state.findIndex(e => dayPredicator(e, action.payload.date));

            if (index < 0 && typeof action.payload.date === "object" && action.payload.data.book && action.payload.data.read) {
                state.push({
                    date: action.payload.date,
                    id: nanoid(),
                    readBooks: [{ id: nanoid(), book: action.payload.data.book, read: action.payload.data.read }],
                    text: ""
                })
            } else {
                let log = state[index].readBooks.findIndex(e => e.id === action.payload.id || e.book === action.payload.data.book);
                console.log(log);
                console.log(action.payload);


                if (action.payload.data.customName) state[index].readBooks[log].book = "";
                if (log >= 0) state[index].readBooks[log] = { ...state[index].readBooks[log], ...action.payload.data }
                else {
                    state[index].readBooks.push({ id: nanoid(), read: 0, ...action.payload.data })
                }
            }
        },
        removeLog(state, action: PayloadAction<{ date: RDateType | string, id: string }>) {
            const log = state.findIndex(e => dayPredicator(e, action.payload.date));
            state[log].readBooks.splice(state[log].readBooks.findIndex(e => e.id === action.payload.id), 1);
        },
        deleteAll(state, action) {
            state = new Array<DiaryField>();
        }
    }
})

function dayPredicator(e: DiaryField, date: RDateType | string) {
    if (typeof date === "string") return e.id === date; else return RDate.isEqual(e.date, (date as RDateType))
}

export const { addDay, addLog, updateDiaryText, updateLog, removeLog, deleteAll } = DiarySlice.actions;
export default DiarySlice.reducer;
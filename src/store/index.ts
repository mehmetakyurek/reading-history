import { combineReducers, createStore } from "@reduxjs/toolkit"
import MainReducer, { } from "./reducers/main"
import DiarySlice from "./reducers/diary"
import SummariesSlice from "./reducers/summaries"
import QuotesSlice from "./reducers/quotes"
import ListsSlice from "./reducers/lists"
import { persistStore, persistReducer } from 'redux-persist'
import { PersistorOptions } from "redux-persist/es/types"

const RootReducer = combineReducers({
  main: MainReducer,
  diary: DiarySlice,
  summaries: SummariesSlice,
  quotes: QuotesSlice,
  lists: ListsSlice
})

const persistConfig = {
  key: 'root',
  storage: window.electron.storage
}

const persistedReducer = persistReducer(persistConfig, RootReducer) // Removed <any> type casting from RootReducer


const store = createStore(persistedReducer)

export type RootState = ReturnType<typeof RootReducer>;

export default store;

export let persistor = persistStore(store, ({
  manualPersist: true
} as unknown) as PersistorOptions)


export type { BookState } from "./reducers/lists"
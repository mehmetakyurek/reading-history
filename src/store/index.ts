import { combineReducers, createStore } from "@reduxjs/toolkit"

import MainReducer, { } from "./reducers/main"
import DiarySlice from "./reducers/diary"
import SummariesSlice from "./reducers/summaries"
import QuotesSlice from "./reducers/quotes"

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { composeWithDevTools } from 'redux-devtools-extension';
import { generate } from "./DataGenerator"


const RootReducer = combineReducers({
  main: MainReducer,
  diary: DiarySlice,
  summaries: SummariesSlice,
  quotes: QuotesSlice
})

const persistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, RootReducer) // Removed <any> type casting from RootReducer


const store = createStore(persistedReducer, composeWithDevTools())

export type RootState = ReturnType<typeof RootReducer>;

export default store;

export let persistor = persistStore(store)

if (localStorage.getItem("generateData") === "true") {
  localStorage.removeItem("generateData");
  setTimeout(generate, 1000);
}
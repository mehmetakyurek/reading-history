import React from 'react';
import {
  MemoryRouter as Router,
  Route,
  Routes
} from "react-router-dom"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"


import { persistor } from "./store/index"
import './App.css';

//"typescript.preferences.importModuleSpecifier": "relative",

import Main from "./components/Main"
import Diary from "./components/Diary"
import Quotes from "./components/Quotes"
import Settings from "./components/Settings"
import Summaries from './components/Summaries';

import store from "./store"

import { generate } from "./store/DataGenerator"

import TitleBar from './components/TitleBar';
import LogList from './components/LogList';
class App extends React.Component {
  render() {
    persistor.persist();

    if (localStorage.getItem("generateData") === "true") {
      localStorage.removeItem("generateData");
      setTimeout(generate, 1000);
    }
    return <Provider store={store}>
      <PersistGate persistor={persistor} loading={<div>loading</div>}>

        <Router initialEntries={["/main"]}>
          <div className="App">
            <Routes>
              <Route path="/main" element={<Main />}></Route>
              <Route path="/plan" element={<LogList />}></Route>
              <Route path="/diary" element={<Diary />}></Route>
              <Route path="/settings" element={<Settings />}></Route>
              <Route path="/quotes" element={<Quotes />}></Route>
              <Route path="/summaries" element={<Summaries />}></Route>
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  }
}

export default App;
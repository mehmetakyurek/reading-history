import React from 'react';
import {
  MemoryRouter as Router,
  Switch,
  Route,
  Redirect,
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
            <Switch>
              <Route path="/main"><TitleBar page="Main" /><Main /></Route>
              <Route path="/plan"><TitleBar page="Plan" /><LogList /></Route>
              <Route path="/diary"><TitleBar page="Diary" /><Diary /></Route>
              <Route path="/settings"><TitleBar page="Settings" /><Settings /></Route>
              <Route path="/quotes"><TitleBar page="Quotes" /><Quotes /></Route>
              <Route path="/summaries"><TitleBar page="Summaries" /><Summaries /></Route>
              <Route path="/logout"><Redirect to="/" /></Route>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  }
}

export default App;
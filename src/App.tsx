import React from 'react';
import logo from './logo.svg';
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

import Login from "./components/Login"
import Main from "./components/Main"
import Diary from "./components/Diary"
import Quotes from "./components/Quotes"
import Settings from "./components/Settings"
import Summaries from './components/Summaries';
import Plan from "./components/Plan"

import store from "./store"

import { generate } from "./store/DataGenerator"

import BookInput from './components/BookInput'; //Test
import TitleBar from './components/TitleBar';
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
              <Route path="/plan"><TitleBar page="Plan" /><Plan /></Route>
              <Route path="/diary"><TitleBar page="Diary" /><Diary /></Route>
              <Route path="/settings"><TitleBar page="Settings" /><Settings /></Route>
              <Route path="/quotes"><TitleBar page="Quotes" /><Quotes /></Route>
              <Route path="/summaries"><TitleBar page="Summaries" /><Summaries /></Route>
              <Route path="/plan" component={Plan} />
              <Route path="/logout"><Redirect to="/" /></Route>

              <Route path="/book">
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#32343D"
                }}><BookInput changeLayout={true} value="Aut Blanditiis - Wilbert Hackett" /></div>
              </Route>
            </Switch>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  }
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./components/Login"
import { createRoot } from "react-dom/client"


const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Login>
      <App />
    </Login>
  </React.StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./components/Login"

ReactDOM.render(
  <React.StrictMode>
    <Login>
      <App />
    </Login>
  </React.StrictMode>,
  document.getElementById('root')
);

export function getWeekDays(weekDay: "short" | "long", locale: string = "default"): Array<string> {
  var baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
  var weekDays = [];
  for (var i = 0; i < 7; i++) {
    weekDays.push(baseDate.toLocaleDateString(locale, { weekday: weekDay }));
    baseDate.setDate(baseDate.getDate() + 1);
  }
  return weekDays;
}
export function getMonths(month: "short" | "long", locale: string = "default"): Array<string> {
  const date = new Date(2021, 0, 1);
  const months: Array<string> = [];
  while (date.getFullYear() === 2021) {
    months.push(date.toLocaleString(locale, {
      month: month
    }));
    date.setMonth(date.getMonth() + 1)
  }
  return months;
}

import classes from "./styles/Datepicker.module.scss";
import { FC, ReactElement, useEffect, useState } from "react"

import { getMonths, getWeekDays } from "./util"
import { RDateType } from "../class";
import { getFirstDay, getPrevLastDate } from "./util";

const days = getWeekDays("short"); //Global var
const months = getMonths("long");
const DateNow = new Date();
type DatepickerProps = {
    date: RDateType | Date,
    dateChanged: (date: RDateType) => void,
    changed: boolean
};

type DatepickerState = {
    year: number,
    month: number,
    date: number
}

const Datepicker: FC<DatepickerProps> = (props): ReactElement => {
    const [content, setContent] = useState<"date" | "month" | "year">("date");
    const date = (props.date instanceof Date ? props.date : new Date(props.date.year, props.date.month, props.date.date));

    const [state, setState] = useState<DatepickerState>({
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate()
    })
    useEffect(() => {
        const d = (props.date instanceof Date ? props.date : new Date(props.date.year, props.date.month, props.date.date));
        setState({
            year: d.getFullYear(),
            month: d.getMonth(),
            date: d.getDate()
        })
    }, [props.changed])
    const SetDate = (d: { year?: number, month?: number, date?: number }) => {
        setState({ ...state, ...d });
        if (d.month || d.year) setContent("date");
        props.dateChanged({ year: d.year ? d.year : state.year, month: d.month ? d.month : state.month, date: d.date ? d.date : state.date });
    }
    if (date)
        return <div className={classes["datepicker"]}>
            <div className={classes["datepicker-content-container"]}>
                <div className={classes["datepicker-title"]}>
                    <div className={classes["datepicker-title-year"]} onClick={e => { setContent(content === "year" ? "date" : "year") }}>{state.year}</div>
                    <div className={classes["datepicker-title-right"]}>
                        <div className={classes["datepicker-title-date"]}>{state.date}</div>
                        <div className={classes["datepicker-title-month"]} onClick={e => { setContent(content === "month" ? "date" : "month") }}>{months[state.month]}</div>
                    </div>
                </div>
                <div className={classes["datepicker-content"]}>
                    {
                        content === "date" ? <DateSelector state={state} setDate={(date) => { SetDate({ date }) }} /> :
                            content === "month" ? <MonthSelector state={state} setMonth={month => { SetDate({ month }); }} /> :
                                content === "year" ? <YearSelector state={state} setYear={year => { SetDate({ year }) }} /> : ""
                    }
                </div>
            </div>
        </div>
    else return <div>Incorrect Date</div>
}

const DateSelector: FC<{ state: DatepickerState, setDate: (date: number) => void }> = (props): ReactElement => {
    let prevMonth: Array<ReactElement> = [];
    let dates: Array<ReactElement> = [];
    let rest: Array<ReactElement> = [];
    const prevLast = getPrevLastDate(props.state.year, props.state.month);
    const first = getFirstDay(props.state.year, props.state.month);
    const last = new Date(props.state.year, props.state.month + 1, 0).getDate();

    for (let i = prevLast - (first - 2); i <= prevLast; i++) { prevMonth.push(<div key={i} className={classes["datepicker-date-prev"]}>{i}</div>) }
    for (let i = 1; i <= last; i++) { dates.push(<div key={i} className="datepicker-date" data-index={i} onClick={e => props.setDate(Number(e.currentTarget.dataset.index))}>{i}</div>) }
    for (let i = 1; i <= 42 - last - (first - 1); i++) { rest.push(<div key={i} className={classes["datepicker-date-rest"]}>{i}</div>) }
    return <div className={classes["datepicker-day-selector"]}>
        {days.map(e => <div key={e} className={classes["datepicker-day-selector-day"]}>{e}</div>)}
        {prevMonth}{dates}{rest}
    </div>
}
const MonthSelector: FC<{ state: DatepickerState, setMonth: (month: number) => void }> = (props): ReactElement => {
    //const click = (e: React.MouseEvent<HTMLDivElement>) => { e.currentTarget.dataset["index"] }   
    return <div className={classes["datepicker-month-selector"]}>
        {
            months.map((e, index) => <div key={index} className={classes["datepicker-month"] + (DateNow.getMonth() === index ? (" " + classes["month-now"]) : "")} data-index={index} onClick={e => props.setMonth(Number(e.currentTarget.dataset.index))}>
                {e}
            </div>)
        }
    </div>
}
const YearSelector: FC<{ state: DatepickerState, setYear: (year: number) => void }> = (props): ReactElement => {
    const elements: Array<ReactElement> = [];
    for (let i = props.state.year - 4; i <= props.state.year + 4; i++) elements.push(
        <div key={i} className={classes["datepicker-year"] + (DateNow.getFullYear() === i ? (" " + classes["year-now"]) : "")} data-index={i} onClick={e => props.setYear(Number(e.currentTarget.dataset.index))}>
            {i}
        </div>);
    return <div className={classes["datepicker-year-selector"]}>
        {elements}
    </div>
}

export default Datepicker;

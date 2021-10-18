import { FC, useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { getMonths } from "..";
import { RootState } from "../store";
import classes from "./styles/Plan.module.scss";

import Monthly from "./PlanMonthly"
import TitleBar from "./TitleBar"
import { MemoryRouter, Link, Route, Switch, useRouteMatch } from "react-router-dom";
import cn from "classnames"

const months = getMonths("long");

const Plan: FC = () => {
    let match = useRouteMatch();
    return <>
        <Route path={`/plan/:y/:m`} component={Monthly} />
        <Route exact path={`/plan`} component={Months} />
    </>
}

const Months: FC<{ year?: number, onSelected?: (year: number, month: number) => void }> = (props) => {
    const months = [];
    const [presentYear, setPresentYear] = useState(new Date().getFullYear());
    const [year, setYear] = useState(props.year || presentYear);
    const YearBarItems = [];
    useEffect(() => setYear(props.year || new Date().getFullYear()), [props.year])

    for (let i = 0; i <= 11; i++) {
        months.push(<MonthItem year={year} month={i} key={year.toString() + "." + i.toString()} onClick={props.onSelected} />)
    }

    for (let i = presentYear - 9; i <= presentYear + 9; i++) {
        YearBarItems.push(<div className={cn([classes.YearBarItem, { [classes.Present]: i === presentYear, [classes.Selected]: i === year }])}
            onClick={(e) => setYear(i)}
        >{i}</div>)
    }

    return <div className={classes["plan-container"]}>
        <div className={classes.Header} onWheel={(e) => setPresentYear(e.deltaY < 0 ? presentYear - 1 : presentYear + 1)}>
            {YearBarItems}
        </div>
        <div className={classes.MonthsContainer}>
            {months}
        </div>
    </div>
}

const MonthItem: FC<{ year: number, month: number, hideCurrentMonth?: boolean, onClick?: (year: number, month: number) => void }> = (props) => {
    const now = new Date();
    const [date, setDate] = useState(now.getDate());
    const [current, setCurrent] = useState((!props.hideCurrentMonth) && now.getFullYear() == props.year && now.getMonth() === props.month);

    const books = useSelector((state: RootState) => state.main.books.filter(e => e.date?.year === props.year && e.date?.month === props.month).sort((a, b) => { return (a.date?.date ?? 0) - (b.date?.date ?? 0) }));
    const todayIndex = current ? books.findIndex((e, index) => ((index === 0 && (e.date?.date ?? 0) >= date && date < (books[index + 1]?.date?.date ?? 0)) || ((e.date?.date ?? 0) >= date && index > 0 && (books[index - 1].date?.date ?? 0) < date))) || -1 : -1;
    const startIndex = books.length > 4 && todayIndex > 2 ? todayIndex - (1 + (2 - (books.length - 1 - todayIndex) < 0 ? 0 : 2 - (books.length - 1 - todayIndex))) : 0;


    return <div className={classes["month-container"]} onClick={e => props.onClick?.(props.year, props.month)}>
        <Link to={`/plan/${props.year}/${props.month}`} >

            <div className={classes["month-container-inside"]}>
                {current && < div className={classes["current-date-indicator"]}>
                    <svg viewBox="0 0 55 55" >
                        <path d="M 5,5 50,5 50,50 z" strokeLinejoin="round" strokeLinecap="round" strokeWidth="10" stroke="black" />
                        <text x="50%" y="50%" fontSize="20" >
                            {date}
                        </text>
                    </svg>
                </div>}
                <div className={classes["month-header"]}>{months[props.month ?? -1]}</div>
                <div className={classes["month-logs"]}>

                    {books.slice(startIndex, startIndex + 4).map((e, index) => <LogRow
                        date={e.date?.date ?? 0}
                        book={e.name + (e.author?.length || 0 > 0 ? " - " + e.author : "")}
                        read={e.list === "read"}
                        currentMonth={current}
                        current={current && (startIndex + index) === (todayIndex)}
                        key={e.id}
                    />)}
                </div>
                <div className={classes["logs-remaining"]}>{books.length - 3 > 0 ? "+" + (books.length - 3) : ""}</div>
            </div>
        </Link>
    </div>
}

type Log = {
    date?: number,
    book?: string,
    read?: boolean,
    currentMonth?: boolean
    current?: boolean
}

const LogRow: FC<Log> = (props) => {
    return <div className={classes["log-row"]}>
        {props.currentMonth && <div className={classes["log-row-line"] + (props.current ? (" " + classes["log-row-line-circle"]) : "")}>

        </div>}
        <div className={classes["log-row-date"] + (props.read ? " " + classes["read"] : "")}>{props.date}</div>
        <div className={classes["log-row-book"]}>{props.book}</div>
    </div>
}

export default Plan;
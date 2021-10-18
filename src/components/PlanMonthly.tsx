import { FC, useEffect, useState, useRef, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import { getMonths, getWeekDays } from ".."
import { RootState } from "../store";
import classes from "./styles/PlanMonthly.module.scss"
import { getDates } from "./util";
import cn from "classnames"

import { ReactComponent as PlusIcon } from "./styles/img/plus.svg"
import { createPortal } from "react-dom";
import { RDate, RDateType } from "../class";
import { addBook, BookState, deleteBook, updateBook } from "../store/reducers/main";
import TitleBar from "./TitleBar";

const months = getMonths("long");
const days = getWeekDays("long");

const root = document.getElementById("root");

const Monthly: FC = (props) => {
    const present = new Date().getMonth();
    const { y, m } = useParams<{ y: string, m: string }>();
    const [year, month] = [Number(y), Number(m)];

    const [OC, setOC] = useState(0);
    const [editDate, setDate] = useState<RDateType>({} as RDateType);

    const dates = getDates(year, month);

    let data = useSelector((state: RootState) => {
        const [py, pm] = month === 0 ? [year - 1, 11] : [year, month - 1];
        const [ny, nm] = month === 11 ? [year + 1, 0] : [year, month + 1];
        const prev = state.main.books.filter(e => (e.date?.year === py && e.date.month === pm && e.date.date >= dates.filter(e => e.prev === true)[0]?.date));
        const current = state.main.books.filter(e => (e.date?.year === year && e.date.month === month));
        const next = state.main.books.filter(e => (e.date?.year === ny && e.date.month === nm && e.date.date <= dates.filter(e => e.next === true).slice(-1)[0]?.date));

        return dates.map(e => {
            const data = e.prev ? prev.filter(q => q.date?.date === e.date) :
                e.current ? current.filter(q => q.date?.date === e.date) :
                    e.next ? next.filter(q => q.date?.date === e.date) : undefined
            return {
                ...e,
                data
            }
        })
    });


    if (isNaN(year) || isNaN(month)) return <Redirect to="/plan" />
    return <div className={classes.MonthlyViewContainer}>
        <div className={classes.Header}>
            <div className={classes.MonthBar}>
                <Link to="/plan"><div className={classes.Year}>{year}</div></Link>
                {months.map((e, index) =>
                    <Link to={`/plan/${year}/${index}`} className={cn(classes.Month, { [classes.MonthPresent]: index === present, [classes.MonthSelected]: index === month })}>{e}</Link>)}
            </div>
        </div>
        <div className={classes.DatesContainer}>
            {
                data.map((e, index) => <div className={cn(classes.DateItem, {
                    [classes.Prev]: e.prev === true,
                    [classes.Current]: e.current === true,
                    [classes.Next]: e.next === true
                })} onClick={() => {
                    setDate({ year: e.prev && month === 0 ? year - 1 : e.next && month === 11 ? year + 1 : year, month: e.next && month === 11 ? 0 : e.prev && month === 0 ? 11 : e.prev ? month - 1 : e.next ? month + 1 : month, date: e.date });
                    setOC(OC + 1);
                }}>
                    <div className={classes.DateItemHeader}>
                        <div>{days[index] ?? ""}</div>
                        <div>{e.date}</div>
                    </div>
                    <div className={classes.DateItemList}>
                        {e.data?.map(i => <div className={classes.Log}>{i.name} <div className={classes.DeleteLog}>x</div></div>)}
                    </div>
                    <div className={classes.AddButton}><PlusIcon /></div>
                </div>)
            }
        </div>
        <Day enable={OC} date={editDate} />
    </div >
}

const Day: FC<{ date: RDateType, enable?: number }> = props => {
    const [enabled, setEnabled] = useState(false);
    const books = useSelector((state: RootState) => state.main.books.filter(e => RDate.isEqual(e.date, props.date)));
    useEffect(() => {
        if (props.enable ?? 0 > 0) setEnabled(true);
    }, [props.enable])
    return createPortal(<div className={classes.DayEdit}
        style={{ display: (enabled ? undefined : "none") }}
        onClick={e => {
            if ((e.target as HTMLElement)?.children[0]?.classList.contains(classes.DayContainer)) setEnabled(false);
        }}>
        <div className={classes.DayContainer}>
            <div className={classes.DayHeader}>
                <div className={classes.DayHeaderYear}>{props.date?.year}.{props.date?.month + "." + props.date?.date}</div>
                <div className={classes.DayHeaderDay}>{new RDate(props.date).defaultDate.toLocaleDateString("tr-TR", { weekday: "long" })}</div>
            </div>
            {books.map(e => <DayRow book={e} date={props.date} />)}
            <DayRow date={props.date} />
        </div>
    </div>, root || document.body);
}

const DayRow: FC<{ book?: BookState, date: RDateType }> = props => {
    const [name, setName] = useState(props.book?.name ?? "");
    const [page, setPage] = useState(props.book?.pages || 0);
    const pageEl = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    useEffect(() => {
        setPage(props.book?.pages ?? 0);
        setName(props.book?.name ?? "");
    }, [props.book]);
    const add = useCallback(() => {
        if (name.length > 0) {
            dispatch(addBook({
                name: name,
                pages: page,
                date: props.date
            }))
            setName("");
            setPage(0);
        }
    }, [name, page])
    const update = useCallback(() => {
        console.log(props.book?.id);
        dispatch(updateBook({
            id: props.book?.id,
            name: name,
            pages: page
        }))
    }, [name, page, props.book]);
    return <div className={cn(classes.DayItem, { [classes.AddBook]: props.book === undefined })}>
        <input value={name} placeholder={"Book"} onChange={e => setName(e.currentTarget.value)} onBlur={e => {
            if (props.book) update();
            else {
                setTimeout(() => {
                    if (pageEl.current !== document.activeElement) add();
                }, 1);
            }
        }} />
        <input type="number" onBlur={() => props.book === undefined ? add() : update()} ref={pageEl} value={page > 0 ? page : ""} placeholder="Page" onChange={e => setPage(Number(e.currentTarget.value))} />
        {props.book !== undefined && <div className={classes.DayRemove} onClick={() => dispatch(deleteBook(props.book?.id || ""))} />}
    </div>
}

export default Monthly;

function prevMonth(n: number): number {
    return n === 0 ? 11 : n - 1;
}
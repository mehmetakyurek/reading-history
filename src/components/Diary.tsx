import classes from "./styles/Diary.module.scss"
import { FC, ReactElement, useEffect, useRef, useState } from "react"
import Datepicker from "./Datepicker"
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { BookState } from "../store/reducers/lists";
import { RDate, RDateType } from "../class";
import { useHistory } from "react-router";
import { createSelector } from "reselect";
import { addLog, updateLog, removeLog, updateDiaryText } from "../store/reducers/diary";
import { ReactComponent as RemoveButton } from "./styles/img/remove.svg";

const DiaryPage: FC = (props): ReactElement => {
    const history = useHistory<{ date: RDateType }>();
    const [date, setDate] = useState<RDateType>(history.location.state?.date || new RDate().Date);
    const [diaryText, setDiaryText] = useState("");
    const dispatch = useDispatch();
    const target = useSelector((state: RootState) => state.main.target);
    const books = useSelector((state: RootState) => state.lists.flat());
    const log = useSelector((state: RootState) => createSelector([
        (state: RootState) => state.lists.flat(),
        (state: RootState) => state.diary
    ], (books, diaries) => {
        const l = diaries.find(e => e.date.year === date.year && e.date.month === date.month && e.date.date === date.date)
        const readBooks = new Array<{ book?: BookState, read: number, id: string, customName?: string }>();
        for (const b of l?.readBooks ?? []) {
            const book = books.find(e => e.id === b.book);
            if (book) readBooks.push({
                book,
                read: b.read,
                id: b.id
            });
            else {
                readBooks.push({
                    id: b.id,
                    read: b.read,
                    customName: b.customName
                })
            }
        }
        return {
            ...l,
            readBooks
        }
    })(state));

    let TotalRead = 0;
    log?.readBooks?.map(e => TotalRead += e.read);

    useEffect(() => {
        setDiaryText(log?.text || "");
    }, [log?.text])
    const [changed, setChanged] = useState(false);
    return <div className={classes["container"]}>
        <div className={classes["container-left"]}>
            <div className={classes["datepicker"]}>
                <Datepicker date={{ ...date }} changed={changed} dateChanged={(date) => { setDate(date); history.replace("/diary", { date: date }); }} />
            </div>
            <div className={classes["reading-log"]}>
                <div className={classes["reading-log-items"]}>
                    {log?.readBooks?.map(e => <ReadingLogItem
                        {...e}
                        key={e.id}
                        onUpdate={data => {
                            const book = getBookId(books, data.text);
                            if (book) dispatch(updateLog({ date, id: e.id, data: { book, read: data.read } }))
                            else dispatch(updateLog({ date, id: e.id, data: { customName: data.text, read: data.read } }))
                        }}
                        onDelete={id => dispatch(removeLog({ date, id }))}
                    />)}
                    <AddNewLogItem onEntry={(name, read) => {
                        const book = getBookId(books, name);
                        
                        dispatch(addLog(book ? { book, read: read || 0, date } : { customName: name, date, read: read || 0 }))
                    }} />
                </div>
                <div className={classes["reading-log-info"]}>
                    <div className={classes["reading-log-info-total"]}>{TotalRead}p.</div>
                    <div className={classes["reading-log-info-remaining"]}>{(target - TotalRead > 0) ? (target - TotalRead) + "p. remaining" : ""}</div>
                </div>
            </div>
            <div className={classes["diary-text"]}>
                <textarea value={diaryText} onChange={e => setDiaryText(e.currentTarget.value)} onBlur={e => { dispatch(updateDiaryText({ date, text: e.currentTarget.value })) }} />
            </div>
        </div>
        <div className={classes["container-right"]}>
            <MonthOverview date={date} onClick={date => { setDate(date); setChanged(!changed); }} />
        </div>
    </div>
}

export const getBookId = (books: Array<BookState>, text?: string) => {
    
    const t = text?.toLowerCase() ?? "";
    return text === undefined ? "" : books.find(e => e.name.toLowerCase() === t || (e.name.toLowerCase() === t?.[0]))?.id;
}

export default DiaryPage;

const ReadingLogItem: FC<{ book?: BookState, id: string, read: number, customName?: string, onUpdate?: (data: { text: string, read: number }) => void, onDelete?: (id: string) => void }> = (props): ReactElement => {
    const [name, setName] = useState(props.book ? (props.book.name) : props.customName ?? "");
    const [read, setRead] = useState(props.read);
    return <div className={classes["reading-log-item"]}>
        <input className={classes["reading-log-item-name"]} value={name} onChange={e => setName(e.target.value)} onBlur={() => props.onUpdate?.({ text: name, read: read })} />
        <input type="number" max="100" className={classes["reading-log-item-read"]} value={read} onChange={(e) => e.target.value.length <= 3 ? setRead(Number(e.target.value)) : true} onBlur={() => props.onUpdate?.({ text: name, read: read })} />
        <div className={classes["reading-log-item-remove"]} onClick={() => props.onDelete?.(props.id)}><RemoveButton /></div>
    </div>
}
const AddNewLogItem: FC<{ onEntry: (name: string, read?: number) => void }> = (props): ReactElement => {
    const [name, setName] = useState<string>("");
    const nameRef = useRef<HTMLInputElement>(null);
    return <div className={classes["reading-log-item"]}>
        <input className={classes["reading-log-item-name"]} value={name} ref={nameRef} placeholder="Book" onChange={e => setName(e.currentTarget.value)} />
        <input type="number" placeholder="Page" max="100" className={classes["reading-log-item-read"]} defaultValue={""} onBlur={e => {
            if (name.length > 0)
                props.onEntry(name, Number(e.currentTarget.value));
            e.currentTarget.value = "";
            setName("");
            nameRef.current?.focus();
        }} />
    </div>
}

const MonthOverview: FC<{ date: RDateType, onClick?: (date: RDateType) => void }> = (props): ReactElement => {
    const getBooks = (state: RootState) => state.lists;
    const getDiary = (state: RootState) => state.diary;
    const dayData = useSelector((state: RootState) => createSelector([getBooks, getDiary], (books, diaries) => {
        const data = new Array<MonthOverviewItemT>();
        for (const diary of diaries.filter(e => e.date.year === props.date.year && e.date.month === props.date.month)) {

            const book = books.flat().find(e => e.id === diary.readBooks[0]?.book);
            data.push({
                date: diary.date,
                book: book ? (book?.name) : diary.readBooks[0]?.customName,
                read: diary.readBooks[0]?.read,
                rest: diary.readBooks?.length - 1 > 0 ? diary.readBooks?.length - 1 : undefined
            })
        }
        return data;
    })(state))
    const SHOW_EMPTY_DAYS = false;
    return <div className={classes["month-overview"]}>
        {
            dayData.filter(e => SHOW_EMPTY_DAYS || e.book).map(e => <MonthOverviewItem onClick={props.onClick} {...e} key={RDate.parse(e.date)} />)
        }
    </div>
}
type MonthOverviewItemT = {
    date: RDateType, read?: number, book?: string, rest?: number, onClick?: (date: RDateType) => void
}
const MonthOverviewItem: FC<MonthOverviewItemT> = (props): ReactElement => {
    return <div className={classes["month-overview-day"]} onClick={() => { props.onClick?.(props.date); }}>
        <div className={classes["month-overview-day-date"]}>{props.date.date}</div>
        <div className={classes["month-overview-day-book"]}>{props.book || "-_-"}</div>
        <div className={classes["month-overview-day-read"]}>{props.read || "0"}p.</div>
        <div className={classes["month-overview-day-rest"]}>{props.rest ? "+" + props.rest : ""}</div>
    </div>
}
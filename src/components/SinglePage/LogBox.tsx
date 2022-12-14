import { useSelector } from "react-redux"
import { flushSync } from "react-dom"
import cn from "classnames"
import { BookState, RootState } from "../../store"
import { useDispatch } from "react-redux"
import React, { FC, useCallback, useEffect, useState } from "react"
import { ReactComponent as QuotesSvg } from "../styles/img/quotes.svg"
import { ReactComponent as SummariesSvg } from "../styles/img/summaries.svg"
import { ReactComponent as DoneSvg } from "./styles/done.svg"
import "./styles/LogBox.css"
import { RDate, RDateType } from "../../class"
import { addBook, move, setNote } from "../../store/reducers/lists"
import { updateLog } from "../../store/reducers/diary"
import { useNavigate } from "react-router-dom"
import { setContent, setDate, setEditList, toggleBook } from "../../store/reducers/temp"

const LogBox: FC = (props) => {
    const date = useSelector((state: RootState) => state.temp.date);
    const books = useSelector((state: RootState) => state.diary.find(e => RDate.isEqual(e.date, date))?.readBooks.map(b => (b.read > 0 && b.book ? b.book : "")));
    const ids = useSelector((state: RootState) => state.temp.editList);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setEditList(books ?? []));
    }, [date])

    return <div className='LogBox grid grid-rows-[min-content_min-content_minmax(0px,_1fr)] h-full'>
        <List />
        <div className='Logs mt-3 overflow-auto'>
            {ids.map(e => <EditLog id={e} key={e} />)}
        </div>
    </div>
}

let timeOut: NodeJS.Timeout;

const List: FC = (props) => {
    const ids = useSelector((state: RootState) => state.temp.editList);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addValue, setAddValue] = useState("");
    const BookList = useSelector((state: RootState) => state.lists[1]);
    const spellcheck = useSelector((state: RootState) => state.prefs.spellcheck);
    const Add = useCallback((e: string) => {
        if (e && e.length > 2) {
            dispatch(addBook({ name: addValue, list: 1 }));
            setAddValue("");
        }
    }, [dispatch, addValue, setAddValue]);
    return <div className='LogList flex flex-wrap gap-5 place-content-evenly px-5'>

        {BookList.length > 0 ? BookList.map((book, index) => <Book key={book.id} book={book} index={index} selected={ids.includes(book.id)} />) : <span>Your reading list is empty.</span>}
        <div className='flex basis-full gap-3'>
            <input
                spellCheck={spellcheck}
                className='bg-transparent border rounded-sm border-border-color py-1 px-2.5 outline-none placeholder:text-disabled' type="text" placeholder="Add book..."
                value={addValue} onChange={e => setAddValue(e.currentTarget.value)}
                onKeyUp={e => e.key === "Enter" && Add(e.currentTarget.value)} onBlur={e => Add(e.currentTarget.value)} />
            <Button className="w-7 hover:bg-gray-800" onClick={e => navigate("/plan")} />
        </div>
    </div>
}

const Book: FC<{ book: BookState, index: number, selected?: boolean }> = (props) => {
    const dispatch = useDispatch();
    return <div className={`Log ${props.selected ? "text-[#d0d0d0]" : 'text-[#545454]'} cursor-pointer select-none`} onClick={() => dispatch(toggleBook(props.book.id))}>
        {props.book.name}
    </div>
}

const EditLog: FC<{ id: string }> = (props) => {
    const dispatch = useDispatch();

    const date = useSelector((state: RootState) => state.temp.date);
    const book = useSelector((state: RootState) => {
        return state.lists[1].find(e => e.id === props.id)
    });
    const [target, setTarget] = useState(30);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(200);
    const current = useSelector((state: RootState) => state.diary.find(e => RDate.isEqual(e.date, date))?.readBooks.find(e => e.book === book?.id)?.read ?? 0)

    const [read, setRead] = useState(current);

    useEffect(() => { setRead(current) }, [current, date])
    const updateRead = useCallback((r: number) => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            if (book)
                dispatch(updateLog({ date: date, data: { book: book.id, read: r } }))
        }, 300)
    }, [dispatch, read, timeOut])
    return book ? <div className='group'>
        <div className='Header py-3.5 pl-3 mx-7 flex justify-between border-b border-[#707070]'>
            {book.name}
            <div className='LogButtons w-36 grid grid-cols-4 grid-rows-1 gap-x-2.5 items-center fill-slate-500'>
                <div title="Mark as done" className="transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer stroke-slate-500 stroke-[0.5] rounded-full border-2 border-slate-500 aspect-square p-1" onClick={() => dispatch(move({ id: book.id, list: 2 }))}><DoneSvg /></div>
                <div title="Quotes" className='transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer' onClick={() => dispatch(setContent({ view: "quotes", id: book.id }))} ><QuotesSvg /></div>
                <div title="Note" className='transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer' onClick={() => dispatch(setContent({ view: "note", id: book.id }))} ><SummariesSvg /></div>
                <div className='Day bg-[#4A4D58] aspect-square flex justify-center items-center rounded-full'>{date.date}</div>
            </div>
        </div>
        <div className='Content grid gap-x-3 grid-cols-[0.8fr_1.2fr] px-9 py-4 mt-3'>
            <div className='Picker grid gap-1 grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto]'>
                <span className="flex items-center row-start-1 row-end-4 text-neutral-400">{min.toString()}</span>
                <span className="text-center">{read.toString()}</span>
                <span className="flex items-center row-start-1 row-end-4 col-start-3 col-end-4 text-neutral-400">{max.toString()}</span>
                <div className='relative col-end-3 col-start-2 h-4'>
                    <div style={{ left: Math.floor((target / max) * 100) + "%" }} className={`absolute w-2 h-2 bg-triangle bg-no-repeat bg-center mb-6 rotate-180 -bottom-8`} />
                    <input min={min} max={max} value={read} onChange={v => {
                        flushSync(() => setRead(Number(v.currentTarget.value)));
                        updateRead(Number(v.currentTarget.value));
                    }} type="range" className="range" />
                </div>
                <span className="text-center text-neutral-400">{target.toString()}</span>
            </div>
            <History date={date} bookId={book.id} onChange={d => dispatch(setDate(d))} />
        </div>
    </div> : <></>
}

const History: FC<{ date: RDateType, bookId: string, onChange?: (date: RDateType) => void }> = (props) => {
    const history = useSelector((state: RootState) => {
        return state.diary.filter(e => e.date.year === props.date.year && e.date.month === props.date.month && e.readBooks.filter(e => e.book === props.bookId).length > 0).map(e => ({ date: e.date, read: e.readBooks.find(e => e.book === props.bookId)?.read ?? 0 }))
    });

    return <div className='History flex gap-2 w-full justify-center flex-wrap'>
        {history.map(e => <div className='flex items-center justify-center flex-col gap-y-2 cursor-pointer' key={RDate.parse(e.date)} onClick={() => props.onChange?.(e.date)}>
            <div className='after-triangle relative flex items-center justify-center rounded-full w-8 aspect-square p-1 bg-slate-600'>{e.date.date}</div>
            <span className=''>{e.read}</span>
        </div>
        )}
        <div className='relative flex flex-col justify-center gap-y-2'>
            <Button className='w-8 aspect-square p-1 hover:bg-neutral-900 rounded-md' onClick={(e) => { e.stopPropagation(); }} />
            <span className='text-center justify-self-end'>{history.reduce(((p, c) => p + c.read), 0)}</span>
        </div>
    </div>
}

const Button: FC<{ className?: string, onClick?: React.MouseEventHandler<HTMLDivElement> }> = (props) => {
    return <div className={cn('button grid grid-cols-3 gap-0.5 items-center', props.className)} onClick={props.onClick}>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
    </div>
}

export default LogBox;
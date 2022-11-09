import { useSelector } from "react-redux"
import cn from "classnames"
import { BookState, RootState } from "../../store"
import React, { Dispatch, FC, useMemo, useReducer, useState } from "react"
import { ReactComponent as QuotesSvg } from "../styles/img/quotes.svg"
import { ReactComponent as SummariesSvg } from "../styles/img/summaries.svg"
import "./styles/LogBox.css"
import Datepicker from "../Datepicker"
import { RDate } from "../../class"
import { Link } from "react-router-dom"
import DatePicker from "../Datepickerthatworksgood"
export default function () {
    const [ids, dispatch] = useReducer(reducer, ["cyp2uNsvKLn-zz8KD7wjY"]);
    return <div className='LogBox'>
        <List dispatch={dispatch} ids={ids} />
        <Link to={"/diary"}>aa</Link>
        <div className='Logs mt-10'>
            {ids.map(e => <EditLog id={e} />)}
        </div>
    </div>
}

const inital = Array<string>();

type GetDispatchParametersType<T extends typeof reducer> = Dispatch<Parameters<T>["1"]>
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const reducer = (state: typeof inital, action: { payload: ArrayElement<typeof inital> }) => {
    const s = [...state];
    const i = s.indexOf(action.payload);
    i >= 0 ? s.splice(i, 1) : s.push(action.payload);
    return s;
}

const List: FC<{ ids: string[], dispatch: GetDispatchParametersType<typeof reducer> }> = (props) => {
    const BookList = useSelector((state: RootState) => state.lists[1]);

    return <div className='LogList flex flex-wrap gap-5 place-content-evenly px-5'>
        {BookList.map((book, index) => <Book book={book} index={index} dispatch={props.dispatch} selected={props.ids.includes(book.id)} />)}
        <div className='basis-full'><input className='bg-transparent border rounded-sm border-border-color py-1 px-2.5 outline-none placeholder:text-disabled' type="text" placeholder="Add book..." /></div>
    </div>
}

const Book: FC<{ book: BookState, index: number, selected?: boolean, dispatch: GetDispatchParametersType<typeof reducer> }> = (props) => {

    return <div className={`Log ${props.selected ? "text-[#d0d0d0]" : 'text-[#545454]'} cursor-pointer select-none`} onClick={() => props.dispatch({ payload: props.book.id })}>
        {props.book.name}
    </div>
}

const EditLog: FC<{ id: string }> = (props) => {

    const history = useMemo(() => [
        { date: 14, read: 44 },
        { date: 10, read: 55 },
        { date: 5, read: 23 },
    ], [])

    const cDate = useMemo(() => new Date(), []);
    const [date, setDate] = useState({
        year: cDate.getFullYear(),
        month: cDate.getMonth(),
        date: cDate.getDate()
    });
    const [target, setTarget] = useState(30);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(200);
    const [current, setCurrent] = useState(0);
    const book = useSelector((state: RootState) => state.lists[1].find(e => e.id === props.id));

    return <div className='EditLog'>
        <div className='Header py-3.5 pl-3 mx-7 flex justify-between border-b border-[#707070]'>
            {book?.name}
            <div className='LogButtons w-24 grid grid-cols-3 grid-rows-1 gap-x-2.5 items-center fill-[#6c7e8d]'>
                <div><QuotesSvg /></div>
                <div><SummariesSvg /></div>
                <div className='Day bg-[#4A4D58] aspect-square flex justify-center items-center rounded-full'>{date.date}</div>
            </div>
        </div>
        <div className='Content grid gap-x-3 grid-cols-[0.8fr_1.2fr] px-9 py-4 mt-3'>
            <div className='Picker grid gap-1 grid-rows-[auto_1fr_auto] grid-cols-[auto_1fr_auto]'>
                <span className="flex items-center row-start-1 row-end-4 text-neutral-400">{min.toString()}</span>
                <span className="text-center">{current.toString()}</span>
                <span className="flex items-center row-start-1 row-end-4 col-start-3 col-end-4 text-neutral-400">{max.toString()}</span>
                <div className='relative col-end-3 col-start-2 h-4'>
                    <div style={{ left: Math.floor((target / max) * 100) + "%" }} className={`absolute w-2 h-2 bg-triangle bg-no-repeat bg-center mb-6 rotate-180 -bottom-8`} />
                    <input min={min} max={max} value={current} onChange={v => setCurrent(Number(v.target.value))} type="range" className="range" />
                </div>
                <span className="text-center text-neutral-400">{target.toString()}</span>
            </div>
            <div className='History flex gap-2 w-full justify-center'>
                {history.map(e => <div className='flex items-center justify-center flex-col gap-y-2'>
                    <div className='after-triangle relative flex items-center justify-center rounded-full w-8 aspect-square p-1 bg-slate-600'>{e.date}</div>
                    <span className=''>{e.read}</span>
                </div>
                )}
                <div className='relative flex flex-col justify-center gap-y-2'>
                    <Button className='w-8 aspect-square p-1 hover:bg-neutral-900 rounded-md' />
                    <span className='text-center justify-self-end'>{history.reduce(((p, c) => p + c.read), 0)}</span>
                    <div className="absolute top-0 left-full w-96 aspect-square"><DatePicker/></div>
                </div>
            </div>
        </div>
    </div>
}
const Button: FC<{ className?: string }> = (props) => {
    return <div className={cn('button grid grid-cols-3 gap-0.5 items-center', props.className)}>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
        <div className='aspect-square bg-slate-600 rounded-full'></div>
    </div>
}
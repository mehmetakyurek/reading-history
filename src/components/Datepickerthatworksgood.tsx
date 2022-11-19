import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { getFirstDay, getPrevLastDate } from "./util";
import cn from "classnames"
import { getMonths, getWeekDays } from "..";
import { RDate, RDateType } from "../class";
const days = getWeekDays("short");
const months = getMonths("long");
const today = new RDate().Date;

const DatePicker: FC<{ date?: Date, onChange?: (date: RDateType) => void, onClick?: React.MouseEventHandler<HTMLDivElement>, className?: string }> = (props) => {

    const [date, setDate] = useState(new RDate(props.date ?? undefined).Date)

    const dates = useMemo(() => {
        const [prevLast, first, last] = [
            getPrevLastDate(date.year, date.month),
            getFirstDay(date.year, date.month),
            new Date(date.year, date.month + 1, 0).getDate()
        ]
        const d = Array<number>();
        for (let i = prevLast - (first - 2); i <= prevLast; i++) { d.push(-i) }
        for (let i = 1; i <= last; i++) { d.push(i) }
        for (let i = 1; i <= 42 - last - (first - 1); i++) { d.push(-i) }
        return d;
    }, [date.month, date.year]);

    useEffect(() => {
        props.onChange?.(date);
    }, [date])

    const dateClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        const d = Number(e.currentTarget.getAttribute("data-date"));
        setDate({ ...date, date: d })
    }, [setDate])
    const handleMonthClick = useCallback((add: -1 | 1) => {
        if (add === 1 && date.month === 11) setDate({ ...date, year: date.year + 1, month: 0 })
        else if (add === -1 && date.month === 0) setDate({ ...date, year: date.year - 1, month: 11 });
        else setDate({ ...date, month: date.month + add });

    }, [date, setDate])
    return <div className={cn('Datepicker z-50 select-none grid grid-cols-7 grid-rows-8 gap-1 place-items-center bg-stone-900 rounded-lg px-2 py-5 w-full h-full', props.className)} onClick={props.onClick}>
        <div className='header col-start-1 col-end-8 flex'>
            <div className='px-2 mx-2 hover:bg-neutral-700 rounded-sm' onClick={() => setDate({ ...date, year: date.year - 1 })}>{'<'}</div>
            <div>{date.year}</div>
            <div className='px-2 mx-2 hover:bg-neutral-700 rounded-sm' onClick={() => setDate({ ...date, year: date.year + 1 })}>{'>'}</div>
            <div className='px-2 mx-2 hover:bg-neutral-700 rounded-sm' onClick={() => handleMonthClick(-1)} > {'<'}</div>
            <div>{months[date.month]}</div>
            <div className='px-2 mx-2 hover:bg-neutral-700 rounded-sm' onClick={() => handleMonthClick(1)} >{'>'}</div>
        </div>
        {days.map(e => <span key={e} className={cn('pb-1 underline-offset-4 underline text-neutral-400')}>{e}</span>)}
        {dates.map(e => <DateItem date={e} key={e} onClick={dateClick} selected={date.date === e} present={date.year === today.year && date.month === today.month && e === date.date} />)}
    </div >
}

const DateItem: FC<{ date: number, present?: boolean, onClick?: React.MouseEventHandler<HTMLDivElement>, selected?: boolean }> = (props) => {
    return <div onClick={props.onClick} data-date={props.date} className={cn('hover:bg-slate-700 p-2 text-center rounded cursor-pointer w-full', { 'text-slate-500 pointer-events-none': props.date < 0, 'text-orange-600': props.present, 'border border-solid border-neutral-800': props.selected })}>
        {props.date < 0 ? Math.abs(props.date) : props.date}
    </div>
}

const Months: FC<{}> = props => {
    return <div className=''>

    </div>
}

export default DatePicker;
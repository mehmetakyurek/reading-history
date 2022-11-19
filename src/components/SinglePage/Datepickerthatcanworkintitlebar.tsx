import cn from "classnames";
import { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getMonths, getWeekDays } from "../..";
import { RDate, RDateType } from "../../class";
import { RootState } from "../../store";
import { setDate } from "../../store/reducers/temp";

import "./styles/datepicker.css"
const months = getMonths("long");
const days = getWeekDays("short")
const today = new RDate().Date

let interval: NodeJS.Timer;

const DatePicker: FC<{ onChange?: (date: RDateType) => void, onClick?: React.MouseEventHandler<HTMLDivElement>, className?: string }> = (props) => {

    const date = useSelector((state: RootState) => state.temp.date);
    const [shown, setShown] = useState({ year: date.year, month: date.month });
    const last = useMemo(() => new Date(shown.year, shown.month + 1, 0).getDate(), [shown, date]);
    const dispatch = useDispatch();
    useEffect(() => {
        setShown(date)
    }, [date])

    const dateClick = useCallback((e: number) => {
        dispatch(setDate({ ...shown, date: e }))
    }, [shown, dispatch, setDate])

    return <div className={cn('Datepicker-container h-8 select-none w-full flex justify-center overflow-hidden', props.className)} onClick={props.onClick}>
        <div className='Datepicker transition-all gap-x-1 px-2 flex h-full text-neutral-500 place-items-center' onWheel={e => {
            setShown(
                e.deltaY < 0 ? shown.month === 0 ? { year: shown.year - 1, month: 11 } : { ...shown, month: shown.month - 1 } :
                    e.deltaY > 0 ? shown.month === 11 ? { year: shown.year + 1, month: 0 } : { ...shown, month: shown.month + 1 } : { ...shown }
            )
        }}>
            <div>{shown.year}</div>
            <div className="w-16 text-center">{months[shown.month]}</div>
            <div className="flex ">{
                [...Array(last)].map((e, index) =>
                    <DateItem
                        key={index}
                        onClick={dateClick}
                        date={index + 1}
                        selected={shown.year === date.year && shown.month === date.month && date.date === index + 1}
                        present={RDate.isEqual({ ...shown, date: index + 1 }, today)}
                    />)
            }</div>
        </div>
        {/*dates.map(e => <DateItem date={e} key={e} onClick={dateClick} selected={date.date === e} present={date.year === today.year && date.month === today.month && e === today.date} />)*/}
    </div >
}

const DateItem: FC<{ date: number, present?: boolean, onClick?: (date: number) => void, selected?: boolean }> = (props) => {
    return <div onClick={e => props.onClick?.(props.date)} data-date={props.date} className={cn('hover:bg-slate-700 text-center w-7 rounded cursor-pointer ', { 'text-orange-600': props.present, 'underline underline-offset-4': props.selected })}>
        {props.date < 0 ? Math.abs(props.date) : props.date}
    </div>
}
export default DatePicker;
import cn from "classnames";
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getMonths, getWeekDays } from "../util";
import { RDate, RDateType } from "../../class";
import { RootState } from "../../store";
import { setDate } from "../../store/reducers/temp";

import "./styles/datepicker.css"
const months = getMonths("long");
const days = getWeekDays("short")
const today = new RDate().Date

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

    return <div className={cn('Datepicker-container h-8 select-none w-full flex justify-center', props.className)} onClick={props.onClick}>
        <div className='Datepicker transition-all gap-x-1 px-2 flex h-full text-neutral-500 place-items-center' onWheel={e => {
            setShown(
                e.deltaY < 0 ? shown.month === 0 ? { year: shown.year - 1, month: 11 } : { ...shown, month: shown.month - 1 } :
                    e.deltaY > 0 ? shown.month === 11 ? { year: shown.year + 1, month: 0 } : { ...shown, month: shown.month + 1 } : { ...shown }
            )
        }}>
            <div className="group relative text-text">
                {shown.year}
                <Years year={shown.year} onChange={y => setShown({ ...shown, year: y })} />
            </div>
            <div className="group relative w-16 text-center text-text">
                {months[shown.month]}
                <Months month={shown.month} onchange={m => setShown({ ...shown, month: m })} />
            </div>
            <div className="group relative flex lg:w-[54.25rem] w-7 lg:relative">{
                [...Array(last)].map((e, index) =>
                    <DateItem
                        key={index}
                        onClick={dateClick}
                        date={index + 1}
                        selected={shown.year === date.year && shown.month === date.month && date.date === index + 1}
                        present={RDate.isEqual({ ...shown, date: index + 1 }, today)}
                    />)
            }
                <Days last={last} shown={shown} onClick={dateClick} />
            </div>
        </div>
        {/*dates.map(e => <DateItem date={e} key={e} onClick={dateClick} selected={date.date === e} present={date.year === today.year && date.month === today.month && e === today.date} />)*/}
    </div >
}

const Years: FC<{ year: number, onChange: (year: number) => void }> = props => {
    const years = Array<number>(9);
    for (let i = props.year - 4; i <= props.year + 4; i++) years.push(i);
    return <HoverContainer>
        {years.map(y => <HoverItem current={today.year === y} selected={props.year === y} onClick={() => props.onChange(y)}>{y}</HoverItem>)}
    </HoverContainer>
}

const Months: FC<{ month: number, onchange: (month: number) => void }> = props => {
    return <HoverContainer>
        {months.map((e, i) => <HoverItem current={today.month === i} selected={props.month === i} onClick={() => props.onchange(i)}>{e}</HoverItem>)}
    </HoverContainer>
}
const Days: FC<{ shown: Omit<RDateType, 'date'>, last: number, onClick?: (date: number) => void }> = props => {
    const selected = useSelector((state: RootState) => state.temp.date)
    return <div className="showOnLarge py-2 left-2/4 -translate-x-2/4 grid-cols-7 grid-flow-row w-max bg-rock-400 absolute hidden gap-1 shadow-[0_0px_10px_5px] rounded-sm shadow-rock-400/80 top-full">
        {[...Array(props.last)].map((e, i) => <HoverItem onClick={() => props.onClick?.(i + 1)}current={RDate.isEqual(today, {...props.shown, date: i +1 })} selected={RDate.isEqual(selected, { ...props.shown, date: i + 1 })}>{i + 1}</HoverItem>)}
    </div>
}

const HoverContainer: FC<{ children: ReactNode, onLg?: boolean }> = props => {
    return <div className=" text-disabled py-2 left-2/4 -translate-x-2/4 bg-rock-400 group-hover:flex flex-col absolute hidden gap-1 shadow-[0_0px_10px_5px] rounded-sm shadow-rock-400/80 top-full">
        {props.children}
    </div>
}

const HoverItem: FC<{ children: string | number, onClick?: React.MouseEventHandler<HTMLDivElement>, selected?: boolean, current?: boolean }> = props => {
    return <div onClick={props.onClick} className={"px-3 hover:bg-rock-200 cursor-pointer text-center" + (props.selected ? ' text-text' : '') + (props.current ? ' current' : '')}>{props.children}</div>
}

const DateItem: FC<{ date: number, present?: boolean, onClick?: (date: number) => void, selected?: boolean }> = (props) => {
    const selectedDate = useSelector((state: RootState) => state.temp.date.date === props.date)
    return <div onClick={e => props.onClick?.(props.date)} data-date={props.date}
        className={cn(
            'hover:bg-slate-700 text-center w-7 rounded cursor-pointer lg:block',
            {
                'underline underline-offset-4': props.present,
                'lg:left-0 block text-text': props.selected,
                'hidden': !selectedDate
            })}>
        {props.date < 0 ? Math.abs(props.date) : props.date}
    </div>
}
export default DatePicker;
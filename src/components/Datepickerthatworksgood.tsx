import { date } from "faker";
import { FC, useMemo } from "react";
import { getFirstDay, getPrevLastDate } from "./util";

const DatePicker: FC<{ date?: Date }> = (props) => {

    const [prevLast, first, last] = useMemo(() => {
        const date = props.date || new Date();
        return [
            getPrevLastDate(date.getFullYear(), date.getMonth()),
            getFirstDay(date.getFullYear(), date.getMonth()),
            new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
        ]
    }, [props.date]);

    const dates = Array<number>();

    for (let i = prevLast - (first - 2); i <= prevLast; i++) { dates.push(i) }
    for (let i = 1; i <= last; i++) { dates.push(i) }
    for (let i = 1; i <= 42 - last - (first - 1); i++) { dates.push(i) }

    return <div className='grid grid-cols-7 grid-rows-6 gap-2 w-full h-full place-items-center'>
        {dates.map(e => <div>{e}</div>)}
    </div>
}

export default DatePicker;
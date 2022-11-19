import React, { createRef, FC, ReactElement, useCallback, useState } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RDate, RDateType } from "../../class";
import { RootState } from "../../store";
import classes from "./scss/YearOverview.module.scss"
import { createPortal } from "react-dom";
// 364 tane kutu oluşturuyor, yılın son günü 365' inciyi oluştaracak şekilde düzenlenecek.

const YearOverview: FC<{ onSelect?: (date: RDateType) => void }> = (props) => {
    const HoverBoxRef = createRef<HTMLDivElement>()
    const [hoverRead, setHoverRead] = useState(-1);
    const [hoverDate, setHoverDate] = useState("");
    let date = new Date();

    const handleClick: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        props.onSelect?.(new RDate(new Date(Number(e.currentTarget.getAttribute("data-date")))).Date)
    }, [props.onSelect]);
    
    const target = useSelector<RootState, number>(state => state.main.target);
    const YearData = useSelector<RootState, YearData>(state => {
        const dateNow = new Date();

        const [date, month, year] = [dateNow.getDate(), dateNow.getMonth(), dateNow.getFullYear()]

        state.diary.filter(e => e.date.year === year);
        const dateCounter = new Date(year, 0, 1);
        const dataArray = [] as YearData
        let future = false;
        while (dateCounter.getFullYear() === year) {
            const log = state.diary.find(e => e.date.year === year && e.date.month === dateCounter.getMonth() && e.date.date === dateCounter.getDate());
            let read = 0;
            for (const i of log?.readBooks ?? []) read += i.read ?? 0;
            if (!future) (future = dateCounter.getMonth() < month || (dateCounter.getMonth() === month && dateCounter.getDate() <= date))
            dataArray.push({
                date: new Date(dateCounter),
                future,
                read
            })
            dateCounter.setDate(dateCounter.getDate() + 1)
        }

        return dataArray;
    })

    return <div className={classes["year-overview"]}>
        <>
            {createPortal(<div ref={HoverBoxRef} className="hover-box">
                <div className={classes["hover-box-date"]}>{hoverDate}</div>
                <div className={classes["hover-box-read"]}>{hoverRead}s.</div>
            </div>, (document.getElementById("root")!))}
            <div className={classes["year-overview-year"]}>{date.getFullYear()}</div>
            <div className={classes["year-overview-data-container"]}>
                <div className={classes["year-overview-data-week"]}>W1</div>
                <div className={classes["year-overview-data-week"]}>W52</div>
                <div className={classes["year-overview-data-info"]}>
                    Less<div className={classes["year-overview-data-info-boxes"]}><div /><div /><div /><div /><div /></div>More
                </div>
                <div className={classes["year-overview-data"]}>
                    {YearData.map(daydata =>
                        <YearDataDayBox
                            onClick={handleClick}
                            onMouseEnter={(e, read, date) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoverRead((read ?? 0));
                                setHoverDate(date);
                                if (HoverBoxRef.current) {
                                    HoverBoxRef.current.style.top = rect.top + "px";
                                    HoverBoxRef.current.style.left = rect.left + "px";
                                    HoverBoxRef.current.style.opacity = "1";
                                }
                            }}
                            onMouseLeave={() => {
                                if (HoverBoxRef.current) HoverBoxRef.current.style.opacity = "0";
                            }}
                            {...daydata}
                            key={daydata.date.toLocaleDateString()}
                            target={target}
                        />)}
                </div>
            </div>
        </>
    </div>
}

const YearDataDayBox: FC<{
    date: Date,
    read?: number,
    future?: boolean,
    target: number,
    onMouseEnter?: (e: React.MouseEvent, read: number, date: string) => void,
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>,
    onClick?: React.MouseEventHandler<HTMLDivElement>
}> = (props): ReactElement => {
    const history = useNavigate();
    return <div
        onMouseEnter={e => props.onMouseEnter?.(e, props.read ?? 0, props.date.getDate() + "." + (props.date.getMonth() + 1))}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        data-date={props.date.getTime()}
        style={{ backgroundColor: "var(--color-level-" + Math.min(Math.round(((props.read ?? 1) / props.target) * 5), 5) + ")" }
        }
        className={classes["year-overview-data-day"] + ((props?.future) ? (" " + classes["blank"]) : "")} >
    </div >
}

type YearData = Array<{
    read: number;
    future: boolean;
    date: Date;
}>

export default YearOverview;
import React, { FC, ReactElement, useRef } from "react"
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { RDate } from "../../class";
import { RootState } from "../../store";
import classes from "./scss/YearOverview.module.scss"

// 364 tane kutu oluşturuyor, yılın son günü 365' inciyi oluştaracak şekilde düzenlenecek.

export default function YearOverview() {
    const data = {
        date: new Date(),
        target: 50
    }
    //const YearData = getYearData();
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
            if (!future) (future = dateCounter.getMonth() < month || (dateCounter.getMonth() == month && dateCounter.getDate() <= date))
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
        <div className={classes["year-overview-year"]}>{data.date.getFullYear()}</div>
        <div className={classes["year-overview-data-container"]}>
            <div className={classes["year-overview-data-week"]}>W1</div>
            <div className={classes["year-overview-data-week"]}>W52</div>
            <div className={classes["year-overview-data-info"]}>
                Less<div className={classes["year-overview-data-info-boxes"]}><div></div><div></div><div></div><div></div><div></div></div>More
            </div>
            <div className={classes["year-overview-data"]}>
                {YearData.map(daydata => <YearDataDayBox key={daydata.date.toLocaleDateString()} read={daydata.read} date={daydata.date} target={data.target} future={daydata.future} />)}
            </div>
        </div>
    </div>
}

type YearDataDayBoxState = { date: Date, read?: number, future?: boolean, target: number };
const YearDataDayBox: FC<YearDataDayBoxState> = (props): ReactElement => {
    const history = useHistory();
    return <div
        onClick={(e) => history.push({ pathname: "/diary", state: { date: new RDate(new Date(Number(e.currentTarget.getAttribute("data-date")))) } })}
        data-date={props.date.getTime()}
        style={{ backgroundColor: "var(--color-level-" + Math.min(Math.round(((props.read ?? 1) / props.target) * 5), 5) + ")" }}
        className={classes["year-overview-data-day"] + ((props?.future) ? (" " + classes["blank"]) : "")}>
        <div className={classes["hover-box"]}>
            <div className={classes["hover-box-date"]}>{props.date.getDate() + "." + (props.date.getMonth() + 1)}</div>
            <div className={classes["hover-box-read"]}>{props.read}s.</div>
        </div>
    </div>
}

function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

type YearData = Array<{
    read: number;
    future: boolean;
    date: Date;
}>
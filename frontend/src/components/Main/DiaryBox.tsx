import classes from "./scss/Diary.module.scss"

import { getWeekDays } from "../../index"
import { RootState } from "../../store";
import { useSelector } from "react-redux";

type TDiaryBox = {
    week: number,
    days: Array<{
        book: string,
        read: number,
        rest: number
    }>
}

function DiarySelector(state: RootState) {
    let date = new Date();

    date.setDate(date.getDate() - date.getDay() + 1);
    const logs = {
        week: getweek(date),
        days: [

        ]
    } as TDiaryBox;
    for (let i = 1; i <= 7; i++) {
        const index = state.diary.findIndex(e => e.date.year === date.getFullYear() && e.date.month === date.getMonth() && e.date.date === date.getDate());

        const bookIndex = state.lists.flat().findIndex(e => e.id === state.diary[index]?.readBooks[0]?.book);
        let read = 0;
        for (let i of state.diary[index]?.readBooks ?? []) read += i.read ?? 0;
        logs.days.push({
            book: state.lists.flat()[bookIndex]?.name,
            read,
            rest: Math.max(state.diary[index]?.readBooks.length - 2, 0) ?? 0
        })
        date.setDate(date.getDate() + 1);
    }

    return logs;
}

export default function DiaryBox() {
    const data = useSelector(DiarySelector);

    const weekDays = getWeekDays("short");
    let dayIndex = new Date().getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;

    return <>
        <div className={classes["overview-diary"]}>
            <div className={classes["diary-week"]}>W {data.week}</div>
            <div className={classes["diary-rows"]}>
                {
                    weekDays.map((day, index) => <div key={index} className={classes["diary-row"]}>
                        <div className={classes["diary-day-name"] + (dayIndex === index ? " " + classes["day-today"] : "")}>{day}</div>
                        <div className={classes["diary-book-section"]}>
                            <div className={classes["diary-book-name"]}>{data.days[index].book}</div>
                            <div className={classes["diary-book-rest"]}>{"+" + data.days[index].rest ?? ""}</div>
                        </div>
                        <div className={classes["diary-pages-read"]}>{data.days[index].read}s.</div>
                    </div>)
                }
            </div>
        </div>
        <div className={classes["overview-title"]}>Diary</div>
    </>
}

function getweek(d: Date) {
    var date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

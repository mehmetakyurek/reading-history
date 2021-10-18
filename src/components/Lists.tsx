import React, { FC, ReactElement } from "react"
import classes from "./styles/Lists.module.scss";

import { ReactComponent as ToReadIcon } from "./styles/img/toRead.svg";
import { ReactComponent as ReadingIcon } from "./styles/img/reading.svg"; // Change colors
import { ReactComponent as ReadIcon } from "./styles/img/read.svg";

import { BookState } from "../store/reducers/main"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { RDate, RDateType } from "../class";
export default function ListsPage() {
    const toRead = useSelector((state: RootState) => state.main.books.filter(e => e.list == "toRead"));
    const reading = useSelector((state: RootState) => state.main.books.filter(e => e.list == "reading"));
    const read = useSelector((state: RootState) => state.main.books.filter(e => e.list == "read"));

    return <div className={classes["container"]}>
        <div className={classes["list-box"] + " " + classes["list-box-to-read"]}>
            <div className={classes["list-box-item-container"]}>
                {toRead.map((e) => <ListItem key={e.id} {...e}></ListItem>)}
            </div>
            <div className={classes["list-box-icon"]}><ToReadIcon /></div>
        </div>
        <div className={classes["list-box"] + " " + classes["list-box-to-read"]}>
            <div className={classes["list-box-item-container"]}>
                {reading.map((e) => <ListItem key={e.id} {...e}></ListItem>)}
            </div>
            <div className={classes["list-box-icon"]}><ReadingIcon /></div>
        </div>
        <div className={classes["list-box"] + " " + classes["list-box-to-read"]}>
            <div className={classes["list-box-item-container"]}>
                {read.map((e) => <ListItem key={e.id} {...e}></ListItem>)}
            </div>
            <div className={classes["list-box-icon"]}><ReadIcon /></div>
        </div>
    </div>
}

const ListItem: FC<BookState> = (props): ReactElement => {
    return <div className={classes["list-box-item"]}>
        <div className={classes["list-box-item-book"]}>{props.name}</div>
        <div className={classes["list-box-item-author"]}>{props.author}</div>
        <div className={classes["list-box-item-page"]}>{props.pages}s.</div>
        <div className={classes["list-box-item-remaining"]}>{props.date != undefined ? getRemaining(props.date) : ""}</div>
    </div>
}
const globalDate = new Date();
function getRemaining(date: Date | RDateType): string {
    if (!(date instanceof Date)) date = new RDate(date).defaultDate;
    if (globalDate.getFullYear() == date.getFullYear()) {
        if (globalDate.getMonth() == date.getMonth()) {
            if (globalDate.getDate() != date.getDate()) return globalDate.getDate() - date.getDate() + "d";
        } else return globalDate.getMonth() - date.getMonth() + "m";
    } else return globalDate.getFullYear() - date.getFullYear() + "y";
    return "";
}
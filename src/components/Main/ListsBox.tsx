import { useSelector } from "react-redux"

import classes from "./scss/Lists.module.scss"
import { BookState, RootState } from "../../store"
import cn from "classnames"

type SectionData = { books: Array<BookState>, rest: number };

const ListBoxSelector = (state: RootState): Array<SectionData> => {
    const lists = [state.main.books.filter(e => e.list === "toRead"), state.main.books.filter(e => e.list === "reading"), state.main.books.filter(e => e.list === "read")]
    return lists.map(e => { return { books: e.slice(0, 3), rest: e.length > 3 ? e.length - 3 : 0 } })
}

function Section(props: { list: SectionData, className?: string }) {
    return <div className={cn(classes["section"], props.className)}>
        <div className={classes["left"]}><div className={classes["line"]} /></div>
        <div className={classes["books"]}>
            {props.list.books.map(e => <div className="book">{e.name + (e.author ? " - " + e.author : "")}</div>)}
            <div className={classes["rest"]}>{props.list.rest ? "+" + props.list.rest : ""}</div>
        </div>
    </div>
}

export default function ListsBox() {
    const data = useSelector(ListBoxSelector);
    return <>
        <div className={classes["overview-lists"]}>
            <div className={classes["section-container"]}>
                <Section list={data[0]} className={classes["section-toRead"]} />
                <Section list={data[1]} className={classes["section-reading"]} />
                <Section list={data[2]} className={classes["section-read"]} />
            </div>
        </div>
        <div className={classes["overview-title"]}>Plan</div>
    </>
}
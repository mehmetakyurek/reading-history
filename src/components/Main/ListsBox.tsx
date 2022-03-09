import { useSelector } from "react-redux"

import classes from "./scss/Lists.module.scss"
import { RootState } from "../../store"
import cn from "classnames"
type BookName = {
    book: string, author: string
}



const ListBoxSelector = (state: RootState) => {
    let data = { toRead: { books: [], rest: 0 }, reading: { books: [], rest: 0 }, read: { books: [], rest: 0 } } as any;
    let [toRead, reading, read] = [state.main.books.filter(e => e.list === "toRead"), state.main.books.filter(e => e.list === "reading"), state.main.books.filter(e => e.list === "read")]
    const st = { toRead, reading, read } as any;
    for (const i in data) {
        for (let x = st[i].length - 1; x > (st[i].length - 4 > 0 ? st[i].length - 4 : 0); x--) {
            data[i].books.push({ author: st[i][x].author, book: st[i][x].name })
            data[i].rest = Math.max(st[i].length - 3, 0)
        }
    }

    return data as { toRead: SectionData, reading: SectionData, read: SectionData };
}

type SectionData = {
    books: Array<BookName & { remaining?: string }>,
    rest?: number
}

function Section(props: { books: SectionData, className?: string }) {
    return <div className={cn(classes["section"], props.className)}>
        <div className={classes["left"]}><div className={classes["line"]} /></div>
        <div className={classes["books"]}>
            {props.books.books.map(e => <div className="book">{e.book + (e.author ? " - " + e.author : "")}</div>)}
            <div className={classes["rest"]}>{props.books.rest ? "+" + props.books.rest : ""}</div>
        </div>
    </div>
}

export default function ListsBox() {
    const data = useSelector(ListBoxSelector);
    return <>
        <div className={classes["overview-lists"]}>
            <div className={classes["section-container"]}>
                <Section books={data.toRead} className={classes["section-toRead"]} />
                <Section books={data.reading} className={classes["section-reading"]} />
                <Section books={data.read} className={classes["section-read"]} />
            </div>
        </div>
        <div className={classes["overview-title"]}>Plan</div>
    </>
}
import { useSelector } from "react-redux";
import { RDate } from "../../class";
import { RootState } from "../../store";
import classes from "./scss/TextBoxes.module.scss"


export interface ITextOverview {
    text?: string,
    from?: { name: string, author: string },
    date?: Date
}

export default function QuotesBox() {
    const data = useSelector((state: RootState) => {
        const q = state.quotes[state.quotes.length - 1];
        const book = state.main.books.find(e => e.id === q?.book);

        return {
            text: q?.text ?? "",
            from: {
                name: book?.name ?? "", author: book?.author ?? ""
            },
            date: q?.date ? new RDate(q.date).defaultDate : undefined
        }
    });
    return <>
        <div className={classes["overview-quote"]}>
            <TextOverview data={data}></TextOverview>
        </div>
        <div className={classes["overview-title"]}>Quotes</div>
    </>
}


export function TextOverview(props: { data: ITextOverview }) {
    const data = props.data;
    return <div className={classes["text-box"]}>
        <div className={classes["text-overview-text"]}>{data.text}</div>
        <div className={classes["text-overview-data"]}>
            <div className={classes["text-overview-book"]}>{data.from?.name}</div>
            <div className={classes["text-overview-author"]}>{data.from?.author}</div>
            <div className={classes["text-overview-date"]}>{data.date?.toLocaleDateString() ?? ""}</div>
        </div>
    </div>;
}
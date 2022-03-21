import classes from "./scss/TextBoxes.module.scss"

import { ITextOverview, TextOverview } from "./QuotesBox"
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { RDate } from "../../class";
import { splitAuthor } from "../util";

export default function SummariesBox() {

    const data = useSelector<RootState, ITextOverview>((state) => {
        const summary = state.summaries[state.summaries.length - 1];
        const book = state.main.books.find(e => e.id === summary?.book)?.name;
        const [name, author] = splitAuthor(book)
        return summary ? {
            text: summary?.text ?? "",
            date: new RDate(summary.date).defaultDate,
            from: { author, name }
        } : {
            text: "Data Not Found"
        }
    })
    return <>
        <div className={classes["overview-summaries"]}>
            <TextOverview data={data}></TextOverview>
        </div>
        <div className={classes["overview-title"]}>Summaries</div>
    </>
}

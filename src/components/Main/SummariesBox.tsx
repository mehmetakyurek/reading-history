import classes from "./scss/TextBoxes.module.scss"

import { ITextOverview, TextOverview } from "./QuotesBox"
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { RDate } from "../../class";

export default function SummariesBox() {

    const data = useSelector<RootState, ITextOverview>((state) => {
        const summary = state.summaries[state.summaries.length - 1];
        const book = state.main.books.find(e => e.id === summary?.book);
        return summary ? {
            text: summary?.text ?? "",
            date: new RDate(summary.date).defaultDate,
            from: {
                author: book?.author ?? "",
                name: book?.name ?? ""
            }
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

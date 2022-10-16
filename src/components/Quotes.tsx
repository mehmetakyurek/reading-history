import { FC, MouseEventHandler, ReactElement, useEffect, useState } from "react"
import { RDate } from "../class";
import { RootState } from "../store"

import classes from "./styles/Quotes.module.scss"

import FilterBox from "./FilterBox"

import { addQuote, deleteQuote, Quote, quotesSelector } from "../store/reducers/quotes";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as SaveButton } from "./styles/img/save.svg";
import { ReactComponent as CancelButton } from "./styles/img/cancel.svg";
import { ReactComponent as AddButton } from "./styles/img/plus.svg";

import { updateQuote } from "../store/reducers/quotes"
import { getBookId } from "./Diary"
import { createDateString, FilterAlgorithm, splitAuthor } from "./util";
import TitleBar from "./TitleBar";


const QuotesPage: FC = (props): ReactElement => {
    const data = useSelector((state: RootState) => quotesSelector(state))
    const tags = useSelector((state: RootState) => [...new Set(state.quotes.map(e => e.tags ?? []).flat())]);

    const [id, setId] = useState<string>();
    const [searchText, setSearchText] = useState("");
    const [selectedTags, setTags] = useState<Array<string>>([]);
    const [OC, setOC] = useState(0);
    return <><TitleBar page="Quotes" />
        <AddQuoteOverlay id={id} OC={OC} />

        <div className={classes["container"]}>
            <div className={classes["quotes-container"]}>
                <div className={classes["add-quote-button"]} onClick={() => { setId(undefined); setOC(OC + 1); }}><AddButton /></div>
                <div className={classes["quotes-item-container"]}>
                    {data.map(e => {
                        if (FilterAlgorithm(e, searchText, selectedTags))
                            return <QuoteItem
                                key={e.id}
                                {...e}
                                onClick={() => {
                                    setId(e.id);
                                    setOC(OC + 1)
                                }} />
                    })}
                </div>
            </div>
            <div className={classes["filter-box"]}>
                <FilterBox
                    tags={tags}
                    selectedTags={indexes => setTags(indexes)}
                    searchFilter={text => setSearchText(text)}
                />
            </div>
        </div>
    </>
}

//Change to Google Keep layout
const QuoteItem: FC<Quote & { onClick?: MouseEventHandler<HTMLDivElement> }> = (props): ReactElement => {
    const [book, author] = splitAuthor(props.book?.name);
    const dispatch = useDispatch();
    return <div className={classes["quotes-item"]} onClick={props.onClick}>
        <div className={classes["quote-delete-button"]} onClick={e => {
            e.stopPropagation();
            dispatch(deleteQuote({ id: props.id }));
        }}></div>
        <div className={classes["quotes-item-header"]}>
            <div className={classes["quotes-item-book"]}>{props.book?.name || props.customName || ""}</div>

        </div>
        <div className={classes["quotes-item-content"]}>{props.text}</div>
        <div className={classes["quotes-item-date"]}>{createDateString(props.date)}</div>
    </div>
}


export default QuotesPage;

const AddQuoteOverlay: FC<{ id?: string, OC: number }> = (props): ReactElement => {
    const [enabled, setEnabled] = useState(props.id !== undefined);
    const [bookInput, setBookInput] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [text, setQuote] = useState<string>("");
    const quote = useSelector((state: RootState) => state.quotes.find(e => e.id === props.id));
    const books = useSelector((state: RootState) => state.lists.flat());
    const book = useSelector((state: RootState) => state.lists.flat().find(e => e.id === quote?.book ?? ""));

    const dispatch = useDispatch();

    useEffect(() => {
        setEnabled(props.OC > 0);
        if (props.id === undefined) {
            setBookInput("")
            setPage(0);
            setQuote("");
        } else {
            setBookInput(book?.name ?? quote?.customName ?? "")
            setPage(quote?.page ?? 0);
            setQuote(quote?.text ?? "");
        }
    }, [props.OC])

    return <div id="add-quote-overlay-bg" className={classes["add-quote-overlay"]} style={{ display: enabled ? "" : "none" }}
        onClick={(e) => {
            if ((e.target as HTMLElement).id === "add-quote-overlay-bg") setEnabled(false);
        }}>
        <div className={classes["add-quote-content-container"]} >
            <div className={classes.QuoteBoxHeader}>
                <input className={classes.QuoteBoxHeaderName} value={bookInput} placeholder={"Name"} onChange={e => setBookInput(e.currentTarget.value)} />
                <div className={classes.QuoteBoxHeaderPage} >Page: <input value={page || ""} type="number" style={{ width: page.toString().length + "ch" }} onChange={e => setPage(Number(e.currentTarget.value))} /></div>
            </div>
            <div className={classes["add-quote-text"]}>
                <textarea value={text} placeholder={"Quote..."} spellCheck={false} onChange={e => setQuote(e.currentTarget.value)}></textarea>
            </div>
            <div className={classes["add-quote-buttons"]}>
                <div className={classes["add-quote-buttons-save"]}
                    onClick={() => {
                        const bookid = getBookId(books, bookInput);
                        if (typeof props.id === "string") dispatch(updateQuote({ id: props.id ?? "", text: text ?? "", book: bookid, customName: bookid ? undefined : bookInput, page: page }));
                        else {
                            dispatch(addQuote({
                                date: new RDate().Date,
                                text: text ?? "",
                                book: bookid,
                                customName: bookid ? undefined : bookInput,
                                page: page
                            }))
                        }
                        setEnabled(false);
                    }}>
                    <SaveButton /></div>
                <div className={classes["add-quote-buttons-cancel"]} onClick={() => { setEnabled(false) }}><CancelButton /></div>
            </div>
        </div>
    </div>
}

//<input className={classes["add-quote-book-name"]} value={bookInput} placeholder={"Name"} onChange={e => setBookInput(e.currentTarget.value)} />
//{< input value={page || ""} type="number" onChange={e => setPage(Number(e.currentTarget.value))} />}
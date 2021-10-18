
import classes from "./styles/Summaries.module.scss";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { deleteSummary, updateSummary } from "../store/reducers/summaries";
import { ReactComponent as CheckIcon } from "./styles/img/check.svg"
import { ReactComponent as CancelIcon } from "./styles/img/cancel.svg"
import { updateBook } from "../store/reducers/summaries"
import { getBookId } from "./Diary";

const SummaryOverlay: FC<{ id?: string, counter?: number }> = (props): ReactElement => {
    const dispatch = useDispatch();
    
    const summary = useSelector((state: RootState) => state.summaries.find(e => e.id === props.id));

    const book = useSelector((state: RootState) => state.main.books.find(e => e.id === summary?.book));
    const [page, setPage] = useState(summary?.page ?? 0);
    const [text, setText] = useState(summary?.text ?? "");
    const [customText, setCustomText] = useState(book?.name || summary?.source || "");


    const [enabled, setEnabled] = useState(false);

    const books = useSelector((state: RootState) => state.main.books);

    useEffect(() => {
        setText(summary?.text ?? "");
        setPage(summary?.page ?? 0);
        setCustomText(book?.name || summary?.source || "");
    }, [props.id, summary?.text, summary?.book, summary?.page, summary?.source])

    useEffect(() => {
        setEnabled((props.counter ?? -1) > 0);
    }, [props.counter, props.id])

    const inputRef = useRef<HTMLInputElement>(null);

    return <div className={classes["summary-overlay-container"]} style={{ display: enabled ? "" : "none" }}>
        <div className={classes["summary-overlay-left"]}>
            <div className={classes["delete-summary-button"]} onClick={e => {
                if (props.id) dispatch(deleteSummary({ id: props.id }))
                setEnabled(false);
            }}></div>
            <div className={classes["summary-overlay-book"]} onClick={(event) => {

                event.preventDefault();
                setTimeout(() => { inputRef.current?.focus() }, 1);
            }}>
                <input ref={inputRef} value={customText} placeholder={"Book"}
                    onBlur={(e) => {
                        const book = getBookId(books, e.currentTarget.value);
                        dispatch(updateBook({
                            id: summary?.id ?? "",
                            book: book,
                            source: customText
                        }))
                    }}
                    onChange={e => setCustomText(e.target.value)}
                    onKeyPress={e => {
                        if (e.key == "Enter") e.currentTarget.blur();
                    }}
                />
            </div>
            <div className={classes["summary-overlay-bottom"]}>
                <div className={classes["summary-overlay-buttons"]}>
                    <div className={classes["check"]} onClick={e => {
                        dispatch(updateSummary({ id: summary?.id, text: text }));
                        setEnabled(false);
                    }}>
                        <CheckIcon />
                    </div>
                    <div className={classes["cancel"]}>
                        <CancelIcon onClick={() => setEnabled(false)} />
                    </div>
                </div>
                <div className={classes["summary-overlay-page"]}>
                    {summary?.page ?? ""}
                </div>
            </div>
        </div>
        <div className={classes["summary-overlay-right"]}>
            <textarea value={text} onChange={e => setText(e.target.value)} spellCheck="false" />
        </div>
    </div >
}

export default SummaryOverlay;
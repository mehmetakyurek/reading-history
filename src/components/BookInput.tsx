import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { BookState } from "../store/reducers/main";
import classes from "./styles/BookInput.module.scss"

type props = {
    style?: React.CSSProperties,
    value?: string
    onChange?: (value: string) => void  
    changeLayout?: boolean
}
/*
const BookInput: FC<props> = (props) => {
    const [inputVal, setInputVal] = useState(props.value ?? "la");
    const [selected, setSelected] = useState(-1);
    const resultBox = useRef<HTMLDivElement>(null);
    const rowHeight = useMemo(() => { return resultBox.current?.children[0]?.clientHeight ?? 0; }, [resultBox.current?.children[0]?.clientHeight])
    const inputEl = useRef<HTMLInputElement>(null);
    const [enableLayout, setLayout] = useState(props.changeLayout !== undefined && props.changeLayout);
    console.log(enableLayout);


    const list = useSelector((state: RootState) => {
        const [book, author] = inputVal.replace(" - ", "/*").split("/*").map(e => e.toLocaleLowerCase());
        if (book.length > 1) return state.main.books.filter(e => e.name.toLowerCase().includes(book) && (author === undefined || e.author?.toLowerCase().includes(author)))
        else return [];
    });

    const BookSelected = useCallback(() => {
        setInputVal(list[selected].name + " - " + list[selected].author);
    }, [list, selected])

    useEffect(() => {
        const [scrollTop, boxHeight, selectedTop] = [resultBox.current?.scrollTop ?? 0, resultBox.current?.offsetHeight ?? 0, (selected + 1) * rowHeight];
        if (selectedTop > boxHeight + scrollTop) resultBox.current?.scrollTo(0, rowHeight * (selected + 1) - resultBox.current.clientHeight);
        else if (selectedTop - rowHeight < scrollTop) resultBox.current?.scrollTo(0, rowHeight * (selected));
    }, [selected])

    useEffect(() => {
        setInputVal(props.value ?? "")
    }, [props.value])

    const [results, setResults] = useState(false);
    return <div className={classes["book-input-container"]} style={{ ...props.style, borderRadius: results ? "3px 3px 0 0" : "3px" }}>
        <BookName val={inputVal} enabled={enableLayout} onClick={() => { setLayout(false); inputEl.current?.focus(); }} />
        
        <input
            className={classes["book-input"]}
            type="text"
            value={inputVal}
            placeholder="Text Here..."
            ref={inputEl}
            onChange={e => {
                setInputVal(e.currentTarget.value);
                props.onChange?.(e.currentTarget.value);
            }}

            onFocus={() => {
                setResults(true);
            }}

            onKeyDown={e => {
                if (e.key === "ArrowDown")
                    if (selected === list.length - 1) setSelected(0)
                    else setSelected(selected + 1);
                else if (e.key === "ArrowUp")
                    if (selected === 0) setSelected(list.length - 1);
                    else setSelected(selected - 1);
                else if (e.key === "Enter") {
                    if (list[selected]) BookSelected()
                }
                else if (e.key === "Escape") {
                    if (results) setResults(false);
                    else inputEl.current?.blur();
                }
                else if (e.ctrlKey === true && e.key === " ") {
                    setResults(!results);
                }
            }}
            onBlur={() => {
                setTimeout(() => {
                    //setSelected(-1);
                    setResults(false);
                    setLayout(true);
                }, 50)
            }}
        />
        <div className={classes["book-input-result-box"]} style={{ display: results ? "" : "none" }} ref={resultBox}>
            {list.map((e, index) =>
                <ResultRow
                    key={e.id}
                    book={e}
                    selected={selected === index}
                    hover={() => setSelected(index)}
                    click={() => {
                        BookSelected();
                    }} />)}
        </div>
    </div>
}


const ResultRow: FC<{ book: BookState, selected: boolean, hover?: () => void, click?: () => void }> = props => {
    const book = props.book;
    return <div className={classes["result-box-row"] + (props.selected ? " " + classes["selected"] : "")} onMouseMove={e => props.hover?.()} onMouseDown={(e) => { if (e.button === 0) props.click?.() }}>
        <div className={classes["row-name"]}>{book.name}</div>
        <div className={classes["row-author"]}>{book.author}</div>
        <div className={classes["row-icon"] + (props.book.list ? (" " + classes[("row-icon-" + props.book.list)]) : "")}></div>
    </div>
}

const BookName: FC<{ val: string, enabled: boolean, onClick?: React.MouseEventHandler<HTMLDivElement> }> = props => {
    const [book, setBook] = useState("");
    const [author, setAuthor] = useState("");

    useEffect(() => {
        const book = props.val.split(" - ");
        setBook(book[0]);
        setAuthor(book[1] ?? "");
    }, [props.val]);

    const [enabled, setEnabled] = useState(props.enabled);
    useEffect(() => {
        setEnabled(props.enabled);
    }, [props.enabled]);

    return <div className={classes["book-name-author-layout"]} style={{ display: enabled ? "" : "none" }} onClick={props.onClick}>
        <div className={classes["book-layout-book"]}>{book}</div>
        <div className={classes["book-layout-author"]}>{author}</div>
    </div>
}

export default BookInput;*/
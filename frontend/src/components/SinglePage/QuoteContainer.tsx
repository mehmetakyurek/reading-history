import { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RDate } from "../../class";
import { RootState } from "../../store";
import { addQuote, updateQuote } from "../../store/reducers/quotes";

const Quotes: FC<{ book: string }> = props => {
    const quotes = useSelector((state: RootState) => state.quotes.filter(e => e.book === props.book));
    const book = useSelector((state: RootState) => state.lists.flat().find(e => e.id === props.book));
    return <div className="grid grid-rows-[auto_minmax(0,1fr)] h-full">
        <div className="relative header text-center py-2">{book?.name} </div>
        <div className="flex flex-wrap gap-5 overflow-auto justify-center box-border mx-2.5 mt-2.5 pb-2.5">
            <NewQuote book={props.book} />{quotes.map(quote => <Quote key={quote.id} text={quote.text} id={quote.id} />)}
        </div>
    </div>
}

const Quote: FC<{ text: string, id: string }> = props => {
    const dispatch = useDispatch();
    const [val, setVal] = useState(props.text);
    const spellcheck = useSelector((state: RootState) => state.prefs.spellcheck);
    const save = useCallback(() => {
        dispatch(updateQuote({
            id: props.id,
            text: val
        }));
    }, [dispatch, val, props.id])
    return <textarea
        className="basis-80 bg-neutral-800 px-4 py-5 rounded resize-none h-80 outline-none"
        value={val}
        onChange={e => setVal(e.currentTarget.value)}
        spellCheck={spellcheck} onBlur={e => { save(); e.currentTarget.setAttribute("spellcheck", "false") }} onFocus={e => e.currentTarget.setAttribute("spellcheck", spellcheck.toString())} />

}
const NewQuote: FC<{ book: string }> = (props) => {
    const dispatch = useDispatch();
    const [val, setVal] = useState('');
    const save = useCallback(() => {
        if (val.length > 5) {
            dispatch(addQuote({
                date: new RDate().Date,
                text: val,
                book: props.book
            }))
            setVal('');
        }
    }, [val]);
    return <textarea
        className="basis-80 bg-neutral-800 px-4 py-5 rounded resize-none h-80 outline-none"
        value={val}
        onChange={e => setVal(e.currentTarget.value)}
        onBlur={save}
        onKeyUp={e => { if (e.ctrlKey && e.code === 'Enter') save() }}
    />
}
export default Quotes;
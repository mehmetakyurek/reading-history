import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { setNote } from "../../store/reducers/lists"

const Note: FC<{ book: string }> = (props) => {
    const dispatch = useDispatch();
    const book = useSelector((state: RootState) => state.lists.flat().find(e => e.id === props.book));
    const [value, setValue] = useState(book?.note ?? "");
    const spellcheck = useSelector((state: RootState) => state.prefs.spellcheck);
    useEffect(() => {
        setValue(book?.note ?? "");
    }, [book, setValue])
    const save = useCallback(() => {
        if (book)
            dispatch(setNote({ bookId: book.id, text: value }))
    }, [value, book, dispatch])

    return <div className='p-4 h-full grid grid-rows-[auto,1fr]'>
        <div className='text-xl mb-4'>{book?.name}</div>
        <textarea className='resize-none w-full h-full bg-transparent outline-none' placeholder="Note...."
            value={value} onChange={e => setValue(e.currentTarget.value)} spellCheck={spellcheck} onBlur={e => { save(); e.currentTarget.setAttribute("spellcheck", "false") }} onFocus={e => e.currentTarget.setAttribute("spellcheck", spellcheck.toString())} />
    </div>
}

export default Note;
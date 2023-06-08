import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addBook } from "../../../store/reducers/lists";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { Button } from ".";
import cn from "classnames";
import { log } from "console";

let timeOut: NodeJS.Timeout;

export const NewBookInput: FC = props => {
    const spellcheck = useSelector((state: RootState) => state.prefs.spellcheck);
    const [val, setVaL] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");
    const Add = useCallback((e: string) => {
        if (e && e.length > 2) {
            dispatch(addBook({ name: val, list: 1 }));
            setVaL("");
        }
    }, [dispatch, val, setVaL]);

    useEffect(() => {
        clearTimeout(timeOut);
        timeOut = setTimeout(() => { setSearchText(val) }, 1000);
    }, [setSearchText, timeOut, val])
    const onSelect = useCallback((text: string) => {
        setVaL(text);
        setSearchText("")
    }, [setVaL, setSearchText])
    const onEnter = useCallback(() => {

    }, [])
    return <div className='flex basis-full gap-3 relative'>
        <input
            spellCheck={spellcheck}
            className='bg-transparent border rounded-sm border-border-color py-1 px-2.5 outline-none placeholder:text-disabled' type="text" placeholder="Add book..."
            value={val} onChange={e => setVaL(e.currentTarget.value)}
            onKeyUp={e => e.key === "Enter" && Add(e.currentTarget.value)} /* onBlur={e => Add(e.currentTarget.value)} */ />
        <Button className="w-7 hover:bg-gray-800" onClick={e => navigate("/plan")} />
        <RecommendationList q={searchText} onSelect={onSelect} onEnter={onSelect} />
    </div>
}

const RecommendationList: FC<{ q: string, onSelect: (text: string) => void, onEnter: (text: string) => void }> = props => {
    const [result, setResult] = useState<any>();
    const [selected, setSelected] = useState(-1);
    useEffect(() => {
        if (props.q?.length > 5)
            fetch("https://openlibrary.org/search.json?q=title%3A+\"" + encodeURI(props.q) + "\"").then(val => {
                val.json().then(json => setResult(json.docs));
            });
        else setResult(undefined);
    }, [props.q])
    const onKeydown = useCallback((ev: KeyboardEvent) => {
        switch (ev.key) {
            case "ArrowDown":
                if (selected < result?.length || -1) setSelected(s => s + 1);
                break;
            case "ArrowUp":
                if (selected > 0) setSelected(s => s - 1);
                break;
            case "Enter":
                if (selected > 0) props.onEnter?.(result[selected].title);
                break;
        }

    }, [selected, result, setSelected])
    useEffect(() => {
        window.addEventListener('keydown', onKeydown);
        return () => {
            window.removeEventListener("keydown", onKeydown);
        };
    }, [onKeydown])
    const Click: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        let target = (e.target as HTMLElement);
        if (target.tagName !== 'DIV') target = (target.parentElement as HTMLDivElement);
        props.onSelect(target.getAttribute('data-name') || "");
    }, [props.onSelect])
    return <div className="absolute top-full flex flex-col w-80 rounded bg-rock-200" onClick={Click}>
        {result?.map((r: any, i: number) =>
            <SearchResultItem item={r} selected={selected === i} />
        )}
    </div>
}
const SearchResultItem: FC<{ item: any, selected?: boolean }> = props => {

    return <div data-name={props.item.title} className={cn("p-2 w-full h-fit flex items-center hover:bg-rock-400", { 'bg-rock-400': props.selected })}>
        <img src={"https://covers.openlibrary.org/b/id/" + props.item.cover_i + "-S.jpg"} alt="" />
        <span className="ml-2">
            {props.item.title}
        </span>
    </div>
}
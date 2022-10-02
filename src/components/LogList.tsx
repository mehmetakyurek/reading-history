import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookState, RootState } from "../store";
import { BookList } from "../store/reducers/main";
import { move } from "../store/reducers/lists";

import classes from "./styles/LogList.module.scss"
import { createDateString } from "./util";
import cn from "classnames"

const LogList: FC = () => {
    const headers = ["To Read", "Reading", "Read"];
    const [drag, setDrag] = useState<onDragType>();
    const lists = useSelector<RootState, Array<Array<BookState>>>(state => state.lists);
    return <div className={classes["container"]}>
        {drag !== undefined && drag.point.x > 0 && <DragItem clickPoint={drag.point} size={drag.size} ><ListItem book={drag.book} key="drag" /></DragItem>}
        {lists.map((e, i) =>
            <List
                header={headers[i]}
                logs={e}
                drag={(drag) => setDrag(drag)}
                dragItem={drag?.book}
            />)}
    </div>
}
const List: FC<{ logs: Array<BookState>, header: string, drag?: (drag?: onDragType) => void, dragItem?: BookState }> = props => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState(-1);
    const wrapper = useRef<HTMLDivElement>(null);
    const id = useMemo(() => props.logs.findIndex(e => e.id === props.dragItem?.id), [props.dragItem, props.logs]);
    const calculateOrder = useCallback((e: React.MouseEvent<HTMLDivElement>, ignoreDragItem?: boolean) => {
        if ((props.dragItem || ignoreDragItem) && wrapper.current) {
            const items = [...wrapper.current.children].filter(e => !e.classList.contains(classes["hidden"])) as Array<HTMLDivElement>;
            //console.log(items, wrapper.current.children);

            for (let i = 0; i < items.length; i++) {
                //console.log(id, i, items[i].classList.toString(), items[i].offsetHeight, items[i].offsetTop);
                if ((
                    ((items[i]).offsetTop + (items[i]).offsetHeight / 2) - wrapper.current.offsetTop)
                    >
                    ((e.pageY - wrapper.current.offsetTop) + (wrapper.current.scrollTop))) {
                    setOrder(i);
                    break;
                }
            }
        }
    }, [wrapper.current, setOrder, props.dragItem])

    let timeOut: NodeJS.Timeout;

    return <div
        className={classes["list"]}
        onMouseMove={e => {
            if (props.dragItem) {
                clearTimeout(timeOut);
                timeOut = setTimeout(() => calculateOrder(e), 1);
            }
        }}
        onMouseLeave={() => { setOrder(-1); clearTimeout(timeOut) }}
        onMouseDown={e => calculateOrder(e, true)}
        onMouseUp={e => {
            if (props.dragItem) {
                dispatch(move({ id: props.dragItem.id, list: props.header === "Read" ? 2 : props.header === "Reading" ? 1 : 0, order }))
                setOrder(-1);
            }
        }}
    ><div className={classes["list-header"]}>{props.header}</div>
        <div className={classes["wrapper"]} ref={wrapper}>{props.logs.map((e, i) => {
            return <>
                {order === i && props.dragItem && <ListItem book={props.dragItem} preview />}
                {<ListItem hidden={id === i} book={e} key={e.id} drag={props.drag} />}
                {console.log(order, i)}
                {order === props.logs.length - (id > -1 ? 1 : 0 ) && order - 1 === id && props.dragItem && <ListItem book={props.dragItem} preview />}
            </>
        })}</div>
    </div>
}
type onDragType = { book: BookState, point: Point, size: Point }

const ListItem: FC<{ book: BookState, drag?: (drag?: onDragType) => void, hidden?: boolean, preview?: boolean }> = (props) => {
    return <div className={cn(classes["list-item"], { [classes["preview"]]: props.preview, [classes["hidden"]]: props.hidden })} style={{ display: props.hidden ? "none" : "" }} onMouseDown={e => {
        if (e.button === 0) {
            props.drag?.({
                book: props.book,
                point: { x: e.clientX - e.currentTarget.offsetLeft, y: e.screenY - (e.currentTarget.offsetTop - (e.currentTarget.parentElement?.scrollTop ?? 0)) },
                size: { x: e.currentTarget.clientWidth, y: e.currentTarget.clientHeight }
            });
            document.body.style.userSelect = "none";
            document.addEventListener("mouseup", () => {
                props.drag?.(undefined);
                document.body.style.userSelect = "";
            }, { once: true })
        }
    }}>

        <div className={classes["book"]}>
            <div className={classes["book-name"]}>{props.book.name}</div>
            <div className={classes["book-page"]}>{props.book.pages ?? "0"}</div>
        </div>
        <div className={classes["dates"]}>
            <div className={classes["date-start"]}>{props.book.date ? createDateString(props.book.date) : ""}</div>
            <div className={classes["date-end"]}>{props.book.finishDate ? createDateString(props.book.finishDate) : ""}</div>
        </div>
        <div className={classes["buttons"]}>
            <div className={classes["quotes"]}>Quotes</div>
            <div className={classes["note"]}>Edit Note</div>
        </div>
    </div>;
}


type Point = { x: number, y: number }

const DragItem: FC<{ clickPoint: Point, size: Point }> = props => {
    const item = useRef<HTMLDivElement>(null);
    const updatePoint = useCallback((e: MouseEvent): any => {
        if (item.current) {
            item.current.style.top = (e.pageY - props.clickPoint.y) + "px"
            item.current.style.left = (e.pageX - props.clickPoint.x) + "px"
        }
    }, [item.current])
    useEffect(() => {
        document.addEventListener("mousedown", updatePoint, { once: true });
        document.addEventListener("mousemove", updatePoint)
        return () => document.removeEventListener("mousemove", updatePoint);
    }, [document])
    return createPortal(<div className={classes["drag-item"]} ref={item} style={{
        pointerEvents: "none",
        width: props.size.x, height: props.size.y
    }}>
        {props.children}
    </div>, document.getElementById("root")!);
}

export default LogList;
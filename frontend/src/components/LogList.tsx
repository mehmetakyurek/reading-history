import React, { FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { BookState, RootState } from "../store";
import { move } from "../store/reducers/lists";

import classes from "./styles/LogList.module.scss"
import { createDateString } from "./util";
import cn from "classnames"
import TitleBar from "./TitleBar";

import { ReactComponent as DeleteIcon } from "./styles/img/delete.svg"
import { ReactComponent as EditIcon } from "./styles/img/edit.svg"
const LogList: FC = () => {
    const headers = ["To Read", "Reading", "Read"];
    const [drag, setDrag] = useState<onDragType>();
    const lists = useSelector<RootState, Array<Array<BookState>>>(state => state.lists);

    return <> <TitleBar page="Plan" />
        <div className={classes["container"]}>
            {drag !== undefined && drag.point.x > 0 && <DragItem clickPoint={drag.point} size={drag.size} ><ListItem book={drag.book} key="drag" /></DragItem>}
            {lists.map((e, i) =>
                <List
                    key={i}
                    header={headers[i]}
                    logs={e}
                    drag={(drag) => setDrag(drag)}
                    dragItem={drag?.book}
                />)}
        </div>
    </>
}
const List: FC<{ logs: Array<BookState>, header: string, drag?: (drag?: onDragType) => void, dragItem?: BookState }> = props => {
    const dispatch = useDispatch();
    const [order, setOrder] = useState(-1);
    const wrapper = useRef<HTMLDivElement>(null);
    const id = useMemo(() => props.logs.findIndex(e => e.id === props.dragItem?.id), [props.dragItem, props.logs]);
    const [scroll, setScroll] = useState(0);
    const items = [...props.logs]

    if (id > -1) items.splice(id, 1)
    if (order > -1 && props.dragItem) items.splice(order, 0, props.dragItem);

    let rowGap: number = 0;
    useEffect(() => {
        if (wrapper.current) rowGap = Number(getComputedStyle(wrapper.current).rowGap.replace("px", ""))
    }, [wrapper.current])

    const calculatePoint = useCallback(() => {
        let height = 0;
        if (wrapper.current)
            [...wrapper.current?.children].map(e => {
                if (e instanceof HTMLDivElement) {
                    e.style.top = height.toString() + "px";
                    height += e.offsetHeight + rowGap;
                }
            })
    }, [wrapper.current])
    useEffect(() => {
        window.addEventListener("resize", calculatePoint);
        return () => window.removeEventListener("resize", calculatePoint);
    }, [window])

    useEffect(calculatePoint, [order, props, wrapper.current?.children]);
    useEffect(() => {
        if (scroll !== 0) {
            interval = setInterval(() => {
                if (wrapper.current)
                    wrapper.current.scrollTop += scroll;
            }, 1)
            return () => clearInterval(interval)
        } else clearInterval(interval)
    }, [scroll])
    const calculateOrder = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (wrapper.current) {
            const items = [...wrapper.current.children].filter(e => !(e.classList.contains(classes["preview"]))) as Array<HTMLDivElement>;
            if (items.length === 0) setOrder(0);
            for (let i = 0; i < items.length; i++) {
                if (e.pageY <= wrapper.current.offsetTop) {
                    flushSync(() => { setOrder(0); })
                    break;
                }
                else if (((e.pageY + wrapper.current.scrollTop) >= (((items[items.length - 1]?.offsetTop + wrapper.current.offsetTop) + items[items.length - 1]?.offsetHeight)))) {
                    flushSync(() => { setOrder(items.length); })
                    break;
                } else if ((e.pageY + wrapper.current.scrollTop) <= ((items[i].offsetTop + wrapper.current.offsetTop) + (items[i].offsetHeight / 2))) {
                    flushSync(() => { setOrder(i); })
                    break;
                }
            }

            if (wrapper.current && wrapper.current.scrollHeight > 0) {
                if (e.pageY >= (wrapper.current.offsetTop + wrapper.current.offsetHeight) - 30 && wrapper.current.scrollTop < wrapper.current.scrollHeight) {
                    setScroll(2);
                } else if (e.pageY <= wrapper.current.offsetTop + 30 && wrapper.current.scrollTop > 0) {
                    setScroll(-2)
                } else {
                    setScroll(0);
                }
            }
        }
    }, [wrapper.current, setOrder, props.dragItem])

    let interval: NodeJS.Timeout;
    let timeOut: NodeJS.Timeout;

    return <div
        className={classes["list"]}
        onMouseMove={e => {
            if (props.dragItem) {
                clearTimeout(timeOut);
                timeOut = setTimeout(() => calculateOrder(e), 2);
            }
        }}
        onMouseLeave={() => { setOrder(-1); clearTimeout(timeOut) }}
        onMouseDown={(e) => {
            timeOut = setTimeout(() => {
                calculateOrder(e)
            }, 100)
        }}
        onMouseUp={() => {
            clearTimeout(timeOut)
            clearInterval(interval)
            setOrder(-1);
            if (props.dragItem) {
                dispatch(move({ id: props.dragItem.id, list: props.header === "Read" ? 2 : props.header === "Reading" ? 1 : 0, order }))
            }
        }}
    ><div className={classes["list-header"]}>{props.header}</div>
        <div className={classes["wrapper"]} ref={wrapper}>
            {items.map((e, i) =>
                <ListItem
                    key={e.id}
                    order={i}
                    book={e}
                    preview={order === i}
                    hidden={e.id === props.dragItem?.id && order !== i}
                    drag={order !== i ?
                        ((args) => {
                            if (props.drag && args && wrapper.current)

                                props.drag({
                                    ...args,
                                    point: { x: args.point.x - wrapper.current?.offsetLeft, y: args.point.y - wrapper.current.offsetTop + wrapper.current.scrollTop }
                                })
                            else props.drag?.(undefined)

                        }) : undefined} />
            )}
        </div>
    </div>
}
type onDragType = { book: BookState, point: Point, size: Point }

const ListItem = React.forwardRef<HTMLDivElement, { order?: number, book: BookState, drag?: (drag?: onDragType) => void, hidden?: boolean, preview?: boolean }>((props, ref) => {
    let timeout: NodeJS.Timeout;
    return <div
        ref={ref}
        data-order={props.order}
        className={cn(
            classes["list-item"],
            { [classes["preview"]]: props.preview, [classes["hidden"]]: props.hidden },
            "group z-1"
        )}
        style={{ display: props.hidden ? "none" : "" }}

        onMouseDown={ev => {
            const e = { ...ev };
            timeout = setTimeout(() => {
                if (e.button === 0) {
                    props.drag?.({
                        book: props.book,
                        point: { x: e.clientX, y: e.clientY - e.currentTarget.offsetTop },
                        size: { x: e.currentTarget.clientWidth, y: e.currentTarget.clientHeight }
                    });
                    document.body.style.userSelect = "none";
                    document.addEventListener("mouseup", () => {
                        props.drag?.(undefined);
                        document.body.style.userSelect = "";
                    }, { once: true })
                }
            }, 100)
        }} onMouseUp={() => { clearTimeout(timeout); props.drag?.(); }}>
        <div className={classes["book"] + " text-sm"}>
            <div className="overflow-hidden text-ellipsis">{props.book.name}</div>
            <div className="text-text-disabled ">{props.book.pages ?? "0"}</div>
        </div>
        <div className="pr-5 pl-2.5">
            <div className={classes["date-start"]}>{props.book.date ? createDateString(props.book.date) : ""}</div>
            <div className={classes["date-end"]}>{props.book.finishDate ? createDateString(props.book.finishDate) : ""}</div>
        </div>
        <div className="text-right cursor-pointer">
            <div className={classes["quotes"]}>Quotes</div>
            <div className={classes["note"]}>Edit Note</div>
        </div>
        <div className="
            absolute
            transition-transform -translate-x-5 group-hover:translate-x-0 left-full duration-100 -z-100
            px-1 f h-full 
            flex justify-evenly flex-col 
            invisible group-hover:visible hover:visible
            -z-1
        ">
            <div className="w-[2em] h-[2em]"><DeleteIcon className="w-[2em] h-[2em] fill-red-700 translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100" /></div>
            <div className="w-[2em] h-[2em]"><EditIcon className="w-[2em] h-[2em] fill-rock-100 -translate-y-4 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100" /></div>
        </div>
    </div>;
})


type Point = { x: number, y: number }

const DragItem: FC<{ children: ReactNode, clickPoint: Point, size: Point }> = props => {
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

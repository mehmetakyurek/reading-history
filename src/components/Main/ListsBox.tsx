import React, { } from "react"
import { useSelector } from "react-redux"
import { Route, useHistory } from "react-router-dom"
import { createSelector } from "@reduxjs/toolkit"

import classes from "./scss/Lists.module.scss"
import { RootState } from "../../store"

type BookName = {
    book: string, author: string
}



const ListBoxSelector = (state: RootState) => {
    let data = { toRead: { books: [], rest: 0 }, reading: { books: [], rest: 0 }, read: { books: [], rest: 0 } } as any;
    let [toRead, reading, read] = [state.main.books.filter(e => e.list === "toRead"), state.main.books.filter(e => e.list === "reading"), state.main.books.filter(e => e.list === "read")]
    const st = { toRead, reading, read } as any;
    for (const i in data) {
        for (let x = st[i].length - 1; x > (st[i].length - 4 > 0 ? st[i].length - 4 : 0); x--) {
            data[i].books.push({ author: st[i][x].author, book: st[i][x].name })
            data[i].rest = Math.max(st[i].length - 3, 0)
        }
    }

    return data as ListsBoxData;
}

type ListsBoxData = {
    toRead: {
        books: Array<BookName>,
        rest?: number
    },
    reading: {
        books: Array<BookName & { remaining: string }>,
        rest?: number
    },
    read: {
        books: Array<BookName & { remaining: string }>,
        rest?: number
    }
}

export default function ListsBox() {
    const data = useSelector(ListBoxSelector);
    return <>
        <div className={classes["overview-lists"]}>
            <div className={classes["section"] + " " + classes["section-to-read"]}>
                <div className={classes["section-icon"]} />
                <div className={classes["section-line"]} />
                <div className={classes["section-text-container"]}>
                    {
                        data.toRead.books.map(book =>
                            <div key={book.book} className={classes["section-text-row"]}>
                                <div className={classes["section-text"]}>{book.book + (book.author ? " - " + book.author : "")}</div>
                            </div>
                        )
                    }
                    <div className={classes["section-text-rest"]}>
                        +{data.toRead.rest}...
                    </div>
                </div>
            </div>
            <div className={classes["section"] + " " + classes["section-reading"]}>
                <div className={classes["section-icon"]} />
                <div className={classes["section-line"]} />
                <div className={classes["section-text-container"]}>
                    {
                        data.reading.books.map(book =>
                            <div key={book.book} className={classes["section-text-row"]}>
                                <div className={classes["section-text"]}>{book.book + (book.author ? " - " + book.author : "")}</div>
                                <div className={classes["section-remaining"]} style={{ visibility: book.remaining ? "visible" : "hidden" }}>{book.remaining ?? ""}</div>
                            </div>
                        )
                    }
                    <div className={classes["section-text-rest"]}>
                        +{data.reading.rest}...
                    </div>
                </div>
            </div>
            <div className={classes["section"] + " " + classes["section-read"]}>
                <div className={classes["section-icon"]} />
                <div className={classes["section-line"]} />
                <div className={classes["section-text-container"]}>
                    {
                        data.read.books.map(book =>
                            <div key={book.book} className={classes["section-text-row"]}>
                                <div className={classes["section-text"]}>{book.book + (book.author ? " - " + book.author : "")}</div>
                                <div className={classes["section-remaining"]} style={{ visibility: book.remaining ? "visible" : "hidden" }}>{book.remaining}</div>
                            </div>
                        )
                    }
                    <div className={classes["section-text-rest"]}>
                        +{data.read.rest}...
                    </div>
                </div>
            </div>
        </div>
        <div className={classes["overview-title"]}>Plan</div>
    </>
}
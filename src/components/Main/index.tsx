import { render } from "@testing-library/react"
import { read } from "fs"
import React, { Profiler, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { isThisTypeNode } from "typescript"

import classes from "./scss/index.module.scss"

import ListsBox from "./ListsBox"
import DiaryBox from "./DiaryBox"
import QuotesBox from "./QuotesBox"
import SummariesBox from "./SummariesBox"
import ProgressRing from "./ProgressRing"
import YearOverview from "./Yearoverview"

import { ReactComponent as LogoutIcon } from "../styles/img/logout.svg"
import { ReactComponent as SettingsIcon } from "../styles/img/settings.svg"
import { Link, useHistory } from "react-router-dom"

export default function MainPage() {
    const history = useHistory();
    return <div className={classes.container}>
        <div className={classes["first-part"]}>
            <div className={classes["overview-box-container"]} onClick={() => history.push("/plan")}>
                <div className={classes["overview-content"]}>
                    <ListsBox></ListsBox>
                </div>
            </div>
            <div className={classes["overview-box-container"]} onClick={() => history.push("/diary")}>
                <div className={classes["overview-content"]}>
                    <DiaryBox></DiaryBox>
                </div>
            </div>
            <div className={classes["overview-box-container"]} onClick={() => history.push("/quotes")}>
                <div className={classes["overview-content"]}>
                    <QuotesBox></QuotesBox>
                </div>
            </div>
            <div className={classes["overview-box-container"]} onClick={() => history.push("/summaries")}>
                <div className={classes["overview-content"]}>
                    <SummariesBox></SummariesBox>
                </div>
            </div>
        </div>
        <div className={classes["second-part"]}>
            <div className={classes["progress-bar"]}>
                <ProgressRing radius={75} ></ProgressRing>
            </div>
            <div className={classes["yearly-data-container"]}>
                <YearOverview></YearOverview>
            </div>
        </div>
        <div className={classes["bottom-icon-bar"]}>
            <div className={classes["bottom-right"]}>
                <Link to="/settings"><SettingsIcon /></Link>
                <Link to="/logout"><LogoutIcon /></Link>
            </div>
        </div>
    </div>
}

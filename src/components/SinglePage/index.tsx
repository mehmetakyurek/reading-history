import React, { useEffect, useReducer } from "react";
import { RDate, RDateType } from "../../class";
import TitleBar from "../TitleBar";
import LogBox from "./LogBox";
import Quotes from "./QuoteContainer";
import { ReactComponent as LogoutIcon } from "../styles/img/logout.svg"
import { ReactComponent as SettingsIcon } from "../styles/img/settings.svg"
import { Link } from "react-router-dom";
import Notes from "./NotesContainer";
import Overview from "./Overview";
import DatePicker from "./Datepickerthatcanworkintitlebar";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function () {
    const content = useSelector((state: RootState) => state.temp.content);
    return <>
        <TitleBar page="Main" className="bg-rock-400"><DatePicker /></TitleBar>
        <div className="grid grid-cols-[minmax(500px,.6fr)_1fr] grid-rows-1 overflow-hidden h-full bg-rock-200">
            <div className='MainContainer min-w-min bg-rock-300 pt-7 font-[Nunito] text-sm z-10'>
                <LogBox />
            </div>
            <div className="z-0">
                {content.view === "quotes" && <Quotes book={content.id} />}
                {content.view === "note" && <Notes book={content.id} />}
                {content.view === "main" && <Overview />}
            </div>
        </div>
        <div className="absolute right-2 bottom-2">
            <Link to={"/settings"}><SettingsIcon /></Link>
        </div>
    </>
}
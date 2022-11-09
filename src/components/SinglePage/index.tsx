import React from "react";
import TitleBar from "../TitleBar";
import LogBox from "./LogBox";
export default function () {
    return <>
        <TitleBar page="Main" />
        <div className='MainContainer w-2/5 min-w-[500px] bg-neutral-800 pt-7 font-[Nunito] text-sm'>
            <LogBox />
        </div>
    </>
}
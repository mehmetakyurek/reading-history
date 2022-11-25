import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { useNavigate } from "react-router";
import { generate } from "../store/DataGenerator";
import store, { RootState } from "../store/index"
import { setDailyReadingTarget, setSpellcheck } from "../store/reducers/preferences";


import classes from "./styles/Settings.module.scss"
import TitleBar from "./TitleBar";

export default function SettingsPage() {
    const dispatch = useDispatch();
    const prefs = useSelector((state: RootState) => state.prefs);
    const navigate = useNavigate();
    const [path, setPath] = useState("");
    useEffect(() => {
        window.electron.getDataPath().then((val: string) => setPath(val));
    }, [])

    return <><TitleBar page="Settings" />
        <div className={classes.Container + ' ' +
            'flex flex-col max-w-3xl m-auto gap-y-3 items-start h-full border-x-2 border-rock-300 pt-24 px-5 box-border'}>
            <div>
                Daily reading target:
                <input className='mx-2 bg-transparent outline-none' value={prefs.dailyReadingTarget} onChange={(e) => { store.dispatch(setDailyReadingTarget(Number(e.target.value))) }}></input>
            </div>
            <div>
                Spellcheck: <input type={'checkbox'} checked={prefs.spellcheck} onChange={e => dispatch(setSpellcheck(!prefs.spellcheck))} />
            </div>
            <button onClick={() => {
                generate();
                navigate("/main");
            }}>GenerateData</button>
            <div>{path}<button className="px-2 bg-rock-300 rounded ml-3" onClick={() => window.electron.moveFile().then((val: string) => setPath(val))}>...</button></div>

        </div>
    </>
}
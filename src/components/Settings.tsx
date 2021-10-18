import { useSelector } from "react-redux"
import store, { RootState } from "../store/index"
import { setTarget } from "../store/reducers/main";


import classes from "./styles/Settings.module.scss"

export default function SettingsPage() {
    let target = useSelector((state: RootState) => state.main.target);
    return <div className={classes.Container}>
        <div className={classes.SettingsRow}>
            Daily target: <input value={target} onChange={(e) => { store.dispatch(setTarget(e.target.value)) }}></input>
        </div>
        <button onClick={() => {
            localStorage.clear();
            localStorage.setItem("generateData", "true");
            window.electron.restart();
        }}>GenerateData</button>
    </div>
}

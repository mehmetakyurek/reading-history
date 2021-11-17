import { useSelector } from "react-redux"
import { useHistory } from "react-router";
import { generate } from "../store/DataGenerator";
import store, { RootState } from "../store/index"
import { setTarget } from "../store/reducers/main";


import classes from "./styles/Settings.module.scss"

export default function SettingsPage() {
    let target = useSelector((state: RootState) => state.main.target);
    const history = useHistory();
    return <div className={classes.Container}>
        <div className={classes.SettingsRow}>
            Daily target: <input value={target} onChange={(e) => { store.dispatch(setTarget(e.target.value)) }}></input>
        </div>
        <button onClick={() => {
            generate();
            history.push("/main");
        }}>GenerateData</button>
    </div>
}
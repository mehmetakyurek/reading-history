import classes from "./styles/Login.module.scss"
import { Router, useHistory } from "react-router-dom"
import { useState } from "react";
import cn from "classnames"

export default function LoginPage() {
  const [input, setInput] = useState("");
  const history = useHistory();
  const [loaded, setLoaded] = useState();
  return <div className={cn(classes["container"])}>
    <div className={classes.bg}></div>
    <div className={classes["login-box"]}>
      <div className={classes["welcome-text"]}>
        Welcome
      </div>
      <input type="password" className={classes["login-password"]} value={input} onChange={e => setInput(e.currentTarget.value)} />
      <div className={classes["login-button"]} onClick={() => {
        /*ipcRenderer.invoke("check", input).then(e => {
          if (e === true)
            history.push("/main")
        })*/
      }}>
        Login
      </div>
    </div>
  </div>
}
import { FC, ReactElement, ReactNode } from "react"
import { createPortal } from "react-dom"

import classes from "./styles/TitleBar.module.scss"
import cn from "classnames"
import { ReactComponent as BackSvg } from "./styles/img/back.svg"
import { ReactComponent as Minimize } from "./styles/img/Minimize.svg"
import { ReactComponent as MinMax } from "./styles/img/MinMax.svg"
import { ReactComponent as Close } from "./styles/img/Close.svg"
import { Link } from "react-router-dom"
import { Quit, WindowIsMaximised, WindowMaximise, WindowMinimise, WindowToggleMaximise, WindowUnmaximise } from "../../wailsjs/runtime"

const TitleBar: FC<{ page?: string, auth?: boolean, children?: ReactNode, className?: string }> = props => {

    return createPortal(<div className={cn(classes.TitleBar, props.className)}>
        <div className={classes.Buttons}>

            {props.page !== "Main" && props.page !== "Login" && <Link to="/main" className={classes.Back + " fill-text-header"}><BackSvg /></Link>}

            {props.page !== "Main" && props.page !== "Login" && <>
                <Link to="/plan" className={cn(classes.Plan, { [classes.Current]: props.page === "Plan" })}>Plan</Link>
                <Link to="/diary" className={cn(classes.Diary, { [classes.Current]: props.page === "Diary" })}>Diary</Link>
                <Link to="/quotes" className={cn(classes.Quotes, { [classes.Current]: props.page === "Quotes" })}>Quotes</Link>
                <Link to="/summaries" className={cn(classes.Summaries, { [classes.Current]: props.page === "Summaries" })}>Summaries</Link>
            </>
            }
        </div>
        <div className="Content">
            {props.children}
        </div>
        <div className={classes.AppButtons}>
            <div onClick={() => { WindowMinimise() }}><Minimize /></div>
            <div onClick={() => { WindowToggleMaximise() }}><MinMax /></div>
            <div onClick={() => { Quit() }}><Close /></div>
        </div>
    </div>, document.body);
}


export default TitleBar;

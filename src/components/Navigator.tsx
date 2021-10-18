import { Link, useHistory } from "react-router-dom"

import classes from "./styles/NavigationBar.module.scss";

import { ReactComponent as ListsIcon } from "./styles/img/lists.svg"
import { ReactComponent as DiaryIcon } from "./styles/img/diary.svg"
import { ReactComponent as QuotesIcon } from "./styles/img/quotes.svg"
import { ReactComponent as SummariesIcon } from "./styles/img/summaries.svg"
import { ReactComponent as BackIcon } from "./styles/img/back.svg"

export default function NavigationBar() {
    const history = useHistory();
    
    function stopPropagation(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) { e.stopPropagation() }
    
    return <div className={classes["navigation-bar"]} onClick={() => history.push("/main")}>
        <div className={classes["navigation-bar-icon-container"]}>
            <Link to="/plan" onClick={stopPropagation}><ListsIcon /></Link>
            <Link to="/diary" onClick={stopPropagation}><DiaryIcon /></Link>
            <Link to="/quotes" onClick={stopPropagation}><QuotesIcon /></Link>
            <Link to="/summaries" onClick={stopPropagation}><SummariesIcon /></Link>
        </div>
    </div>
}

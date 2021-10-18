import classes from "./styles/Summaries.module.scss";
import { FC, MouseEventHandler, ReactElement, useState } from "react";
import FilterBox from "./FilterBox";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { SummariesSelector, Summary } from "../store/reducers/summaries";
import SummaryOverlay from "./SummaryOverlay"

import { ReactComponent as AddButton } from "./styles/img/plus.svg";
import { createDateString, FilterAlgorithm } from "./util";
import TitleBar from "./TitleBar";

const SummariesPage: FC = (props): ReactElement => {
    const data = useSelector((state: RootState) => SummariesSelector(state));
    const tags = useSelector((state: RootState) => [...new Set(state.summaries.map(e => e.tags ?? []).flat())]);

    const [SummaryId, setSummaryId] = useState<string>();
    const [OC, setOC] = useState(0); // Quick Fix
    const [ratingFilter, setRatingFilter] = useState(0);
    const [selectedTags, setTags] = useState<string[]>([]);
    const [searchText, setSearchText] = useState("");
    return <>
        <div className={classes["container"]}>
            <div className={classes["summaries-container"]}>
                <div className={classes["summaries-item-container"]}>
                    <div className={classes["add-summary-button"]} onClick={e => {
                        setSummaryId(undefined);
                        setOC(OC + 1);
                    }}><AddButton /></div>
                    {data.map(e => (FilterAlgorithm(e, searchText, selectedTags) && (ratingFilter == 0 || e.rating == ratingFilter)) ? <SummariesItem key={e.id} {...e} onClick={() => { setSummaryId(e.id); setOC(OC + 1); }} /> : "")}
                </div>
            </div>
            <div className={classes["filter-box"]}>
                <FilterBox
                    tags={tags}
                    ratingChanged={(rating: number) => { setRatingFilter(rating); }}
                    selectedTags={tgs => setTags(tgs)}
                    searchFilter={t => setSearchText(t)}
                />
            </div>
        </div>
        <SummaryOverlay id={SummaryId} counter={OC} />
    </>
}

const SummariesItem: FC<Summary & { onClick?: MouseEventHandler<HTMLDivElement> }> = (props): ReactElement => {
    const rating = [];

    for (var i = 1; i <= (props.rating || 0); i++) rating.push(<div key={i} className={classes["book-rating-star"]} />)
    return <div className={classes["summaries-item"]} onClick={props.onClick}>
        <div className={classes["book-name"]}>{props.book?.name ? props.book.name : ((props.source == "") ? "Empty" : props.source)}</div>
        <div className={classes["book-rating"]}>{rating}</div>
        <div className={classes["book-author"]}>{props.book?.author ?? ""}</div>
        <div className={classes["book-date"]}>{createDateString(props.date)}</div>
    </div>
}

export default SummariesPage;

function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
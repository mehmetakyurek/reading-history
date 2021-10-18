import React, { FC, ReactElement, useState } from "react"
import { useSelector } from "react-redux"

import { ReactComponent as StarIcon } from "./styles/img/star.svg"

import classes from "./styles/FilterBox.module.scss"

type FilterBoxPropsT = {
    tags?: string[],
    selectedTags?: (indexes: string[]) => void,
    searchFilter?: (text: string) => void,
    ratingChanged?: (rating: number) => void
}

const FilterBox: FC<FilterBoxPropsT> = (props): ReactElement => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchVal, setSearchVal] = useState<string>("");
    const TagClick = (e: React.MouseEvent) => {
        const tag = e.currentTarget.getAttribute("data-tag") || "";
        let newState: string[];
        if (selectedTags.includes(tag)) newState = selectedTags.filter(e => e !== tag);
        else newState = [...selectedTags, tag];
        setSelectedTags(newState);
        props.selectedTags?.(newState);
    }

    return <div className={classes["container"]}>
        <div className={classes["filter-box"]}>
            <div className={classes["filter-box-top"]}>
                <input className={classes["filter-box-search"]} placeholder="Search" value={searchVal} onChange={e => { setSearchVal(e.currentTarget.value); props.searchFilter?.(e.currentTarget.value); }} />
                {props.ratingChanged ? <FilterBoxStars rating={0} changed={props.ratingChanged} /> : ""}
            </div>

            <div className={classes["filter-box-tags"]}>
                {props.tags?.map((e, index) => <div data-name={e} data-tag={e} key={index} className={classes["filter-box-tag"] + (selectedTags.includes(e) ? " " + classes["selected"] : "")} onClick={TagClick}>{e[0] !== "#" ? "#" : ""}{e}</div>)}
            </div>

        </div>
    </div>
}

const FilterBoxStars: FC<{ rating?: number, changed?: FilterBoxPropsT["ratingChanged"] }> = (props): ReactElement => {
    const [rating, setRating] = useState(props.rating || 0);
    const stars = [];
    const Click = function (e: React.MouseEvent) {
        const index = Number(e.currentTarget.getAttribute("data-index"));
        if (index === rating) setRating(0);
        else if (index <= 5 && index >= 0) setRating(index);
        props.changed?.(index == rating ? 0 : index);
    }
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <div data-index={i} key={i} className={classes["rating-box-star"] + (((i) <= rating) ? " " + classes["selected"] : "")} onClick={Click} >{<StarIcon />}</div>
        );
    }
    return <div className={classes["rating-box"]}>
        {stars}
    </div>
}

export default FilterBox;
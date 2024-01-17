import { FC, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import ProgressRing from "../Main/ProgressRing";
import YearOverview from "../Main/Yearoverview";
import { setDate } from "../../store/reducers/temp"

const Overview: FC = () => {

    const year = useMemo(() => new Date().getFullYear(), []);
    const read = useSelector((state: RootState) => state.lists[2].filter(e => e.finishDate?.year === year))
    const dispatch = useDispatch();
    return <div className="flex items-center justify-center h-full flex-col gap-y-20">
        <div className="basis-40 overflow-hidden">
            <ProgressRing radius={0} />
        </div>
        <div className="container flex items-center justify-center"><YearOverview onSelect={e => dispatch(setDate(e))} /></div>
    </div>
}

export default Overview;
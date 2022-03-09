import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { completedSelector } from "../../store/reducers/main"
import classes from "./scss/Progressring.module.scss"

type ProgressRingType = {
    radius: number
}
// https://css-tricks.com/building-progress-ring-quickly/
export default function ProgressRing(props: ProgressRingType) {
    const target = useSelector((state: RootState) => state.main.target);
    const completed = useSelector(completedSelector).length;
    
    const circumference = (55 * 2 * Math.PI);
    const progress = ((completed / target) * 100);

    const strokeDashoffset = (circumference - ((progress > 0 && progress < 100) ? progress : progress < 0 ? 0 : progress > 100 ? 100 : 0)  / 100 * circumference);

    return (
        <svg viewBox="0 0 150 150" className={classes["progress-ring"]}
        >
            <circle className={classes["progress-ring-bg"]}
                fill="transparent"
                style={{ strokeDashoffset }}
                r={55}
                cx={"50%"}
                cy={"50%"}
                strokeWidth={20}
            />
            <text className={classes["progress-ring-text"]} x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">{completed}/{target}</text>
            <circle className={classes["progress-ring-stroke"]}
                fill="transparent"
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                transform="rotate(-90, 75, 75)"
                r={55}
                cx={"50%"}
                cy={"50%"}
                strokeWidth={20}
            />

        </svg>
    );
}
import { useContext } from "react";
import { useState } from "react";
import { DateDataContext, UserDataContext } from "../../App";
import "../../assets/styles/ConfirmPage/DurationFigure.scss";
import { GoalID, WeekString } from "../../GlobalVariable";



const DurationFigure = (props) => {
    // props↓
    // finalGoalID
    // middleGoalID



    /////////////////////////////////////////////////////////////////////
    // global variables
    /////////////////////////////////////////////////////////////////////
    const goalsData = useContext(UserDataContext)["Goals"];
    const dateData  = useContext(DateDataContext);
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // local variables
    /////////////////////////////////////////////////////////////////////
    let targetGoal;
    if (props.middleGoalID === undefined) {
        targetGoal = goalsData.getSortedArray(new GoalID(props.finalGoalID));
    } else {
        targetGoal = goalsData.getSortedArray(new GoalID(props.finalGoalID), new GoalID(props.middleGoalID));
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // 期間の設定
    /////////////////////////////////////////////////////////////////////
    const [durationWeekStringList, setDurationWeekStringList] = useState(() => {
        // 最小週と最大週の設定
        let startWeekString, endWeekString;
        targetGoal.forEach((goalDataDict, index) => {
            if (index === 0) {
                startWeekString = new WeekString(goalDataDict["duration"][0]);
                endWeekString   = new WeekString(goalDataDict["duration"][goalDataDict["duration"].length-1]);
            } else {
                const targetMinWeekString = new WeekString(goalDataDict["duration"][0]);
                const targetMaxWeekString = new WeekString(goalDataDict["duration"][goalDataDict["duration"].length-1]);
                if (startWeekString.compareTo(targetMinWeekString) > 0) {
                    startWeekString = targetMinWeekString;
                }
                if (endWeekString.compareTo(targetMaxWeekString) < 0) {
                    endWeekString = targetMaxWeekString;
                }
            }
        })
        let result = [];
        let onWeekString = startWeekString;
        while (onWeekString.compareTo(endWeekString) <= 0) {
            result.push(new WeekString(onWeekString.getStr()));
            onWeekString.addWeek(1, dateData);
        }
        return result;
    })
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////////
    return (
        <div className="confirm-page__duration-figure">
            <ul className="confirm-page__duration-figure__columns-list">
                {durationWeekStringList.map((weekString, index) => {
                    const year  = weekString.getYear();
                    const month = weekString.getMonth();
                    const week  = weekString.getWeek();
                    if (week === 1 || index === 0) {
                        return (
                            <li className="confirm-page__duration-figure__columns-list__column first-week" key={"confirm-page__duration-figure__columns-list__column"+index}>
                                <p className="confirm-page__duration-figure__columns-list__column--year">{year}年</p>
                                <p className="confirm-page__duration-figure__columns-list__column--month">{month}月</p>
                                <p className="confirm-page__duration-figure__columns-list__column--week">{week}</p>
                                <ul className="confirm-page__duration-figure__columns-list__column__active-goals-list">
                                    {targetGoal.map((goalData, index) => {
                                        if (goalData["duration"].includes(`${year}-${month}-${week}`)) {
                                            return (
                                                <li className="confirm-page__duration-figure__columns-list__column__active-goals-list--goal active" key={"confirm-page__duration-figure__columns-list__column--active-goals-list--goal"+index}>
                                                </li>
                                            );
                                        } else {
                                            return (
                                                <li className="confirm-page__duration-figure__columns-list__column__active-goals-list--goal" key={"confirm-page__duration-figure__columns-list__column--active-goals-list--goal"+index}>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            </li>
                        );
                    } else {
                        return (
                            <li className="confirm-page__duration-figure__columns-list__column" key={"confirm-page__duration-figure__columns-list__column first-week"+index}>
                                <p className="confirm-page__duration-figure__columns-list__column--year">{year}年</p>
                                <p className="confirm-page__duration-figure__columns-list__column--month">{month}月</p>
                                <p className="confirm-page__duration-figure__columns-list__column--week">{week}</p>
                                <ul className="confirm-page__duration-figure__columns-list__column__active-goals-list">
                                    {targetGoal.map((goalData, index) => {
                                        if (goalData["duration"].includes(`${year}-${month}-${week}`)) {
                                            return (
                                                <li className="confirm-page__duration-figure__columns-list__column__active-goals-list--goal active" key={"confirm-page__duration-figure__columns-list__column--active-goals-list--goal"+index}>
                                                </li>
                                            );
                                        } else {
                                            return (
                                                <li className="confirm-page__duration-figure__columns-list__column__active-goals-list--goal" key={"confirm-page__duration-figure__columns-list__column--active-goals-list--goal"+index}>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            </li>
                        );
                    }
                })}
            </ul>
            <ul className="confirm-page__duration-figure__rows-list">
                {Object.values(targetGoal).map((goalData, index) => {
                    return (
                        <li className="confirm-page__duration-figure__rows-list__row" key={"confirm-page__duration-figure__rows-list__row"+index}>
                            <p className="confirm-page__duration-figure__rows-list__row--title">{goalData["title"]}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
}



export { DurationFigure };
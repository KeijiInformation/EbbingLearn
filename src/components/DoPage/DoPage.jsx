import { ProgressGauge } from "../common/ProgressGauge";
import { existInDict } from "../../functions/useful";
import { DayProgressInputForm } from "./DayProgressInputForm";
import { useContext, useEffect, useState } from "react";
import { DateDataContext, TaskVariablesContext, UserDataContext } from "../../App";
import { DateString, GoalID, WeekString } from "../../GlobalVariable";
import RightArrow from "../../assets/images/DoPage/rightArrow.png";
import LeftArrow from "../../assets/images/DoPage/leftArrow.png";



const DoPage = (props) => {
    // props
    // setReloadFlags



    //////////////////////////////////////////////////////
    // global variables
    //////////////////////////////////////////////////////
    const dateData      = useContext(DateDataContext);
    const userData      = useContext(UserDataContext);
    const taskVariables = useContext(TaskVariablesContext);
    const goalsData     = userData["Goals"];
    const progressData  = userData["Progress"];
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // set date and week
    //////////////////////////////////////////////////////
    const [onWeekString, setOnWeekString] = useState(() => {
        const result = new WeekString();
        result.generateFromToday(dateData);
        return result;
    });
    const [onDateString, setOnDateString] = useState(() => {
        const result = new DateString();
        result.generateFromToday(dateData);
        return result;
    })


    const moveTomorrow = () => {
        setOnDateString((prevState) => {
            const result = new DateString(prevState.getStr());
            result.addDay(1);
            if (result.convertToWeekString(dateData) !== prevState.convertToWeekString(dateData)) {
                setOnWeekString(result.convertToWeekString(dateData));
            }
            return result;
        })
    }
    const moveYesterday = () => {
        setOnDateString((prevState) => {
            const result = new DateString(prevState.getStr());
            result.addDay(-1);
            if (result.convertToWeekString(dateData) !== prevState.convertToWeekString(dateData)) {
                setOnWeekString(result.convertToWeekString(dateData));
            }
            return result;
        })
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // set week and date tasks
    //////////////////////////////////////////////////////
    // {"final1_middle1_small1": progressDict, ...}
    const [weekTotalTasks, setWeekTotalTasks] = useState({});
    useEffect(() => {
        setWeekTotalTasks(() => {
            let onWeekProgressData = progressData.getData()[onWeekString.getStr()];
            if (onWeekProgressData === undefined) {
                return {};
            }
            let result = {};
            Object.values(onWeekProgressData).forEach(goalTasks => {
                Object.values(goalTasks).forEach(goalTask => {
                    if (!existInDict(result, goalTask["id"])) {
                        result[goalTask["id"]] = {...goalTask};
                    } else {
                        result[goalTask["id"]]["amount"]   += goalTask["amount"];
                        result[goalTask["id"]]["progress"] += goalTask["progress"];
                        if (result[goalTask["id"]]["range"][0] > goalTask["range"][0] && goalTask["range"][0] !== null) {
                            result[goalTask["id"]]["range"][0] = goalTask["range"][0];
                        }
                        if (result[goalTask["id"]]["range"][1] < goalTask["range"][1]) {
                            result[goalTask["id"]]["range"][1] = goalTask["range"][1];
                        }
                    }
                })
            })
            return result;
        })
    }, [onWeekString])

    const [dateTotalTasks, setDateTotalTasks] = useState({});
    useEffect(() => {
        setDateTotalTasks(() => {
            let result = {};
            let onDateProgressData = progressData.getData()[onWeekString.getStr()];
            if (onDateProgressData === undefined) {
                onDateProgressData = {};
            } else {
                onDateProgressData = onDateProgressData[onDateString.getStr()];
            }
            Object.values(onDateProgressData).forEach(goalTask => {
                result[goalTask["id"]] = goalTask;
            })
            return result;
        })
    }, [onDateString]);
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////
    return (
        <div id="do-page" className="do-page">
            <div className="do-page__toweek">
                {`${onWeekString.getYear()}年${onWeekString.getMonth()}月第${onWeekString.getWeek()}週`}
            </div>
            <div className="do-page__progress-gauge">
                <p className="do-page__progress-gauge--description">今週の進捗</p>
                <ProgressGauge
                    startWeekString = {onWeekString}
                    endWeekString   = {onWeekString}
                    gaugeID         = "gauge1"
                />
            </div>
            <ul className="do-page__final-goals-list">
                {goalsData.getSortedArray().map((finalGoal, finalGoalIndex) => {
                    if (!finalGoal["delete"]["flag"]) {
                        return (
                            <li className="do-page__final-goals-list__final-goal" key={"do-page__final-goals-list__final-goal"+finalGoalIndex}>
                                <p className="do-page__final-goals-list__final-goal--title">{finalGoal["title"]}</p>
                                <ul className="do-page__final-goals-list__final-goal__middle-goals-list">
                                    {goalsData.getSortedArray(new GoalID(finalGoal["id"])).map((middleGoal, middleGoalIndex) => {
                                        if (!middleGoal["delete"]["flag"]) {
                                            return (
                                                <li className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal" key={`do-page__final-goals-list__final-goal${finalGoalIndex}__middle-goals-list${middleGoalIndex}`}>
                                                    <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal--title">{middleGoal["title"]}</p>
                                                    <div className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals">
                                                        <img src={middleGoal["thumbnail"]} alt="" className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals--thumbnail" />
                                                        <ul className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list">
                                                            {goalsData.getSortedArray(new GoalID(finalGoal["id"]), new GoalID(middleGoal["id"])).map((smallGoal, smallGoalIndex) => {
                                                                let progressData = weekTotalTasks[`${finalGoal["id"]}_${middleGoal["id"]}_${smallGoal["id"]}`];
                                                                if (progressData !== undefined && !smallGoal["delete"]["flag"]) {
                                                                    return (
                                                                        <div>
                                                                            <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list--task-name">{smallGoal["title"]}</p>
                                                                            <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list--progress">{`${progressData["progress"]} / ${progressData["amount"]}${taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}`}</p>
                                                                            <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list--amount-of-task">{`(${progressData["range"][0]} ~ ${progressData["range"][1]}${taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])})`}</p>
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    // return (
                                                                    //     <li className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list__small-goal task-not-required" key={`do-page__final-goals-list__final-goal${finalGoalIndex}__middle-goals-list__middle-goal${middleGoalIndex}__thumbnail-and-small-goals__small-goals-list${smallGoalIndex}`}>
                                                                    //         <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list__small-goal--task-name">{smallGoalDataDict["title"]}</p>
                                                                    //         <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list__small-goal--progress">{`${smallGoalDataDict["progress"]}${smallGoalDataDict["unit"]} / 全${smallGoalDataDict["amount"]}${smallGoalDataDict["unit"]}`}</p>
                                                                    //         <p className="do-page__final-goals-list__final-goal__middle-goals-list__middle-goal__thumbnail-and-small-goals__small-goals-list__small-goal--not-required-message">{"これは任意のタスクです"}</p>
                                                                    //     </li>
                                                                    // );
                                                                    return undefined;
                                                                }
                                                            })}
                                                        </ul>
                                                    </div>
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
            <div className="do-page__day-progress">
                <div className="do-page__day-progress__progress-gauge">
                    <p className="do-page__day-progress__progress-gauge--description">本日の進捗</p>
                    <ProgressGauge
                        dateString = {onDateString}
                        gaugeID    = "gauge2"
                    />
                </div>
                <div className="do-page__day-progress__day-info">
                    <div className="do-page__day-progress__day-info--move-day-button" onClick={moveYesterday}>
                        <img src={LeftArrow} alt="" />
                        <p>前の日へ</p>
                    </div>
                    <div className="do-page__day-progress__day-info__progress-input-form">
                        <p className="do-page__day-progress__day-info__progress-input-form--on-day">{`${onDateString.getMonth()} / ${onDateString.getDay()} (${onDateString.getDayOfWeek()})`}</p>
                        <DayProgressInputForm
                            dateTotalTasks      = {dateTotalTasks}
                            onDateString        = {onDateString}
                            onWeekString        = {onWeekString}
                            setReloadFlags      = {props.setReloadFlags}
                        />
                    </div>
                    <div className="do-page__day-progress__day-info--move-day-button" onClick={moveTomorrow}>
                        <p>次の日へ</p>
                        <img src={RightArrow} alt="" />
                    </div>
                </div>
            </div>
        </div>
    );
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
}



export default DoPage;
import { useContext } from "react";
import { TaskVariablesContext } from "../../../../App";
import "../../../../assets/styles/RegisterPage/Forms/StudyPace/PaceOfGoalViewBox.scss";
import { ThumbnailView } from "../../../common/ThumbnailView";



const PaceOfGoalViewBox = (props) => {
    // props
    // inputGoalData
    // middleGoalID
    // watch



    ///////////////////////////////////////////////////////////////////
    // global variables
    ///////////////////////////////////////////////////////////////////
    const taskVariables = useContext(TaskVariablesContext);
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////
    // set local variables
    ///////////////////////////////////////////////////////////////////
    const middleGoal = props.inputGoalData["middleGoals"][props.middleGoalID];
    // studyPace options
    const inputData = props.watch();
    const dayoff = [];
    Object.keys(inputData).forEach(key => {
        // dayoff
        if (key.split("_")[0] === "dayoff") {
            if (inputData[key] === true) {
                dayoff.push(key.split("_")[1]);
            }
        }
    })
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////
    // calc pace
    ///////////////////////////////////////////////////////////////////
    const calcPaceOfWeek = (smallGoal) => {
        return Math.ceil(smallGoal["amount"] / smallGoal["duration"].length);
    }
    const calcPaceOfDay = (smallGoal) => {
        let numberOfDaysPerWeek = 7 - dayoff.length;
        if (inputData["reLearningPerWeekFlag"]) {
            numberOfDaysPerWeek = Math.ceil(numberOfDaysPerWeek / 2);
        }
        const numberOfDays = numberOfDaysPerWeek * smallGoal["duration"].length;
        return Math.ceil(smallGoal["amount"] / numberOfDays);
    }
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////
    return (
        <div className="pace-of-goal-view-wrapper">
            <div className="pace-of-goal-view-wrapper__middle-goal">
                <ThumbnailView
                    thumbnailURL = {middleGoal["thumbnail"]["path"]}
                />
                <p className="pace-of-goal-view-wrapper__middle-goal--title">{middleGoal["title"]}</p>
                <p className="pace-of-goal-view-wrapper__middle-goal--duration">期間: {middleGoal["duration"].length}週間</p>
            </div>
            <ul className="pace-of-goal-view-wrapper__small-goals-list">
                {Object.values(middleGoal["smallGoals"]).map((smallGoal, index) => {
                    return (
                        <li className="pace-of-goal-view-wrapper__small-goals-list__small-goal" key={"pace-of-goal-view-wrapper__small-goals-list__small-goal"+index}>
                            <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal--title">{smallGoal["title"]}</p>
                            <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal--genre-of-task">{taskVariables.getGenre(smallGoal["genre"])}</p>
                            <p>週</p>
                            <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal--pace-of-week">{calcPaceOfWeek(smallGoal)}</p>
                            <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal--unit-of-task">{taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}</p>
                            <div className="pace-of-goal-view-wrapper__small-goals-list__small-goal__pace-of-day">
                                <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal__pace-of-day--text-begin">(1日</p>
                                <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal__pace-of-day--task-per-day">{calcPaceOfDay(smallGoal)}</p>
                                <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal__pace-of-day--unit-of-task">{taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}</p>
                                <p className="pace-of-goal-view-wrapper__small-goals-list__small-goal__pace-of-day--text-finish">ペース)</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
}



export { PaceOfGoalViewBox };
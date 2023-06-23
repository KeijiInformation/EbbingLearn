import { useForm } from "react-hook-form"
import "../../assets/styles/DoPage/DayProgressInputForm.scss";
import { useContext } from "react";
import { TaskVariablesContext, UserDataContext } from "../../App";
import { GoalID } from "../../GlobalVariable";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DayProgressInputForm = (props) => {
    // props
    // onWeekString
    // onDateString
    // dateTotalTasks
    // setReloadFlags



    ////////////////////////////////////////////////////////////////
    // global variables
    ////////////////////////////////////////////////////////////////
    const userData      = useContext(UserDataContext);
    const goalsData     = userData["Goals"];
    const progressData  = userData["Progress"];
    const accountData   = userData["Account"];
    const taskVariables = useContext(TaskVariablesContext);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // react-hook-form
    ////////////////////////////////////////////////////////////////
    const { register, handleSubmit } = useForm();
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // 提出関数
    ////////////////////////////////////////////////////////////////
    const onSubmit = (data) => {
        // create submit data
        const submitGoalsData    = goalsData.getGoal();
        const submitProgressData = progressData.getData();
        console.log(data);
        Object.keys(data).forEach(goalIDs => {
            const goalIDsArray = goalIDs.split("_");
            submitProgressData[props.onWeekString.getStr()][props.onDateString.getStr()][goalIDs]["progress"] += Number(data[goalIDs]);
            submitGoalsData[goalIDsArray[0]]["middleGoals"][goalIDsArray[1]]["smallGoals"][goalIDsArray[2]]["progress"] += Number(data[goalIDs]);
            if (submitGoalsData[goalIDsArray[0]]["middleGoals"][goalIDsArray[1]]["smallGoals"][goalIDsArray[2]]["progress"] === submitGoalsData[goalIDsArray[0]]["middleGoals"][goalIDsArray[1]]["smallGoals"][goalIDsArray[2]]["amount"]) {
                submitGoalsData[goalIDsArray[0]]["middleGoals"][goalIDsArray[1]]["smallGoals"][goalIDsArray[2]]["done"] = true;
            }
        })


        // submit goals data
        Object.values(submitGoalsData).forEach(goalData => {
            const goalsDocRef = doc(db, "Goals", `${accountData.getUID()}_${goalData["id"]}`);
            setDoc(goalsDocRef, goalData);
        })


        // submit progress data
        const progressDocRef = doc(db, "ProgressData", accountData.getUID());
        setDoc(progressDocRef, submitProgressData);


        // reload data
        props.setReloadFlags(prevState => {
            prevState["Goals"]    = true;
            prevState["Progress"] = true;
            return {...prevState};
        })
    }
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////
    return (
        <form className="day-progress-form" onSubmit={handleSubmit(onSubmit)}>
            <ul className="day-progress-form__small-goals-list">
                {goalsData.getSortedArray().map(finalGoal => {
                    return goalsData.getSortedArray(new GoalID(finalGoal["id"])).map(middleGoal => {
                        return goalsData.getSortedArray(new GoalID(finalGoal["id"]), new GoalID(middleGoal["id"])).map(smallGoal => {
                            const goalIDs = `${finalGoal["id"]}_${middleGoal["id"]}_${smallGoal["id"]}`;
                            if (props.dateTotalTasks[goalIDs]) {
                                const dateProgressData = props.dateTotalTasks[goalIDs];
                                if (!finalGoal["delete"]["flag"] && !middleGoal["delete"]["flag"] && !smallGoal["delete"]["flag"]) {
                                    return (
                                        <li className="day-progress-form__small-goals-list__small-goal" key={goalIDs}>
                                            <p className="day-progress-form__small-goals-list__small-goal--title">{smallGoal["title"]}</p>
                                            <div className="day-progress-form__small-goals-list__small-goal__input-form">
                                                <input
                                                    type="number"
                                                    className="day-progress-form__small-goals-list__small-goal__input-form--input"
                                                    {...register(goalIDs, {required: true, minLength: 0})}
                                                />
                                                <p> / </p>
                                                <p>推奨{dateProgressData["amount"]+taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}</p>
                                                <p>{`(${dateProgressData["range"][0]}~${dateProgressData["range"][1]})`}</p>
                                            </div>
                                        </li>
                                    )
                                }
                            } else {
                                return undefined;
                            }
                        })
                    })
                })}
            </ul>
            <input type="submit" value="勉強を終える" className="day-progress-form--submit-btn"/>
        </form>
    );
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
};

export { DayProgressInputForm };
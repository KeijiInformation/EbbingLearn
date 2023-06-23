import { useContext } from "react";
import { useForm } from "react-hook-form";
import { InputDurationWithFigureBox } from "../InputDurationWithFigureBox";
import { InputTitleBox } from "../InputTitleBox";
import { NextSectionBtn } from "../NextSectionBtn";
import { InputTaskInfoBox } from "./InputTaskInfoBox";
import "../../../../assets/styles/RegisterPage/Forms/SmallGoal/SmallGoalForm.scss";
import { Button } from "../../../common/Button";
import { TaskVariablesContext, UserDataContext } from "../../../../App";
import { GoalID } from "../../../../GlobalVariable";

const SmallGoalForm = (props) => {
    // props↓
    // inputGoalData
    // setInputGoalData
    // middleGoalID
    // toggleOpenState



    ////////////////////////////////////////////////////////////////////
    // global variables
    ////////////////////////////////////////////////////////////////////
    const goalsData      = useContext(UserDataContext)["Goals"];
    const taskVariables = useContext(TaskVariablesContext);
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // react-hook-form
    ////////////////////////////////////////////////////////////////////
    const { register, handleSubmit, watch, formState: {errors} } = useForm();
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // 提出関数
    ////////////////////////////////////////////////////////////////////
    const addSmallGoal = () => {
        const data = watch();
        const middleGoalID = props.middleGoalID;
        // idの決定
        const goalID = new GoalID("small0");
        Object.keys(props.inputGoalData["middleGoals"][middleGoalID]["smallGoals"]).forEach(elem => {
            const goalIDElem = new GoalID(elem);
            if (goalID.compareTo(goalIDElem) === -1) {
                goalID.set(goalIDElem.getID());
            }
        })
        goalID.add(1);
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            // データの格納
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]                   = {};
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["id"]             = goalID.getID();
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["done"]           = false;
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["title"]          = data["title"];
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["genre"]          = Number(data["genre"]);
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["amount"]         = Number(data["amount"]);
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["unit"]           = Number(data["unit"]);
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["progress"]       = 0;
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["duration"]       = [];
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["middleGoalID"]   = middleGoalID;
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["reLearningFlag"] = data["reLearningFlag"];
            updatedData["middleGoals"][middleGoalID]["smallGoals"][goalID.getID()]["delete"]         = {"flag": false, "date": null};
            return {...updatedData};
        })
    }
    const onSubmit = (data) => {
        // durationの登録
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            Object.keys(updatedData["middleGoals"][props.middleGoalID]["smallGoals"]).forEach(smallGoalID => {
                updatedData["middleGoals"][props.middleGoalID]["smallGoals"][smallGoalID]["duration"] = [];
            })
            document.querySelectorAll(".duration-input:checked").forEach(dom => {
                const key = dom.name;
                if (key !== undefined) {
                    const smallGoalID  = key.split("_")[1];
                    const weekStr      = key.split("_")[2];
                    updatedData["middleGoals"][props.middleGoalID]["smallGoals"][smallGoalID]["duration"].push(weekStr);
                }
            })
            return {...updatedData};
        })

        // middleGoalのClose処理
        props.toggleOpenState(props.middleGoalID);
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // delete function
    ////////////////////////////////////////////////////////////////////
    const deleteSmallGoal = (targetID) => {
        delete props.inputGoalData["middleGoals"][props.middleGoalID]["smallGoals"][targetID];
        props.setInputGoalData(prevState => {
            const result = {...prevState};
            result["middleGoals"][props.middleGoalID]["smallGoals"] = {};
            goalsData.createSortedArray(props.inputGoalData["middleGoals"][props.middleGoalID]["smallGoals"]).forEach((goal, index) => {
                goal["id"] = `small${index+1}`;
                result["middleGoals"][props.middleGoalID]["smallGoals"][`small${index+1}`] = goal;
            })
            return result;
        })
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////////
    return (
        <form className="small-goal-inner__middle-goals-list__item--form" onSubmit={handleSubmit(onSubmit)}>
            <div className="small-goal-inner__middle-goals-list__item--base-register-form">
                <InputTitleBox
                    register={register}
                    maxLength={20}
                    errors={errors}
                />
                <InputTaskInfoBox
                    register={register}
                    watch={watch}
                />
                <Button
                    clickEvent = {addSmallGoal}
                    text       = "追加"
                />
            </div>

            <ul className="small-goal-inner__middle-goals-list__item--small-goals-list">
                {goalsData.createSortedArray(props.inputGoalData["middleGoals"][props.middleGoalID]["smallGoals"]).map((smallGoal, index) => {
                    return (
                        <li key={"small-goal-inner__middle-goals-list__item--small-goals-list--item" + index}>
                            <p>{smallGoal["id"] + ". " + smallGoal["title"]}</p>
                            <p>{taskVariables.getGenre(smallGoal["genre"]) + smallGoal["amount"] + taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}</p>
                            <button onClick={() => {deleteSmallGoal(smallGoal["id"])}}></button>
                        </li>
                    );
                })}
            </ul>
            <div className="small-goal-inner__middle-goals-list__item--duration-form" >
                <InputDurationWithFigureBox
                    navigationMessage = {"それぞれの小目標に何週間かけるのかを設定します。短ければ1週間にこなさなければいけない量が多くなるので無理のない範囲で設定しましょう。なるべく各目標の期間がかぶらないようにすると良いです。"}
                    inputGoalData     = {props.inputGoalData}
                    goalsData         = {props.inputGoalData["middleGoals"][props.middleGoalID]["smallGoals"]}
                    register          = {register}
                    middleGoalID      = {props.middleGoalID}
                />
                <NextSectionBtn
                    text={"保存"}
                />
            </div>
        </form>
    );
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
}

export { SmallGoalForm };
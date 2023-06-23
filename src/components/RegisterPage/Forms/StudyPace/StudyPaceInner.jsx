import { BackSectionBtn } from "../BackSectionBtn";
import { NextSectionBtn } from "../NextSectionBtn";
import { DayoffConfigBox } from "./DayoffConfigBox";
import { ReLearningPerWeekConfigBox } from "./ReLearningPerWeekConfigBox";
import { PaceOfReLearningConfigBox } from "./PaceOfReLearningConfigBox";
import { PaceOfGoalViewBox } from "./PaceOfGoalViewBox";
import "../../../../assets/styles/RegisterPage/Forms/StudyPace/StudyPaceInner.scss"
import { useForm } from "react-hook-form";


const StudyPaceInner = (props) => {
    // props
    // inputGoalData
    // setInputGoalData
    // setSectionFlowState


    ///////////////////////////////////////////////////////////////////////////////
    // react-hook-form
    ///////////////////////////////////////////////////////////////////////////////
    const {register, handleSubmit, watch} = useForm();
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////
    // 提出関数
    ///////////////////////////////////////////////////////////////////////////////
    const onSubmit = (data) => {
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            // dayoff
            updatedData["studyPace"]["dayoff"] = [];
            if (data["dayoffConfigCheck"]) {
                Object.keys(data).forEach(key => {
                    if (key.split("_")[0] === "dayoff") {
                        if (data[key]) {
                            updatedData["studyPace"]["dayoff"].push(key.split("_")[1]);
                        }
                    }
                })
            }
            // reLearningPerWeekFlag
            updatedData["studyPace"]["reLearningPerWeekFlag"] = data["reLearningPerWeekFlag"];
            // paceOfReLearning
            if (data["paceOfReLearningConfigCheck"]) {
                updatedData["studyPace"]["paceOfReLearning"]  = data["paceOfReLearning"];
            } else {
                updatedData["studyPace"]["paceOfReLearning"]  = 0;
            }
            return {...updatedData};
        })
        props.setSectionFlowState("complete");
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////////////////////
    return (
        <form className="study-pace-inner" onSubmit={handleSubmit(onSubmit)}>
            <div className="study-pace-inner__checkbox-list">
                <DayoffConfigBox
                    register = {register}
                    watch    = {watch}
                />
                <ReLearningPerWeekConfigBox
                    register={register}
                />
                <PaceOfReLearningConfigBox
                    register={register}
                />
            </div>
            <div className="study-pace-inner__goal-view">
                <p className="study-pace-inner__goal-view--navigation-text">この設定だと以下のような進行ペースになります</p>
                <ul className="study-pace-inner__goal-view__goal-list">
                    {Object.values(props.inputGoalData["middleGoals"]).map((middleGoal, index) => {
                        return (
                            <li className="study-pace-inner__goal-view__goal-list--item" key={"study-pace-inner__goal-view__goal-list--item"+index}>
                                <PaceOfGoalViewBox
                                    inputGoalData = {props.inputGoalData}
                                    middleGoalID  = {middleGoal["id"]}
                                    watch         = {watch}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="study-pace-inner__move-section-btn-list">
                <BackSectionBtn
                    clickEvent = {() => {
                        props.setSectionFlowState("small-goal");
                    }}
                    text = "前へ"
                />
                <NextSectionBtn
                    text = "登録する"
                />
            </div>
        </form>
    );
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
}


export { StudyPaceInner };
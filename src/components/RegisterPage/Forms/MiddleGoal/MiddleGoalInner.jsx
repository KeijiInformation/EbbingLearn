import { InputTitleBox } from "../InputTitleBox";
import { InputThumbnailBox } from "../InputThumbnailBox";
import { BackSectionBtn } from "../BackSectionBtn";
import { NextSectionBtn } from "../NextSectionBtn";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { InputDurationWithFigureBox } from "../InputDurationWithFigureBox";
import { useContext } from "react";
import { NoImageURLContext, UserDataContext } from "../../../../App";
import { GoalID } from "../../../../GlobalVariable";
import { Button } from "../../../common/Button";
import { ThumbnailView } from "../../../common/ThumbnailView";


const MiddleGoalInner = (props) => {
    // props
    // inputGoalData
    // setInputGoalData
    // setSectionFlowState



    //////////////////////////////////////////////////////////////////
    // react-hook-form
    //////////////////////////////////////////////////////////////////
    const { register, handleSubmit, watch, formState: {errors} } = useForm();
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // global variable
    //////////////////////////////////////////////////////////////////
    const goalsData   = useContext(UserDataContext)["Goals"];
    const accountData = useContext(UserDataContext)["Account"];
    const noImageURL  = useContext(NoImageURLContext);
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // 提出関数
    //////////////////////////////////////////////////////////////////
    const addMiddleGoal = () => {
        const data = watch();
        // idの決定
        const goalID = new GoalID("middle0");
        Object.keys(props.inputGoalData["middleGoals"]).forEach(elem => {
            const goalIDElem = new GoalID(elem);
            if (goalID.compareTo(goalIDElem) === -1) {
                goalID.set(goalIDElem.getID());
            }
        })
        goalID.add(1);
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            // データの格納
            updatedData["middleGoals"][goalID.getID()]                = {};
            updatedData["middleGoals"][goalID.getID()]["id"]          = goalID.getID();
            updatedData["middleGoals"][goalID.getID()]["title"]       = data["title"];
            updatedData["middleGoals"][goalID.getID()]["duration"]    = [];
            updatedData["middleGoals"][goalID.getID()]["thumbnail"]   = {
                "path": thumbnailURL,
                "storagePath": `images/${accountData.getUID()}/${props.inputGoalData["id"]}/${goalID.getID()}`,
            };
            updatedData["middleGoals"][goalID.getID()]["smallGoals"]  = {};
            updatedData["middleGoals"][goalID.getID()]["finalGoalID"] = updatedData["id"];
            updatedData["middleGoals"][goalID.getID()]["delete"]      = {"flag": false, "date": null};
            return {...updatedData};
        })
        // 初期化
        data["title"] = "";
        setThumbnailURL(noImageURL);
    }
    const onSubmit = (data) => {
        // durationの登録
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            Object.keys(updatedData["middleGoals"]).forEach(goalID => {
                updatedData["middleGoals"][goalID]["duration"] = [];
            })
            document.querySelectorAll(".duration-input:checked").forEach(dom => {
                const key = dom.name;
                if (key !== undefined) {
                    const goalID  = key.split("_")[0];
                    const weekStr = key.split("_")[1];
                    updatedData["middleGoals"][goalID]["duration"].push(weekStr);
                }
            })
            return {...updatedData};
        })
        props.setSectionFlowState("small-goal");
    }
    const [thumbnailURL, setThumbnailURL] = useState(noImageURL);
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // delete function
    //////////////////////////////////////////////////////////////////
    const deleteMiddleGoal = (targetID) => {
        delete props.inputGoalData["middleGoals"][targetID];
        props.setInputGoalData(prevState => {
            const result = {...prevState};
            result["middleGoals"] = {};
            goalsData.createSortedArray(props.inputGoalData["middleGoals"]).forEach((goal, index) => {
                goal["id"] = `middle${index+1}`;
                result["middleGoals"][`middle${index+1}`] = goal;
            })
            return result;
        })
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////
    return (
        <div className="middle-goal-inner">
            <form className="middle-goal-inner__title-and-thumbnail-form" onSubmit={handleSubmit(onSubmit)}>
                { Object.keys(props.inputGoalData["middleGoals"]).length === 0
                ?
                    <InputTitleBox
                        register  = {register}
                        errors    = {errors}
                        maxLength = {30}
                    />
                :
                    <InputTitleBox
                        register    = {register}
                        errors      = {errors}
                        maxLength   = {30}
                        notRequired = {true}
                    />
                }
                
                <InputThumbnailBox
                    register        = {register}
                    thumbnailURL    = {thumbnailURL}
                    setThumbnailURL = {setThumbnailURL}
                />
                <Button
                    clickEvent = {addMiddleGoal}
                    text       = "追加"
                    className  = "add-middle-goal-btn"
                />

                <ul className="middle-goal-inner__middle-goal-items-list">
                    {goalsData.createSortedArray(props.inputGoalData["middleGoals"]).map((middleGoal, index) => {
                        return (
                            <li key={"middle-goal"+index} className="middle-goal-inner__middle-goal-items-list--item">
                                <ThumbnailView
                                    thumbnailURL = {middleGoal["thumbnail"]["path"]}
                                    alt          = {middleGoal["title"] + "サムネイル"}
                                />
                                <p>{(index+1)+"."+middleGoal["title"]}</p>
                                <button onClick={() => {deleteMiddleGoal(middleGoal["id"])}}></button>
                            </li>
                        );
                    })}
                </ul>

                <div className="middle-goal-inner__duration-form">
                    <InputDurationWithFigureBox
                        navigationMessage = {"それぞれの中目標に何週間かけるのかを設定します。短ければ1週間にこなさなければいけない量が多くなるので無理のない範囲で設定しましょう。なるべく各目標の期間がかぶらないようにすると良いです。"}
                        inputGoalData     = {props.inputGoalData}
                        goalsData         = {props.inputGoalData["middleGoals"]}
                        register          = {register}
                    />
                    <div className="middle-goal-inner__duration-form--move-section-btn-list">
                        <BackSectionBtn
                            clickEvent = {() => {
                                props.setSectionFlowState("final-goal");
                                }}
                            text = "前へ"
                        />
                        <NextSectionBtn
                            text = "次へ"
                        />
                    </div>
                </div>

            </form>
        </div>
    );
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
}


export { MiddleGoalInner };
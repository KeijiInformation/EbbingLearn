import { DateDataContext, UserDataContext } from "../../../../App";
import { InputTitleBox } from "../InputTitleBox";
import { InputDescriptionBox } from "../InputDescriptionBox";
import { InputDurationBox } from "../InputDurationBox";
import { InputThumbnailBox } from "../InputThumbnailBox";
import { NextSectionBtn } from "../NextSectionBtn";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { WeekString } from "../../../../GlobalVariable";



const FinalGoalInner = (props) => {
    // props
    // inputGoalData
    // setInputGoalData
    // setSectionFlowState


    ////////////////////////////////////////////////////////
    // グローバル変数
    ////////////////////////////////////////////////////////
    const goalsData   = useContext(UserDataContext)["Goals"];
    const accountData = useContext(UserDataContext)["Account"];
    const dateData    = useContext(DateDataContext);
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // react-hook-form
    ////////////////////////////////////////////////////////
    const { register, watch, handleSubmit, formState: {errors} } = useForm();
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // 提出関数
    ////////////////////////////////////////////////////////
    const onSubmit = (data) => {
        // idの決定
        let goalID = goalsData.getMaxID();
        goalID.add(1);
        // durationStartの形式加工 "2022,2,2" -> [2022, 2, 2]
        let durationArray   = data["durationStart"].split(",");
        const durationStart = [Number(durationArray[0]), Number(durationArray[1]), Number(durationArray[2])];
        // thumbnailのURLを取得
        let thumbnailBlobURL;
        if (data["thumbnail"].length === 1) {
            thumbnailBlobURL = URL.createObjectURL(data["thumbnail"][0]);
        } else {
            thumbnailBlobURL = thumbnailURL;
        }
        // 入力データの格納
        props.setInputGoalData(prevState => {
            const updatedData = prevState;
            updatedData["id"]            = goalID.getID();
            updatedData["title"]         = data["title"];
            updatedData["description"]   = data["description"];
            updatedData["durationStart"] = durationStart;
            updatedData["durationEnd"]   = durationInput;
            updatedData["thumbnail"]     = {
                "path": data["thumbnail"],
                "storagePath": `images/${accountData.getUID()}/${goalID.getID()}/thumbnail`,
                "url": thumbnailBlobURL,
            };
            return {...updatedData};
        })
        props.setSectionFlowState("middle-goal");
    }
    const [thumbnailURL, setThumbnailURL] = useState(props.inputGoalData["thumbnail"]["url"]);
    const [durationInput, setDurationInput] = useState(() => {
        const nextWeekString = new WeekString();
        nextWeekString.generateFromToday(dateData);
        nextWeekString.addWeek(1, dateData);
        return nextWeekString.convertToArray();
    });
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////
    return (
        <div className="final-goal-inner">
            <form className="final-goal-inner__form" onSubmit={handleSubmit(onSubmit)}>
                <InputTitleBox
                    value     = {props.inputGoalData["title"]}
                    register  = {register}
                    errors    = {errors}
                    maxLength = {30}
                />
                <InputDescriptionBox
                    value     = {props.inputGoalData["description"]}
                    register  = {register}
                    errors    = {errors}
                    maxLength = {150}
                />
                <InputDurationBox
                    value            = {props.inputGoalData["durationEnd"]}
                    register         = {register}
                    watch            = {watch}
                    setDurationInput = {setDurationInput}
                />
                <InputThumbnailBox
                    register        = {register}
                    thumbnailURL    = {thumbnailURL}
                    setThumbnailURL = {setThumbnailURL}
                />
                <div className="final-goal-inner__form--move-section-btn-list">
                    <NextSectionBtn
                        text = "次へ"
                    />
                </div>
            </form>
        </div>
    );
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
}


export { FinalGoalInner };
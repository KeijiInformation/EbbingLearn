import { SmallGoalForm } from "./SmallGoalForm"
import { BackSectionBtn } from "../BackSectionBtn";
import { useState } from "react";
import "../../../../assets/styles/RegisterPage/Forms/SmallGoal/SmallGoalInner.scss";
import { useEffect } from "react";
import { Button } from "../../../common/Button";
import { ThumbnailView } from "../../../common/ThumbnailView";


const SmallGoalInner = (props) => {
    // props
    // inputGoalData
    // setGoalInputData
    // setSectionFlowState



    /////////////////////////////////////////////////////////////////////////
    // global veriable
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // 提出関数
    /////////////////////////////////////////////////////////////////////////
    const moveNextSection = () => {
        props.setSectionFlowState("study-pace");
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // open state admin
    /////////////////////////////////////////////////////////////////////////
    const [openState, setOpenState] = useState(() => {
        let resultDict = {};
        Object.keys(props.inputGoalData["middleGoals"]).forEach(middleGoalID => {
            resultDict[middleGoalID] = "closed";
        });
        return resultDict;
    });
    const toggleOpenState = (targetClassName) => {
        setOpenState(prevState => {
            let reLoadDict = {};
            Object.keys(prevState).forEach(element => {
                if (prevState[element] === "closed" && element === targetClassName) {
                    reLoadDict[element] = "opened";
                } else {
                    reLoadDict[element] = "closed";
                }
            });
            return {...prevState, ...reLoadDict};
        });
    }
    useEffect(() => {
        Object.keys(openState).forEach((element) => {
            if (openState[element] === "opened") {
                let targetDOM = document.querySelector(`.small-goal-inner__middle-goals-list__item.${element}`);
                targetDOM.scrollIntoView({"behavior": "smooth", "block": "start"});
                window.scrollBy({top: (targetDOM.getBoundingClientRect().top-64), behavior: "smooth"})
            }
        })
    }, [openState])
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////////////
    return (
        <div className="small-goal-inner">
            <ul className="small-goal-inner__middle-goals-list">
                {Object.values(props.inputGoalData["middleGoals"]).map((middleGoal, index) => {
                    return (
                        <li className={`small-goal-inner__middle-goals-list__item ${openState[middleGoal["id"]]} ${middleGoal["id"]}`} key={"small-goal-inner__middle-goals-list__item" + index}>
                            <div className="small-goal-inner__middle-goals-list__item__middle-goal-info"  onClick={() => {toggleOpenState(middleGoal["id"])}}>
                                <ThumbnailView
                                    thumbnailURL = {middleGoal["thumbnail"]["path"]}
                                    alt          = {middleGoal["title"]}
                                />
                                <div className="small-goal-inner__middle-goals-list__item__middle-goal-info--text">
                                    <p>{middleGoal["title"]}</p>
                                    <p>{middleGoal["duration"].length}週間</p>
                                </div>
                            </div>
                            <p className="small-goal-inner__middle-goals-list__item--navigation-text">小目標の追加</p>
                            <SmallGoalForm
                                middleGoalID     = {middleGoal["id"]}
                                toggleOpenState  = {toggleOpenState}
                                inputGoalData    = {props.inputGoalData}
                                setInputGoalData = {props.setInputGoalData}
                            />
                        </li>
                    );
                })}
            </ul>
            <div className="small-goal-inner__duration-form--move-section-btn-list">
                <BackSectionBtn
                    clickEvent = {() => {
                        props.setSectionFlowState("middle-goal")
                    }}
                    text = "前へ"
                />
                <Button
                    clickEvent = {moveNextSection}
                    text       = {"次へ"}
                />
            </div>
        </div>
    );
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
}


export { SmallGoalInner };
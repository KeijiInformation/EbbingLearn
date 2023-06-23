import { useContext, useEffect } from "react";
import "../../assets/styles/common/ProgressGauge.scss";
import { DateDataContext, UserDataContext } from "../../App";
import { WeekString } from "../../GlobalVariable";

const ProgressGauge = (props) => {
    // props
    // finalGoalID
    // middleGoalID
    // smallGoalID
    // startWeekString
    // endWeekString
    // dateString: weekStringとdateStringがどちらもundefinedならば全期間を表す
    // gaugeID: 各ゲージの識別のために使用。gauge1, 2, 3などの固有番号で渡す



    //////////////////////////////////////////////////////////
    // global variables
    //////////////////////////////////////////////////////////
    const goalsData    = useContext(UserDataContext)["Goals"];
    const progressData = useContext(UserDataContext)["Progress"];
    const dateData     = useContext(DateDataContext);
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////
    // calc total weight
    //////////////////////////////////////////////////////////
    let totalWeight = 0;
    // 全期間の場合
    if (props.startWeekString === undefined && props.endWeekString === undefined && props.dateString === undefined) {
        totalWeight += goalsData.getTotalWeight(props.finalGoalID, props.middleGoalID, props.smallGoalID);
    // 特定の日の場合
    } else if (props.startWeekString === undefined && props.endWeekString === undefined && props.dateString !== undefined) {
        totalWeight += progressData.getDateTotalWeight(props.dateString, dateData, goalsData, props.finalGoalID, props.middleGoalID, props.smallGoalID);
        // 特定の期間の場合
    } else {
        const onWeekString = new WeekString(props.startWeekString.getStr());
        while (onWeekString.compareTo(props.endWeekString) <= 0) {
            totalWeight += progressData.getWeekTotalWeight(onWeekString, goalsData, props.finalGoalID, props.middleGoalID, props.smallGoalID);
            onWeekString.addWeek(1, dateData);
        }
    }
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////
    // calc total progress
    //////////////////////////////////////////////////////////
    let totalProgress = 0;
    if (props.startWeekString === undefined && props.endWeekString === undefined && props.dateString === undefined) {
        totalProgress += goalsData.getTotalProgress(props.finalGoalID, props.middleGoalID, props.smallGoalID);
    } else if (props.startWeekString === undefined && props.endWeekString === undefined && props.dateString !== undefined) {
        totalProgress += progressData.getDateTotalProgress(props.dateString, dateData, goalsData, props.finalGoalID, props.middleGoalID, props.smallGoalID);
    } else {
        const onWeekString = new WeekString(props.startWeekString.getStr());
        while (onWeekString.compareTo(props.endWeekString) <= 0) {
            totalProgress += progressData.getWeekTotalProgress(onWeekString, goalsData, props.finalGoalID, props.middleGoalID, props.smallGoalID);
            onWeekString.addWeek(1, dateData);
        }
    }
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////
    // calc progress ratio
    //////////////////////////////////////////////////////////
    let progressRatio = 0;
    if (totalWeight !== 0) {
        progressRatio = Math.floor(100 * totalProgress / totalWeight);
    }
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////
    // gauge length admin
    //////////////////////////////////////////////////////////
    useEffect(() => {
        const targetDOM = document.querySelector(".progress-gauge-wrapper--achieved."+props.gaugeID);
        if (progressRatio > 100) {
            targetDOM.style.width = "100%";
        } else {
            targetDOM.style.width = progressRatio + "%";
        }
    });
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////
    return (
        <div className={"progress-gauge-wrapper " + props.gaugeID}>
            <div className="progress-gauge-wrapper--inner ">{progressRatio+"%"}</div>
            <div className="progress-gauge-wrapper--background"></div>
            <div className={"progress-gauge-wrapper--achieved " + props.gaugeID}></div>
        </div>
    );
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////
}

export {ProgressGauge};
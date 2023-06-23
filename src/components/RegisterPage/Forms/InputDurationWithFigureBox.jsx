import { useContext, useEffect, useState } from "react";
import { DateDataContext, UserDataContext } from "../../../App";
import "../../../assets/styles/RegisterPage/Forms/InputDurationWithFigureBox.scss";
import { WeekString } from "../../../GlobalVariable";
import { InputDurationBox } from "./InputDurationBox";
import { Button } from "../../common/Button";
import { FiCheckSquare } from "react-icons/fi";

const InputDurationWithFigureBox = (props) => {
    // props↓
    // navigationMessage: 説明テキスト
    // inputGoalData
    // goalsData: 目標の入った構造体の配列(各要素は構造体で{"title": })
    // register
    // middleGoalID: 選択中のmiddleGoalのID。small-goal-formで使う



    /////////////////////////////////////////////////////////////
    // global variables
    /////////////////////////////////////////////////////////////
    const goalsData = useContext(UserDataContext)["Goals"];
    const dateData  = useContext(DateDataContext);
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // set durationWeekStrings
    /////////////////////////////////////////////////////////////
    const durationWeekStrings = [];
    // 中目標用
    if (props.middleGoalID === undefined) {
        let onWeekString        = new WeekString(`${props.inputGoalData["durationStart"][0]}-${props.inputGoalData["durationStart"][1]}-${props.inputGoalData["durationStart"][2]}`);
        let endWeekString       = new WeekString(`${props.inputGoalData["durationEnd"][0]  }-${props.inputGoalData["durationEnd"][1]  }-${props.inputGoalData["durationEnd"][2]  }`);
        while (onWeekString.compareTo(endWeekString) <= 0) {
            durationWeekStrings.push(new WeekString(onWeekString.getStr()));
            onWeekString.addWeek(1, dateData);
        }
    // 小目標用
    } else {
        props.inputGoalData["middleGoals"][props.middleGoalID]["duration"].forEach(weekStr => {
            durationWeekStrings.push(new WeekString(weekStr));
        })
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // duration input state
    /////////////////////////////////////////////////////////////
    const [targetID, setTargetID] = useState("all");
    const [durationStart, setDurationStart] = useState(() => {
        if (durationWeekStrings.length !== 0) {
            return durationWeekStrings[0].convertToArray();
        } else {
            return undefined;
        }
    });
    const [durationEnd, setDurationEnd] = useState(() => {
        if (durationWeekStrings.length !== 0) {
            return durationWeekStrings[0].convertToArray();
        } else {
            return undefined;
        }
    });
    const setDurations = (flag) => {
        const startWeekString = new WeekString(`${durationStart[0]}-${durationStart[1]}-${durationStart[2]}`);
        const endWeekString   = new WeekString(`${durationEnd[0]}-${durationEnd[1]}-${durationEnd[2]}`);
        if (startWeekString.compareTo(endWeekString) <= 0) {
            const onWeekString = new WeekString(startWeekString.getStr());
            while (onWeekString.compareTo(endWeekString) <= 0) {
                let targetCheckBoxList = [];
                if (targetID === "all") {
                    Object.keys(props.goalsData).forEach(goalID => {
                        if (props.middleGoalID === undefined) {
                            targetCheckBoxList.push(document.querySelector(`#checkbox_${goalID}_${onWeekString.getStr()}`));
                        } else {
                            targetCheckBoxList.push(document.querySelector(`#checkbox_${props.middleGoalID}_${goalID}_${onWeekString.getStr()}`));
                        }
                    })
                } else {
                    if (props.middleGoalID === undefined) {
                        targetCheckBoxList.push(document.querySelector(`#checkbox_${targetID}_${onWeekString.getStr()}`))
                    } else {
                        targetCheckBoxList.push(document.querySelector(`#checkbox_${props.middleGoalID}_${targetID}_${onWeekString.getStr()}`))
                    }
                }
                targetCheckBoxList.forEach(targetCheckBox => {
                    targetCheckBox.checked = flag;
                })
                onWeekString.addWeek(1, dateData);
            }
        }
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // svg admin
    /////////////////////////////////////////////////////////////
    useEffect(() => {
        const checkLines = document.querySelectorAll(".duration-with-figure-input-box__duration-input-wrapper--target-and-check-btn .btn-wrapper svg polyline");
        console.log(checkLines);
        checkLines.forEach((checkLine) => {
            checkLine.classList.add("check-line");
        })
    }, [])
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////
    return (
        <div className="duration-with-figure-input-box">
            <p className="duration-with-figure-input-box__title">各目標を達成するのに要する期間の設定</p>
            <p className="duration-with-figure-input-box__navigation-message">{props.navigationMessage}</p>
            {durationWeekStrings.length !== 0 &&
                <div className="duration-with-figure-input-box__duration-input-wrapper">
                    <div className="duration-with-figure-input-box__duration-input-wrapper--duration-input">
                        <InputDurationBox
                            value            = {durationStart}
                            startWeekString  = {durationWeekStrings[0]}
                            endWeekString    = {durationWeekStrings[durationWeekStrings.length-1]}
                            setDurationInput = {setDurationStart}
                        />
                        <p>～</p>
                        <InputDurationBox
                            value            = {durationStart}
                            startWeekString  = {durationWeekStrings[0]}
                            endWeekString    = {durationWeekStrings[durationWeekStrings.length-1]}
                            setDurationInput = {setDurationEnd}
                        />
                    </div>
                    <div className="duration-with-figure-input-box__duration-input-wrapper--target-and-check-btn">
                        <select onChange={(e) => {setTargetID(e.target.value)}}>
                            <option value="all">すべて</option>
                            {goalsData.createSortedArray(props.goalsData).map((goal, index) => {
                                return <option key={"duration-with-figure-input-box__duration-input-wrapper--target-select_" + index} value={goal["id"]}>{`${index+1}. ${goal["title"]}`}</option>
                            })}
                        </select>
                        <div>
                            <Button
                                clickEvent = {() => setDurations(false)}
                                text       = "チェックをはずす"
                                className  = "sub"
                            />
                            <Button
                                clickEvent = {() => setDurations(true)}
                                text       = "チェックする"
                                className  = "sub"
                                icon       = {<FiCheckSquare />}
                            />
                        </div>
                    </div>
                </div>
            }
            <div className="duration-with-figure-input-box__figure-box">

                {/* タイトルの一覧表示 */}
                <ul className="duration-with-figure-input-box__figure-box__middle-goal-title-list">
                    <li className="duration-with-figure-input-box__figure-box__middle-goal-title-list--number-of-week">
                        {`(計${durationWeekStrings.length}週間)`}
                    </li>
                    {goalsData.createSortedArray(props.goalsData).map((goal, index) => {
                        return (
                            <li className="duration-with-figure-input-box__figure-box__middle-goal-title-list--item" key={"duration-with-figure-input-box__figure-box__middle-goal-title-list--item" + index}>
                                <p>{(index+1)+". "+goal["title"]}</p>
                            </li>
                        );
                    })}
                </ul>

                {/* 年月週の一覧表示 */}
                <div className="duration-with-figure-input-box__figure-box__figure">
                    <ul className="duration-with-figure-input-box__figure-box__figure--columns">
                        {durationWeekStrings.map((weekString, index) => {
                            const year  = weekString.getYear();
                            const month = weekString.getMonth();
                            const week  = weekString.getWeek();
                            return (
                                <li key={"duration-with-figure-input-box__figure-box__figure--columns" + index}>
                                { index === 0 || month+week === 1
                                    ?
                                        <>
                                        <p className="duration-with-figure-input-box__figure-box__figure--columns--year-num">{year}年</p>
                                        <p className="duration-with-figure-input-box__figure-box__figure--columns--month-num">{month}月</p>
                                        <p className="duration-with-figure-input-box__figure-box__figure--columns--week-num">{week}</p>
                                        </>
                                    :
                                        <>
                                        { week === 1
                                            ?
                                                <>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--year-num hidden">{year}年</p>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--month-num">{month}月</p>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--week-num">{week}</p>
                                                </>
                                            :
                                                <>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--year-num hidden">{year}年</p>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--month-num hidden">{month}月</p>
                                                <p className="duration-with-figure-input-box__figure-box__figure--columns--week-num">{week}</p>
                                                </>
                                        }
                                        </>
                                }
                                </li>
                            );
                        })}
                    </ul>

                    {/* インプット行の一覧表示 */}
                    <ul className="duration-with-figure-input-box__figure-box__figure--rows">
                        {goalsData.createSortedArray(props.goalsData).map((goal, index) => {
                            return (
                                <ul className="duration-with-figure-input-box__figure-box__figure--rows--checkbox-list" key={"duration-with-figure-input-box__figure-box__figure--rows--checkbox-list" + index}>
                                    {durationWeekStrings.map((weekString, durationIndex) => {
                                        // まだデータが存在しない時
                                        if (goal["duration"].includes(weekString.getStr())) {
                                            return (
                                                <li key={"duration-with-figure-input-box__figure-box__figure--rows--checkbox-list--checkbox" + durationIndex} className="duration-with-figure-input-box__figure-box__figure--rows--checkbox-list--checkbox">
                                                    { !props.middleGoalID
                                                        ?
                                                        <input type="checkbox" id={`checkbox_${goal["id"]}_${weekString.getStr()}`} checked className="duration-input" {...props.register((goal["id"]+"_"+weekString.getStr()), {required: false})}/>
                                                        :
                                                        <input type="checkbox" id={`checkbox_${props.middleGoalID}_${goal["id"]}_${weekString.getStr()}`} checked className="duration-input" {...props.register((props.middleGoalID+"_"+goal["id"]+"_"+weekString.getStr()), {required: false})}/>
                                                    }
                                                </li>
                                            );
                                        } else {
                                            return (
                                                <li key={"duration-with-figure-input-box__figure-box__figure--rows--checkbox-list--checkbox" + durationIndex} className="duration-with-figure-input-box__figure-box__figure--rows--checkbox-list--checkbox">
                                                    { !props.middleGoalID
                                                        ?
                                                        <input type="checkbox" id={`checkbox_${goal["id"]}_${weekString.getStr()}`} className="duration-input" {...props.register((goal["id"]+"_"+weekString.getStr()), {required: false})}/>
                                                        :
                                                        <input type="checkbox" id={`checkbox_${props.middleGoalID}_${goal["id"]}_${weekString.getStr()}`} className="duration-input" {...props.register((props.middleGoalID+"_"+goal["id"]+"_"+weekString.getStr()), {required: false})}/>
                                                    }
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            );
                        })}
                    </ul>

                </div>
            </div>
        </div>
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    )
}

export { InputDurationWithFigureBox };
import { DurationFigure } from "./DurationFigure";
import { Menu } from "./Menu";
import { Popup } from "./Popup";
import { useState, useContext } from "react";
import { TaskVariablesContext, UserDataContext } from "../../App";
import { GoalID, WeekString } from "../../GlobalVariable";
import { ProgressGauge } from "../common/ProgressGauge";
import { ThumbnailView } from "../common/ThumbnailView";
import { CSSTransition } from "react-transition-group";
import arrowBackImage from "../../assets/images/Confirm/arrowBack.png";



const ConfirmPage = (props) => {
    // props
    // setReloadFlags



    ///////////////////////////////////////////////////////////////
    // global variables
    ///////////////////////////////////////////////////////////////
    const goalsData     = useContext(UserDataContext)["Goals"];
    const progressData  = useContext(UserDataContext)["Progress"];
    const taskVariables = useContext(TaskVariablesContext);
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // open state admin
    ///////////////////////////////////////////////////////////////
    const [isFinalGoalVisible, setIsFinalGoalVisible] = useState(true);
    const [isFinalGoalOpen, setIsFinalGoalOpen] = useState(() => {
        const result = {};
        Object.values(goalsData.getGoals()).forEach(finalGoal => {
            result[finalGoal["id"]] = false;
        })
        return result;
    })
    const [isMiddleGoalVisible, setIsMiddleGoalVisible] = useState(true);
    const [isMiddleGoalOpen, setIsMiddleGoalOpen] = useState(() => {
        const result = {};
        Object.values(goalsData.getGoals()).forEach(finalGoal => {
            Object.values(finalGoal["middleGoals"]).forEach(middleGoal => {
                result[`${finalGoal["id"]}_${middleGoal["id"]}`] = false;
            })
        })
        return result;
    })
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // open close animation
    ///////////////////////////////////////////////////////////////
    const setFinalGoalOpenState = (targetFinalGoalID, bool) => {
        setIsFinalGoalVisible(!bool);
        setIsFinalGoalOpen(prevState => {
            Object.keys(prevState).forEach(finalGoalID => {
                prevState[finalGoalID] = false;
            })
            prevState[targetFinalGoalID] = bool;
            return {...prevState};
        })
    }
    const setMiddleGoalOpenState = (targetFinalGoalID, targetMiddleGoalID, bool) => {
        setIsMiddleGoalVisible(!bool);
        setIsMiddleGoalOpen(prevState => {
            Object.keys(prevState).forEach(goalIDs => {
                prevState[goalIDs] = false;
            })
            if (targetMiddleGoalID !== "all" || bool !== false) {
                prevState[`${targetFinalGoalID}_${targetMiddleGoalID}`] = bool;
            }
            return {...prevState};
        })
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // edit popup
    ///////////////////////////////////////////////////////////////
    const [isOpenEditPop  , setIsOpenEditPop  ] = useState(false);
    const agreeEditGoal = (targetFinalGoalID) => {
        console.log("未実装です。");
        setFinalGoalOpenState(targetFinalGoalID, false);
        setIsOpenEditPop(false);
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // delete popup
    ///////////////////////////////////////////////////////////////
    const [isOpenDeletePop, setIsOpenDeletePop] = useState(false);
    const agreeDeleteGoal = (targetFinalGoalID) => {
        setFinalGoalOpenState(targetFinalGoalID, false);
        setIsOpenDeletePop(false);
        goalsData.setDeleteFlag(true, targetFinalGoalID);
    }
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////////////
    return (
        <div id="confirm-page" className="confirm-page">
            <p className="confirm-page__anounce">
                目標を確認しましょう
            </p>
            <div className="confirm-page__page-content-container">
                <ul className="confirm-page__goals-list">
                    {/* finalGoals list View */}
                    {goalsData.getSortedArray().map(( finalGoal, index ) => {
                        if (!finalGoal["delete"]["flag"]) {
                            return (
                                <CSSTransition
                                    in = {isFinalGoalVisible}
                                    timeout = {600}
                                    unmountOnExit
                                >
                                    <li className={`confirm-page__goals-list__final-goal ${finalGoal["id"]}`} key={"confirm-page__goals-list__final-goal"+index}>
                                        <div className="confirm-page__goals-list__final-goal--base-info" onClick={() => setFinalGoalOpenState(finalGoal["id"], true)}>
                                            <ThumbnailView
                                                thumbnailURL = {finalGoal["thumbnail"]}
                                            />
                                            <div className="confirm-page__goals-list__final-goal--base-info--outline">
                                                <p className="confirm-page__goals-list__final-goal--base-info--outline--title">{finalGoal["title"]}</p>
                                                <div className="confirm-page__goals-list__final-goal--base-info--outline--progress-gauge">
                                                    <ProgressGauge
                                                        finalGoalID = {new GoalID(finalGoal["id"])}
                                                        gaugeID     = {"gauge_" + finalGoal["id"]}
                                                    />
                                                </div>
                                                <div className="confirm-page__goals-list__final-goal--base-info--outline--duration">
                                                    <p className="confirm-page__goals-list__final-goal--base-info--duration--outline--durationStart">{`${finalGoal["durationStart"][0]}年${finalGoal["durationStart"][1]}月第${finalGoal["durationStart"][2]}週`}</p>
                                                    <p>～</p>
                                                    <p className="confirm-page__goals-list__final-goal--base-info--duration--outline--durationEnd">{`${finalGoal["durationEnd"][0]}年${finalGoal["durationEnd"][1]}月第${finalGoal["durationEnd"][2]}週`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </CSSTransition>
                            )
                        }
                    })}
                </ul>






                {/* finalGoal detail View */}
                {goalsData.getSortedArray().map(finalGoal => {
                    return (
                        <CSSTransition
                            in = {isFinalGoalOpen[finalGoal["id"]]}
                            timeout = {600}
                            unmountOnExit
                        >
                            <div className="confirm-page__goal-detail-wrapper" key={"confirm-page__goal-detail-wrapper-"+finalGoal["id"]}>


                            {/* popup */}
                            <CSSTransition
                                in      = {isOpenDeletePop}
                                timeout = {300}
                                unmountOnExit
                            >
                                <Popup
                                    text        = {"本当に削除しますか？"}
                                    cancelEvent = {() => setIsOpenDeletePop(false)}
                                    agreeEvent  = {() => agreeDeleteGoal(finalGoal["id"])}
                                />
                            </CSSTransition>
                            <CSSTransition
                                in      = {isOpenEditPop}
                                timeout = {300}
                                unmountOnExit
                            >
                                <Popup
                                    text        = {"本当に編集しますか？（この機能は未実装です）"}
                                    cancelEvent = {() => setIsOpenEditPop(false)}
                                    agreeEvent  = {() => agreeEditGoal(finalGoal["id"])}
                                />
                            </CSSTransition>
                            <CSSTransition
                                in      = {isOpenDeletePop || isOpenEditPop}
                                timeout = {300}
                                unmountOnExit
                            >
                                <div className="popup-overlay"/>
                            </CSSTransition>


                                <div className="final-goal-detail">
                                    <div className="back-btn-wrapper" onClick={() => {setMiddleGoalOpenState(finalGoal["id"], "all", false); setFinalGoalOpenState(finalGoal["id"], false)}}>
                                        <img src={arrowBackImage} alt="戻る" />
                                    </div>
                                    <Menu
                                        setIsOpenDeletePop = { setIsOpenDeletePop }
                                        setIsOpenEditPop   = { setIsOpenEditPop   }
                                    />
                                    <div className="final-goal-detail__outline">
                                        <ThumbnailView
                                            thumbnailURL = {finalGoal["thumbnail"]}
                                        />
                                        <div className="final-goal-detail__outline--info">
                                            <div>
                                                <div className="label title">
                                                    <p>Title</p>
                                                    <p>:</p>
                                                </div>
                                                <div className="value title">
                                                    <p>{finalGoal["title"]}</p>
                                                </div>
                                                <div className="label duration">
                                                    <p>Duration</p>
                                                    <p>:</p>
                                                </div>
                                                <div className="value duration">
                                                    <div className="duration-start"><p className="year">{finalGoal["durationStart"][0]}</p><p>年</p><p className="month">{finalGoal["durationStart"][1]}</p><p>月第</p><p className="week">{finalGoal["durationStart"][2]}</p><p>週</p></div>
                                                    <p>～</p>
                                                    <div className="duration-end"  ><p className="year">{finalGoal["durationStart"][0]}</p><p>年</p><p className="month">{finalGoal["durationStart"][1]}</p><p>月第</p><p className="week">{finalGoal["durationStart"][2]}</p><p>週</p></div>
                                                </div>
                                                <div className="label progress">
                                                    <p>Progress</p>
                                                    <p>:</p>
                                                </div>
                                                <div className="value progress">
                                                    <ProgressGauge
                                                        finalGoalID = {new GoalID(finalGoal["id"])}
                                                        gaugeID     = {"gauge_" + finalGoal["id"]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="description">
                                                <p>{finalGoal["description"]}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="middle-goal-wrapper">
                                    <div className="middle-goal-wrapper__duration-figure">
                                        <DurationFigure
                                            finalGoalID = {finalGoal["id"]}
                                        />
                                    </div>
                                        <p className="middle-goal-wrapper__anounce">中目標一覧</p>
                                        <div className="middle-goal-wrapper__middle-goals-list-container">
                                            <ul className="middle-goal-wrapper__middle-goals-list">
                                                {goalsData.getSortedArray(new GoalID(finalGoal["id"])).map((middleGoal) => {
                                                    const startWeekArray = new WeekString(middleGoal["duration"][0]).convertToArray();
                                                    const endWeekArray   = new WeekString(middleGoal["duration"][middleGoal["duration"].length-1]).convertToArray();
                                                    if (!middleGoal["delete"]["flag"]) {
                                                        return (
                                                            <CSSTransition
                                                                in = {isMiddleGoalVisible}
                                                                timeout = {600}
                                                                unmountOnExit
                                                            >
                                                                <li className={`middle-goal-wrapper__middle-goals-list--middle-goal ${middleGoal["id"]}`} key={"middle-goal-wrapper__middle-goals-list--middle-goal-"+middleGoal["id"]} onClick={() => setMiddleGoalOpenState(finalGoal["id"], middleGoal["id"], true)}>
                                                                    <p className="title">{middleGoal["title"]}</p>
                                                                    <ThumbnailView
                                                                        thumbnailURL = {middleGoal["thumbnail"]}
                                                                    />
                                                                    <div className="duration">
                                                                        <div className="duration__duration-start"><p className="label">開始:</p><p className="year">{startWeekArray[0]}</p><p>年</p><p className="month">{startWeekArray[1]}</p><p>月第</p><p className="week">{startWeekArray[2]}</p><p>週</p></div>
                                                                        <div className="duration__duration-end"  ><p className="label">終了:</p><p className="year">{endWeekArray[0]  }</p><p>年</p><p className="month">{endWeekArray[1]  }</p><p>月第</p><p className="week">{endWeekArray[2]  }</p><p>週</p></div>
                                                                    </div>
                                                                    <ProgressGauge
                                                                        finalGoalID  = {new GoalID(finalGoal["id"])}
                                                                        middleGoalID = {new GoalID(middleGoal["id"])}
                                                                        gaugeID      = {"gauge_" + finalGoal["id"] + "_" + middleGoal["id"]}
                                                                    />
                                                                </li>
                                                            </CSSTransition>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </div>
                                </div>






                                {/* middle goal detail view */}
                                {goalsData.getSortedArray(new GoalID(finalGoal["id"])).map(middleGoal => {
                                    const startWeekArray = new WeekString(middleGoal["duration"][0]).convertToArray();
                                    const endWeekArray   = new WeekString(middleGoal["duration"][middleGoal["duration"].length-1]).convertToArray();
                                    return (
                                        <CSSTransition
                                            in = {isMiddleGoalOpen[`${finalGoal["id"]}_${middleGoal["id"]}`]}
                                            timeout = {600}
                                            unmountOnExit
                                        >
                                            <div className="middle-goal-detail">
                                                <div className="middle-goal-detail__outline">
                                                    <div className="back-btn-wrapper" onClick={() => {setMiddleGoalOpenState(finalGoal["id"], middleGoal["id"], false)}}>
                                                        <img src={arrowBackImage} alt="戻る" />
                                                    </div>
                                                    <ThumbnailView
                                                        thumbnailURL = {middleGoal["thumbnail"]}
                                                    />
                                                    <div className="middle-goal-detail__outline--info">
                                                        <p className="label title">Title:</p>
                                                        <p className="value title">{middleGoal["title"]}</p>
                                                        <p className="label duration">Duration:</p>
                                                        <div className="value duration">
                                                            <div className="duration-start"><p className="year">{startWeekArray[0]}</p><p>年</p><p className="month">{startWeekArray[1]}</p><p>月第</p><p className="week">{startWeekArray[2]}</p><p>週</p></div>
                                                            <p>～</p>
                                                            <div className="duration-end"  ><p className="year">{endWeekArray[0]  }</p><p>年</p><p className="month">{endWeekArray[1]  }</p><p>月第</p><p className="week">{endWeekArray[2]  }</p><p>週</p></div>
                                                        </div>
                                                        <p className="label progress">Progress:</p>
                                                        <div className="value progress">
                                                            <ProgressGauge
                                                                finalGoalID  = {new GoalID(finalGoal["id"])}
                                                                middleGoalID = {new GoalID(middleGoal["id"])}
                                                                gaugeID      = {"gauge_" + finalGoal["id"] + "_" + middleGoal["id"]}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>






                                                {/* small goals list */}
                                                <div className="middle-goal-detail__small-goal-wrapper">
                                                    <DurationFigure
                                                        finalGoalID  = {finalGoal["id"]}
                                                        middleGoalID = {middleGoal["id"]}
                                                    />
                                                    <p className="middle-goal-detail__small-goal-wrapper--anounce">小目標一覧</p>
                                                    <ul className="middle-goal-detail__small-goal-wrapper--small-goals-list">
                                                        {goalsData.getSortedArray(new GoalID(finalGoal["id"]), new GoalID(middleGoal["id"])).map(smallGoal => {
                                                            if (!smallGoal["delete"]["flag"]) {
                                                                return (
                                                                    <li className="small-goal-detail-wrapper" key={"small-goal-detail-wrapper-" + smallGoal["id"]}>
                                                                        <div className="small-goal-detail-wrapper__title">
                                                                            <p>{smallGoal["title"]}</p>
                                                                            <p>{`(${taskVariables.getGenre(smallGoal["genre"])}${smallGoal["amount"]}${taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])})`}</p>
                                                                        </div>
                                                                        <div className="small-goal-detail-wrapper__content">
                                                                            <p className="label duration">Duration</p>
                                                                            <div className="value duration">
                                                                                <p>{smallGoal["duration"].length}</p>
                                                                                <p>週間</p>
                                                                            </div>
                                                                            <p className="label amount">Amount</p>
                                                                            <div className="value amount">
                                                                                <p>{taskVariables.getGenre(smallGoal["genre"])}</p>
                                                                                <p>{`${smallGoal["progress"]} / ${smallGoal["amount"]}`}</p>
                                                                                <p>{taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}</p>
                                                                            </div>
                                                                            <p className="label progress">Progress</p>
                                                                            <div className="value progress">
                                                                                <ProgressGauge
                                                                                    finalGoalID  = {new GoalID(finalGoal["id"])}
                                                                                    middleGoalID = {new GoalID(middleGoal["id"])}
                                                                                    smallGoalID  = {new GoalID(smallGoal["id"])}
                                                                                    gaugeID      = {"gauge_" + finalGoal["id"] + "_" + middleGoal["id"] + "_" + smallGoal["id"]}
                                                                                />
                                                                                {/* <div className="delay-message">
                                                                                    <p>!推奨ペースに対して</p>
                                                                                    <p>{`(仮に2)`}</p>
                                                                                    <p>{taskVariables.getUnit(smallGoal["genre"], smallGoal["unit"])}遅れています</p>
                                                                                </div> */}
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                )
                                                            }
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CSSTransition>
                                    )
                                })}
                            </div>
                        </CSSTransition>
                    )
                })}
            </div>
        </div>
    );
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////
}


export default ConfirmPage;
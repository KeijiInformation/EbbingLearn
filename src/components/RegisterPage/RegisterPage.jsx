import "../../assets/styles/RegisterPage/Forms/FinalGoal/FinalGoalInner.scss";
import "../../assets/styles/RegisterPage/Forms/MiddleGoal/MiddleGoalInner.scss";

import { Navigation } from "./Navigation";
import { SectionOutLine } from "./SectionOutLine";
import { InputFormBox } from "./InputFormBox";
import { useContext, useState } from "react";
import { Link as Scroll } from "react-scroll";
import { db } from "../../firebase";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { DateDataContext, TaskVariablesContext, UserDataContext } from "../../App";
import { WeekString } from "../../GlobalVariable";
import { existInDict } from "../../functions/useful";

const RegisterPage = (props) => {
    // props
    // setReloadFlags
    // pageState
    // setPageState



    ////////////////////////////////////////////////////////////////
    // global variables
    ////////////////////////////////////////////////////////////////
    const accountInfo   = useContext(UserDataContext)["Account"];
    const progressData  = useContext(UserDataContext)["Progress"];
    const taskVariables = useContext(TaskVariablesContext);
    const dateData      = useContext(DateDataContext);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // set section flow state
    ////////////////////////////////////////////////////////////////
    // どの設定項目にいるかのState。各設定項目に合わせて以下の文字列で管理する。
    // ["final-goal", "middle-goal", "small-goal", "study-pace"]
    // modelDataの使用オプション
    const useModelData = false;
    const needSubmit = true;
    const [sectionFlowState, setSectionFlowState] = useState(() => {
        if (useModelData) {
            return "complete";
        } else {
            return "final-goal";
        }
    });
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // submit to firebase
    ////////////////////////////////////////////////////////////////
    const [completeInputData, setCompleteInputData] = useState(undefined);
    useEffect(() => {
        if (!needSubmit) {
            console.log(completeInputData);
        }
        if (sectionFlowState === "complete" && completeInputData !== undefined && needSubmit) {
            // upload image to firestorage
            const storage = getStorage();
            if (completeInputData["thumbnail"]["path"].length !== 0) {
                let imageRef = ref(storage, completeInputData["thumbnail"]["storagePath"]);
                uploadBytes(imageRef, completeInputData["thumbnail"]["path"]).then(snapshot => {
                    completeInputData["thumbnail"] = completeInputData["thumbnail"]["storagePath"];
                })
            } else {
                completeInputData["thumbnail"] = "images/noImage.png";
            }
            Object.values(completeInputData["middleGoals"]).forEach(middleGoal => {
                if (middleGoal["thumbnail"]["path"].length !== 0) {
                    let imageRef = ref(storage, middleGoal["thumbnail"]["storagePath"]);
                    uploadBytes(imageRef, middleGoal["thumbnail"]["path"]).then(snapshot => {
                        completeInputData["middleGoals"][middleGoal["id"]]["thumbnail"] = middleGoal["thumbnail"]["storagePath"];
                    })
                } else {
                    completeInputData["middleGoals"][middleGoal["id"]]["thumbnail"] = "images/noImage.png";
                }
            })


            // upload goals data
            const goalsDocumentRef = doc(db, "Goals", `${accountInfo.getUID()}_${completeInputData["id"]}`);
            setDoc(goalsDocumentRef, completeInputData);


            // create progress data
            const createdProgressData = {};
            Object.values(completeInputData["middleGoals"]).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    const goalIDs = `${completeInputData["id"]}_${middleGoal["id"]}_${smallGoal["id"]}`;
                    // 週ごとの割り当てを決定
                    const weekAllocation = {};
                    let   totalAmount    = smallGoal["amount"];
                    const pacePerWeek    = Math.ceil(totalAmount / smallGoal["duration"].length);
                    smallGoal["duration"].forEach(weekStr => {
                        if (totalAmount - pacePerWeek <= 0) {
                            weekAllocation[weekStr] = totalAmount;
                            totalAmount = 0;
                        } else {
                            weekAllocation[weekStr] = pacePerWeek;
                            totalAmount -= pacePerWeek;
                        }
                    })
                    // 日ごとの割り当てを決定
                    const dateAllocation = {};
                    let   weekRange      = [0, 0];
                    smallGoal["duration"].forEach(weekStr => {
                        dateAllocation[weekStr] = {};
                        const weekString = new WeekString(weekStr);
                        weekRange        = [weekRange[1]+1, weekRange[1]+weekAllocation[weekString.getStr()]];
                        // 週に勉強する日数の確定
                        let numberOfDays      = 7 - completeInputData["studyPace"]["dayoff"].length;
                        let firstLearningDays = numberOfDays;
                        let reLearningDays    = 0;
                        if (completeInputData["studyPace"]["reLearningPerWeekFlag"]) {
                            firstLearningDays = Math.ceil(numberOfDays / 2);
                            reLearningDays    = numberOfDays - firstLearningDays;
                        }
                        // 割り当て
                        const dateStrings = weekString.convertToDateStringList(dateData);
                        let   totalAmount = weekAllocation[weekString.getStr()];
                        let   pacePerDay  = Math.ceil(totalAmount / firstLearningDays);
                        let   range       = [weekRange[0], weekRange[0]];
                        dateStrings.forEach((dateString, i) => {
                            const dateStr = dateString.getStr();
                            // 骨格生成
                            dateAllocation[weekStr][dateStr] = {};
                            dateAllocation[weekStr][dateStr][goalIDs] = {};
                            // 休日の場合
                            if (completeInputData["studyPace"]["dayoff"].includes(i)) {
                                dateAllocation[weekStr][dateStr][goalIDs]["amount"] = 0
                                dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [null, null];
                            // 週前半の場合
                            } else if (firstLearningDays > 0) {
                                if (totalAmount - pacePerDay <= 0) {
                                    dateAllocation[weekStr][dateStr][goalIDs]["amount"] = totalAmount;
                                    if (range[1] === null) {
                                        dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [null, null];
                                    } else {
                                        dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [range[1], range[1]+totalAmount-1];
                                    }
                                    range = [null, null];
                                    totalAmount = 0;
                                    firstLearningDays--;
                                } else {
                                    dateAllocation[weekStr][dateStr][goalIDs]["amount"] = pacePerDay;
                                    dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [range[1], range[1]+pacePerDay-1];
                                    range = [range[1], range[1]+pacePerDay];
                                    totalAmount -= pacePerDay;
                                    firstLearningDays--;
                                }
                            // 週後半の場合
                            } else {
                                if (firstLearningDays === 0) {
                                    range = [weekRange[0], weekRange[0]];
                                    totalAmount = weekAllocation[weekString.getStr()];
                                    pacePerDay  = Math.ceil(totalAmount / reLearningDays);
                                    firstLearningDays--;
                                }
                                if (totalAmount - pacePerDay <= 0) {
                                    dateAllocation[weekStr][dateStr][goalIDs]["amount"] = totalAmount;
                                    if (range[1] === null) {
                                        dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [null, null];
                                    } else {
                                        dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [range[1], range[1]+totalAmount-1];
                                    }
                                    range = [null, null];
                                    totalAmount = 0;
                                    reLearningDays--;
                                } else {
                                    dateAllocation[weekStr][dateStr][goalIDs]["amount"] = pacePerDay;
                                    dateAllocation[weekStr][dateStr][goalIDs]["range"]  = [range[1], range[1]+pacePerDay-1];
                                    range = [range[1], range[1]+pacePerDay];
                                    totalAmount -= pacePerDay;
                                    reLearningDays--;
                                }
                            }
                        })
                    })
                    // 提出用のデータを更新
                    Object.keys(dateAllocation).forEach(weekStr => {
                        if (!existInDict(createdProgressData, weekStr)) {
                            createdProgressData[weekStr] = {};
                        }
                        Object.keys(dateAllocation[weekStr]).forEach(dateStr => {
                            if (!existInDict(createdProgressData[weekStr], dateStr)) {
                                createdProgressData[weekStr][dateStr] = {};
                            }
                            createdProgressData[weekStr][dateStr][goalIDs] = {
                                progress: 0,
                                range:    dateAllocation[weekStr][dateStr][goalIDs]["range"],
                                amount:   dateAllocation[weekStr][dateStr][goalIDs]["amount"],
                                weight:   taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]),
                                id:       goalIDs,
                            }
                        })
                    })
                })
            })


            // upload progress data
            const submitProgressData = progressData.getData();
            Object.keys(createdProgressData).forEach(weekStr => {
                if(!existInDict(submitProgressData, weekStr)) {
                    submitProgressData[weekStr] = {};
                }
                Object.keys(createdProgressData[weekStr]).forEach(dateStr => {
                    submitProgressData[weekStr][dateStr] = {...submitProgressData[weekStr][dateStr], ...createdProgressData[weekStr][dateStr]};
                })
            })
            const progressDataDocumentRef = doc(db, "ProgressData", accountInfo.getUID());
            setDoc(progressDataDocumentRef, submitProgressData);


            // reload
            props.setReloadFlags(prevState => {
                prevState["Goals"]    = true;
                prevState["Progress"] = true;
                return {...prevState};
            })
        }
    }, [completeInputData]);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////
    return (
        <div id="register-page" className="register-page">
            <Navigation
                sectionFlowState = {sectionFlowState}
                />
            <SectionOutLine
                sectionFlowState = {sectionFlowState}
            />
            <InputFormBox
                useModelData         = {useModelData}
                sectionFlowState     = {sectionFlowState}
                setSectionFlowState  = {setSectionFlowState}
                setCompleteInputData = {setCompleteInputData}
                setPageState         = {props.setPageState}
                pageState            = {props.pageState}
            />
            <Scroll to="register-page" duration={200} smooth={true} offset={-64} className="scroll-to-register-page-top" />
        </div>
    );
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
}


export default RegisterPage;
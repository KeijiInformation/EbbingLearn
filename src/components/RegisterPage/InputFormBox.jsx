import { FinalGoalInner  } from "./Forms/FinalGoal/FinalGoalInner";
import { MiddleGoalInner } from "./Forms/MiddleGoal/MiddleGoalInner";
import { SmallGoalInner  } from "./Forms/SmallGoal/SmallGoalInner";
import { StudyPaceInner  } from "./Forms/StudyPace/StudyPaceInner";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { DateDataContext, NoImageURLContext, UserDataContext } from "../../App";
import { getModelData } from "../../functions/modelData/Goals";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CSSTransition } from "react-transition-group";
import { LoadDataPopup } from "./LoadDataPopup";



const InputFormBox = (props) => {
    // props
    // useModelData
    // sectionFlowState
    // setSectionFlowState
    // setCompleteInputData
    // setPageState
    // pageState



    ////////////////////////////////////////////////////////////////
    // global variable
    ////////////////////////////////////////////////////////////////
    const accountData = useContext(UserDataContext)["Account"];
    const goalsData   = useContext(UserDataContext)["Goals"]
    const dateData    = useContext(DateDataContext);
    const noImageURL  = useContext(NoImageURLContext);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // load save data
    ////////////////////////////////////////////////////////////////
    // 管理用State管理
    const [isLoadPopMount, setIsLoadPopMount] = useState(false);
    const [savedData, setSavedData] = useState({})
    // データのロード
    useEffect(() => {
        let docRef = doc(db, "ContemporaryRegister", accountData.getUID());
        getDoc(docRef).then(doc => {
            const data = doc.data();
            setSavedData(data);
            if (data["lastSection"] !== null && data["lastSection"] !== undefined) {
                setIsLoadPopMount(true);
            }
        })
    }, [])



    // ロード処理
    const cancelLoad = () => {
        setIsLoadPopMount(false);
    }
    const loadData = async () => {
        const lastSection = savedData["lastSection"];
        delete savedData["lastSection"];
        const data = {...savedData};
        // サムネイルデータの加工
        // const storageRef = getStorage();
        // if (lastSection === "middle-goal") {
        //     let imageRef = ref(storageRef, data["thumbnail"]["path"]);
        //     await getDownloadURL(imageRef).then(url => {
        //         data["thumbnail"] = {
        //             "path": [url],
        //             "storagePath": data["thumbnail"]["storagePath"],
        //             "url": url
        //         }
        //     })
        //     await getBlob(imageRef).then(blob => {
        //         data["thumbnail"] = {
        //             "path": blob,
        //             "storagePath": data["thumbnail"]["storagePath"],
        //             "url": blob
        //         }
        //     })
        // } else if (lastSection === "small-goal" || lastSection === "study-pace") {
        //     let imageRef = ref(storageRef, data["thumbnail"]["path"]);
        //     await getBlob(imageRef).then(blob => {
        //         data["thumbnail"] = {
        //             "path": blob,
        //             "storagePath": data["thumbnail"]["storagePath"],
        //             "url": blob
        //         }
        //     })
        //     await Object.values(data["middleGoals"]).forEach(middleGoal => {
        //         imageRef = ref(storageRef, middleGoal["thumbnail"]["path"]);
        //         getBlob(storageRef).then(blob => {
        //             data["middleGoals"][middleGoal["id"]]["thumbnail"] = {
        //                 "path": blob,
        //                 "storagePath": middleGoal["thumbnail"]["storagePath"],
        //                 "url": blob
        //             }
        //         })
        //     })
        // }
        // データの登録
        setInputGoalData(data);
        setSavedData({lastSection: null});
        // 中断データの更新
        let docRef = doc(db, "ContemporaryRegister", accountData.getUID());
        await setDoc(docRef, {lastSection: null});
        setIsLoadPopMount(false);
        // セクションの移動
        if (lastSection !== "complete") {
            props.setSectionFlowState(lastSection);
        }
    }
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // contemporarily save
    ////////////////////////////////////////////////////////////////
    // 処理開始のタイミング設定
    useEffect(() => {
        return () => {
            if (props.sectionFlowState !== "final-goal" && props.sectionFlowState !== "complete") {
                saveData();
            }
        }
    }, [props.sectionFlowState])
    useEffect(() => {
        window.addEventListener("popstate"    , saveData);
        window.addEventListener("beforeunload", saveData);
        return () => {
            window.removeEventListener("popstate"    , saveData);
            window.removeEventListener("beforeunload", saveData);
        }
    })



    // 保存関数
    const saveData = async () => {
        // 中断セクションの格納
        const data = inputGoalData;
        data["lastSection"] = props.sectionFlowState;
        // サムネイルの加工処理
        if (data["lastSection"] === "middle-goal") {
            data["thumbnail"]["path"] = [];
        } else if (data["lastSection"] === "small-goal" || data["lastSection"] === "study-pace") {
            data["thumbnail"]["path"] = [];
            Object.values(data["middleGoals"]).forEach(middleGoal => {
                middleGoal["thumbnail"]["path"] = [];
            })
        }
        // const storage = getStorage();
        // if (data["lastSection"] === "middle-goal") {
        //     if (data["thumbnail"]["path"].length !== 0) {
        //         let imageRef = ref(storage, `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`);
        //         await uploadBytes(imageRef, data["thumbnail"]["path"][0]).then(snapshot => {
        //             data["thumbnail"]["path"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`;
        //             data["thumbnail"]["url"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`;
        //         })
        //     }
        // } else if (data["lastSection"] === "small-goal" || data["lastSection"] === "study-pace") {
        //     if (data["thumbnail"]["path"].length !== 0) {
        //         const imageRef = ref(storage, `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`);
        //         await uploadBytes(imageRef, data["thumbnail"]["path"][0]).then(snapshot => {
        //             data["thumbnail"]["path"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`;
        //             data["thumbnail"]["url"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/thumbnail`;
        //         })
        //     }
        //     await Object.values(data["middleGoals"]).forEach(middleGoal => {
        //         if (middleGoal["thumbnail"]["path"].length !== 0) {
        //             const imageRef = ref(storage, `images/${accountData.getUID()}/Contemporary/${data["id"]}/${middleGoal["id"]}`);
        //             uploadBytes(imageRef, data["thumbnail"]["path"][0]).then(snapshot => {
        //                 data["middleGoals"][middleGoal["id"]]["thumbnail"]["path"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/${middleGoal["id"]}`;
        //                 data["middleGoals"][middleGoal["id"]]["thumbnail"]["url"] = `images/${accountData.getUID()}/Contemporary/${data["id"]}/${middleGoal["id"]}`;
        //             })
        //         }
        //     })
        // }
        // データの登録
        let docRef = doc(db, "ContemporaryRegister", accountData.getUID());
        await setDoc(docRef, data);
    }
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // 入力を保存するオブジェクトの作成
    ////////////////////////////////////////////////////////////////
    const [inputGoalData, setInputGoalData] = useState({
        "id": null,
        "title": null,
        "description": null,
        "durationStart": [null, null, null],
        "durationEnd": [null, null, null],
        "thumbnail": {
            "path": null,
            "storagePath": null,
            "url": noImageURL,
        },
        "delete": {
            "flag": false,
            "date": null,
        },
        "middleGoals": {},
        "studyPace": {
            "dayoff": null,
            "paceOfReLearning": null,
            "reLearningPerWeekFlag": null,
        },
        "uid": accountData.getUID(),
    })
    useEffect(() => {
        // console.log(inputGoalData);
    }, [inputGoalData])
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // change section
    ////////////////////////////////////////////////////////////////
    useEffect(() => {
        if (!props.sectionFlowState === "complete") {
            document.querySelector(".scroll-to-register-page-top").click();
        } else {
            if (props.useModelData) {
                props.setCompleteInputData(getModelData(dateData, goalsData));
            } else {
                props.setCompleteInputData(inputGoalData);
            }
        }
    }, [props.sectionFlowState]);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////
    return (
        <div className={"input-form-box"}>

            <CSSTransition
                in = {isLoadPopMount}
                timeout = {300}
                unmountOnExit
            >
                <LoadDataPopup
                    loadData          = {loadData}
                    cancelLoad        = {cancelLoad}
                />
            </CSSTransition>
            <CSSTransition
                in = {isLoadPopMount}
                timeout = {300}
                unmountOnExit
            >
                <div className="popup-overlay"></div>
            </CSSTransition>

            {props.sectionFlowState === "final-goal"  &&
                <FinalGoalInner
                    inputGoalData={inputGoalData}
                    setInputGoalData={setInputGoalData}
                    setSectionFlowState={props.setSectionFlowState}
                />
            }

            {props.sectionFlowState === "middle-goal" &&
                <MiddleGoalInner
                    inputGoalData={inputGoalData}
                    setInputGoalData={setInputGoalData}
                    setSectionFlowState={props.setSectionFlowState}
                />
            }

            {props.sectionFlowState === "small-goal"  &&
                <SmallGoalInner
                    inputGoalData={inputGoalData}
                    setInputGoalData={setInputGoalData}
                    setSectionFlowState={props.setSectionFlowState}
                />
            }

            {props.sectionFlowState === "study-pace"  &&
                <StudyPaceInner
                    inputGoalData={inputGoalData}
                    setInputGoalData={setInputGoalData}
                    setSectionFlowState={props.setSectionFlowState}
                />
            }

        </div>
    );
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////

}


export { InputFormBox };
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { GoalIDs } from "../GlobalVariable";

class ProgressData {
    constructor(uid, setLoadFlags) {
        this._uid = uid;

        this._collectionRef = null;
        this._documentRef = null;
        this._data = {};
        this._fetchData().then((result) => {
            this._data = result;
            setLoadFlags((prevState) => {
                const update = prevState;
                update["Progress"] = true;
                return {...prevState, ...update};
            })
        })
    }






    ////////////////////////////////////////////////////////////////////////
    // private
    ////////////////////////////////////////////////////////////////////////
    async _fetchData() {
        this._collectionRef = collection(db, "ProgressData");
        this._documentRef = await getDoc(doc(this._collectionRef, this._uid));
        let result = this._documentRef.data();
        if (result === undefined) {
            this._createEmptyCollection();
            result = {};
        }
        return result;
    }
    _createEmptyCollection() {
        const docRef = doc(db, "ProgressData", this._uid);
        setDoc(docRef, {});
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // reload
    ////////////////////////////////////////////////////////////////////////
    reload(setLoadFlags) {
        setLoadFlags((prevState) => {
            prevState["Progress"] = false;
            return {...prevState};
        })
        this._collectionRef = null;
        this._documentRef = null;
        this._fetchData().then((result) => {
            this._data = result;
            setLoadFlags((prevState) => {
                const update = prevState;
                update["Progress"] = true;
                return {...prevState, ...update};
            })
        })
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // get data
    ////////////////////////////////////////////////////////////////////////
    // 取得関数
    getData() {
        return this._data;
    }
    getWeekData(weekString) {
        return this._data[weekString.getStr()];
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // get progress
    ////////////////////////////////////////////////////////////////////////
    getWeekTotalProgress(weekString, goalsData=undefined, finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        const targetWeekData = this.getWeekData(weekString);
        if (targetWeekData === undefined) {
            return 0;
        }
        let result = 0;
        // 全目標が対象
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    result += task["weight"]*task["progress"];
                })
            })
        // 特定の大目標が対象
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"]).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoal["id"]}_${smallGoal["id"]}`);
                })
            })
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    if (targetGoalIDsList.includes(task["id"])) {
                        result += task["weight"]*task["progress"];
                    }
                })
            })
        // 特定の中目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"][middleGoalID.getID()]["smallGoals"]).forEach(smallGoal => {
                targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoal["id"]}`);
            })
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    if (targetGoalIDsList.includes(task["id"])) {
                        result += task["weight"]*task["progress"];
                    }
                })
            })
        // 特定の小目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            Object.values(targetWeekData).forEach(tasksData => {
                const targetTask = tasksData[`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoalID.getID()}`];
                if (targetTask !== undefined) {
                    result += targetTask["weight"]*targetTask["progress"];
                }
            })
        }
        return result;
    }
    getWeekTotalWeight(weekString, goalsData=undefined, finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        const targetWeekData = this.getWeekData(weekString);
        if (targetWeekData === undefined) {
            return 0;
        }
        let result = 0;
        // 全目標が対象
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    result += task["weight"]*task["amount"];
                })
            })
        // 特定の大目標が対象
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"]).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoal["id"]}_${smallGoal["id"]}`);
                })
            })
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    if (targetGoalIDsList.includes(task["id"])) {
                        result += task["weight"]*task["amount"];
                    }
                })
            })
        // 特定の中目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"][middleGoalID.getID()]["smallGoals"]).forEach(smallGoal => {
                targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoal["id"]}`);
            })
            Object.values(targetWeekData).forEach(tasksData => {
                Object.values(tasksData).forEach(task => {
                    if (targetGoalIDsList.includes(task["id"])) {
                        result += task["weight"]*task["amount"];
                    }
                })
            })
        // 特定の小目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            Object.values(targetWeekData).forEach(tasksData => {
                const targetTask = tasksData[`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoalID.getID()}`];
                if (targetTask !== undefined) {
                    result += targetTask["weight"]*targetTask["amount"];
                }
            })
        }
        return result;
    }
    getDateTotalProgress(dateString, dateData, goalsData=undefined, finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        let targetDateData = this.getWeekData(dateString.convertToWeekString(dateData));
        if (targetDateData === undefined) {
            return 0;
        }
        targetDateData = targetDateData[dateString.getStr()];
        let result = 0;
        // 全目標が対象
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(targetDateData).forEach(task => {
                result += task["progress"]*task["weight"];
            })
        // 特定の大目標が対象
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"]).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoal["id"]}_${smallGoal["id"]}`);
                })
            })
            Object.values(targetDateData).forEach(task => {
                if (targetGoalIDsList.includes(task["id"])) {
                    result += task["progress"]*task["weight"];
                }
            })
        // 特定の中目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"][middleGoalID.getID()]["smallGoals"]).forEach(smallGoal => {
                targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoal["id"]}`);
            })
            Object.values(targetDateData).forEach(task => {
                if (targetGoalIDsList.includes(task["id"])) {
                    result += task["progress"]*task["weight"];
                }
            })
        // 特定の小目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            const targetTask = targetDateData[`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoalID.getID()}`];
            if (targetTask !== undefined) {
                result += targetTask["progress"]*targetTask["weight"];
            }
        }
        return result;
    }
    getDateTotalWeight(dateString, dateData, goalsData=undefined, finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        let targetDateData = this.getWeekData(dateString.convertToWeekString(dateData));
        if (targetDateData === undefined) {
            return 0;
        }
        targetDateData = targetDateData[dateString.getStr()];
        let result = 0;
        // 全目標が対象
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(targetDateData).forEach(task => {
                result += task["weight"]*task["amount"];
            })
        // 特定の大目標が対象
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"]).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoal["id"]}_${smallGoal["id"]}`);
                })
            })
            Object.values(targetDateData).forEach(task => {
                if (targetGoalIDsList.includes(task["id"])) {
                    result += task["weight"]*task["amount"];
                }
            })
        // 特定の中目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            const targetGoalIDsList = [];
            Object.values(goalsData[finalGoalID.getID()]["middleGoals"][middleGoalID.getID()]["smallGoals"]).forEach(smallGoal => {
                targetGoalIDsList.push(`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoal["id"]}`);
            })
            Object.values(targetDateData).forEach(task => {
                if (targetGoalIDsList.includes(task["id"])) {
                    result += task["weight"]*task["amount"];
                }
            })
        // 特定の小目標が対象
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            const targetTask = targetDateData[`${finalGoalID.getID()}_${middleGoalID.getID()}_${smallGoalID.getID()}`];
            if (targetTask !== undefined) {
                result += targetTask["weight"]*targetTask["amount"];
            }
        }
        return result;
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // delete progress
    ////////////////////////////////////////////////////////////////////////
    async deleteData(finalGoalID, middleGoalID, smallGoalID) {
        const newData = {...this._data};
        const targetGoalIDs = new GoalIDs(undefined, finalGoalID, middleGoalID, smallGoalID);
        await Object.values(this._data).forEach(weekDict => {
            Object.values(weekDict).forEach(dateDict => {
                Object.keys(dateDict).forEach(goalIDs => {
                    if (goalIDs !== undefined && targetGoalIDs.include(new GoalIDs(goalIDs))) {
                        delete dateDict[goalIDs];
                    }
                })
            })
        })
        this._data = {...newData};
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
}

export default ProgressData;
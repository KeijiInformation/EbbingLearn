import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { db } from "../firebase";
import { DateString, GoalID, TaskVariables } from "../GlobalVariable";



class GoalsData {
    constructor(uid, setLoadFlags) {
        this._uid = uid;

        this._collectionRef = undefined;
        this._data = {};
        this._fetchedData = {};
        this._fetch().then((result) => {
            this._fetchedData = result;
            this._loadThumbnail(result).then(loadedData => {
                this._data = loadedData;
                setLoadFlags((prevState) => {
                    const update = prevState;
                    update["Goals"] = true;
                    return {...prevState, ...update};
                })
            })
        });
    }





    /////////////////////////////////////////////////////////////
    // private
    /////////////////////////////////////////////////////////////
    async _fetch() {
        let result = {};
        this._collectionRef = collection(db, "Goals");
        const q = query(this._collectionRef, where("uid", "==", this._uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(doc => {
            result[doc.data()["id"]] = doc.data();
        })
        return result;
    }
    async _loadThumbnail(fetchData) {
        const storage = getStorage();
        this._noImageURL = await getDownloadURL(ref(storage, "images/noImage.png"));
        Object.values(fetchData).forEach(finalGoal => {
            if (finalGoal["thumbnail"] === "images/noImage.png") {
                fetchData[finalGoal["id"]]["thumbnail"] = this._noImageURL;
            } else {
                getDownloadURL(ref(storage, finalGoal["thumbnail"])).then(url => {
                    fetchData[finalGoal["id"]]["thumbnail"] = url;
                });
            }
            Object.values(finalGoal["middleGoals"]).forEach(middleGoal => {
                if (middleGoal["thumbnail"] === "images/noImage.png") {
                    fetchData[finalGoal["id"]]["middleGoals"][middleGoal["id"]]["thumbnail"] = this._noImageURL;
                } else {
                    getDownloadURL(ref(storage, middleGoal["thumbnail"])).then(url => {
                        fetchData[finalGoal["id"]]["middleGoals"][middleGoal["id"]]["thumbnail"] = url;
                    });
                }
            })
        })
        return fetchData;
    }
    _sortGoalsArr(goalsArr) {
        if (goalsArr.length !== 0) {
            goalsArr.sort((a, b) => {
                const goalIDObject = new GoalID(a["id"]);
                return goalIDObject.compareTo(new GoalID(b["id"]));
            })

        }
        return goalsArr;
    }
    _getFinalGoal(finalGoalID) {
        return this._data[finalGoalID.getID()];
    }
    _getMiddleGoal(finalGoalID, middleGoalID) {
        return this._getFinalGoal(finalGoalID)["middleGoals"][middleGoalID.getID()];
    }
    _getSmallGoal(finalGoalID, middleGoalID, smallGoalID) {
        return this._getMiddleGoal(finalGoalID, middleGoalID)["smallGoals"][smallGoalID.getID()];
    }
    async _deleteThumbnail(thumbnailPath) {
        if (thumbnailPath !== "images/noImage.png") {
            const storageRef = getStorage();
            const imageRef = ref(storageRef, thumbnailPath);
            await deleteObject(imageRef);
            return;
        }
        return;
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // reload
    /////////////////////////////////////////////////////////////
    reload(setLoadFlags) {
        setLoadFlags(prevState => {
            prevState["Goals"] = false;
            return {...prevState};
        })
        this._fetch().then((result) => {
            this._loadThumbnail(result).then((loadedData) => {
                this._data = loadedData;
                setLoadFlags((prevState) => {
                    const update = prevState;
                    update["Goals"] = true;
                    return {...prevState, ...update};
                })
            })
        });
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // get goal
    /////////////////////////////////////////////////////////////
    getGoal(finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        if (finalGoalID !== undefined) {
            if (middleGoalID !== undefined) {
                if (smallGoalID !== undefined) {
                    return this._getSmallGoal(finalGoalID, middleGoalID, smallGoalID);
                }
                return this._getMiddleGoal(finalGoalID, middleGoalID);
            }
            return this._getFinalGoal(finalGoalID);
        }
        return this._data;
    }
    getGoals(finalGoalID=undefined, middleGoalID=undefined) {
        const result = this.getGoal(finalGoalID, middleGoalID);
        if (finalGoalID !== undefined) {
            if (middleGoalID !== undefined) {
                return result["smallGoals"];
            }
            return result["middleGoals"];
        }
        return result;
    }
    getSortedArray(finalGoalID=undefined, middleGoalID=undefined) {
        let resultArr = Object.values(this.getGoals(finalGoalID, middleGoalID));
        resultArr = this._sortGoalsArr(resultArr);
        return resultArr;
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // convert inputGoalData
    /////////////////////////////////////////////////////////////
    convertToInputGoalData() {
        
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // get id
    /////////////////////////////////////////////////////////////
    getMaxID(finalGoalID=undefined, middleGoalID=undefined) {
        const goalsDataArr = Object.values(this.getGoals(finalGoalID, middleGoalID));
        let maxID = "";
        if (finalGoalID !== undefined) {
            if (middleGoalID !== undefined) {
                maxID = new GoalID("small0");
            }
            maxID = new GoalID("middle0");
        }
        maxID = new GoalID("final0");
        goalsDataArr.forEach(goal => {
            let targetGoalID = new GoalID(goal["id"])
            if (maxID.compareTo(targetGoalID) === -1) {
                maxID = targetGoalID;
            }
        })
        return maxID;
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // cram goals
    /////////////////////////////////////////////////////////////
    async cram() {
        const goalsArr = this.getSortedArray();
        for (let i=1; i<=goalsArr.length; i++) {
            const finalGoal = goalsArr[i-1];
            if (new GoalID(finalGoal["id"]).getIDVal() !== i) {
                const prevID = finalGoal["id"];
                this._data[finalGoal["id"]] = "final" + i;
                await setDoc(this._collectionRef, `${this._uid}_${prevID}`, finalGoal);
            }
        }
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // delete
    /////////////////////////////////////////////////////////////
    setDeleteFlag(flag, finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        let today = new DateString();
        today.generateFromToday();
        if        (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            if (flag) {
                this._data[finalGoalID]["delete"]["flag"] = true;
                this._data[finalGoalID]["delete"]["date"] = today.getStr();
            } else {
                this._data[finalGoalID]["delete"]["flag"] = false;
                this._data[finalGoalID]["delete"]["date"] = null;
            }
            Object.keys(this._data[finalGoalID]["middleGoals"]).forEach(middleGoalIDElem => {
                if (flag) {
                    this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["delete"]["flag"] = true;
                    this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["delete"]["date"] = today.getStr();
                } else {
                    this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["delete"]["flag"] = false;
                    this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["delete"]["date"] = null;
                }
                Object.keys(this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["smallGoals"]).forEach(smallGoalIDElem => {
                    if (flag) {
                        this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["smallGoals"][smallGoalIDElem]["delete"]["flag"] = true;
                        this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["smallGoals"][smallGoalIDElem]["delete"]["date"] = today.getStr();
                    } else {
                        this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["smallGoals"][smallGoalIDElem]["delete"]["flag"] = false;
                        this._data[finalGoalID]["middleGoals"][middleGoalIDElem]["smallGoals"][smallGoalIDElem]["delete"]["date"] = null;
                    }
                })
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            if (flag) {
                this._data[finalGoalID]["middleGoals"][middleGoalID]["delete"]["flag"] = true;
                this._data[finalGoalID]["middleGoals"][middleGoalID]["delete"]["date"] = today.getStr();
            } else {
                this._data[finalGoalID]["middleGoals"][middleGoalID]["delete"]["flag"] = false;
                this._data[finalGoalID]["middleGoals"][middleGoalID]["delete"]["date"] = null;
            }
            Object.keys(this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"]).forEach(smallGoalIDElem => {
                if (flag) {
                    this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalIDElem]["delete"]["flag"] = true;
                    this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalIDElem]["delete"]["date"] = today.getStr();
                } else {
                    this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalIDElem]["delete"]["flag"] = false;
                    this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalIDElem]["delete"]["date"] = null;
                }
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            if (flag) {
                this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalID]["delete"]["flag"] = true;
                this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalID]["delete"]["date"] = today.getStr();
            } else {
                this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalID]["delete"]["flag"] = false;
                this._data[finalGoalID]["middleGoals"][middleGoalID]["smallGoals"][smallGoalID]["delete"]["date"] = null;
            }
        }
        const docRef = doc(db, "Goals", `${this._uid}_${finalGoalID}`);
        setDoc(docRef, this._data[finalGoalID]);
    }
    async delete(progressData) {
        let pastDay = new DateString();
        pastDay.generateFromToday();
        pastDay.addDay(-30);
        const goalsArr = this.getSortedArray();
        for (let i=0; i<goalsArr.length; i++) {
            const finalGoal = goalsArr[i];
            if (finalGoal["delete"]["flag"] === true && pastDay.compareTo(new DateString(finalGoal["delete"]["date"])) >= 0) {
                // delete thumbnail
                this._deleteThumbnail(this._fetchedData["thumbnail"]);
                // delete progress
                progressData.deleteData(finalGoal["id"]);
                // delete doc
                await deleteDoc(doc(db, "Goals", `${this._uid}_${finalGoal["id"]}`));
            } else {
                await Object.values(finalGoal["middleGoals"]).forEach(middleGoal => {
                    if (middleGoal["delete"]["flag"] && pastDay.compareTo(new DateString(middleGoal["delete"]["date"])) >= 0) {
                        // delete thumbnail
                        this._deleteThumbnail(this._fetchedData[finalGoal["id"]]["middleGoals"][middleGoal["id"]]["thumbnail"]);
                        // delete progress
                        progressData.deleteData(finalGoal["id"], middleGoal["id"]);
                        // delete doc
                        delete this._data[finalGoal["id"]]["middleGoals"][middleGoal["id"]];
                    } else {
                        Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                            if (smallGoal["delete"]["flag"] && pastDay.compareTo(new DateString(smallGoal["delete"]["date"])) >= 0) {
                                // delete progress
                                progressData.deleteData(finalGoal["id"], middleGoal["id"], smallGoal["id"]);
                                // delete doc
                                delete this._data[finalGoal["id"]]["middleGoals"][middleGoal["id"]]["smallGoals"][smallGoal["id"]];
                            }
                        })
                    }
                })
                const docRef = doc(db, "Goals", `${this._uid}_${finalGoal["id"]}`);
                setDoc(docRef, finalGoal);
            }
        }
        const docRef = doc(db, "ProgressData", this._uid);
        setDoc(docRef, progressData.getData());
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // get progress
    /////////////////////////////////////////////////////////////
    getTotalProgress(finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        const goalData = this.getGoals(finalGoalID, middleGoalID);
        let result = 0;
        let taskVariables = new TaskVariables();
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(finalGoal => {
                Object.values(finalGoal["middleGoals"]).forEach(middleGoal => {
                    Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                        result += smallGoal["progress"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
                    })
                })
            })
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    result += smallGoal["progress"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
                })
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(smallGoal => {
                result += smallGoal["progress"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            const smallGoal = goalData[smallGoalID.getID()];
            result += smallGoal["progress"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
        }
        return result;
    }
    getTotalWeight(finalGoalID=undefined, middleGoalID=undefined, smallGoalID=undefined) {
        const goalData = this.getGoals(finalGoalID, middleGoalID);
        let result = 0;
        let taskVariables = new TaskVariables();
        if        (finalGoalID === undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(finalGoal => {
                Object.values(finalGoal["middleGoals"]).forEach(middleGoal => {
                    Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                        result += smallGoal["amount"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
                    })
                })
            })
        } else if (finalGoalID !== undefined && middleGoalID === undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(middleGoal => {
                Object.values(middleGoal["smallGoals"]).forEach(smallGoal => {
                    result += smallGoal["amount"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
                })
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID === undefined) {
            Object.values(goalData).forEach(smallGoal => {
                result += smallGoal["amount"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
            })
        } else if (finalGoalID !== undefined && middleGoalID !== undefined && smallGoalID !== undefined) {
            const smallGoal = goalData[smallGoalID.getID()];
            result += smallGoal["amount"]*taskVariables.getWeight(smallGoal["genre"], smallGoal["unit"]);
        }
        return result;
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////
    // sort
    /////////////////////////////////////////////////////////////
    createSortedArray(goalsDataDict) {
        let resultArr = Object.values(goalsDataDict);
        resultArr = this._sortGoalsArr(resultArr);
        return resultArr;
    }
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////
}



export default GoalsData;
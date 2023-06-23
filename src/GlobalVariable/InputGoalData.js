import DateString from "./DateString";
import GoalID from "./GoalID";



//////////////////////////////////////////////////////////////////////////
// final goal
//////////////////////////////////////////////////////////////////////////
class FinalGoal {
    constructor(finalGoalID, title, description, durationStart, durationEnd, thumbnailFile, thumbnailPath, thumbnailURL) {
        this.id            = finalGoalID;
        this.title         = title;
        this.description   = description;
        this.durationStart = durationStart;
        this.durationEnd   = durationEnd;
        this.thumbnail     = {"file": thumbnailFile, "path": thumbnailPath, "url": thumbnailURL};
        this.middleGoals   = [];
    }
    getID() {
        return this.id;
    }
    getMiddleGoals() {
        return this.middleGoals;
    }
    getMiddleGoal(middleGoalID) {
        return this.middleGoals.find((middleGoal) => {return middleGoal.getID() === middleGoalID});
    }
    addMiddleGoal(middleGoalData) {
        this.middleGoals.push(middleGoalData);
    }
    isComplete() {
        return !(Object.values(this).includes(undefined) || this.thumbnail.path === undefined);
    }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////
// middle goal
//////////////////////////////////////////////////////////////////////////
class MiddleGoal {
    constructor(finalGoalID, id, title, duration, thumbnailFile, thumbnailPath, thumbnailURL) {
        this.finalGoalID = finalGoalID;
        this.id          = id;
        this.title       = title;
        this.duration    = duration;
        this.thumbnail   = {"file": thumbnailFile, "path": thumbnailPath, "url": thumbnailURL};
        this.smallGoals  = [];
    }
    getID() {
        return this.id;
    }
    getSmallGoals() {
        return this.smallGoals;
    }
    getSmallGoal(smallGoalID) {
        return this.smallGoals.find((smallGoal) => {return smallGoal.getID() === smallGoalID});
    }
    addSmallGoal(smallGoalData) {
        this.smallGoals.push(smallGoalData);
    }
    isComplete() {
        return !(Object.values(this).includes(undefined) || this.thumbnail.path === undefined);
    }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////
// small goal
//////////////////////////////////////////////////////////////////////////
class SmallGoal {
    constructor(middleGoalID, id, title, duration=[], reLearningFlag, genre, amount, unit) {
        this.middleGoalID   = middleGoalID;
        this.id             = id;
        this.title          = title;
        this.duration       = duration;
        this.reLearningFlag = reLearningFlag;
        this.genre          = genre;
        this.amount         = amount;
        this.unit           = unit;
    }
    isComplete() {
        return !Object.values(this).includes(undefined);
    }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////
// study pace
//////////////////////////////////////////////////////////////////////////
class StudyPace {
    constructor(dayoff, paceOfReLearning, reLearningPerWeekFlag) {
        this.dayoff                = dayoff;
        this.paceOfReLearning      = paceOfReLearning;
        this.reLearningPerWeekFlag = reLearningPerWeekFlag;
    }
    isComplete() {
        return !Object.values(this).includes(undefined);
    }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////






//////////////////////////////////////////////////////////////////////////
// input goal data
//////////////////////////////////////////////////////////////////////////
class InputGoalData {
    constructor() {
        this.inputGoalData = undefined;
        this.inputStudyPaceData = undefined;
    }

    addFinalGoal(id, title, description, durationStart, durationEnd, thumbnailFile, thumbnailPath, thumbnailURL) {
        const data = new FinalGoal(
            id,
            title,
            description,
            durationStart,
            durationEnd,
            thumbnailFile,
            thumbnailPath,
            thumbnailURL
        )
        this.inputGoalData = data;
        return id;
    }

    addMiddleGoal(thumbnailFile, thumbnailPath, thumbnailURL, title, duration=[]) {
        const targetID = new GoalID(`middle${this.finalGoalData.getMiddleGoals().length+1}`);
        const data = new MiddleGoal(
            this.finalGoalData.getID(),
            targetID,
            title,
            duration,
            thumbnailFile,
            thumbnailPath,
            thumbnailURL
        );
        this.finalGoalData.addMiddleGoal(data);
        return targetID;
    }

    addSmallGoal(middleGoalID, title, duration=[], reLearningFlag, genre, amount, unit) {
        const middleGoal = this.finalGoalData.getMiddleGoal(middleGoalID);
        const targetID   = `small${middleGoal.getSmallGoals.length+1}`;
        const data       = new SmallGoal(
            middleGoal.getID(),
            targetID,
            title,
            duration,
            reLearningFlag,
            genre,
            amount,
            unit
        )
        middleGoal.addSmallGoal(data);
        return targetID;
    }

    addStudyPace(dayoff, paceOfReLearning, reLearningPerWeekFlag) {
        this.inputStudyPaceData = new StudyPace(dayoff, paceOfReLearning, reLearningPerWeekFlag);
    }

    isComplete() {
        let result = true;
        result = this.inputGoalData.isComplete();
        this.inputGoalData.getMiddleGoals().forEach(middleGoal => {
            if (!middleGoal.isComplete()) {
                result = false;
            }
            middleGoal.getSmallGoals().forEach(smallGoal => {
                if (!smallGoal.isComplete()) {
                    result = false;
                }
            })
        })
        if (!this.inputStudyPaceData.isComplete()) {
            result = false;
        }
        return result;
    }

    createContemporaryData() {
        
    }

    createCompleteData(uid) {
        if (!this.isComplete()) {
            return undefined;
        }
        const today = new DateString();
        today.generateFromToday();
        const finalGoal = this.inputGoalData;
        const result = {
            "id": finalGoal.id,
            "title": finalGoal.title,
            "description": finalGoal.description,
            "durationStart": finalGoal.durationStart,
            "durationEnd": finalGoal.durationEnd,
            "thumbnail": finalGoal.thumbnail,
            "uid": uid,
            "timeStamp": today.convertToArray(),
            "delete": {flag: false, date: null},
            "studyPace": {
                "dayoff": this.inputStudyPaceData.dayoff,
                "paceOfReLearning": this.inputStudyPaceData.paceOfReLearning,
                "reLearningPerWeekFlag": this.inputStudyPaceData.reLearningPerWeekFlag
            },
            "middleGoals": {}
        };
        this.inputGoalData.getMiddleGoals().forEach(middleGoal => {
            result["middleGoals"][middleGoal.id] = {
                "finalGoalID": finalGoal.id,
                "id": middleGoal.id,
                "title": middleGoal.title,
                "duration": middleGoal.duration,
                "thumbnail": middleGoal.thumbnail,
                "delete": {
                    "flag": false,
                    "date": null,
                },
                "smallGoals": {},
            }
            middleGoal.getSmallGoals.forEach(smallGoal => {
                result["middleGoals"][middleGoal.id]["smallGoals"][smallGoal.id] = {
                    "middleGoalID": middleGoal.id,
                    "id": smallGoal.id,
                    "title": smallGoal.title,
                    "genre": smallGoal.genre,
                    "amount": smallGoal.amount,
                    "unit": smallGoal.unit,
                    "reLearningFlag": smallGoal.reLearningFlag,
                    "duration": smallGoal.duration,
                    "progress": 0,
                    "done": false,
                    "delete": {
                        "flag": false,
                        "date": null
                    },
                }
            })
        })
        return result;
    }
}
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////



export default InputGoalData;
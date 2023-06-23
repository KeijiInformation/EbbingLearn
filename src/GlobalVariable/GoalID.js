class GoalID {
    constructor(goalID) {
        this._id        = goalID;
        const arr       = this._convertToArray(this._id);
        this._goalGenre = arr[0];
        this._idVal     = arr[1];
    }






    //////////////////////////////////////////////////
    // private
    //////////////////////////////////////////////////
    _convertToArray(id) {
        const result = ["", -1];
        if        (id.split("final" ).length === 2) {
            result[0] = "final";
            result[1] = Number(id.split("final")[1]);
        } else if (id.split("middle").length === 2) {
            result[0] = "middle";
            result[1] = Number(id.split("middle")[1]);
        } else if (id.split("small" ).length === 2) {
            result[0] = "small";
            result[1] = Number(id.split("small")[1]);
        } else {
            console.log(`GoalID.js>GoalID>_convertToArray: goalIDの値が不適切です。(${id})`);
        }
        return result;
    }






    //////////////////////////////////////////////////
    // set
    //////////////////////////////////////////////////
    set(goalID) {
        this._id = goalID;
        const arr = this._convertToArray(this._id);
        this._goalGenre = arr[0];
        this._idVal = arr[1];
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////






    //////////////////////////////////////////////////
    // get
    //////////////////////////////////////////////////
    getID() {
        return this._id;
    }
    getGoalGenre() {
        return this._goalGenre;
    }
    getIDVal() {
        return this._idVal;
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////






    //////////////////////////////////////////////////
    // calc
    //////////////////////////////////////////////////
    add(adder) {
        this._idVal += adder;
        if (this._idVal < 0) {
            this._idVal = 0;
        }
        this._id = this._goalGenre + String(this._idVal);
    }
    getDifference(goalID) {
        return this.getIDVal() - goalID.getIDVal();
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////






    //////////////////////////////////////////////////
    // compare
    //////////////////////////////////////////////////
    compareTo(goalIDObject) {     // targetより大きければ1, 等しければ0, 小さければ-1を返す
        if (this._goalGenre !== goalIDObject.getGoalGenre()) {
            console.log(`GoalID.js>GoalID>conpareTo: 異なる目標種同士の比較が行われています。(${this._id}, ${goalIDObject.getID()})`);
            return -2;
        }
        const targetIDVal = goalIDObject.getIDVal();
        if        (this._idVal  < targetIDVal) {
            return -1;
        } else if (this._idVal === targetIDVal) {
            return 0;
        } else {
            return 1;
        }
    }
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
    //////////////////////////////////////////////////
}



export default GoalID;
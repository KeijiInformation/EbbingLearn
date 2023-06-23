import DateString from "./DateString";



class WeekString {
    constructor(weekStr = "") {
        this.weekStr = weekStr;
    }






    /////////////////////////////////////////////////////////////////////////
    // private
    /////////////////////////////////////////////////////////////////////////
    _isSet() {
        if (this.weekStr === "") {
            console.log("weekStringが未設定です。");
            return false;
        } else {
            return true;
        }
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // set, get
    /////////////////////////////////////////////////////////////////////////
    set(weekStr) {
        this.weekStr = weekStr;
    }
    generateFromDate(year, month, day, dateData) {
        const dateString = new DateString();
        dateString.generateFromDate(year, month, day);
        this.weekStr = dateData.getWeekStringFromDateString(dateString).getStr();
    }
    generateFromToday(dateData) {
        const todayString = new DateString();
        todayString.generateFromToday();
        this.weekStr = dateData.getWeekStringFromDateString(todayString).getStr();
    }
    // 週初めの日付をDateString形式で返す
    convertToArray() {
        if (this._isSet()) {
            const result = this.weekStr.split("-");
            return [Number(result[0]), Number(result[1]), Number(result[2])];
        }
        return null;
    }
    convertToDateStringList(dateData) {
        if (this._isSet()) {
            return dateData.getDateStringListFromWeekString(this);
        }
        return null;
    }
    createWeekString(dateData, YearAdder=0, monthAdder=0, weekAdder=0) {
        const result = new WeekString(this.weekStr);
        result.addYear(YearAdder);
        result.addMonth(monthAdder);
        result.addWeek(weekAdder, dateData);
        return result;
    }
    getStr() {
        return this.weekStr;
    }
    getYear() {
        return this.convertToArray()[0];
    }
    getMonth() {
        return this.convertToArray()[1];
    }
    getWeek() {
        return this.convertToArray()[2];
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // judge
    /////////////////////////////////////////////////////////////////////////
    compareTo(weekString) {     // 引数より大きければ1, 等しければ0, 小さければ-1 を返す
        let origin = this.convertToArray();
        let target = weekString.convertToArray();
        if        (origin[0] > target[0]) {
            return 1;
        } else if (origin[0] < target[0]) {
            return -1;
        } else {
            if        (origin[1] > target[1]) {
                return 1;
            } else if (origin[1] < target[1]) {
                return -1;
            } else {
                if        (origin[2] > target[2]) {
                    return 1;
                } else if (origin[2] < target[2]) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////////
    // calc
    /////////////////////////////////////////////////////////////////////////
    addYear(adder) {
        let weekArray = this.convertToArray();
        weekArray[0] += adder;
        this.set(`${weekArray[0]}-${weekArray[1]}-${weekArray[2]}`);
    }
    addMonth(adder) {
        let weekArray = this.convertToArray();
        let inclement;
        if (adder >= 0) {
            inclement = 1
        } else {
            inclement = -1;
            adder     = -adder;
        }
        for (let i=0; i<adder; i++) {
            weekArray[1] += inclement;
            if        (weekArray[1] > 12) {
                this.addYear(1);
                weekArray[0] = this.getYear();
                weekArray[1] = 1;
            } else if (weekArray[1] <= 0) {
                this.addYear(-1);
                weekArray[0] = this.getYear();
                weekArray[1] = 12;
            }
        }
        this.set(`${this.getYear()}-${weekArray[1]}-${weekArray[2]}`)
    }
    addWeek(adder, dateData) {
        let weekArray = this.convertToArray();
        if (adder >= 0) {
            for (let i=0; i<adder; i++) {
                weekArray[2]++;
                if (!dateData.isExistWeekStr(`${weekArray[0]}-${weekArray[1]}-${weekArray[2]}`)) {
                    this.addMonth(1);
                    weekArray[0] = this.getYear();
                    weekArray[1] = this.getMonth();
                    weekArray[2] = 1;
                }
            }
        } else {
            for (let i=0; i<-adder; i++) {
                weekArray[2]--;
                while (!dateData.isExistWeekStr(`${weekArray[0]}-${weekArray[1]}-${weekArray[2]}`)) {
                    if (weekArray[2] <= 0) {
                        this.addMonth(-1);
                        weekArray[0] = this.getYear();
                        weekArray[1] = this.getMonth();
                        weekArray[2] = 5;
                    } else {
                        weekArray[2]--;
                    }
                }
            }
        }
        this.set(`${this.convertToArray()[0]}-${this.convertToArray()[1]}-${weekArray[2]}`);
    }
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
}



export default WeekString;
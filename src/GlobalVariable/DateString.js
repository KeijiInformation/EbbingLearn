class DateString {
    constructor(dateStr = "") {
        this.dateStr = dateStr;
    }






    ////////////////////////////////////////////////////////////
    // private
    ////////////////////////////////////////////////////////////
    _isSet() {
        if (this.dateStr === "") {
            console.log("dateStringが未設定です。")
            return false;
        } else {
            return true;
        }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    //public
    ////////////////////////////////////////////////////////////
    // set
    set(dateStr) {
        this.dateStr = dateStr;
    }
    generateFromDate(year, month, day) {
        this.dateStr = `${year}/${month}/${day}`;
    }
    generateFromToday() {
        let todate = new Date();
        this.set(`${todate.getFullYear()}/${todate.getMonth()+1}/${todate.getDate()}`);
    }

    // convert
    convertToWeekString(dateData) {
        let result = dateData.getWeekStringFromDateString(this);
        return result;
    }
    convertToArray() {
        if (this._isSet()) {
            let result = this.dateStr.split("/");
            return [Number(result[0]), Number(result[1]), Number(result[2])];
        }
        return null;
    }

    // get
    getStr() {
        return this.dateStr;
    }
    getYear() {
        return this.convertToArray()[0];
    }
    getMonth() {
        return this.convertToArray()[1];
    }
    getDay() {
        return this.convertToArray()[2];
    }
    getDateString(adder) {
        let onDate = new Date(this.getStr());
        let result = new DateString();
        onDate.setDate(onDate.getDate() + adder);
        result.generateFromDate(onDate.getFullYear(), onDate.getMonth()+1, onDate.getDate());
        return result;
    }
    getDayOfWeek() {
        const dateObj = new Date(this.getStr());
        return ["日", "月", "火", "水", "木", "金", "土"][dateObj.getDay()];
    }

    // calc
    addYear(adder) {
        let dateArray = this.convertToArray();
        dateArray[0] += adder;
        this.set(`${dateArray[0]}/${dateArray[1]}/${dateArray[2]}`);
    }
    addMonth(adder) {
        let dateArray = this.convertToArray();
        dateArray[1] += adder;
        if (dateArray[1] > 12) {
            adder = dateArray[1] - 12;
            let yearAdder = 0;
            while (adder > 0) {
                dateArray[1] = adder;
                adder = dateArray[1] - 12;
                yearAdder++;
            }
            this.addYear(yearAdder);
        }
        this.set(`${this.convertToArray()[0]}-${dateArray[1]}-${dateArray[2]}`);
    }
    addDay(adder) {
        let dateObj = new Date(this.getStr());
        dateObj.setDate(dateObj.getDate()+adder);
        this.set(`${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`);
    }

    // judge
    compareTo(dateString) {     // 引数より大きければ1, 等しければ0, 小さければ-1 を返す
        let origin = this.convertToArray();
        let target = dateString.convertToArray();
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
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
}



export default DateString;
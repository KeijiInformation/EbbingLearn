import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { existInDict } from "../functions/useful";
import DateString from "./DateString";
import WeekString from "./WeekString";


class DateData {
    constructor() {
        this._collectionRef = null;
        this.admin = {};
        this.dateData = {};
        this._fetchData().then(() => {
            // DBの更新
            if (this._isNeedUpdate()) {
                let updateDict = this._createNewDates();
                Object.keys(updateDict).forEach(key => {
                    let documentRef = doc(this._collectionRef, key);
                    setDoc(documentRef, updateDict[key]);
                })
            }
        })
    }






    //////////////////////////////////////////////////////////////////
    // private
    //////////////////////////////////////////////////////////////////
    // データの取得
    async _fetchData() {
        this._collectionRef = collection(db, "DateAndWeekData");

        const snapShot = await getDocs(this._collectionRef);
        await snapShot.docs.forEach(doc => {
            if (doc.id !== "dateDataAdmin") {
                this.dateData[doc.id] = doc.data();
            }
        })
        const adminData = await getDoc(doc(this._collectionRef, "dateDataAdmin"));
        this.admin = adminData.data();
        return 0;
    }
    // データ更新(startからendを見てweekStringを割り当てる関数)
    _assignWeekString(weekDateStrings, onWeekString) {
        let result = new WeekString();
        let startDateString = weekDateStrings[0], endDateString = weekDateStrings[6];
        if (startDateString.getMonth() !== endDateString.getMonth()) {
            let thisMonth = startDateString.getMonth(), nextMonth = endDateString.getMonth();
            let numOfThisMonth = 0, numOfNextMonth = 0;
            weekDateStrings.forEach(dateString => {
                switch (dateString.getMonth()) {
                    case thisMonth:
                        numOfThisMonth++;
                        break;
                    case nextMonth:
                        numOfNextMonth++;
                        break;
                    default:
                        break;
                }
            })
            if (numOfThisMonth >= numOfNextMonth) {
                result.set(`${onWeekString.getYear()}-${onWeekString.getMonth()}-${onWeekString.getWeek()+1}`);
                return result;
            } else {
                onWeekString.addMonth(1);
                result.set(`${onWeekString.getYear()}-${onWeekString.getMonth()}-1`);
                return result;
            }
        } else {
            // 2022-3-5かつstartが2022/4/3とかの場合の処理(2022-4-1にする必要がある)
            if (onWeekString.getMonth() !== startDateString.getMonth()) {
                onWeekString.addMonth(1);
                result.set(`${onWeekString.getYear()}-${onWeekString.getMonth()}-1`);
            } else {
                result.set(`${onWeekString.getYear()}-${onWeekString.getMonth()}-${onWeekString.getWeek()+1}`);
            }
            return result;
        }
    }
    // データ更新(更新の必要性を判定)
    _isNeedUpdate() {
        let today = new DateString();
        today.generateFromToday();
        if (this.admin["update"] === today.getYear()) {
            return false;
        } else {
            return true;
        }
    }
    // データ更新(40年後までのDateAndWeekDataのCollectionDataを作成する)
    _createNewDates() {
        // 結果オブジェクトのひな形を作成
        const resultDict = {};
        let startYear = new WeekString(this.admin["remainder"][1]).getYear();
        let today = new DateString();
        today.generateFromToday();
        let endYear = today.getYear() + 40;
        for (let i=startYear; i<=endYear+1; i++) {      // (endの1つ後の年の1月1週目までを作成)
            resultDict[i] = {};
        }

        // 前回更新時の最終日情報を取得
        let lastUpdateDateString = new DateString(this.admin["remainder"][0]);
        let lastUpdateWeekString = new WeekString(this.admin["remainder"][1]);

        // ループ開始
        let onYear = startYear;
        let onDateString = lastUpdateDateString.getDateString(1);
        let onWeekString = new WeekString(`${lastUpdateWeekString.getYear()}-${lastUpdateWeekString.getMonth()}-${lastUpdateWeekString.getWeek()}`);
        let weekDateStrings = [];
        // 年単位のループ
        while (onYear <= endYear) {
            // 週単位のループ
            while (onDateString.getYear() === onYear) {
                for (let i=0; i<7; i++) {
                    weekDateStrings.push(onDateString);
                    onDateString = onDateString.getDateString(1);
                }
                onWeekString = this._assignWeekString(weekDateStrings, onWeekString);
                if (onWeekString.getYear() !== onYear) {
                    weekDateStrings.forEach(dateString => {
                        resultDict[onYear+1][dateString.getStr()] = onWeekString.getStr();
                    })
                } else {
                    weekDateStrings.forEach(dateString => {
                        resultDict[onYear][dateString.getStr()] = onWeekString.getStr();
                    })
                }
                weekDateStrings = [];
            }
            onYear++;
        }
        // 前回登録時の最終年の1月初週のデータを統合
        resultDict[startYear] = {...resultDict[startYear], ...this.dateData[startYear]};
        // adminDataの作成
        onDateString.addDay(-1);
        resultDict["dateDataAdmin"] = {
            "remainder": [new DateString(onDateString.getStr()).getStr(), new WeekString(onWeekString.getStr()).getStr()],
            "update": today.getYear(),
        }
        return resultDict;
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // public
    //////////////////////////////////////////////////////////////////
    // 登録されているなかで最も未来のWeekStringを取得する関数
    getWeekStringFromMostFar() {
        return new WeekString(this.admin["remainder"][1]);
    }
    // 登録されているなかで最も未来のDateStringを取得する関数
    getDateStringFromMostFar() {
        return new DateString(this.admin["remainder"][0]);
    }
    // 日付からWeekStringオブジェクトを作成し返す関数
    getWeekStringFromDateString(dateString) {
        const result = new WeekString();
        const dateArray = dateString.convertToArray();
        const targetYear = [];
        // 1月であれば去年と今年が捜索対象
        if        (dateArray[1] === 1) {
            targetYear[0] = String(dateArray[0]-1);
            targetYear[1] = String(dateArray[0]  );
        // 12月であれば今年と来年が捜索対象
        } else if (dateArray[1] === 12) {
            targetYear[0] = String(dateArray[0]  );
            targetYear[1] = String(dateArray[0]+1);
        // その年が捜索対象
        } else {
            targetYear[0] = String(dateArray[0]);
        }
        targetYear.forEach(year => {
            if (existInDict(this.dateData[year], dateString.getStr())) {
                result.set(this.dateData[year][dateString.getStr()]);
            }
        })
        return result;
    }
    // WeekStringオブジェクトからDateStringの配列を作成し返す関数
    getDateStringListFromWeekString(weekString) {
        let result = [];
        const weekArray = weekString.convertToArray();
        const targetYear = [];
        // 1月であれば去年と今年が捜索対象
        if        (weekArray[1] === 1) {
            targetYear[0] = String(weekArray[0]-1);
            targetYear[1] = String(weekArray[0]  );
        // 12月であれば今年と来年が捜索対象
        } else if (weekArray[1] === 12) {
            targetYear[0] = String(weekArray[0]  );
            targetYear[1] = String(weekArray[0]+1);
        // その年が捜索対象
        } else {
            targetYear[0] = String(weekArray[0]);
        }
        targetYear.forEach(year => {
            Object.keys(this.dateData[year]).forEach(dateStr => {
                if (this.dateData[year][dateStr] === weekString.getStr()) {
                    result.push(new DateString(dateStr))
                }
            })
        })
        result.sort((a, b) => {
            return a.compareTo(b);
        })
        return result;
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // compare, judge
    //////////////////////////////////////////////////////////////////
    isExistWeekStr(weekStr) {       // weekStrが存在するものかどうかを判定する関数
        let result       = false;
        const weekString = new WeekString(weekStr);
        const weekArray  = weekString.convertToArray();
        if (weekArray[1] < 1 || weekArray[1] > 12) {
            return false;
        }

        const targetYear = [];
        // 1月であれば去年と今年が捜索対象
        if        (weekArray[1] === 1) {
            targetYear[0] = String(weekArray[0]-1);
            targetYear[1] = String(weekArray[0]  );
        // 12月であれば今年と来年が捜索対象
        } else if (weekArray[1] === 12) {
            targetYear[0] = String(weekArray[0]  );
            targetYear[1] = String(weekArray[0]+1);
        // その年が捜索対象
        } else {
            targetYear[0] = String(weekArray[0]);
        }
        targetYear.forEach(year => {
            if (existInDict(this.dateData, year)) {
                    Object.keys(this.dateData[year]).forEach(dateStr => {
                        if (this.dateData[year][dateStr] === weekStr) {
                        result = true;
                    }
                })
            }
        })
        return result;
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
}

export default DateData;
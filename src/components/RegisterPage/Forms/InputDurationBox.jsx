import { useContext } from "react";
import { useState } from "react";
import { DateDataContext } from "../../../App";
import "../../../assets/styles/RegisterPage/Forms/InputDurationBox.scss";
import { WeekString } from "../../../GlobalVariable";



const InputDurationBox = (props) => {
    // props
    // value
    // register
    // startWeekString
    // endWeekString
    // setDurationInput



    //////////////////////////////////////////////////////
    // グローバル変数
    //////////////////////////////////////////////////////
    const dateData = useContext(DateDataContext);
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // set default value
    //////////////////////////////////////////////////////
    const nextWeekString = new WeekString();
    nextWeekString.generateFromToday(dateData);
    nextWeekString.addWeek(1, dateData);
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // validate
    //////////////////////////////////////////////////////
    const [inputWeekArray, setInputWeekArray] = useState(() => {
        if (!props.value.includes(null)) {
            props.setDurationInput(props.value);
            return props.value;
        } else if (props.startWeekString !== undefined && props.endWeekString !== undefined) {
            return props.startWeekString.convertToArray();
        } else {
            return [nextWeekString.getYear(), nextWeekString.getMonth(), nextWeekString.getWeek()];
        }
    })
    const updateInputData = (year, month, week) => {
        setInputWeekArray(() => {
            return [year, month, week];
        })
        props.setDurationInput([year, month, week]);
    }

    const validateOnBlur = (year, month, week) => {
        let adjustedArray = adjustInputValues(year, month, week);
        year  = adjustedArray[0];
        month = adjustedArray[1];
        week  = adjustedArray[2];

        if (!isNotPastWeek(year, month, week)) {
            return false;
        }
        if (!isOver(year, month, week)) {
            return false;
        }
        return true;
    }
    const validateOnChange = (year, month, week) => {
        if (year === "" || month === "" || week === "") {
            updateInputData(year, month, week);
        } else {
            const adjustedArray = adjustInputValues(year, month, week);
            year  = adjustedArray[0];
            month = adjustedArray[1];
            week  = adjustedArray[2];
            updateInputData(year, month, week);
        }

    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // adjust input values
    //////////////////////////////////////////////////////
    const adjustInputValues = (year, month, week) => {
        let result = _convertToNum(year, month, week);
        result     = _overWeek (result[0], result[1], result[2]);
        result     = _overMonth(result[0], result[1], result[2]);
        return result;
    }
    const _convertToNum = (year, month, week) => {
        if (year  === '') {
            year  = 0;
        }
        if (month === '') {
            month = 0;
        }
        if (week  === '') {
            week  = 0;
        }
        return [Number(year), Number(month), Number(week)];
    }
    const _overWeek = (year, month, week) => {
        const onWeekString = new WeekString(`${year}-${month}-${week}`);
        if (!dateData.isExistWeekStr(onWeekString.getStr())) {
            if (week >= 5) {
                onWeekString.addWeek( 1, dateData);
            } else if (week <= 0) {
                onWeekString.addWeek(-1, dateData);
            }
            return [onWeekString.getYear(), onWeekString.getMonth(), onWeekString.getWeek()];
        } else {
            return [year, month, week];
        }
    }
    const _overMonth = (year, month, week) => {
        if        (month > 12) {
            return [year+1, 1, week];
        } else if (month < 1) {
            return [year-1, 12, week];
        } else {
            return [year, month, week];
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // set error message
    //////////////////////////////////////////////////////
    const [errorMessage, setErrorMessage] = useState(undefined);
    const errors = {
        "noError": undefined,
        "over": "設定された値が大きすぎます。",
        "pastWeek": `${nextWeekString.getYear()}年${nextWeekString.getMonth()}月第${nextWeekString.getWeek()}週目以降の値を入力してください。`
    }
    // エラーがなければ true を、あれば false を返す
    // 40年以上先の値を設定した際のエラー
    const isOver = (year, month, week) => {
        if (props.startWeekString === undefined && props.endWeekString === undefined) {
            if (dateData.isExistWeekStr(`${year}-${month}-${week}`)) {
                updateInputData(year, month, week);
                setErrorMessage(errors.noError);
                return true;
            } else {
                const mostFarWeekString = dateData.getWeekStringFromMostFar();
                updateInputData(mostFarWeekString.getYear(), mostFarWeekString.getMonth(), mostFarWeekString.getWeek());
                setErrorMessage(errors.over);
                return false;
            }
        } else {
            if (props.endWeekString.compareTo(new WeekString(`${year}-${month}-${week}`)) >= 0) {
                updateInputData(year, month, week);
                setErrorMessage(errors.noError);
                return true;
            } else {
                updateInputData(props.endWeekString.getYear(), props.endWeekString.getMonth(), props.endWeekString.getWeek());
                setErrorMessage(errors.over);
                return false;
            }
        }
    }
    // 今日よりも前の値を設定した際のエラー
    const isNotPastWeek = (year, month, week) => {
        const inputWeekString = new WeekString(`${year}-${month}-${week}`);
        if (props.startWeekString === undefined && props.endWeekString === undefined) {
            if (inputWeekString.compareTo(nextWeekString) >= 0) {
                updateInputData(year, month, week);
                setErrorMessage(errors.noError);
                return true;
            } else {
                updateInputData(nextWeekString.getYear(), nextWeekString.getMonth(), nextWeekString.getWeek());
                setErrorMessage(errors.pastWeek);
                return false;
            }
        } else {
            if (props.startWeekString.compareTo(inputWeekString) <= 0) {
                updateInputData(year, month, week);
                setErrorMessage(errors.noError);
                return true;
            } else {
                updateInputData(props.startWeekString.getYear(), props.startWeekString.getMonth(), props.startWeekString.getWeek());
                setErrorMessage(errors.pastWeek);
                return false;
            }
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////






    //////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////
    return (
        <div className="duration-input-box">


            {props.startWeekString === undefined
                ?
                    <>
                        <p className="duration-input-box__text-kigen">期限 :</p>
                        <input type="number"
                            className = "duration-input-box__input-year"
                            value     = {inputWeekArray[0]}
                            {...props.register("durationEndYear",
                                {
                                    onBlur: (e) => validateOnBlur(e.target.value, inputWeekArray[1], inputWeekArray[2]),
                                    onChange: (e) => validateOnChange(e.target.value, inputWeekArray[1], inputWeekArray[2]),
                                })
                            }
                        />
                    </>
                :
                    <input type="number"
                        className = "duration-input-box__input-year"
                        value     = {inputWeekArray[0]}
                        onBlur    = {(e) => validateOnBlur(e.target.value, inputWeekArray[1], inputWeekArray[2])}
                        onChange  = {(e) => validateOnChange(e.target.value, inputWeekArray[1], inputWeekArray[2])}
                    />
            }

            <p className="duration-input-box__text-nen">年</p>


            {props.startWeekString === undefined
                ?
                    <input type="number"
                        className = "duration-input-box__input-month"
                        value     = {inputWeekArray[1]}
                        {...props.register("durationEndMonth",
                            {
                                onBlur: (e) => validateOnBlur(inputWeekArray[0], e.target.value, inputWeekArray[2]),
                                onChange: (e) => validateOnChange(inputWeekArray[0], e.target.value, inputWeekArray[2]),
                            })
                        }
                    />
                :
                    <input type="number"
                        className = "duration-input-box__input-month"
                        value     = {inputWeekArray[1]}
                        onBlur    = {(e) => validateOnBlur(inputWeekArray[0], e.target.value, inputWeekArray[2])}
                        onChange  = {(e) => validateOnChange(inputWeekArray[0], e.target.value, inputWeekArray[2])}
                    />
            }
            <p className="duration-input-box__text-gatsu">月</p>


            <p className="duration-input-box__text-dai">第</p>
            {props.startWeekString === undefined
                ?
                    <input type="number"
                        className = "duration-input-box__input-week"
                        value     = {inputWeekArray[2]}
                        {...props.register("durationEndWeek",
                            {
                                onBlur: (e) => validateOnBlur(inputWeekArray[0], inputWeekArray[1], e.target.value),
                                onChange: (e) => validateOnChange(inputWeekArray[0], inputWeekArray[1], e.target.value),
                            })
                        }
                    />
                :
                    <input type="number"
                        className = "duration-input-box__input-week"
                        value     = {inputWeekArray[2]}
                        onBlur    = {(e) => validateOnBlur(inputWeekArray[0], inputWeekArray[1], e.target.value)}
                        onChange  = {(e) => validateOnChange(inputWeekArray[0], inputWeekArray[1], e.target.value)}
                    />
            }
            <p className="duration-input-box__text-shu">週</p>
            {props.startWeekString === undefined &&
                <input type="hidden" value={nextWeekString.convertToArray()} {...props.register("durationStart")}/>
            }
            {errorMessage && <p className="duration-input-box__error-message">{errorMessage}</p>}
        </div>
    );
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
}



export {InputDurationBox};
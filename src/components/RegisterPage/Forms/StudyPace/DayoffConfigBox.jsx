import { useEffect, useState } from "react";
import "../../../../assets/styles/RegisterPage/Forms/StudyPace/DayoffConfigBox.scss";

const DayoffConfigBox = (props) => {
    // props
    // register
    // watch



    /////////////////////////////////////////////////////////////////////
    // validate
    /////////////////////////////////////////////////////////////////////
    const validateOnChange = () => {
        // dayoffListの作成
        const data       = props.watch();
        const dayoffList = [];
        Object.keys(data).forEach(key => {
            if (key.split("_")[0] === "dayOff") {
                if (data[key] === true) {
                    dayoffList.push(data[key].split("_")[1]);
                }
            }
        })
        // バリデーションの実行
        if (isNoDayoff(dayoffList)) {
            return false;
        }
        return true;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // set error message
    /////////////////////////////////////////////////////////////////////
    const [errorMessage, setErrorMessage] = useState(undefined);
    const errors = {
        "noError": undefined,
        "noDayoff": "1つ以上選択してください"
    }
    // 休日が1日もない時のエラー
    const isNoDayoff = (dayoffList) => {
        if (dayoffList.length === 0) {
            setErrorMessage(errors.noDayoff);
            return true;
        } else {
            return false;
        }
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // observe wether this option is needed or not
    /////////////////////////////////////////////////////////////////////
    const [optionIsNeedFlag, setOptionIsNeedFlag] = useState(false);
    const [checkBoxState, setCheckBoxState]       = useState("unchecked");
    useEffect(() => {
        if (optionIsNeedFlag) {
            setCheckBoxState("");
        } else {
            setCheckBoxState("unchecked");
        }
    }, [optionIsNeedFlag])
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // render
    /////////////////////////////////////////////////////////////////////
    return (
        <div className="study-pace-inner__checkbox-list__dayoff-config-box">
            <div className={"study-pace-inner__checkbox-list__dayoff-config-box__input-box " + checkBoxState}>
                <div className="study-pace-inner__checkbox-list__dayoff-config-box--input-check">
                    <input type="checkbox" {...props.register("dayoffConfigCheck", {onChange: e => setOptionIsNeedFlag(e.target.checked)})} />
                    <p>定休日を設定する</p>
                </div>
                {optionIsNeedFlag &&
                    <ul className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list">
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Sun", {onChange: (e) => validateOnChange})} />
                            <p>日曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Mon", {onChange: (e) => validateOnChange})} />
                            <p>月曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Tue", {onChange: (e) => validateOnChange})} />
                            <p>火曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Wed", {onChange: (e) => validateOnChange})} />
                            <p>水曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Thu", {onChange: (e) => validateOnChange})} />
                            <p>木曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Fri", {onChange: (e) => validateOnChange})} />
                            <p>金曜</p>
                        </li>
                        <li className="study-pace-inner__checkbox-list__dayoff-config-box__select-day-list--item">
                            <input type="checkbox" {...props.register("dayoff_Sut", {onChange: (e) => validateOnChange})} />
                            <p>土曜</p>
                        </li>
                    </ul>
                }
            </div>
            <p className="study-pace-inner__checkbox-list__dayoff-config-box--navigation-message">計画を継続できるように、週に数日休みを設けることを推奨しています。デフォルトでは日曜日になっていますが、あなたの都合に合わせて設定しましょう。特にこだわりがなければ週に1日が良いでしょう。</p>
            {errorMessage && <p className="study-pace-inner__checkbox-list__dayoff-config-box--error-message">{errorMessage}</p>}
        </div>
    );
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
}



export { DayoffConfigBox };
import { useEffect, useState } from "react";

const ReLearningPerWeekConfigBox = (props) => {
    // props
    // register





    ////////////////////////////////////////////////////////////////////////////
    // observe wether this option is needed or not
    ////////////////////////////////////////////////////////////////////////////
    const [optionIsNeedFlag, setOptionIsNeedFlag] = useState(false);
    const [checkBoxState, setCheckBoxState]      = useState("unchecked");
    useEffect(() => {
        if (optionIsNeedFlag) {
            setCheckBoxState("");
        } else {
            setCheckBoxState("unchecked");
        }
    }, [optionIsNeedFlag])
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////////////////
    return (
        <div className="study-pace-inner__checkbox-list__re-learning-per-week-config-box">
            <div className={"study-pace-inner__checkbox-list__re-learning-per-week-config-box__input-box " + checkBoxState}>
                <div className="study-pace-inner__checkbox-list__re-learning-per-week-config-box--input-check">
                    <input type="checkbox" {...props.register("reLearningPerWeekFlag", {onChange: e => setOptionIsNeedFlag(e.target.checked)})} />
                    <p>1週間に同じタスクを2回行う</p>
                </div>
            </div>
            <p className="study-pace-inner__checkbox-list__re-learning-per-week-config-box--navigation-message">せっかく学習したことも1回だけではすぐに忘れてしまいます。週に2回同じことをすることで学習成果の定着に役立ちます。</p>
        </div>
    );
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
}



export { ReLearningPerWeekConfigBox };
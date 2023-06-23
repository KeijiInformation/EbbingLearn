import { useEffect, useState } from "react";
import "../../../../assets/styles/RegisterPage/Forms/StudyPace/PaceOfReLearningConfigBox.scss";

const PaceOfReLearningConfigBox = (props) => {
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
        <div className="study-pace-inner__checkbox-list__pace-of-re-learning-config-box">
            <div className={"study-pace-inner__checkbox-list__pace-of-re-learning-config-box__input-box " + checkBoxState}>
                <div className="study-pace-inner__checkbox-list__pace-of-re-learning-config-box--input-check">
                    <input type="checkbox" {...props.register("paceOfReLearningConfigCheck", {onChange: e => setOptionIsNeedFlag(e.target.checked)})}/>
                    <p>復習ペースをカスタマイズする</p>
                </div>
                {optionIsNeedFlag &&
                    <select className="study-pace-inner__checkbox-list__pace-of-re-learning-config-box--input-select" {...props.register("paceOfReLearning")}>
                        <option value="1.5">1.5倍ペース</option>
                        <option value="2.0">2.0倍ペース</option>
                        <option value="2.5">2.5倍ペース</option>
                        <option value="3.0">3.0倍ペース</option>
                    </select>
                }
            </div>
            <p className="study-pace-inner__checkbox-list__pace-of-re-learning-config-box--navigation-message">週に2度同じ内容を学習すれば多少学習成果は長持ちしますが、それはテストの一夜漬けのように時間とともにすぐ薄れていきます。学習成果を一生ものにして使いこなすためには、定期的な復習が必要です。復習段階では、初めて学習したときよりも速いペースでさらっと流すのが良いでしょう。しかし、中には復習が必要ないような物もあるので注意しましょう。詳しくはお役立ち記事の「復習の必要性」をご確認ください。</p>
            {/* {paceOfReLearningErrorMessage && <p className="study-pace-inner__checkbox-list__pace-of-re-learning-config-box--error-message">{paceOfReLearningErrorMessage}</p>} */}
        </div>
    );
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
}



export { PaceOfReLearningConfigBox };
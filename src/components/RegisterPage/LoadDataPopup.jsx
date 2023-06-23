import { Button } from "../common/Button";
import "../../assets/styles/RegisterPage/LoadDataPopup.scss";



const LoadDataPopup = (props) => {
    // props
    // cancelSave
    // saveData



    //////////////////////////////////////////////////////////////////
    // event
    //////////////////////////////////////////////////////////////////
    const noEvent = () => {
        props.cancelLoad();
    }
    const yesEvent = async () => {
        await props.loadData();
    }
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////
    return (
        <div className="load-data-popup-wrapper">
            <div className="load-data-popup-wrapper__message-box">
                <p className="load-data-popup-wrapper__message-box--attention">前回中断したデータがあります。</p>
                <p className="load-data-popup-wrapper__message-box--ask">中断したデータを読み込みますか？</p>
            </div>
            <div className="load-data-popup-wrapper__btn-box">
                <div className="load-data-popup-wrapper__btn-box--no">
                    <Button
                        clickEvent = { noEvent }
                        text       = { "いいえ" }
                    />
                </div>
                <div className="load-data-popup-wrapper__btn-box--yes">
                    <Button
                        clickEvent = { yesEvent }
                        text       = { "はい" }
                    />
                </div>
            </div>
        </div>
    )
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
}



export { LoadDataPopup };
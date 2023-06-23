import { Button } from "../common/Button";
import "../../assets/styles/ConfirmPage/Popup.scss";



const Popup = (props) => {
    // props
    // text
    // cancelEvent
    // agreeEvent



    //////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////
    return (
        <div className="popup-wrapper">
            <p className="popup-wrapper__announce">{props.text}</p>
            <ul className="popup-wrapper__btn-list">
                <li className="popup-wrapper__btn-list--btn">
                    <Button
                        text       = {"いいえ"}
                        clickEvent = {props.cancelEvent}
                    />
                </li>
                <li className="popup-wrapper__btn-list--btn">
                    <Button
                        text = {"はい"}
                        clickEvent = {props.agreeEvent}
                    />
                </li>
            </ul>
        </div>
    )
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
}



export { Popup }
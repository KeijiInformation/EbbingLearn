import { Link as Scroll } from "react-scroll";
import { IoIosArrowBack } from "react-icons/io";

const BackSectionBtn = (props) => {

    return (
        <label className="btn-wrapper">
            <Scroll to="register-page" duration={200} smooth={true} offset={-64} onClick={props.clickEvent} className="button">
                <IoIosArrowBack/>
                <p>{props.text}</p>
            </Scroll>
        </label>
    );
}


export { BackSectionBtn };
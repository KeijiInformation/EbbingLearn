import { GrFormNext } from "react-icons/gr";

const NextSectionBtn = (props) => {

    return (
        <label className="next-section-btn-wrapper">
            <input type="submit" className="button"/>
            <p>{props.text}</p>
            <GrFormNext/>
        </label>
    );
}


export { NextSectionBtn };
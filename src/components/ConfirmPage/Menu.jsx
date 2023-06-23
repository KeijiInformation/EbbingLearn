import { AiOutlineEllipsis } from "react-icons/ai";
import "../../assets/styles/ConfirmPage/Menu.scss";
import { CSSTransition } from "react-transition-group";
import { useState } from "react";



const Menu = (props) => {
    // props
    // setIsOpenDeletePop
    // setIsOpenEditPop



    ////////////////////////////////////////////////////////////////////////
    // toggle menu
    ////////////////////////////////////////////////////////////////////////
    const [isMenuOpen, setIsMenuOpen] = useState("close");
    const toggleMenu = () => {
        if (isMenuOpen === "close") {
            setIsMenuOpen("open");
        } else {
            setIsMenuOpen("close");
        }
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // btn func
    ////////////////////////////////////////////////////////////////////////
    const onClickDelete = () => {
        props.setIsOpenDeletePop(true);
    }
    const onClickEdit = () => {
        props.setIsOpenEditPop(true);
    }
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////////////////
    return (
        <div className={"menu-wrapper " + isMenuOpen}>
            <div className="menu-wrapper__toggle-btn" onClick={toggleMenu}>
                <AiOutlineEllipsis/>
                <span className="border-line left"></span>
                <span className="border-line top"></span>
                <span className="border-line right"></span>
            </div>
            <CSSTransition
                in      = {isMenuOpen === "open"}
                timeout = {1300}
                unmountOnExit
            >
                <ul className="menu-wrapper__menu-list">
                    <div className="menu-wrapper__menu-list--border">
                        <span className="top"></span>
                        <span className="right"></span>
                        <span className="bottom"></span>
                        <span className="left"></span>
                    </div>
                    <li className="menu-wrapper__menu-list--delete">
                        <button onClick={onClickDelete}>削除</button>
                    </li>
                    <li className="menu-wrapper__menu-list--edit">
                        <button onClick={onClickEdit}>編集</button>
                    </li>
                </ul>
            </CSSTransition>
        </div>
    )
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
}



export { Menu };
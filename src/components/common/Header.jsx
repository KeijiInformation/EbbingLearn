import { useContext, useEffect } from 'react';
import { UserDataContext } from '../../App';
import LogoImage from '../../assets/images/common/EbbingLearn-Logo.png';
import confirmPageIcon from "../../assets/images/common/confirmPageIcon.png";
import doPageIcon from "../../assets/images/common/doPageIcon.png";
import registerPageIcon from "../../assets/images/common/registerPageIcon.png";


const Header = (props) => {
    // props
    // setPageState



    ////////////////////////////////////////////////////////////
    // global variables
    ////////////////////////////////////////////////////////////
    const accountData = useContext(UserDataContext)["Account"];
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // link btn hovering
    ////////////////////////////////////////////////////////////
    useEffect(() => {
        const hoveringTitleText = {
            "header__link-list__link-to-confirm-btn":  "目標を確認する",
            "header__link-list__link-to-do-btn":       "学習する",
            "header__link-list__link-to-register-btn": "目標を登録する",
        }
        const linkBtnList = document.querySelectorAll(".header__link-list li");
        linkBtnList.forEach(linkBtn => {
            linkBtn.addEventListener("mouseover", (e) => {
                const textDOM = document.querySelector(".header__hovering-content--text");
                textDOM.textContent = hoveringTitleText[e.target.className];
                textDOM.style.clipPath = "inset(0 0 0 0)";
            })
            linkBtn.addEventListener("mouseleave", () => {
                const textDOM = document.querySelector(".header__hovering-content--text");
                textDOM.style.clipPath = "inset(0 50% 0 50%)";
            })
        })
    }, [])
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////
    // render
    ////////////////////////////////////////////////////////////
    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__app-info">
                    <img src={LogoImage} alt="ロゴ画像" className="header__app-info--logo" />
                    <p className="header__app-info--app-title">Ebbing Learn</p>
                </div>
                <ul className="header__link-list">
                    <li className="header__link-list__link-to-confirm-btn"  onClick={() => props.setPageState("confirm")}>
                    </li>
                    <li className="header__link-list__link-to-do-btn"       onClick={() => props.setPageState("do")}>
                    </li>
                    <li className="header__link-list__link-to-register-btn" onClick={() => props.setPageState("register")}>
                    </li>
                </ul>
                <div className="header__hovering-content">
                    <p className="header__hovering-content--text"></p>
                </div>
                <div className="header__account-info">
                    <p className="header__account-info--account-name">{accountData.getDisplayName()}</p>
                    <img src={accountData.getIconURL()} alt="アカウントイメージ画像" className="header__account-info--account-image" />
                </div>
            </div>
        </header>
    );
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
}


export default Header;
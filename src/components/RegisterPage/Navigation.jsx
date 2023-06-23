import NavigateLine from "../../assets/images/RegisterPage/navigate-line.png";

const Navigation = (props) => {

    // ナビゲーションリスト作成ここから
    const sectionNameObject = [
        ["final-goal", "大目標の設定"],
        ["middle-goal", "中目標の設定"],
        ["small-goal", "小目標の設定"],
        ["study-pace", "進行ペースの設定"]
    ];
    const sectionTitleDOMList = sectionNameObject.map((item) => {
        if (item[0] !== "study-pace") {
            if (props.sectionFlowState === item[0]) {
                return (
                    <li className="section-navigation__li" key={"section-navigation__li--" + item[0]}>
                        <span className="section-navigation__li--title on-section">{item[1]}</span>
                        <img src={NavigateLine} alt="ナビゲートライン" className="section-navigation__li--navigate-line" />
                    </li>
                );
            } else {
                return (
                    <li className="section-navigation__li" key={"section-navigation__li--" + item[0]}>
                        <span className="section-navigation__li--title">{item[1]}</span>
                        <img src={NavigateLine} alt="ナビゲートライン" className="section-navigation__li--navigate-line" />
                    </li>
                );
            }
        } else {
            if (props.sectionFlowState === item[0]) {
                return (
                    <li className="section-navigation__li" key={"section-navigation__li--" + item[0]}>
                        <span className="section-navigation__li--title on-section">{item[1]}</span>
                    </li>
                );
            } else {
                return (
                    <li className="section-navigation__li" key={"section-navigation__li--" + item[0]}>
                        <span className="section-navigation__li--title">{item[1]}</span>
                    </li>
                );
            }
        }
    });
    // ナビゲーションリスト作成ここまで






    // レンダリングここから
    return (
        <ul className="section-navigation">
            {sectionTitleDOMList}
        </ul>
    );
    // レンダリングここまで

}

export { Navigation };
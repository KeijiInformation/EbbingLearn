import "../../../assets/styles/RegisterPage/Forms/InputTitleBox.scss";

const InputTitleBox = (props) => {
    // props
    // value
    // register
    // errors
    // maxLength
    // notRequired

    return (
        <div className="title-input-box">
            <p className="title-input-box__title">タイトル</p>
            { props.notRequired !== true
                ? <input className="title-input-box__input" value={props.value} type="text" {...props.register("title", {required: {value: true, message: "入力してください。"}, maxLength: {value: props.maxLength, message: props.maxLength + "以内で入力してください。"}})} />
                : <input className="title-input-box__input" value={props.value} type="text" {...props.register("title", {maxLength: {value: props.maxLength, message: props.maxLength + "以内で入力してください。"}})} />
            }
            {props.errors["title"] && <p className="title-input-box__error-message">{props.errors["title"]["message"]}</p>}
        </div>
    );

}


export {InputTitleBox};
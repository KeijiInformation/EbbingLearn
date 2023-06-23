import "../../../assets/styles/RegisterPage/Forms/InputDescriptionBox.scss";



const InputDescriptionBox = (props) => {
    // props
    // value
    // errors
    // register
    // maxLength



    return (
        <div className="description-input-box">
            <p className="description-input-box__title">説明</p>
            <p className="description-input-box__navigation-message">その目標を設定した理由や、目標を達成すると何ができるかなど説明を書きましょう。</p>
            <input className="description-input-box__input" type="textarea" value={props.value} {...props.register("description", {required: {value: true, message: "入力してください。"}, maxLength: {value: props.maxLength, message: props.maxLength + "字以内で入力してください。"}})}/>
            {props.errors["description"] && <p className="description-input-box__error-message">{props.errors["description"]["message"]}</p>}
        </div>
    );
}


export {InputDescriptionBox};
const Button = (props) => {
    return (
        <div className={"btn-wrapper " + props.className}>
            <button className="button" type="button" onClick={props.clickEvent}>
                {props.icon}
                <p>{props.text}</p>
            </button>
        </div>
    );
}

export {Button};
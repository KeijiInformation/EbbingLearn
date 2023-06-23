import { useContext, useEffect } from "react";
import { NoImageURLContext } from "../../../App";
import { GrDocumentUpload } from "react-icons/gr";
import "../../../assets/styles/RegisterPage/Forms/InputThumbnailBox.scss";



const InputThumbnailBox = (props) => {
    // props
    // register
    // thumbnailURL



    //////////////////////////////////////////////////////////////
    // global variables
    //////////////////////////////////////////////////////////////
    const noImageURL = useContext(NoImageURLContext);
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////
    // set url
    //////////////////////////////////////////////////////////////
    const setInputData = (data) => {
        if (data.length !== 0) {
            const fileReader = new FileReader();
            fileReader.onload = (event) => {
                props.setThumbnailURL(event.target.result);
            }
            fileReader.readAsDataURL(data[0]);
        } else {
            props.setThumbnailURL(noImageURL);
        }
    }
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////
    // resize image
    //////////////////////////////////////////////////////////////
    useEffect(() => {
        const imageDOM = document.querySelector(".thumbnail-input-box__image-preview-box--image");
        if (imageDOM.clientHeight > imageDOM.clientWidth) {
            imageDOM.style.height = "100%";
            imageDOM.style.width  = "auto";
        } else {
            imageDOM.style.height = "auto";
            imageDOM.style.width  = "100%";
        }
    }, [props.thumbnailURL])
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////
    return (
        <div className="thumbnail-input-box">
            <p className="thumbnail-input-box__title">サムネイルの設定</p>
            <p className="thumbnail-input-box__navigation-message">目標に関するイメージ画像を挿入します。</p>
            <div className="thumbnail-input-box__image-preview-box">
                <img src={props.thumbnailURL} alt="" className="thumbnail-input-box__image-preview-box--image" />
            </div>
            <div className="btn-wrapper sub">
                <label className="button">
                    <GrDocumentUpload/>
                    <p>アップロード</p>
                    <input type="file" accept="image/*" className="thumbnail-input-box__input" {...props.register("thumbnail", {onChange: (e) => setInputData(e.target.files)})}/>
                </label>
            </div>
        </div>
    );
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
}


export {InputThumbnailBox};
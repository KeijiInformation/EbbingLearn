import { useEffect } from "react";
import "../../assets/styles/common/ThumbnailView.scss";



const ThumbnailView = (props) => {
    // props
    // thumbnailURL
    // alt



    ///////////////////////////////////////////////////////
    // resize image
    ///////////////////////////////////////////////////////
    useEffect(() => {
        const imageDOM = document.querySelector(".thumbnail-view__image");
        if (imageDOM.clientHeight > imageDOM.clientWidth) {
            imageDOM.style.height = "100%";
            imageDOM.style.width  = "auto";
        } else {
            imageDOM.style.height = "auto";
            imageDOM.style.width  = "100%";
        }
    }, [props.thumbnailURL])
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////
    // render
    ///////////////////////////////////////////////////////
    return (
        <div className="thumbnail-view">
            <img src={props.thumbnailURL} alt={props.alt} className="thumbnail-view__image" />
        </div>
    )
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
}



export {ThumbnailView}
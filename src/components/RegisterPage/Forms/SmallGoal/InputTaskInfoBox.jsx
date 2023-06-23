import { useContext, useEffect, useState } from "react";
import { TaskVariablesContext } from "../../../../App";

const InputTaskInfoBox = (props) => {
    // props↓
    // register
    // watch



    //////////////////////////////////////////////////////////////////////////
    // global variables
    //////////////////////////////////////////////////////////////////////////
    const taskVariables = useContext(TaskVariablesContext);
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // set watch
    //////////////////////////////////////////////////////////////////////////
    const genreWatch = props.watch()["genre"];
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // set option state
    //////////////////////////////////////////////////////////////////////////
    const [unitOptions, setUnitOptions] = useState(taskVariables.getUnits(0));
    useEffect(() => {
        setUnitOptions(taskVariables.getUnits(Number(genreWatch)));
    }, [genreWatch])
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////
    // render
    //////////////////////////////////////////////////////////////////////////
    return (
        <div className="task-info-input-box">
            <p className="task-info-input-box__title">タスク量</p>
            <div className="task-info-input-box__input-boxes">
                <div className="task-info-input-box__input-boxes__genre-input-box">
                    <p className="task-info-input-box__input-boxes__genre-input-box--title">ジャンル</p>
                    <select className="task-info-input-box__input-boxes__genre-input-box--input" {...props.register("genre", {required: true})}>
                        {taskVariables.getGenres().map((genre, index) => {
                            return <option key={"task-info-input-box__input-boxes__genre-input-box--input--option"+index} value={index}>{genre}</option>
                        })}
                    </select>
                </div>

                <div className="task-info-input-box__input-boxes__amount-input-box">
                    <p className="task-info-input-box__input-boxes__amount-input-box--title">量</p>
                    <input type="number" className="task-info-input-box__input-boxes__amount-input-box--input"  {...props.register("amount", {required: true})}/>
                </div>

                <div className="task-info-input-box__input-boxes__unit-input-box">
                    <p className="task-info-input-box__input-boxes__unit-input-box--title">単位</p>
                    {unitOptions &&
                        <select className="task-info-input-box__input-boxes__unit-input-box--input" {...props.register("unit", {required: true})}>
                            {unitOptions.map((unitOption, index) => {
                                return <option value={index} key={"task-info-input-box__input-boxes__amount-input-box--input--option"+index}>{unitOption}</option>
                            })}
                        </select>
                    }
                </div>
            </div>

            <div className="task-info-input-box__re-learning-flag-input-box">
                <input type="checkbox" className="task-info-input-box__re-learning-flag-input-box--input" {...props.register("reLearningFlag")}/>
                <p className="task-info-input-box__re-learning-flag-input-box--title">復習期間を設ける</p>
            </div>

        </div>
    );
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
}


export { InputTaskInfoBox };
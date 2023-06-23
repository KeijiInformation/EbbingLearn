const SectionOutLine = (props) => {

    // 設定項目のStateに合わせてタイトルと説明欄を変更ここから
    let title = "", description = "";
    if (props.sectionFlowState === "final-goal") {
        title = "大目標"
        description = "あなたの最終ゴールを登録しましょう。最終的にあなたが手に入れたいスキルや理想像をここに入力します。例としては、「○○大学合格レベルの数学力を身に着ける」や「エクセルを仕事で使えるぐらいのレベルにする」など。";
    } else if (props.sectionFlowState === "middle-goal") {
        title = "中目標";
        description = "設定した大目標を達成するために必要な事項を登録しましょう。ここで登録した中目標ごとに、「小目標の設定」で具体的な教材を登録していきます。例としては、大目標「エクセルを仕事でつかえるぐらいのレベルにする」に対して中目標「基本操作の修得」や「ショートカットキーの修得」、「マクロの修得」などが考えられます。";
    } else if (props.sectionFlowState === "small-goal") {
        title = "小目標";
        description = "設定した中目標を達成するために使う教材を登録しましょう。登録する際は、ネットの記事や有識者の意見を参考にしながら教材を決めるとよいでしょう。登録できる教材の種類は「動画」、「書籍」、「講座」があります。";
    } else if (props.sectionFlowState === "study-pace") {
        title = "進行ペース";
        description = "設定した小目標を参考に、進行ペースを決定するためのオプションを選択します。特にこだわりがなければ基本的にデフォルトの設定を推奨します。推奨する設定では、週に2回同じ内容を学習し、さらに復習を1回目よりも速いペースで行うことで確実に定着できるようになっています。また、計画を継続してできるように定休日を設けることを推奨しています。";
    } else {
        title = "!! 存在しないStateです !!";
        description = "RegisterPage内のsectionFlowStateを見直してください。"
    }
    // 設定項目のStateに合わせてタイトルと説明欄を変更ここから






    // レンダリングここから
    return (
        <div className="section-out-line">
            {props.sectionFlowState !== "complete"
                ?
                <>
                    <p className="section-out-line__title">{title}<span>を設定しましょう</span></p>
                    <p className="section-out-line__description">{description}</p>
                </>
                :
                <>
                    <p className="section-out-line__title">登録が完了しました！</p>
                </>
            }
        </div>
    );
    // レンダリングここまで

}

export { SectionOutLine };
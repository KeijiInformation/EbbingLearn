class TaskVariables {
    constructor() {
        this.genreOfTask = [
            "動画",     // 0
            "本"  ,     // 1
            "講座",     // 2
        ]
        this.unitOfTask = [
            [           // 0: 動画
                "分",       // 0
                "本",       // 1
            ],
            [           // 1: 本
                "ページ",   // 0
                "章",       // 1
            ],
            [           // 2: 講座
                "講座",     // 0
            ]
        ]
        this.weightOfTask = [
            [           // 0: 動画
                5,          // 0: 分
                50,         // 1: 本
            ],
            [           // 1: 本
                2,          // 0: ページ
                60,         // 1: 章
            ],
            [           // 2: 講座
                60,         // 0: 講座
            ]
        ]
    }

    getGenres() {
        return this.genreOfTask;
    }
    getGenre(genreID) {
        return this.genreOfTask[genreID];
    }
    getUnits(genreID) {
        return this.unitOfTask[genreID];
    }
    getUnit(genreID, unitID) {
        return this.unitOfTask[genreID][unitID];
    }
    getWeight(genreID, unitID) {
        return this.weightOfTask[genreID][unitID];
    }
}



export default TaskVariables;
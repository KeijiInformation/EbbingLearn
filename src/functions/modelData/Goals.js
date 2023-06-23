import { DateString, WeekString } from "../../GlobalVariable";

const getModelData = (dateData, goalsData) => {
    const finalGoalIDNum = goalsData.getMaxID().getIDVal() + 1;

    const todayString = new DateString();
    todayString.generateFromToday();

    const nextWeekString = new WeekString();
    nextWeekString.generateFromToday(dateData);
    nextWeekString.addWeek(1, dateData);
    const endWeekString = nextWeekString.createWeekString(dateData, 0, 0, 14);



    return {
            "uid": "swA5RJ6a9gcj5egzNfHnS9CqWie2",
            "id": "final" + finalGoalIDNum,
            "title": "大目標" + finalGoalIDNum,
            "description": "大目標" + finalGoalIDNum + "説明",
            "durationStart": [
                nextWeekString.getYear(),
                nextWeekString.getMonth(),
                nextWeekString.getWeek(),
            ],
            "durationEnd": [
                endWeekString.getYear(),
                endWeekString.getMonth(),
                endWeekString.getWeek()
            ],
            "thumbnail": {
                "path": [],
                "storagePath": undefined,
            },
            "timestamp": [todayString.getYear(), todayString.getMonth(), todayString.getDay()],
            "delete": {
                "flag": false,
                "date": null,
            },
            "middleGoals": {
                "middle1": {
                    "id": "middle1",
                    "title": "中目標1",
                    "finalGoalID": "final" + finalGoalIDNum,
                    "duration": [
                        nextWeekString.getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 1).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 2).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 3).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 4).getStr(),
                    ],
                    "thumbnail": {
                        "path": [],
                        "storagePath": undefined,
                    },
                    "delete": {
                        "flag": false,
                        "date": null,
                    },
                    "smallGoals": {
                        "small1": {
                            "id": "small1",
                            "middleGoalID": "middle1",
                            "title": "中目標1-小目標1",
                            "genre": 0,
                            "amount": 20,
                            "unit": 1,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 1).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        },
                        "small2": {
                            "id": "small2",
                            "middleGoalID": "middle1",
                            "title": "中目標1-小目標2",
                            "genre": 1,
                            "amount": 300,
                            "unit": 0,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 2).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 3).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        },
                        "small3": {
                            "id": "small3",
                            "middleGoalID": "middle1",
                            "title": "中目標1-小目標3",
                            "genre": 2,
                            "amount": 3,
                            "unit": 0,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 4).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        }
                    }
                },
                "middle2": {
                    "id": "middle2",
                    "title": "中目標2",
                    "duration": [
                        nextWeekString.createWeekString(dateData, 0, 0, 5).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 6).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 7).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 8).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 9).getStr(),
                    ],
                    "thumbnail": {
                        "path": [],
                        "storagePath": undefined,
                    },
                    "finalGoalID": "final" + finalGoalIDNum,
                    "delete": {
                        "flag": false,
                        "date": null,
                    },
                    "smallGoals": {
                        "small1": {
                            "id": "small1",
                            "middleGoalID": "middle2",
                            "title": "中目標2-小目標1",
                            "genre": 0,
                            "amount": 20,
                            "unit": 0,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 5).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 6).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        },
                        "small2": {
                            "id": "small2",
                            "middleGoalID": "middle2",
                            "title": "中目標2-小目標2",
                            "genre": 0,
                            "amount": 620,
                            "unit": 0,
                            "reLearningFlag": false,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 7).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 8).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        },
                        "small3": {
                            "id": "small3",
                            "middleGoalID": "middle2",
                            "title": "中目標2-小目標3",
                            "genre": 1,
                            "amount": 10,
                            "unit": 1,
                            "reLearningFlag": false,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 9).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        }
                    }
                },
                "middle3": {
                    "id": "middle3",
                    "title": "中目標3",
                    "duration": [
                        nextWeekString.createWeekString(dateData, 0, 0, 10).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 11).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 12).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 13).getStr(),
                        nextWeekString.createWeekString(dateData, 0, 0, 14).getStr(),
                    ],
                    "thumbnail": {
                        "path": [],
                        "storagePath": undefined,
                    },
                    "finalGoalID": "final" + finalGoalIDNum,
                    "delete": {
                        "flag": false,
                        "date": null,
                    },
                    "smallGoals": {
                        "small1": {
                            "id": "small1",
                            "middleGoalID": "middle3",
                            "title": "中目標3-小目標1",
                            "genre": 2,
                            "amount": 10,
                            "unit": 0,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 10).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 11).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        },
                        "small2": {
                            "id": "small2",
                            "middleGoalID": "middle3",
                            "title": "中目標3-小目標2",
                            "genre": 2,
                            "amount": 5,
                            "unit": 0,
                            "reLearningFlag": true,
                            "duration": [
                                nextWeekString.createWeekString(dateData, 0, 0, 12).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 13).getStr(),
                                nextWeekString.createWeekString(dateData, 0, 0, 14).getStr(),
                            ],
                            "progress": 0,
                            "done": false,
                            "delete": {
                                "flag": false,
                                "date": null,
                            },
                        }
                    }
                }
            },
            "studyPace": {
                "dayoff": [
                    6,
                ],
                "reLearningPerWeekFlag": true,
                "paceOfReLearning": 1.5
            }
        }
}



export { getModelData };
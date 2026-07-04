
const phaseList = Object.freeze({
        initialize : "初期化処理",
        question : "回答中",
        answerCheck : "答え合わせの処理中",
        wait : "次の問題への入力待機中",
        finished : "完了",
        nextQuestionRange : "次の出題範囲があるかチェック",
        waitForNextQuestionRange : "次の出題範囲"
    })


const PAGES_ID = {
    HOME : "home",
    QUIZ : "quiz",
    FLASHCARD : "flashCard"
}

//selectのvalueを出題範囲に変換するための辞書
const RANGE_PARSE_DICTIONARY = Object.freeze({
    c1v : [
        {min : 1, max : 38}
    ],
    c2v : [
        {min : 164, max : 192}
    ],
    c3v : [
        {min : 290, max : 315}
    ],
    allv : [
        {min : 1, max : 38}, 
        {min : 164, max : 192}, 
        {min : 290, max : 315}
    ],
    c1adj : [
        {min : 39, max : 82}
    ],
    c2adj : [
        {min : 193, max : 228}
    ],
    alladj : [
        {min : 39, max : 82}, 
        {min : 193, max : 228}
    ],
    c1adjv : [
        {min : 83, max : 96}
    ],
    c2adjv : [
        {min : 229, max : 241}
    ],
    alladjv : [
        {min : 83, max : 96}, 
        {min : 229, max : 241}
    ],
    c1n : [
        {min : 97, max : 127}
    ],
    c2n : [
        {min : 242, max : 278}
    ],
    alln : [
        {min : 97, max : 127}, 
        {min : 242, max : 278}
    ],
    c1adv : [
        {min : 128, max : 163}
    ],
    c2adv : [
        {min : 279, max : 289}
    ],
    alladv : [
        {min : 128, max : 163}, {min : 279, max : 289}],
    allall : [
        {min : 1,max : 315}
    ],
    c1all : [
        {min : 1, max : 163}
    ],
    c2all : [
        {min : 164, max : 289}
    ],
    c3all : [
        {min : 290, max : 315}
    ],
    idiomall : [
        {min : 316, max : 379}
    ]
});



//出題範囲の入力がどこから行われたかについての示す変数
const RANGE_SOURCE = Object.freeze({
    SELECT : "select",
    INPUT : "input"
})
//RANGE_SOURCEを踏まえて、背景色を変更するために使う変数
const COLORS = Object.freeze({
    [RANGE_SOURCE.INPUT] : "white",
    [RANGE_SOURCE.SELECT] : "gray"
});

const QUIZ_TYPE = Object.freeze({
    fourOption : "四択問題",
    typing : "一問一答",
    fillFourOption : "例文穴埋め四択問題",
    fillTyping : "例文穴埋め問題"
})

export {phaseList, PAGES_ID, RANGE_PARSE_DICTIONARY, RANGE_SOURCE, COLORS, QUIZ_TYPE}
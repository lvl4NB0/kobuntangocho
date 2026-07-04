import { phaseList } from "./const.js"

const appState={
    words : [],
    wordIndex : [],
    range : [], //もう使ってないけどcommittedRangeじゃ物足りないときに使うための予約
    committedRange : [], //!!!型は必ず一次元配列
    //本来はDB(またはキャッシュ)からユーザーの進捗を取得する
    NUM_OF_Words : 0,
    userProgress : 0,
    isHighlighted : true,
    history : [],
    phase : phaseList.initialize,
    optionBuilder : {},
    QuizSession : undefined,
    fourOptionForFill : [],
    fourOptionForFillRegacyLang : [],
    quizMeaningPool : []
}
const DOM = Object.freeze({
    translation : document.getElementById("translation"),
    question : document.getElementById("question"),
    progressBar : document.getElementById("progress-bar"),
    progressBarNum : document.getElementById("progress-bar-num"),
    result : document.getElementById("result"),
    check : document.getElementById("check"),
    overlay : document.getElementById("quiz-history-overlay"),
    overlayInner : document.getElementById("quiz-history-overlay-inner"),
    answerBox : document.getElementById("answer-typing"),
    fourOption : document.getElementById("four-option"),
    option : [
        document.getElementById("opt1"),
        document.getElementById("opt2"),
        document.getElementById("opt3"),
        document.getElementById("opt4")
    ],
    opt1 : document.getElementById("opt1"),
    opt2 : document.getElementById("opt2"),
    opt3 : document.getElementById("opt3"),
    opt4 : document.getElementById("opt4"),
    correctAnswersNum : document.getElementById("correct-answers-num"),
    answersNum : document.getElementById("answers-num"),
    consecutiveCorrectAnswersNum : document.getElementById("consecutive-correct-answers-num"),
    hider : document.getElementById("hider"),
    isHighlighted : document.getElementById("quiz-highlight"),
    hideOption : document.getElementById("quiz-hide-option")
})

//出題範囲周りの要素
const inputRangeElements = {
    rangeSelectSection : document.getElementById("range-select-section"),
    rangeSelectPoS : document.getElementById("range-select-PoS"),
    startWord : document.getElementById("start-word"),
    endWord : document.getElementById("end-word"),
    inputRangeMin : document.getElementById("range-min"),
    inputRangeMax : document.getElementById("range-max")
}
//チェックボックス関連の要素
const cbElements = {
//クイズとフラッシュカード両方のオプション周りの要素
    cbShuffle : document.getElementById("cb-shuffle"),
    cbIncludeRelation : document.getElementById("cb-include-relation"),
    //フラッシュカードのオプション周りの要素
    cbExceptKnown : document.getElementById("cb-except-known"),
    cbShowMeaningFirst : document.getElementById("cb-show-meaning-first"),
    //クイズのオプション周りの要素
    cbFourOption : document.getElementById("cb-four-option"),
    cbTyping : document.getElementById("cb-typing"),
    cbFillFourOption : document.getElementById("cb-fill-four-option"),
    cbFillTyping : document.getElementById("cb-fill-typing"),
    cbFillHighlight : document.getElementById("cb-fill-highlight"),
    cbKobunToGendaibun : document.getElementById("cb-gendaigo-to-kogo"),
    cbHideOption : document.getElementById("cb-hide-option")
}

export {appState, DOM, inputRangeElements, cbElements}
import { appState, inputRangeElements } from "./state.js";
import { PAGES_ID, phaseList, RANGE_SOURCE, COLORS } from "./const.js";
import { rangeBuilderFromInput, parseRange, getFromSelect, rangeBuilderFromSelect} from "./utils.js"
import { quiz } from "./quiz.js";
function showPage(id, option=null){
    const sections = [PAGES_ID.HOME, PAGES_ID.QUIZ]
    appState.phase = phaseList.initialize
    switch(id){
        case PAGES_ID.HOME : 
            home();
            break;
        case PAGES_ID.QUIZ : 
            if(option === null) console.error("option is null")
            quiz(option);
            break;
    }
    sections.forEach( name => {
        const e = document.getElementById(name)
        if(name === id) e.classList.remove("hidden");
        else e.classList.add("hidden");
    })
}

//出題範囲の初めと終わりの単語を表示する場所を空にする関数
function resetWordBox(){
    inputRangeElements.startWord.textContent = "";
    inputRangeElements.endWord.textContent = "";
}
//出題範囲の入力フォームを空にする関数
function resetInputValue(){
    inputRangeElements.inputRangeMin.value = "";
    inputRangeElements.inputRangeMax.value = "";
}
//出題範囲の初めと終わりの単語を表示する関数
function changeRangeWordsUI(minWord,maxWord,idx,ranges){
    inputRangeElements.startWord.append(minWord ? minWord : "範囲指定エラー",idx < ranges.length ? "," : "");
    inputRangeElements.endWord.append(maxWord ? maxWord : "範囲指定エラー" ,idx < ranges.length ? "," : "");
}
//出題範囲の入力フォームの背景色を変更する関数
function changeInputBackgroundColor(c){
    inputRangeElements.inputRangeMin.style.backgroundColor = c;
    inputRangeElements.inputRangeMax.style.backgroundColor = c;
}
//出題範囲の表示・変数をリセットする関数
function resetRange(){
    changeInputBackgroundColor("white")
    resetInputValue();
    resetWordBox();
    appState.range = [];
    appState.committedRange = [];
}
//出題範囲の入力フォームのmin,maxを再描画する関数 - min,maxの大小関係が逆の時に使う
function changeRangeUI(min, max){   
    if(min !== null && max !== null) {
        inputRangeElements.inputRangeMin.value = min;
        inputRangeElements.inputRangeMax.value = max;
    }
}

/**
 * 出題範囲に対応する単語表示を更新する関数
 * @param {Range[]} ranges
 */
function changeRangeWords(ranges){
    let idx = 1;
    for(let v of ranges){
        const min = v.min;
        const max = v.max;
        const [minWord, maxWord] = parseRange(min,max);
        changeRangeWordsUI(minWord, maxWord, idx, ranges);
        idx++;
    }
}

/**
 * selectのvalueがc3の時（敬語の章が選択された時）にだけ存在しない範囲を無効にするための関数
 * @param {boolean} bool 
 */
function disableOption(bool){
    document.getElementById("v").disabled = bool;
    document.getElementById("adj").disabled = bool;
    document.getElementById("adjv").disabled = bool;
    document.getElementById("n").disabled = bool;
    document.getElementById("adv").disabled = bool;
}

/**
 * 出題範囲を更新する関数
 * @param {"select" (RANGE_SOURCE.SELECT) | "input" (RANGE_SOURCE.SELECT)} src
 */
function updateRange(src){
    //!制約 : srcはRANGE_SOURCE構造体から指定する
    appState.committedRange = [];
    let ranges;
    resetWordBox();
    if(src === RANGE_SOURCE.SELECT){
        resetInputValue();
        const c = COLORS[src]
        changeInputBackgroundColor(c);
        const sctValue = inputRangeElements.rangeSelectSection.value;
        const posValue = inputRangeElements.rangeSelectPoS.value;
        const selectInfo = getFromSelect(sctValue, posValue);
        disableOption(sctValue === "c3" || sctValue === "idiom");
        ranges = rangeBuilderFromSelect(selectInfo);
    }
    else if(src === RANGE_SOURCE.INPUT){
        const c = COLORS[src]
        changeInputBackgroundColor(c);
        ranges = rangeBuilderFromInput();
    }
    else{
        stdErrorout("unknown error #DEBUG:unexpected argument");
        return;
    }

    if(!ranges) return
    if(ranges.length === 0) return; //空配列用の予約

    changeRangeWords(ranges);
    appState.committedRange = ranges;
}

const angles = {
//ユーザーの進捗に応じて、円グラフの角度を計算する
    maxAngle : (appState.userProgress / appState.NUM_OF_Words)*360,
//円グラフのアニメーションのための変数
    angle : 1
}
//円グラフの要素
const CircleEl = {
    progress : document.getElementById("progress"),
    progressPer : document.getElementById("progress-per"),
    progressNum : document.getElementById("progress-num")
}
//ユーザーの進捗を表示する関数(home画面表示毎に一回でOK)
function drawProgress(){
    angles.angle = 1;
    CircleEl.progressPer.textContent = Math.floor((appState.userProgress / appState.NUM_OF_Words)*100);
    CircleEl.progressNum.textContent = appState.userProgress;
}
//円グラフを描画する関数
function drawCircleProgress(angle){
    CircleEl.progress.style.backgroundImage = `conic-gradient(rgb(255, 255, 255) ${angle}deg, rgb(110, 110, 110) ${angle}deg)`;
}
function drawCircle() {
    if( angles.angle < angles.maxAngle ) {
        angles.angle *= 1.03;
        drawCircleProgress(angles.angle);
        requestAnimationFrame(drawCircle);
    }else{
        if(angles.angle === angles.maxAngle) return;
        angles.angle = angles.maxAngle;
        drawCircleProgress(angles.angle);
        requestAnimationFrame(drawCircle);
    }
}
function home(){
    //円描画
    drawProgress();
    drawCircle();
}

export {showPage, updateRange, changeRangeUI, resetRange}
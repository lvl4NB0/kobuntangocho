/**
 * @typedef {Object} Range : 
 * @property @param {number} min 
 *      : 出題範囲指定において、ユーザーからの入力(間接的な入力も含む)で小さい方 ← !!!処理中はmin>maxの場合もあります。!!! 
 *      !!!appState.wordsのインデックスではないので使用する際は必ず-1すること!!!
 * @property @param {number} max 
 *      : 出題範囲指定において、ユーザーからの入力(間接的な入力も含む)で大きい方 ← !!!処理中はmin>maxの場合もあります。!!!
 *      !!!appState.wordsのインデックスではないので使用する際は必ず-1すること!!!
 */

const appState={
    words : [],
    range : [], //もう使ってないけどcommittedRangeじゃ物足りないときに使うための予約
    committedRange : [], //!!!型は必ず一次元配列
    //本来はDB(またはキャッシュ)からユーザーの進捗を取得する
    NUM_OF_Words : 630,
    userProgress : 300
}
//selectのvalueを出題範囲に変換するための辞書
//一応freezeして、値の書き換えを防止する←リファクタリングしてからちゃんとfreezeできてないからいつか直す(記入日:2026-2-23)
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
    ]
});
//jsonファイルから単語データを読み込む
fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    appState.words = data;
  });
//単語データのマッピング
//未実装（jsonが完成したら作る）

//ページ切り替え
/*function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p =>
        p.classList.add("hidden")
    );
    document.getElementById(pageId).classList.remove("hidden");
}*/



//<!--ここからhome固有の関数-->
//入力値の正規化をする関数
function normalizeStringForInput(s){
    return s.normalize("NFKC")      //全角・半角統一
        .replace(/[（）()]/g, "") //括弧除去
        .replace(/[・,.、]/g, "") //区切り文字除去
        .replace(/\s+/g, " ")   //連続空白削除
        .trim();
}

//出題範囲周りの要素
const inputRangeElements = {
    rangeSelectSection : document.getElementById("range-select-section"),
    rangeSelectPoS : document.getElementById("range-select-PoS"),
    startWord : document.getElementById("start-word"),
    endWord : document.getElementById("end-word"),
    inputRangeMin : document.getElementById("range-min"),
    inputRangeMax : document.getElementById("range-max")
}

//エラーメッセージを表示する関数
const errorMsgs = document.getElementById("error-msgs");
const errorMsg = document.createElement("li");

function stdErrorout(s){
        errorMsgs.textContent = "";
        errorMsg.textContent = s;
        errorMsg.className = "error-msgs";
        errorMsgs.appendChild(errorMsg);
        errorMsg.scrollIntoView({behavior: "smooth", block: "center"});
        return;
    }
//入力を正規化してから返却する関数
function errorCheckRange(){
    let min = parseInt(normalizeStringForInput(inputRangeElements.inputRangeMin.value));
    let max = parseInt(normalizeStringForInput(inputRangeElements.inputRangeMax.value));
    if(isNaN(min) || isNaN(max)) return [null, null];
    if(min > max) [min, max] = [max , min];
    if(min < 1) min = 1;
    if(max > appState.words.length) max = appState.words.length;
    return [min,max];
}
//正規化された入力から、該当する単語をjsonから取り出す関数
function parseRange(min,max){
    if(!min || !max) return [null, null];
    return [appState.words[min-1], appState.words[max-1]];
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
    inputRangeElements.startWord.append(minWord ? minWord.word : "範囲指定エラー",idx < ranges.length ? "," : "");
    inputRangeElements.endWord.append(maxWord ? maxWord.word : "範囲指定エラー" ,idx < ranges.length ? "," : "");
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
    console.log(min, max)
}
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
 * select入力から出題範囲を構築する関数
 * @returns {Range[] | null}
 */
function getFromSelect(){
    const sctValue = inputRangeElements.rangeSelectSection.value;
    const posValue = inputRangeElements.rangeSelectPoS.value;
    const key = `${sctValue}${posValue}`;
    if(RANGE_PARSE_DICTIONARY[key]){
        const range = RANGE_PARSE_DICTIONARY[key];
        return [sctValue,posValue,range];
    }else if(sctValue) return [sctValue,null,null];
    else return [null,null,null];
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
//select入力からrangesを返却する関数
function rangeBuilderFromSelect(selectInfo){
    const [sctValue,posValue,ranges] = selectInfo;
    if(!sctValue || !posValue){
        resetRange();
        return null;
    }
    if(!ranges){
        stdErrorout("unknown error #DEBUG:missed ranges");
        resetRange();
        return null;
    }
    return ranges;
}
//input入力からrangesを返却する関数
function rangeBuilderFromInput(){
    const [min, max] = errorCheckRange();
    if(min === null || max === null) return null;
    changeRangeUI(min,max);
    return [{min : min, max : max}];
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
        const selectInfo = getFromSelect();
        const [sctValue] = selectInfo;
        disableOption(sctValue === "c3");
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
    console.log(ranges);

    if(!ranges) return
    if(ranges.length === 0) return; //空配列用の予約

    changeRangeWords(ranges);
    appState.committedRange = ranges;
    console.log("range has changed to",appState.committedRange);
}
//イベントリスナーを一行で追加するための関数 - 可読性は無視したのでリファクタリング対象(risk:0)
function addEventListenerByEvent(target, event, func, secondEvent, secondFunc ,thirdEvent, thirdFunc){
  const targetEl = document.getElementById(target);
  targetEl.addEventListener(event,func);
  if(secondEvent) targetEl.addEventListener(secondEvent,secondFunc);
  if(thirdEvent) targetEl.addEventListener(thirdEvent,thirdFunc);
}

//イベントリスナー
//ヘッダーのホームボタンをクリックしたときの処理（要素の位置はbodyかも）
addEventListenerByEvent("homebutton","click", () => {
    //showPage(1)
    console.log("clicked")
})

//出題範囲の入力に対応するイベントリスナー
addEventListenerByEvent("range-select-section", "change", () => {updateRange(RANGE_SOURCE.SELECT)});
addEventListenerByEvent("range-select-PoS", "change", () => {updateRange(RANGE_SOURCE.SELECT)});
addEventListenerByEvent("range-min", "change", () => {updateRange(RANGE_SOURCE.INPUT)});
addEventListenerByEvent("range-max", "change", () => {updateRange(RANGE_SOURCE.INPUT)});
//スタートボタン
addEventListenerByEvent("start-btn-flashcard", "click", () =>{
    checkCb(true);
  }, "mouseover", () => {
      document.getElementById("start-btn-flashcard").classList.add("anim-box","zoomin","is-animated");
  },"mouseout",() => {
      document.getElementById("start-btn-quiz").classList.remove("anim-box","zoomin","is-animated");
});

addEventListenerByEvent("start-btn-quiz", "click", () =>{
    checkCb(false);
  }, "mouseover", () => {
      document.getElementById("start-btn-quiz").classList.add("anim-box","zoomin","is-animated");
  },"mouseout",() => {
      document.getElementById("start-btn-quiz").classList.remove("anim-box","zoomin","is-animated");
});
//設定周りのイベントリスナー（穴埋め問題用の設定のdisabled切り替え）
addEventListenerByEvent("cb-fill-typing", "change", checkboxToggle);
addEventListenerByEvent("cb-fill-four-option", "change", checkboxToggle);
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
    cbFillHighlight : document.getElementById("cb-fill-highlight")
}
//クイズの形式のうち、穴埋め問題に関するオプションのいずれかが選択されたとき、穴埋め問題の解答を表示するかどうかのオプションを選択可能にする関数
function checkboxToggle(){
    if(cbElements.cbFillFourOption.checked || cbElements.cbFillTyping.checked){
        cbElements.cbFillHighlight.disabled = false;
    }else{
        cbElements.cbFillHighlight.disabled = true;
    }
}

//オプションの値をまとめて取得し返却する関数
//booleanにするのは過剰設計やったかもやけど一応変更に対応できるように書いておく
function createOptionBuilder(isFlashcard){
    let optionBuilder = {
        shuffle : Boolean(cbElements.cbShuffle.checked),
        includeRelation : Boolean(cbElements.cbIncludeRelation.checked)
    }
    if(isFlashcard){
        optionBuilder.exceptKnown = Boolean(cbElements.cbExceptKnown.checked);
        optionBuilder.showMeaningFirst = Boolean(cbElements.cbShowMeaningFirst.checked);
    }else{
        optionBuilder.fourOption = Boolean(cbElements.cbFourOption.checked);
        optionBuilder.typing = Boolean(cbElements.cbTyping.checked);
        optionBuilder.fillFourOption = Boolean(cbElements.cbFillFourOption.checked);
        optionBuilder.fillTyping = Boolean(cbElements.cbFillTyping.checked);
        optionBuilder.fillHighlight = Boolean(cbElements.cbFillHighlight.checked);
    }
    return optionBuilder;
}
//クイズのオプションの選択に不備があるときのエラーメッセージを表示する関数
function missedCheckQuizOption(optionBuilder){
    if(!optionBuilder.fourOption && !optionBuilder.typing && !optionBuilder.fillFourOption && !optionBuilder.fillTyping) {
        stdErrorout("出題形式を少なくとも１つ選択してください")
        return false;
    }
    return true;
}

//クイズとフラッシュカード両方のオプションの値を取得して、オプションの選択に不備がないかチェックする関数
function checkCb(isFlashcard){
    errorMsgs.textContent = "";
    if(!appState.committedRange || appState.committedRange.length === 0 || !appState.committedRange[0]) {
      stdErrorout("出題範囲の入力が不正です");
      return;
    }
    let optionBuilder = createOptionBuilder(isFlashcard);
    if(!isFlashcard) {
        const isValid = missedCheckQuizOption(optionBuilder);
        if(!isValid) return;
    }
    //startQuiz(optionBuilder, appState.commitedRange);
    console.log("start with options : ",optionBuilder," and appState.commintedrange : ", appState.committedRange);
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
//デバッグ用に、呼び出し元の関数名を取得する関数
function getCaller() {
  const error = new Error();
  const stack = error.stack || '';
  const stackLines = stack.split('\n');
  const callerIndex = stackLines.findIndex(line => line.includes('getCaller')) + 2;
  if (stackLines[callerIndex]) {
    return stackLines[callerIndex].trim();
  }
  return 'Unknown';
}

//デバッグ用に、キー値を取得する関数
function findKey(obj,value){
    return obj.indexOf(value);
}
//円描画
drawProgress();
drawCircle();


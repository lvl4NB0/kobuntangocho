//TODO : クイズ出題ロジックを"リライト"。それに伴って赤文字のみの出題に対応するためデータ構造の見直し。（posも追加する）
import { poolBuilder } from "./quiz.js";
import { showPage, updateRange } from "./ui.js";
import { DOM, appState, inputRangeElements, cbElements } from "./state.js";
import { PAGES_ID, RANGE_SOURCE } from "./const.js";
import { BasisOption, QuizOption } from "./quiz.js";
//function main(){
    /**
     * @typedef {Object} Range : 
     * @property @param {number} min 
     *      : 出題範囲指定において、ユーザーからの入力(間接的な入力も含む)で小さい方 ← !!!処理中はmin>maxの場合もあります。!!! 
     *      !!!appState.wordsのインデックスではないので使用する際は必ず-1すること!!!
     * @property @param {number} max 
     *      : 出題範囲指定において、ユーザーからの入力(間接的な入力も含む)で大きい方 ← !!!処理中はmin>maxの場合もあります。!!!
     *      !!!appState.wordsのインデックスではないので使用する際は必ず-1すること!!!
     */
    
    //イベントリスナーを一行で追加するための関数 - 可読性は無視したのでリファクタリング対象(risk:0)
    function addEventListenerByEvent(target, event, func, secondEvent, secondFunc ,thirdEvent, thirdFunc){
            const targetEl = document.getElementById(target);
            targetEl.addEventListener(event,func);
            if(secondEvent) targetEl.addEventListener(secondEvent,secondFunc);
            if(thirdEvent) targetEl.addEventListener(thirdEvent,thirdFunc);
    }
    //オプションの値をまとめて取得し返却する関数
    //booleanにするのは過剰設計やったかもやけど一応変更に対応できるように書いておく
    function readOption(){
        const data = {
            range : appState.committedRange,
            shuffle : cbElements.cbShuffle.checked,
            includeRelation : cbElements.cbIncludeRelation.checked,
            GendaigoKogo : cbElements.cbKobunToGendaibun.checked,
            exceptKnown : cbElements.cbExceptKnown.checked,
            showMeaningFirst : cbElements.cbShowMeaningFirst.checked,
            fourOption : cbElements.cbFourOption.checked,
            typing : cbElements.cbTyping.checked,
            fillFourOption : cbElements.cbFillFourOption.checked,
            fillTyping : cbElements.cbFillTyping.checked,
            fillHighlight : cbElements.cbFillHighlight.checked,
            hideOption : cbElements.cbHideOption.checked
        }
        return data;

    }
    //クイズとフラッシュカード両方のオプションの値を取得して、オプションの選択に不備がないかチェックする関数
    function checkQuizCb(){
        errorMsgs.textContent = "";
        if(!appState.committedRange || appState.committedRange.length === 0 || !appState.committedRange[0]) {
        stdErrorout("出題範囲の入力が不正です");
        return;
        }
        const data = readOption();
        const option = new QuizOption(data);
        const isValid = option.validate();
        if(!isValid) return;
        showPage(PAGES_ID.QUIZ, option);
        console.log("start with options : ",option," and appState.commintedrange : ", option.range);
    }
    function checkFlashCardCb(){
    errorMsgs.textContent = "";
    if(!appState.committedRange || appState.committedRange.length === 0 || !appState.committedRange[0]) {
    stdErrorout("出題範囲の入力が不正です");
    return;
    }
    const data = readOption();
    const option = new QuizOption(data);
    showPage(PAGES_ID.FLASHCARD);
    console.log("start with options : ",option," and appState.commintedrange : ", option.range);
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
     
    
    
    //jsonファイルから単語データを読み込む
    fetch("./words.json")
        .then(res => res.json())
        .then(data => {
            appState.words = data;
            appState.NUM_OF_Words = appState.words.length;
            poolBuilder();
            showPage(PAGES_ID.HOME);
            //第二学年一学期中間考査範囲を初期値とする
            inputRangeElements.inputRangeMin.value = 1;
            inputRangeElements.inputRangeMax.value = 53;
            updateRange(RANGE_SOURCE.INPUT);
        }).catch((e) =>  {
            //alert("単語データが読み込めませんでした。ページを更新してください。")
            console.error(e);
    });
    //イベントリスナー
    //ヘッダーのホームボタンをクリックしたときの処理（要素の位置はbodyかも）
    addEventListenerByEvent("homebutton","click", () => {
        showPage(PAGES_ID.HOME);
    })

    //出題範囲の入力に対応するイベントリスナー
    addEventListenerByEvent("range-select-section", "change", () => {updateRange(RANGE_SOURCE.SELECT)});
    addEventListenerByEvent("range-select-PoS", "change", () => {updateRange(RANGE_SOURCE.SELECT)});
    addEventListenerByEvent("range-min", "change", () => {updateRange(RANGE_SOURCE.INPUT)});
    addEventListenerByEvent("range-max", "change", () => {updateRange(RANGE_SOURCE.INPUT)});
    //スタートボタン
    addEventListenerByEvent("start-btn-flashcard", "click", () =>{
        checkFlashCardCb();
    }, "mouseover", () => {
        document.getElementById("start-btn-flashcard").classList.add("anim-box","zoomin","is-animated");
    },"mouseout",() => {
        document.getElementById("start-btn-quiz").classList.remove("anim-box","zoomin","is-animated");
    });

    addEventListenerByEvent("start-btn-quiz", "click", () =>{
        checkQuizCb();
    }, "mouseover", () => {
        document.getElementById("start-btn-quiz").classList.add("anim-box","zoomin","is-animated");
    },"mouseout",() => {
        document.getElementById("start-btn-quiz").classList.remove("anim-box","zoomin","is-animated");
    });
    //設定周りのイベントリスナー（穴埋め問題用の設定のdisabled切り替え）    
    //クイズの形式のうち、穴埋め問題に関するオプションのいずれかが選択されたとき、穴埋め問題の解答を表示するかどうかのオプションを選択可能にする関数
    function checkboxToggle(element, condition){
        if(condition){
            element.disabled = false;
        }else{
            element.disabled = true;
        }
    }
    addEventListenerByEvent("cb-fill-typing", "change", () => {checkboxToggle(cbElements.cbFillHighlight, (cbElements.cbFillFourOption.checked || cbElements.cbFillTyping.checked))});
    addEventListenerByEvent("cb-fill-four-option", "change", () => {checkboxToggle(cbElements.cbFillHighlight, (cbElements.cbFillFourOption.checked || cbElements.cbFillTyping.checked))});
    addEventListenerByEvent("cb-four-option", "change", () => {checkboxToggle(cbElements.cbHideOption, (cbElements.cbFourOption.checked || cbElements.cbFillFourOption.checked))});
    addEventListenerByEvent("cb-fill-four-option", "change", () => {checkboxToggle(cbElements.cbHideOption, (cbElements.cbFourOption.checked || cbElements.cbFillFourOption.checked))});
    
    addEventListenerByEvent("hider","click",() => {DOM.hider.classList.add("hidden");})

    
    function stopbub(event){
        event.stopPropagation();
    }
    DOM.overlayInner.addEventListener('click', stopbub);
    
//}

//main();


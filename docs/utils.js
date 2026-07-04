import { inputRangeElements, appState } from "./state.js";
import { changeRangeUI, resetRange } from "./ui.js";
import { RANGE_PARSE_DICTIONARY } from "./const.js";

//入力値の正規化をする関数
function normalizeStringForInput(s){
    return s.normalize("NFKC")    //全角・半角統一
        .replace(/[（）()]/g, "") //括弧除去
        .replace(/[・,.、]/g, "") //区切り文字除去
        .replace(/\s+/g, " ")   //連続空白削除
        .trim();
}

function installJson(){
    const usrAns = prompt("単語帳データをjsonでインストールしますか？（y/n）");
        if(usrAns === "y"){
            const blob = new Blob([JSON.stringify(appState.words, null, 2)], { type: 'application/json' });
            const url = (window.URL || window.webkitURL).createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'words.json';
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
}

//入力を正規化してから返却する関数
function errorCheckRange(min,max){
    if(min === 1630) return [1,630];
    if(min === 11111) installJson();
    if(isNaN(min) || isNaN(max)) return [null, null];
    if(min > max) [min, max] = [max , min];
    if(min < 1) min = 1;
    if(min > 630) min = 630;
    if(max > 630) max = 630;
    return [min,max];
}
//正規化された入力から、該当する単語をjsonから取り出す関数
function parseRange(min,max){
    if(!min || !max) return [null, null];
    const minWord = appState.wordIndex.get(min)
    const maxWord = appState.wordIndex.get(max)
    if(!minWord || !maxWord) return [null, null];
    return [minWord.word, maxWord.word];
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
function getInputValue(){
    const min = parseInt(normalizeStringForInput(inputRangeElements.inputRangeMin.value));
    const max = parseInt(normalizeStringForInput(inputRangeElements.inputRangeMax.value));
    return [min,max]
}
//input入力からrangesを返却する関数
function rangeBuilderFromInput(){
    const [inputMin, inputMax] = getInputValue();
    const [min, max] = errorCheckRange(inputMin, inputMax);
    if(min === null || max === null) return null;
    changeRangeUI(min,max);
    return [{min : min, max : max}];
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

export { rangeBuilderFromInput, rangeBuilderFromSelect, parseRange, getFromSelect, getCaller}
import {FlashCardOption} from "../main.js";

function readOption(){
    const data = {
        range : [{min : 2, max:2}],//appState.committedRange,
        shuffle : false,//cbElements.cbShuffle.checked,
        includeRelation : true,//cbElements.cbIncludeRelation.checked,
        GendaigoKogo : false,//cbElements.cbKobunToGendaibun.checked,
        exceptKnown : false,//cbElements.cbExceptKnown.checked,
        showMeaningFirst : false,//cbElements.cbShowMeaningFirst.checked,
        fourOption : undefined,//cbElements.cbFourOption.checked,
        typing : undefined,//cbElements.cbTyping.checked,
        fillFourOption : undefined,//cbElements.cbFillFourOption.checked,
        fillTyping : undefined,//cbElements.cbFillTyping.checked,
        fillHighlight : undefined,//cbElements.cbFillHighlight.checked,
        hideOption : undefined,//cbElements.cbHideOption.checked
    }
    return data;
    
}

class flashCardSession{
    constructor(data){
        this.option = data;
        
    }
}

fetch("./words.json")
    .then(res => res.json())
    .then(data => {
        appState.words = data;
        appState.NUM_OF_Words = appState.words.length;
    }
)

function start(){
    const 
}
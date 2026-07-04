//クイズ画面
import { phaseList, QUIZ_TYPE } from "./const.js";
import { appState, DOM } from "./state.js";
import { getCaller } from "./utils.js";
import { showPage } from "./ui.js";
import { PAGES_ID } from "./const.js";
//#DEBUG
/*appState.committedRange = [
{min : 1, max : 1}
];
let optionBuilder = {
    shuffle : false,
    includeRelation : false,
    fourOption : true,
    typing : true,
    fillFourOption : true,
    fillTyping : true,
    fillHighlight : true,
    GendaigoKogo : false
}*/


export function quiz(option){
    const quizSession = new QuizSession(option);
}

//クイズのオプションの選択に不備があるときのエラーメッセージを表示する関数
function missedCheckQuizOption(optionBuilder){
    if(!optionBuilder.fourOption && !optionBuilder.typing && !optionBuilder.fillFourOption && !optionBuilder.fillTyping) {
        stdErrorout("出題形式を少なくとも１つ選択してください")
        return false;
    }
    return true;
}

export class BasisOption{
    constructor(data){
        this.range = data.range;
        this.shuffle = data.shuffle;
        this.includeRelation = data.includeRelation;
        this.GendaigoKogo = data.GendaigoKogo;
    }
    
}
export class QuizOption extends BasisOption{
    constructor(data){
        super(data);
        this.fourOption = data.fourOption;
        this.typing = data.typing;
        this.fillFourOption = data.fillFourOption;
        this.fillTyping = data.fillTyping;
        this.fillHighlight = data.fillHighlight;
        this.hideOption = data.hideOption;
    }

    validate(){
        return (
            this.fourOption ||
            this.typing ||
            this.fillFourOption ||
            this.fillTyping
        )
    }
    getType(){
        if(this.fourOption) return QUIZ_TYPE.fourOption;
        if(this.typing) return QUIZ_TYPE.typing;
        if(this.fillFourOption) return QUIZ_TYPE.fillFourOption;
        if(this.fillTyping) return QUIZ_TYPE.fillTyping;
        return false;
    }
}


const QuizRenderer = {

    initializeField(type, shouldHide){
        console.log(getCaller())
        console.log("init field")
        const isFourOptionType = (
            type === QUIZ_TYPE.fourOption || 
            type === QUIZ_TYPE.fillFourOption
        )
        const isTypingType = !isFourOptionType;
        //表示設定
        DOM.fourOption.classList.toggle("hidden", isTypingType); //四択
        DOM.answerBox.classList.toggle("hidden", isFourOptionType); //回答ボックス
        DOM.check.classList.toggle("hidden", isFourOptionType); //回答提出ボタン
        DOM.hideOption.classList.toggle("hidden", isTypingType); //黒で四択を隠すやつの設定切り替えボタン
        this.hideOption(shouldHide) //黒で四択隠すやつ
        //下側の問題文
        DOM.translation.classList.toggle(
            "hidden",
            !(type === QUIZ_TYPE.fillFourOption || type === QUIZ_TYPE.fillTyping)
        )
        DOM.isHighlighted.classList.toggle(
            "hidden",
            !(type === QUIZ_TYPE.fillFourOption || type === QUIZ_TYPE.fillTyping)
        )
    },
    
    setAnswerFieldState(type, frozen){
    switch(type){
        case QUIZ_TYPE.fourOption:
        case QUIZ_TYPE.fillFourOption: //FallThrough
            DOM.fourOption.disabled = frozen;
            DOM.check.classList.toggle("hidden", !frozen);

            break;

        case QUIZ_TYPE.typing:
        case QUIZ_TYPE.fillTyping: //FallThrough
            DOM.answerBox.disabled = frozen;
            
            if(!frozen){
                DOM.answerBox.value = "";
            }
            break;
        }
    },

    changeAnswerButtonText(phase){
        DOM.check.textContent = answerButtonMessage[phase];
    },

    showQuestionProgress(numOfQuestion,currentIndex){
        DOM.progressBar.style.width = `${(currentIndex/numOfQuestion)*100}%`;
        DOM.progressBarNum.textContent = `${currentIndex}/${numOfQuestion}`;
    },

    showResult(s){
        if(s === undefined) s = "ERROR";
        DOM.result.textContent = s;
    },

    readAnswer(){
        return DOM.answerBox.value;
    },

    resetAnswerBox(){
        DOM.answerBox.value = "";
    },

    hideOption(shouldHide){
        DOM.hider.classList.toggle("hidden", !shouldHide);
    },

    showQuestion(question,hintSentence,fontSize = "4em", shouldHighlight){
        DOM.translation.textContent = question;
        DOM.question.textContent = shouldHighlight ? hintSentence : hintSentence.replace(/"/g,"");
        DOM.question.style.fontSize = fontSize;
    },

    applyFourOptionContents(choices){
        for(let i = 0; i < 4; i++){
            DOM.option[i].textContent = choices[i]
        }
    },

    renderHistory : (history) => {
        console.log("from renderHistory")
        DOM.overlay.classList.toggle("overlay_on");
        DOM.overlayInner.innerHTML = "";
        let n = 0; //正答数用
        let ccan = 0; //連続正解数用
        let id = 1; //カード番号
        history.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("history-card");

            const number = document.createElement("div");
            number.classList.add("H");
            number.textContent = `${id}問目：`;
            id++;

            const hint = document.createElement("div");
            hint.classList.add("history-question");
            hint.textContent = item.hintSentence;

            const answer = document.createElement("div");
            answer.classList.add("history-answer");
            answer.textContent = `あなた: ${item.userInput}`;

            const correct = document.createElement("div");
            correct.classList.add("history-correct");
            correct.textContent = `正解: ${item.correct}`;

            const result = document.createElement("div");
            result.classList.add("history-result");
            result.textContent = item.isCorrect ? "正解" : "不正解";
            result.classList.add(item.isCorrect ? "ok" : "ng");
            if(item.isCorrect){
                n++;
                ccan++;
            }else{
                ccan = 0;
            }

            if(item.type === QUIZ_TYPE.fillTyping || item.type === QUIZ_TYPE.fillFourOption){
                const question = document.createElement("div");
                question.classList.add("history-question");
                question.textContent = item.question;

                card.append(number, hint, question, answer, correct, result);
            }
            else card.append(number, hint, answer, correct, result);

            DOM.overlayInner.appendChild(card);
        });
        const length = appState.history ? appState.history.length : 0;
        DOM.answersNum.textContent = length
        DOM.correctAnswersNum.textContent = n;
        DOM.consecutiveCorrectAnswersNum.textContent = ccan;

    },

    renderHighlight(shouldHighlight, hintSentence){
        DOM.question.textContent = shouldHighlight ? hintSentence : hintSentence.replace(/"/g,"");
    }
}

class QuizSession extends QuizOption{
    constructor(option){
        /**
         * @param {QuizOption} option 
         */
        super(option) 
        this.phase = phaseList.initialize
        this.currentIndex = 0;
        this.currentIndexInOneSet = 0;
        this.mode = option.GendaigoKogo;
        this.history = [];
        this.type = this.getType();
        console.log(`now type is ${this.type}`)
        const requestModes = {
            fourOption : this.fourOption,
            typing : this.typing,
            fillFourOption : this.fillFourOption,
            fillTyping : this.fillTyping
        }
        console.log(requestModes)
        this.oneSet = {
            numOfexamples : 0,
            numOfQuestion : 0
        }
        this.quizList = {
            origin : [],
            translation : []
        }
        
        const {
            sum,
            numOfexamples,
            numOfWords,
            originSentences,
            translatedSentences,
            originWords       
        } = quizListBuilder(this.range, this.shuffle, this.includeRelation, requestModes);
        this.numOfQuestion = sum
        this.oneSet.numOfexamples = numOfexamples
        this.oneSet.numOfWords = numOfWords
        this.quizList.origin = originSentences
        this.quizList.translation = translatedSentences
        this.words = originWords

        this.correct;
        this.question;
        this.hintSentence;

        this.nextQuestion();
        QuizRenderer.showQuestionProgress(this.numOfQuestion, this.currentIndex);
        QuizRenderer.showResult("")
        QuizRenderer.setAnswerFieldState(this.type, false)
        QuizRenderer.initializeField(this.type, this.hideOption)
        QuizRenderer.changeAnswerButtonText(phaseList.question)
        this.phase = phaseList.question;
        this.register();
        console.log(this)

    }

    register(){
        DOM.check.addEventListener("click", this.next);
        document.getElementById("homebutton").addEventListener(
            "click", 
            this.Unregister, 
            {once : true}
        );
        
        document.getElementById("quiz-highlight").addEventListener("click",this.switchHighlight);
        document.getElementById("quiz-hide-option").addEventListener("click",this.switchHider);
        
        document.getElementById("four-option").addEventListener('click', this.selectFourOption)

        document.getElementById("quiz-history").addEventListener("click", this.historyHandler);
        DOM.overlay.addEventListener("click", this.historyHandler);
    }
    historyHandler = () => {
        QuizRenderer.renderHistory(this.history);
    }
    switchHighlight = () => {
        this.fillHighlight = !this.fillHighlight;
        QuizRenderer.renderHighlight(this.fillHighlight, this.hintSentence);
    }
    switchHider = () => {
        this.hideOption = !this.hideOption;
        if(this.phase === phaseList.wait){
            this.next();
        }
        QuizRenderer.hideOption(this.hideOption);
    }
    selectFourOption = (e) => {
        const FourOptionID = {
            option1 : "opt1",
            option2 : "opt2",
            option3 : "opt3",
            option4 : "opt4",
            option5 : "optIDK"
        }
        const button = e.target.closest(".four-option");
        if (!button) return;
        if(button.id === FourOptionID.option5) DOM.answerBox.value = "";
        else{
            try{
                DOM.answerBox.value = button.textContent;
            }
            catch(e){
                alert("エラーが発生しました。ページを再読み込みしてください。")
                console.error(e)
            }
        }
        this.next();
    };

    Unregister = () => {
        DOM.check.removeEventListener("click", this.next);
        document.getElementById("four-option").removeEventListener("click", this.selectFourOption);
        document.getElementById("quiz-highlight").removeEventListener("click", this.switchHighlight);
        document.getElementById("quiz-hide-option").removeEventListener("click", this.switchHider);
        document.getElementById("quiz-history").removeEventListener("click", this.historyHandler);
        DOM.overlay.removeEventListener("click", this.historyHandler);
    }

    next = () => {
        console.log(this.phase)
        //try{
            switch(this.phase){
                case phaseList.initialize:
                    console.error("didn't complete initializing")
                    break;
                case phaseList.question:
                    this.phase = phaseList.answerCheck;
                    const input = QuizRenderer.readAnswer();
                    const {sentence , isCorrect} = answerCheck(input,this.correct);
                    QuizRenderer.showResult(sentence);
                    QuizRenderer.setAnswerFieldState(this.type, true)
                    QuizRenderer.changeAnswerButtonText(phaseList.wait)
                    this.history.push({
                        userInput : input,
                        correct : this.correct,
                        question : this.question,
                        hintSentence : this.hintSentence,
                        isCorrect : isCorrect,
                        type : this.type
                    })
                    this.phase = phaseList.wait;
                    this.increaseIndex()
                    const oneSet = (
                        (this.type === QUIZ_TYPE.typing || 
                        this.type === QUIZ_TYPE.fourOption) ? 
                        this.oneSet.numOfWords : 
                        this.oneSet.numOfexamples)
                    if(this.currentIndexInOneSet >= oneSet){
                        this.phase = phaseList.nextQuestionRange;
                        this.next();
                    }
                    break;
                case phaseList.wait:
                    QuizRenderer.showQuestionProgress(
                        this.numOfQuestion, 
                        this.currentIndex
                    )
                    QuizRenderer.changeAnswerButtonText(this.phase);
                    QuizRenderer.setAnswerFieldState(this.type, false);
                    QuizRenderer.showResult("");
                    QuizRenderer.resetAnswerBox();
                    QuizRenderer.hideOption(this.hideOption);
                    this.nextQuestion();
                    this.phase = phaseList.question
                    break;
                case phaseList.nextQuestionRange:
                    this.currentIndexInOneSet = 0;
                    if(this.currentIndex >= this.numOfQuestion){
                        this.phase = phaseList.finished;
                        QuizRenderer.changeAnswerButtonText(this.phase);
                        QuizRenderer.showQuestionProgress(
                            this.currentIndex,
                            this.numOfQuestion
                        );
                        break;
                    }
                    this.phase = phaseList.waitForNextQuestionRange
                    break;
                case phaseList.waitForNextQuestionRange:
                    QuizRenderer.showResult("");
                    switch(this.type){
                        case QUIZ_TYPE.fourOption: 
                            this.fourOption = false;
                            break;
                        case QUIZ_TYPE.typing : 
                            this.typing = false;
                            break;
                        case QUIZ_TYPE.fillFourOption : 
                            this.fillFourOption = false;
                            break;
                        case QUIZ_TYPE.fillTyping : 
                            this.fillTyping = false;
                            break;
                        default : 
                            return false;
                    }
                    QuizRenderer.setAnswerFieldState(this.type, false);
                    this.type = this.getType();
                    this.nextQuestion();
                    QuizRenderer.initializeField(this.type, this.hideOption);
                    QuizRenderer.resetAnswerBox()
                    QuizRenderer.showQuestionProgress(
                        this.numOfQuestion,
                        this.currentIndex
                    );
                    this.phase = phaseList.question;
                    break;
                case phaseList.answerCheck:
                    appState
                    break;
                case phaseList.finished:
                    this.phase = phaseList.initialize;
                    QuizRenderer.showResult("");
                    this.Unregister();
                    showPage(PAGES_ID.HOME);
                    break;
                default:
                console.error("Unknown phase", this.phase);
            //}catch(e){
            //    alert("エラーが発生しました。ページを再読み込みしてください。")
            //    console.error(e);
                //tryの範囲がでかすぎるからそのうち細分化してエラーコードをDBに送信できるようにした方がデバッグしやすいかも？ (2026/3/25)
            //}
        }
    }
    increaseIndex(){
        this.currentIndex++;
        this.currentIndexInOneSet++;
    }
    nextQuestion(){
        switch(this.type){
                case QUIZ_TYPE.fourOption: {
                    this.generateWordQuestion();
                    const {choices} = this.generateChoices(true)
                    QuizRenderer.applyFourOptionContents(choices)
                    break;
                }
                case QUIZ_TYPE.typing: {
                    this.generateWordQuestion();
                    break;
                }
                case QUIZ_TYPE.fillFourOption: {
                    this.generateExampleSentence();
                    const {choices} = this.generateChoices()
                    QuizRenderer.applyFourOptionContents(choices)
                    break;
                }
                case QUIZ_TYPE.fillTyping: {
                    this.generateExampleSentence();
                    break;
                }
                default:
                console.error("unexpected type");
        }
    }
    generateExampleSentence(){
        const [original,translated] = [
            this.quizList.origin[this.currentIndexInOneSet],
            this.quizList.translation[this.currentIndexInOneSet]
        ];
        const questionSentence = this.mode ? original : translated;
        const hintSentence = !this.mode ? original : translated;
        [this.correct,this.question] = extractBlank(questionSentence);
        QuizRenderer.showQuestion(this.question,hintSentence,"4em",this.fillHighlight);
        this.questionSentence = questionSentence;
        this.hintSentence = hintSentence;
    }
    generateWordQuestion(){
        const thisWord = this.words[this.currentIndexInOneSet]
        this.question = thisWord.word;
        this.questionSentence = this.question;
        this.hintSentence = this.question
        const mean = thisWord.meaning;
        const idx = Math.floor(Math.random() * mean.length)
        this.correct = this.type === QUIZ_TYPE.fourOption ? 
            mean[idx].text : 
            mean.map(m => m.text).join("・");
        this.correctWordID = thisWord.id;
        if(this.mode) [this.correct,this.question] = [this.question,this.correct]
        QuizRenderer.showQuestion(this.hintSentence,this.question,"7em",this.fillHighlight);
    }
    generateChoices(shouldNormalize=false){
        const seen = new Set();
        let pool
        if(this.mode) 
            pool = shouldNormalize 
                ? appState.quizMeaningPool
                    .filter(m => {
                        if (
                        m.wordId === this.correctWordID || // 正解IDは除外
                        m.word === this.correct ||         // 正解テキストは除外
                        seen.has(m.word)                        // すでに出たものは除外
                        ) {
                        return false;
                        }
                        seen.add(m.word); // 初めて出たテキストを記録
                        return true;
                    })
                    .map(m => m.word)
                : appState.fourOptionForFillRegacyLang
                    .filter(m => !m.includes(this.correct));
        else pool = shouldNormalize 
                ? appState.quizMeaningPool
                    .filter(m => {
                        if (
                        m.wordId === this.correctWordID || // 正解IDは除外
                        m.text === this.correct ||         // 正解テキストは除外
                        seen.has(m.text)                        // すでに出たものは除外
                        ) {
                        return false;
                        }
                        seen.add(m.text); // 初めて出たテキストを記録
                        return true;
                    })
                    .map(m => m.text)
                : appState.fourOptionForFill
                    .filter(m => !m.includes(this.correct));

        const correctNormalized = normalizeForAnswer(this.correct, this.type);
        this.correct = correctNormalized?.[Math.floor(Math.random() * correctNormalized.length)] ?? null;
        const dummies = shuffle(pool).slice(0, 3);
        const choices = shuffle([this.correct, ...dummies]);
        console.log(choices)
        return {
            choices,
            correctIndex: choices.indexOf(this.correct)
        };
    }
}

     



const answerButtonMessage = {
[phaseList.question] : "答え合わせ",
[phaseList.wait] : "次の問題へ",
[phaseList.finished] : "終了"
}

function normalizeForAnswer(s, type){
return type === QUIZ_TYPE.fourOption || type === QUIZ_TYPE.fillFourOption ? s?.split(/・/)?.filter(n => n.trim() !== "") : s?.replace(/[)）～]/g, "")?.split(/・|\(|（|〔|〈|〉|〕/)?.filter(n => n.trim() !== "");
}
function normalizeForCheck(s){
return s?.replace(/[(（～]/g, "")?.split(/・|\)|）|〔|〈|〉|〕/)?.filter(n => n.trim() !== "");
}
// ()内のみでも正解するバグがあるから後で修正すること。(risk2:2026-05-17)
function answerCheck(input,correct){
const judge = normalizeForCheck(correct);
const normalizedInput = normalizeForCheck(input);
if(judge?.every(m => normalizedInput.includes(m))){
    return {sentence : "正解！", isCorrect : true};
    }else if(judge?.some(m => normalizedInput.includes(m) || normalizeForAnswer(correct,QUIZ_TYPE.typing)?.some(m => normalizedInput.includes(m)))){
    return {sentence : "正解", isCorrect : true}
    }else{
    return {sentence : `不正解。正解：${correct}`, isCorrect : false};
    }
}
/**
 * 
 * @param {Map} range 
 * @param {boolean} shouldShuffle 
 * @param {Map} requestedModes 
 * @returns 
 */
function quizListBuilder(range, shouldShuffle, shouldIncludeRelation, requestedModes){

    /**
     * @param {number} i (単語id)
     * 
     */
    function addThisList(i, wordIndex = appState.wordIndex){
        const word = wordIndex.get(i)
        numOfWords++;
        originWords.push(word);
        try{
            for(const examples of word.example_sentences){
                    originSentences.push(examples.origin);
                    translatedSentences.push(examples.translation);
            }
        }catch(e){console.warn("エラーをスキップ:", e);}
        //try{
            return word.related_words ? word.related_words : null;
        //}
        //catch(e){console.warn(`error : ${word} ;`,e)}    
    }
    let originSentences = [];
    let translatedSentences = [];
    let originWords = []
    let numOfWords = 0

    const buffer = 10000;
    let wordIndex;
    if(shouldShuffle) {
        range = shuffle(range);
        const shuffledWordIndex = shuffle(Array.from(appState.wordIndex.entries()));
        wordIndex = new Map(shuffledWordIndex);
        console.error(wordIndex);
    }else{wordIndex = appState.wordIndex}
        range.forEach( aRange => {
        for(let i = aRange.min; i <= aRange.max; i++){
            //addThisListの返り値は、関連語のIDの配列（存在しない場合はnull）で、関連語が存在する場合はさらにその関連語の例文も追加するために使う
            //この関数きもすぎるからリファクタリングしたい（risk:0, 2026-5-16）
            const relatedWords =  addThisList(i,wordIndex);

            //IDは別だが元は同じ単語（活用などで意味が変わる単語）のための処理、関連語でないので存在していれば無条件で追加する
            //ID = (元単語のID * 10000) + 1
            //ていうかID設計として、IDに意味のある情報を持たせるのは絶対よくない
            //とはいえO(1)で取得するためには仕方なかったんだけど、もうちょっとマシな方法なかったんかと今更ながら思う
            //バグ見つけたわ、見すと悩むの関連語で被ってるわ。今は時間がないからあとでbufferとid書き直す。(risk2:2026-05-17)
            // && i >9の部分は臨時パッチ
            const secondRelatedWords = wordIndex.get(i*buffer + 1) && i >9 ? addThisList(i*buffer + 1) : null;

            if(shouldIncludeRelation){
                if(relatedWords){
                    console.log(relatedWords)
                    for(var wordID of relatedWords){
                        addThisList(wordID);
                    }
                }
                if(secondRelatedWords){
                    for(var wordID of secondRelatedWords){
                        addThisList(wordID);
                    }
                }
            }
        }
    });
    let m = 0
    let n = 0;
    if(requestedModes.fourOption) m++;
    if(requestedModes.typing) m++;
    if(requestedModes.fillFourOption) n++;
    if(requestedModes.fillTyping) n++;
    const sum = originSentences.length * n + numOfWords * m;
    //console.clear()
    if(shouldShuffle) {
        const shuffledPair = shuffle(originSentences.map((v, i) => ({ org: v, tral: translatedSentences[i] })));
        originSentences = shuffledPair.map(m => m.org);
        translatedSentences = shuffledPair.map(m => m.tral);
        originWords = shuffle(originWords);
    }
    const numOfexamples = originSentences.length
    return {
        sum,
        numOfexamples,
        numOfWords,
        originSentences,
        translatedSentences,
        originWords
    };
}
function shuffle(array){
    //fisher-yates
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

return result;
}
function getType(){
if(appState.optionBuilder.fourOption) return QUIZ_TYPE.fourOption;
if(appState.optionBuilder.typing) return QUIZ_TYPE.typing;
if(appState.optionBuilder.fillFourOption) return QUIZ_TYPE.fillFourOption;
if(appState.optionBuilder.fillTyping) return QUIZ_TYPE.fillTyping;
return false;
}
export function poolBuilder(){
    appState.wordIndex = new Map(
        appState.words.map(w => [w.id, w])
    );
    appState.fourOptionForFill.push(
        ...appState.words.flatMap(w => 
        w.example_sentences.flatMap(e => {
            const [match,_] = extractBlank(e.translation);
            return match ? match : null;
        }).filter(s => s !== null)
    ));
    appState.fourOptionForFillRegacyLang.push(
        ...appState.words.flatMap(w => 
        w.example_sentences.flatMap(e => {
            const [match,_] = extractBlank(e.origin);
            return match ? match : null;
        }).filter(s => s !== null)
    ));
    appState.quizMeaningPool = appState.words.flatMap(word =>
        word.meaning.flatMap(m =>
            normalizeForAnswer(m.text, QUIZ_TYPE.fourOption).map(text => ({
                wordId: word.id,
                word: word.word,
                reading: word.reading,
                meaningNo: m.no,
                text: text
            }))
        )
    );
}

function extractBlank(s){
    const match = s.match(/"(.*?)"/g);
    if (!match) return "";
    const correct = match.join("/").replace(/"/g,"");
    return [correct,s.replace(/".*?"/g, "____"/*.repeat(match[1].length)*/)];//[answer,quiestionSentence]
}

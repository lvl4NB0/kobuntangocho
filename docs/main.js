//TODO : タイピング問題でも正しくできるように四択の選択肢や答えを意味全てで一つにする

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
    
    const phaseList = Object.freeze({
    initialize : "初期化処理",
    question : "回答中",
    answerCheck : "答え合わせの処理中",
    wait : "次の問題への入力待機中",
    finished : "完了",
    nextQuestionRange : "次の出題範囲があるかチェック",
    waitForNextQuestionRange : "次の出題範囲"
    })
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
        optionBuilder : {}
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
    
    const PAGES_ID = {
        HOME : "home",
        QUIZ : "quiz"
    }
    function showPage(id){
        const sections = [PAGES_ID.HOME, PAGES_ID.QUIZ]
        appState.phase = phaseList.initialize
        switch(id){
            case PAGES_ID.HOME : 
                home();
                break;
            case PAGES_ID.QUIZ : 
                quiz();
                break;
        }
        sections.forEach( name => {
            const e = document.getElementById(name)
            if(name === id) e.classList.remove("hidden");
            else e.classList.add("hidden");
        })
    }
    
    //イベントリスナーを一行で追加するための関数 - 可読性は無視したのでリファクタリング対象(risk:0)
    function addEventListenerByEvent(target, event, func, secondEvent, secondFunc ,thirdEvent, thirdFunc){
            const targetEl = document.getElementById(target);
            targetEl.addEventListener(event,func);
            if(secondEvent) targetEl.addEventListener(secondEvent,secondFunc);
            if(thirdEvent) targetEl.addEventListener(thirdEvent,thirdFunc);
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
            ],
            idiomall : [
                {min : 316, max : 379}
            ]
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
            if(min === 1630) return [1,630];
            if(min === 11111){
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
            console.log(ranges);

            if(!ranges) return
            if(ranges.length === 0) return; //空配列用の予約

            changeRangeWords(ranges);
            appState.committedRange = ranges;
            console.log("range has changed to",appState.committedRange);
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

        //オプションの値をまとめて取得し返却する関数
        //booleanにするのは過剰設計やったかもやけど一応変更に対応できるように書いておく
        function createOptionBuilder(isFlashcard){
            let optionBuilder = {
                shuffle : Boolean(cbElements.cbShuffle.checked),
                includeRelation : Boolean(cbElements.cbIncludeRelation.checked),
                GendaigoKogo : Boolean(cbElements.cbKobunToGendaibun.checked)
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
                optionBuilder.hideOption = Boolean(cbElements.cbHideOption.checked);
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
            appState.optionBuilder = optionBuilder;
            showPage(PAGES_ID.QUIZ);
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
        function home(){
            //円描画
            drawProgress();
            drawCircle();
        }
    

    //クイズ画面

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

        const quizState = {
            mode : appState.optionBuilder.GendaigoKogo,
            includeRelation : appState.optionBuilder.includeRelation,
            shuffle : appState.optionBuilder.shuffle,
            hideOption : appState.optionBuilder.hideOption,
            originalMap : [],
            quizList : {
                origin: [],
                translation: []
            },
            words : [],
            translationMap : [],
            currentIndex : 0,
            currentIndexInOneSet : 0,
            answer : "",
            question : "",
            correct  : "",
            correctWordID : 0,
            questionSentence :"",
            hintSentence : "",
            numOfQuestion : 0,
            oneSet : {
                numOfexamples : 0,
                numOfWords : 0
            },
            type : "",
            fourOptionForFill : [],
            fourOptionNoNormalized : [],
            quizMeaningPool : [],
            fourOptionForFillRegacyLang : []
        }
        function extractBlank(s){
            const match = s.match(/"(.*?)"/g);
            if (!match) return "";
            const correct = match.join("/").replace(/"/g,"");
            return [correct,s.replace(/".*?"/g, "____"/*.repeat(match[1].length)*/)];//[answer,quiestionSentence]
        }
        function showQuestion(question,hintSentence,fontSize = "4em"){
        DOM.translation.textContent = question;
        DOM.question.textContent = appState.isHighlighted ? hintSentence : hintSentence.replace(/"/g,"");
        DOM.question.style.fontSize = fontSize;
        }
        
        function showQuestionProgress(numOfQuestion,currentIndex){
            DOM.progressBar.style.width = `${(currentIndex/numOfQuestion)*100}%`
            DOM.progressBarNum.textContent = `${currentIndex}/${numOfQuestion}`;
        }

        function restoreHistory(input,correct,question,hint,isCorrect,type){
        appState.history.push({
            userInput : input, 
            correct : correct, 
            question : question, 
            hintSentence : hint,
            isCorrect : isCorrect,
            type : type
        });
        console.log(`restored user history : `,appState.history);
        }

        const answerButtonMessage = {
        [phaseList.question] : "答え合わせ",
        [phaseList.wait] : "次の問題へ",
        [phaseList.finished] : "終了"
        }
        function showResult(s){
        if(s === undefined) s = "ERROR"
        DOM.result.textContent = s;
        }
        function ChangeAnswerButtonText(condition){
        DOM.check.textContent = answerButtonMessage[condition];
        }

        function normalizeForAnswer(s){
        return quizState.type === QUIZ_TYPE.fourOption || quizState.type === QUIZ_TYPE.fillFourOption ? s?.replace(/[)）]/g, "")?.split(/・/)?.filter(n => n.trim() !== "") : s?.replace(/[)）～]/g, "")?.split(/・|\(|（|〔|〈|〉|〕/)?.filter(n => n.trim() !== "");
        }
        function answerCheck(input,correct){
        const judge = normalizeForAnswer(correct);
        const normalizedInput = normalizeForAnswer(input);
        if(judge?.every(m => normalizedInput.includes(m))){
            return {sentence : "正解！", isCorrect : true};
            }else if(judge?.some(m => normalizedInput.includes(m))){
            return {sentence : "正解", isCorrect : true}
            }else{
            return {sentence : `不正解。正解：${correct}`, isCorrect : false};
            }
        }
        function generateExampleSentence(){
            const [original,translated] = [quizState.quizList.origin[quizState.currentIndexInOneSet],quizState.quizList.translation[quizState.currentIndexInOneSet]];
            const questionSentence = quizState.mode ? original : translated;
            const hintSentence = !quizState.mode ? original : translated;
            [quizState.correct,quizState.question] = extractBlank(questionSentence);
            console.log(`correct : ${quizState.correct}, mode : ${quizState.mode}, :: ${questionSentence},${hintSentence}`)
            showQuestion(quizState.question,hintSentence);
            quizState.questionSentence = questionSentence;
            quizState.hintSentence = hintSentence;
        }
        function generateWordQuestion(){
            const thisWord = quizState.words[quizState.currentIndexInOneSet]
            quizState.question = thisWord.word;
            quizState.questionSentence = quizState.question;
            quizState.hintSentence = quizState.question
            const mean = thisWord.meaning;
            const idx = Math.floor(Math.random() * mean.length)
            quizState.correct = quizState.type === QUIZ_TYPE.fourOption ? mean[idx].text : mean.map(m => m.text).join("・");
            quizState.correctWordID = thisWord.id;
            if(quizState.mode) [quizState.correct,quizState.question] = [quizState.question,quizState.correct]
            showQuestion(quizState.hintSentence,quizState.question,"7em");
        }
        function nextQuestion(type){
            switch(type){
                case QUIZ_TYPE.fourOption:
                    generateWordQuestion();
                    applyFourOptionText(true);
                break;
                case QUIZ_TYPE.Typing:
                    generateWordQuestion();
                break;
                case QUIZ_TYPE.fillFourOption:
                    generateExampleSentence();
                    applyFourOptionText();
                break;
                case QUIZ_TYPE.fillTyping:
                    generateExampleSentence();
                break;
                default:
                console.error("unexpected type");
        }
        }
        function initializeQuestionField(type){
            function forFourOption(){
                    DOM.fourOption.classList.remove("hidden");
                    DOM.answerBox.classList.add("hidden");
                    DOM.check.classList.add("hidden");
                }
            function forTyping(){
                    DOM.answerBox.classList.remove("hidden");
                    DOM.check.classList.remove("hidden");
                    DOM.fourOption.classList.add("hidden");
                }
            switch(type){
                case QUIZ_TYPE.fourOption:
                    forFourOption();
                    DOM.translation.classList.add("hidden");
                break;
                case QUIZ_TYPE.Typing:
                    forTyping();
                    DOM.translation.classList.add("hidden");
                break;
                case QUIZ_TYPE.fillFourOption:
                    forFourOption();
                    DOM.translation.classList.remove("hidden");
                break;
                case QUIZ_TYPE.fillTyping:
                    forTyping();
                    DOM.translation.classList.remove("hidden");
                break;
                default:
                console.error("unexpected type");
        }
        }
        function renderHistory() {
            DOM.overlayInner.innerHTML = "";
            let n = 0; //正答数用
            let ccan = 0; //連続正解数用
            let id = 1; //カード番号
            appState.history.forEach(item => {
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

        }

        const FourOptionID = {
            option1 : "opt1",
            option2 : "opt2",
            option3 : "opt3",
            option4 : "opt4",
            option5 : "optIDK"
        }

        function selectFourOption(text,id){
        if(id === FourOptionID.option5) DOM.answerBox.value = "";
        else{
            try{
            DOM.answerBox.value = text;
            }
            catch(e){
            alert("エラーが発生しました。ページを再読み込みしてください。")
            console.error(e)
            }
        }
        majorHandler();
        }

        const parent = document.getElementById('four-option');
        parent.addEventListener('click', (e) => {
            const button = e.target.closest('.four-option');
            if (!button) return;
            selectFourOption(button.textContent,button.id);
        });
        function quizListBuilder(){
            /**
             * @param {number} i (単語id)
             * 
             */
            function addThisList(i, wordIndex = appState.wordIndex){
                console.log(wordIndex)
                const word = wordIndex.get(i)
                console.log(word ? word : null)
                numOfWords++;
                originWords.push(word);
                console.log(word)
                console.log(i)
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
            if(quizState.shuffle) {
                appState.committedRange = shuffle(appState.committedRange);
                const shuffledWordIndex = shuffle(Array.from(appState.wordIndex.entries()));
                wordIndex = new Map(shuffledWordIndex);
                console.error(wordIndex);
            }else{wordIndex = appState.wordIndex}
            appState.committedRange.forEach( aRange => {
                for(let i = aRange.min; i <= aRange.max; i++){
                    //addThisListの返り値は、関連語のIDの配列（存在しない場合はnull）で、関連語が存在する場合はさらにその関連語の例文も追加するために使う
                    //この関数きもすぎるからリファクタリングしたい（risk:0, 2026-5-16）
                    const relatedWords =  addThisList(i,wordIndex);

                    //IDは別だが元は同じ単語（活用などで意味が変わる単語）のための処理、関連語でないので存在していれば無条件で追加する
                    //ID = (元単語のID * 10000) + 1
                    //ていうかID設計として、IDに意味のある情報を持たせるのは絶対よくない
                    //とはいえO(1)で取得するためには仕方なかったんだけど、もうちょっとマシな方法なかったんかと今更ながら思う
                    //バグ見つけたわ、見すと悩むの関連語で被ってるわ。今は時間がないからあとでbufferとid書き直す。(risk2:2026-05-17)
                    // && i !=1の部分は臨時パッチ
                    const seccondRelatedWords = wordIndex.get(i*buffer + 1) && i !=1 ? addThisList(i*buffer + 1) : null;

                    if(quizState.includeRelation){
                        if(relatedWords){
                            for(wordID of relatedWords){
                                addThisList(wordID);
                            }
                        }
                        if(seccondRelatedWords){
                            for(wordID of seccondRelatedWords){
                                addThisList(wordID);
                            }
                        }
                    }
                }
            });
            let m = 0
            let n = 0;
            if(appState.optionBuilder.fourOption) m++;
            if(appState.optionBuilder.typing) m++;
            if(appState.optionBuilder.fillFourOption) n++;
            if(appState.optionBuilder.fillTyping) n++;
            const sum = originSentences.length * n + numOfWords * m;
            //console.clear()
            if(quizState.shuffle) {
                const shuffledPair = shuffle(originSentences.map((v, i) => ({ org: v, tral: translatedSentences[i] })));
                console.log(shuffledPair)
                originSentences = shuffledPair.map(m => m.org);
                translatedSentences = shuffledPair.map(m => m.tral);
                originWords = shuffle(originWords);
                console.log(originWords)
            }
            console.log(originSentences)
            console.log(translatedSentences)
            return [sum,[originSentences.length,numOfWords],originSentences,translatedSentences,originWords];
        }
        function poolBuilder(){
            appState.wordIndex = new Map(
                appState.words.map(w => [w.id, w])
            );
            console.log(appState.wordIndex)
            quizState.fourOptionForFill.push(
                ...appState.words.flatMap(w => 
                w.example_sentences.flatMap(e => {
                    const [match,_] = extractBlank(e.translation);
                    return match ? match : null;
                }).filter(s => s !== null)
            ));
            quizState.fourOptionForFillRegacyLang.push(
                ...appState.words.flatMap(w => 
                w.example_sentences.flatMap(e => {
                    const [match,_] = extractBlank(e.origin);
                    return match ? match : null;
                }).filter(s => s !== null)
            ));
            console.log(quizState.fourOptionForFill)
            quizState.quizMeaningPool = appState.words.flatMap(word =>
                word.meaning.flatMap(m =>
                    normalizeForAnswer(m.text).map(text => ({
                        wordId: word.id,
                        word: word.word,
                        reading: word.reading,
                        meaningNo: m.no,
                        text: text
                    }))
                )
            );
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
        function generateChoices(isNormalized){
        const seen = new Set();
        let pool
        if(quizState.mode) 
            pool = isNormalized 
                ? quizState.quizMeaningPool
                    .filter(m => {
                        if (
                        m.wordId === quizState.correctWordID || // 正解IDは除外
                        m.word === quizState.correct ||         // 正解テキストは除外
                        seen.has(m.word)                        // すでに出たものは除外
                        ) {
                        return false;
                        }
                        seen.add(m.word); // 初めて出たテキストを記録
                        return true;
                    })
                    .map(m => m.word)
                : quizState.fourOptionForFillRegacyLang
                    .filter(m => !m.includes(quizState.correct));
        else pool = isNormalized 
                ? quizState.quizMeaningPool
                    .filter(m => {
                        if (
                        m.wordId === quizState.correctWordID || // 正解IDは除外
                        m.text === quizState.correct ||         // 正解テキストは除外
                        seen.has(m.text)                        // すでに出たものは除外
                        ) {
                        return false;
                        }
                        seen.add(m.text); // 初めて出たテキストを記録
                        return true;
                    })
                    .map(m => m.text)
                : quizState.fourOptionForFill
                    .filter(m => !m.includes(quizState.correct));

        const correctNormalized = normalizeForAnswer(quizState.correct);
        quizState.correct = correctNormalized?.[Math.floor(Math.random() * correctNormalized.length)] ?? null;
        const dummies = shuffle(pool).slice(0, 3);
        const choices = shuffle([quizState.correct, ...dummies]);
        return {
            choices,
            correctIndex: choices.indexOf(quizState.correct)
        };
        }
        function getCaller(){
        const error = new Error();
        const stack = error.stack || '';
        const stackLines = stack.split('\n');
        const callerIndex = stackLines.findIndex(line => line.includes('getCaller')) + 2;
        if (stackLines[callerIndex]) {
            return stackLines[callerIndex].trim();
        }
        return 'Unknown';
        }
        const QUIZ_TYPE = Object.freeze({
        fourOption : "四択問題",
        Typing : "一問一答",
        fillFourOption : "例文穴埋め四択問題",
        fillTyping : "例文穴埋め問題"
        })
        function getType(){
        if(appState.optionBuilder.fourOption) return QUIZ_TYPE.fourOption;
        if(appState.optionBuilder.typing) return QUIZ_TYPE.Typing;
        if(appState.optionBuilder.fillFourOption) return QUIZ_TYPE.fillFourOption;
        if(appState.optionBuilder.fillTyping) return QUIZ_TYPE.fillTyping;
        return false;
        }
        function completeOptionBuilder(){
        switch(quizState.type){
        case QUIZ_TYPE.fourOption: 
            appState.optionBuilder.fourOption = false;
            break;
        case QUIZ_TYPE.Typing : 
            appState.optionBuilder.typing = false;
            break;
        case QUIZ_TYPE.fillFourOption : 
            appState.optionBuilder.fillFourOption = false;
            break;
        case QUIZ_TYPE.fillTyping : 
            appState.optionBuilder.fillTyping = false;
            break;
        default : 
            return false;
        }
        }
        function ControlAnswerButtonAtribute(bool){
        if(quizState.type === QUIZ_TYPE.fillFourOption || quizState.type === QUIZ_TYPE.fourOption){
            if(!bool) DOM.check.classList.add("hidden");
            else DOM.check.classList.remove("hidden");
            DOM.fourOption.disabled = bool;
        }
        else if(quizState.type === QUIZ_TYPE.Typing || quizState.type === QUIZ_TYPE.fillTyping){
            DOM.answerBox.disabled = bool;
            if(!bool) DOM.answerBox.value = "";
        }
        }
        function applyFourOptionText(isNormalized = false){
            const {choices,_} = generateChoices(isNormalized);
            for(let i = 0; i < 4; i++){
                DOM.option[i].textContent = choices[i]
            }
        }
        function switchHide(element, shouldHide){
            if(shouldHide){
                element.classList.remove("hidden");
            } else {
                element.classList.add("hidden");
            }
        }
        function switchOpitonUI(){
            switchHide(DOM.hideOption, (quizState.type === QUIZ_TYPE.fourOption || quizState.type === QUIZ_TYPE.fillFourOption));
            switchHide(DOM.isHighlighted, (quizState.type === QUIZ_TYPE.fillFourOption || quizState.type === QUIZ_TYPE.fillTyping));
        }
        function majorHandler(){
        console.log(quizState.currentIndex)
        try{
        switch(appState.phase){
            case phaseList.initialize :
                quizState.currentIndex = 0;
                quizState.currentIndexInOneSet = 0;
                appState.history = [];
                DOM.answerBox.value = "";
                quizState.mode = appState.optionBuilder.GendaigoKogo;
                quizState.includeRelation = appState.optionBuilder.includeRelation;
                quizState.shuffle = appState.optionBuilder.shuffle;
                quizState.hideOption = appState.optionBuilder.hideOption;
                switchHide(DOM.hider, quizState.hideOption);
                quizState.type = getType();
                console.log(quizState.type)
                switchOpitonUI();
                initializeQuestionField(quizState.type);
                ControlAnswerButtonAtribute(false);
                ChangeAnswerButtonText(phaseList.question);
                [
                    quizState.numOfQuestion,
                    [quizState.oneSet.numOfexamples,quizState.oneSet.numOfWords],
                    quizState.quizList.origin,
                    quizState.quizList.translation,
                    quizState.words
                ] = quizListBuilder();
                nextQuestion(quizState.type);
                appState.phase = phaseList.question;
                showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
                showResult("");
                break;
            case phaseList.wait :  
                appState.phase = phaseList.question;
                ChangeAnswerButtonText(appState.phase);
                showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
                ControlAnswerButtonAtribute(false);
                showResult("");
                nextQuestion(quizState.type);
                DOM.answerBox.value = "";
                switchHide(DOM.hider, quizState.hideOption);
                break;
            case phaseList.question :
                const input = DOM.answerBox.value;
                appState.phase = phaseList.answerCheck;
                const {sentence , isCorrect} = answerCheck(input,quizState.correct);
                showResult(sentence);
                appState.phase = phaseList.wait;
                ChangeAnswerButtonText(appState.phase);
                ControlAnswerButtonAtribute(true);
                restoreHistory(
                    input,
                    quizState.correct,
                    quizState.question,
                    quizState.hintSentence,
                    isCorrect,
                    quizState.type
                );
                quizState.currentIndex++;
                quizState.currentIndexInOneSet++;
                const oneSet = quizState.type === QUIZ_TYPE.Typing || quizState.type === QUIZ_TYPE.fourOption ? quizState.oneSet.numOfWords : quizState.oneSet.numOfexamples
                if(quizState.currentIndexInOneSet >= oneSet){
                appState.phase = phaseList.nextQuestionRange;
                console.log("DEBUG : " + `phase is ${appState.phase} currentIndexInOneSet(${quizState.currentIndexInOneSet + 1})>oneSet(${oneSet})` + getCaller())
                majorHandler();
                return;
                }
                break;
            case phaseList.answerCheck : 
            
                break;
            case phaseList.nextQuestionRange : 
                quizState.currentIndexInOneSet = 0;
                if(quizState.currentIndex >= quizState.numOfQuestion){
                    appState.phase = phaseList.finished;
                    ChangeAnswerButtonText(appState.phase);
                    showQuestionProgress(quizState.currentIndex,quizState.numOfQuestion);
                    console.log("DEBUG : " + `phase is ${appState.phase} currentIndex(${quizState.currentIndex + 1})>numOfquestion(${quizState.numOfQuestion})` + getCaller())
                    return;
                }
                appState.phase = phaseList.waitForNextQuestionRange
                break;
            case phaseList.waitForNextQuestionRange : 
                showResult("");
                completeOptionBuilder();
                ControlAnswerButtonAtribute(false);
                quizState.type = getType();
                console.log(quizState.type)
                nextQuestion(quizState.type);
                switchOpitonUI();
                initializeQuestionField(quizState.type);
                DOM.answerBox.value = "";
                appState.phase = phaseList.question;
                showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
            break;
            case phaseList.finished :
                console.log("finished!!!")
                appState.phase = phaseList.initialize;
                showResult("");
                showPage(PAGES_ID.HOME);
                break;
            default:
            console.error("Unknown phase", appState.phase);
        }
        }catch(e){
            alert("エラーが発生しました。ページを再読み込みしてください。")
            console.error(e);
            //tryの範囲がでかすぎるからそのうち細分化してエラーコードをDBに送信できるようにした方がデバッグしやすいかも？ (2026/3/25)
        }
        }
        
    function quiz(){
        majorHandler();
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
            alert("単語データが読み込めませんでした。ページを更新してください。")
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

    function overlayToggle(){
        DOM.overlay.classList.toggle("overlay_on");
        renderHistory();
    }
    document.addEventListener('DOMContentLoaded', () => {
    addEventListenerByEvent("quiz-history","click",overlayToggle);
    DOM.overlay.addEventListener("click",overlayToggle);
    function stopbub(event){
        event.stopPropagation();
    }
    DOM.overlayInner.addEventListener('click', stopbub, false);
    }, false);
    function switchHighlight(){
        appState.isHighlighted = !appState.isHighlighted;
        DOM.question.textContent = appState.isHighlighted ? quizState.hintSentence : quizState.hintSentence.replace(/"/g,"");
    }
    function switchHider(){
        quizState.hideOption = !quizState.hideOption;
        if(appState.phase === phaseList.wait){
            majorHandler();
        }
        switchHide(DOM.hider, quizState.hideOption);
    }
    addEventListenerByEvent("quiz-highlight","click",switchHighlight)
    addEventListenerByEvent("check","click",majorHandler);
    addEventListenerByEvent("hider","click",() => {DOM.hider.classList.add("hidden");})
    addEventListenerByEvent("quiz-hide-option","click",switchHider)
//}

//main();



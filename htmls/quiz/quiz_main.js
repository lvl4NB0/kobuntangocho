//TODO : jsonの例文の構成を変える(exampleオブジェクトの中に現代語訳と原文を入れる)、出題ロジックを作る、シャッフル機能を実装する、あとコミットしなおすのめんどくさいからjsとcssの読み込み順変えるのも後でやる

//後で大文字にする
const phaseList = Object.freeze({
  initialize : "初期化処理",
  question : "回答中",
  answerCheck : "答え合わせの処理中",
  wait : "次の問題への入力待機中",
  finished : "完了",
  nextQuestion : "次の出題範囲"
})
const appState = { 
  words : [],
  isHighlighted : true,
  history : [],
  phase : phaseList.initialize,
  committedRange : [], //!!!型は必ず一次元配列
}
//#DEBUG
appState.committedRange = [
  {min : 1, max : 2}
];

const DOM = Object.freeze({
  translation : document.getElementById("translation"),
  question : document.getElementById("question"),
  progressBar : document.getElementById("progress-bar"),
  progressBarNum : document.getElementById("progress-bar-num"),
  result : document.getElementById("result"),
  check : document.getElementById("check"),
  overlay : document.getElementById("quiz-history-overlay"),
  answerBox : document.getElementById("answer-typing"),
  fourOption : document.getElementById("four-option")
})

fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    appState.words = data;
    majorHandler();
  });
  
function parseRange(min,max){
    if(!min || !max) return [null, null];
    return [appState.words[min-1], appState.words[max-1]];
}

function addEventListenerByEvent(target, event, func, secondEvent, secondFunc ,thirdEvent, thirdFunc){
  const targetEl = document.getElementById(target);
  targetEl.addEventListener(event,func);
  if(secondEvent) targetEl.addEventListener(secondEvent,secondFunc);
  if(thirdEvent) targetEl.addEventListener(thirdEvent,thirdFunc);
}
function extractBlank(s) {
  const match = s.match(/"(.*?)"/);
  if (!match) return "";
  return [match[1],s.replace(/".*?"/, "_".repeat(match[1].length))];//[answer,quiestionSentence]
}
let optionBuilder = {
    shuffle : false,
    includeRelation : false,
    fourOption : false,
    typing : false,
    fillFourOption : false,
    fillTyping : true,
    fillHighlight : true,
    KobunGendaibun : false
}
function showQuestion(question,hintSentence){
  DOM.translation.textContent = question;
  DOM.question.textContent = appState.isHighlighted ? hintSentence : hintSentence.replace(/"/g,"");
}
function switchHighlight(){
  appState.isHighlighted = !appState.isHighlighted;
  DOM.question.textContent = appState.isHighlighted ? quizState.hintSentence : quizState.hintSentence.replace(/"/g,"");
}
function showQuestionProgress(numOfQuestion,currentIndex){
    //UI表示用にインクリメント
    numOfQuestion++;
    currentIndex++;
    DOM.progressBar.style.width = `${((currentIndex-1)/numOfQuestion)*100}%`
    DOM.progressBarNum.textContent = `${currentIndex}/${numOfQuestion}`;
    DOM.result.textContent = "";
}

function restoreHistory(input,correct,question,hint,isCorrect){
  appState.history.push({
    userInput : input, 
    correct : correct, 
    question : question, 
    hintSentence : hint,
    isCorrect : isCorrect
  });
  console.log(`restored user history : `,appState.history);
}

const answerButtonMessage = {
  [phaseList.question] : "答え合わせ",
  [phaseList.wait] : "次の問題へ",
  [phaseList.finished] : "終了"
}
function showResult(s){
  DOM.result.textContent = s;
}
function ChangeAnswerButtonText(){
  console.log(answerButtonMessage[appState.phase])
  DOM.check.textContent = answerButtonMessage[appState.phase];
}

function normalizeForAnswer(s){
  return s
    ?.replace(/[)）]/g, "")
    ?.split(/・|\(|（/)
    ?.filter(n => n.trim() !== "");
}
function answerCheck(input,correct){
  let s;
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
function GenerateExampleSentence(){
    const [original,translated] = [quizState.quizList.origin[quizState.currentIndex],quizState.quizList.translationMap[quizState.currentIndex]];
    const questionSentence = quizState.mode ? original : translated;
    const hintSentence = !quizState.mode ? original : translated;
    [quizState.correct,quizState.question] = extractBlank(questionSentence);
    showQuestion(quizState.question,hintSentence);
    quizState.questionSentence = questionSentence;
    quizState.hintSentence = hintSentence;
}
function nextQuestion(type){
  switch(type){
    case QUIZ_TYPE.fourOption:
      break;
    case QUIZ_TYPE.Typing:
      break;
    case QUIZ_TYPE.fillFourOption:
      GenerateExampleSentence();
      break;
    case QUIZ_TYPE.fillTyping:
      GenerateExampleSentence();
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

addEventListenerByEvent("quiz-history","click",() => {
  //ここは後で書き換える
  DOM.overlay.classList.toggle("hidden");
  DOM.overlay.textContent = appState.history;
})
addEventListenerByEvent("quiz-highlight","click",switchHighlight)
addEventListenerByEvent("check","click",majorHandler);

const quizState = {
  mode : optionBuilder.KobunGendaibun,
  originalMap : [],
  quizList : {
    origin: [],
    translation: []
  },
  translationMap : [],
  currentIndex : 0,
  answer : "",
  question : "",
  questionSentence :"",
  hintSentence : "",
  numOfQuestion : 0,
  type : ""
}
function quizListBuilder(){
  let originSentences = [];
  let translatedSentences = [];
  appState.committedRange.forEach( aRange => {
    for(let i = aRange.min - 1; i < aRange.max; i++){
      for(const examples of appState.words[i].example_sentences){
        originSentences.push(examples.origin);
        translatedSentences.push(examples.translation);
        console.log(originSentences)
      }
    }
  });
  let n = 0;
  if(optionBuilder.fourOption) n++;
  if(optionBuilder.typing) n++;
  if(optionBuilder.fillFourOption) n++;
  if(optionBuilder.fillTyping) n++;
  const sum = originSentences.length * n;
  return [sum,originSentences,translatedSentences];
}
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
const QUIZ_TYPE = Object.freeze({
  fourOption : "四択問題",
  Typing : "一問一答",
  fillFourOption : "例文穴埋め四択問題",
  fillTyping : "例文穴埋め問題"
})
function getType(){
  if(optionBuilder.fourOption) return QUIZ_TYPE.fourOption;
  if(optionBuilder.typing) return QUIZ_TYPE.Typing;
  if(optionBuilder.fillFourOption) return QUIZ_TYPE.fillFourOption;
  if(optionBuilder.fillTyping) return QUIZ_TYPE.fillTyping;
  return false;
}
function completeOptionBuilder(){
  switch(quizState.type){
  case QUIZ_TYPE.fourOption: 
    optionBuilder.fourOption = false;
    break;
  case QUIZ_TYPE.Typing : 
    optionBuilder.typing = false;
    break;
  case QUIZ_TYPE.fillFourOption : 
    optionBuilder.fillFourOption = false;
    break;
  case QUIZ_TYPE.fillTyping : 
    optionBuilder.fillTyping = false;
    break;
  default : 
    return false;
  }
}

function majorHandler(){
  try{
  switch(appState.phase){
    case phaseList.initialize :
      quizState.mode = optionBuilder.KobunGendaibun;
      quizState.type = getType();
      if(quizState.type === false) alert("finished process"); //showPage();
      [quizState.numOfQuestion,quizState.quizList.origin,quizState.quizList.translationMap] = quizListBuilder();
      quizState.currentIndex = 0;
      nextQuestion(quizState.type);
      appState.phase = phaseList.question;
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      break;
    case phaseList.wait :  
        appState.phase = phaseList.question;
        nextQuestion(quizState.type);
        ChangeAnswerButtonText();
        showResult("");
        DOM.answerBox.disabled = false;
        DOM.answerBox.value = "";
        showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      break;
    case phaseList.question :
      const input = DOM.answerBox.value;
      appState.phase = phaseList.answerCheck;
      const {s , isCorrect} = answerCheck(input,quizState.correct);
      showResult(s);
      appState.phase = phaseList.wait;
      ChangeAnswerButtonText();
      DOM.answerBox.disabled = true;
      restoreHistory(
        input,
        quizState.correct,
        quizState.questionSentence,
        quizState.hintSentence,
        isCorrect
      );
      quizState.currentIndex++;
      if(quizState.currentIndex + 1 > quizState.numOfQuestion){
        appState.phase = phaseList.finished;
        completeOptionBuilder();
        ChangeAnswerButtonText();
        alert("DEBUG")
      }
      break;
    case phaseList.finished : 
      appState.phase = phaseList.initialize;
      majorHandler();
      //showPage();
      break;
    default:
      console.error("Unknown phase", appState.phase);
  }
  }catch(e){
    alert("エラーが発生しました。ページを再読み込みしてください。")
    console.error(e);
  }
}
//後で大文字にする
const phaseList = Object.freeze({
  initialize : "初期化処理",
  question : "回答中",
  answerCheck : "答え合わせの処理中",
  wait : "次の問題への入力待機中",
  reset : "完了",
  nextQuestion : "次の出題範囲"
})
const appState = { 
  words : [],
  isHighlighted : true,
  history : [],
  phase : phaseList.initialize,
  range : [], //もう使ってないけどcommittedRangeじゃ物足りないときに使うための予約
  committedRange : [], //!!!型は必ず一次元配列
}
//#DEBUG
appState.committedRange = [
  {min : 1, max : 315}
];

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
  const startIdx = s.indexOf('"');
  const endIdx = s.indexOf('"', startIdx + 1);
  if (startIdx === -1 || endIdx === -1 || startIdx >= endIdx) {
    return "";
  }
  const betweenLength = endIdx - startIdx - 1;

  const match = s.match(/"(.*?)"/);
  if (!match) return "";
  return [match[1],s.replace(/".*?"/, "_".repeat(betweenLength))];//[answer,quiestionSentence]
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
  document.getElementById("translation").textContent = question;
  document.getElementById("question").textContent = appState.isHighlighted ? hintSentence : hintSentence.replace(/"/g,"");
}
function switchHighlight(){
  appState.isHighlighted = !appState.isHighlighted;
  document.getElementById("question").textContent = appState.isHighlighted ? quizState.hintSentence : quizState.hintSentence.replace(/"/g,"");
}
function showQuestionProgress(numOfQuestion,currentIndex){
    //UI表示用にインクリメント
    numOfQuestion++;
    currentIndex++;
    document.getElementById("progress-bar").style.width = `${((currentIndex-1)/numOfQuestion)*100}%`
    document.getElementById("progress-bar-num").textContent = `${currentIndex}/${numOfQuestion}`;
    document.getElementById("result").textContent = "";
}

function restoreHistory(input,correct,question,hint){
  appState.history.push({userInput : input, correct : correct, question : question, hintSentence : hint});
  console.log(`restored user history : `,appState.history);
}

const answerButtonMessage = {
  [phaseList.question] : "答え合わせ",
  [phaseList.wait] : "次の問題へ"
}
function showResult(s){
  document.getElementById("result").textContent = s;
}
function ChangeAnswerButtonText(){
  console.log(answerButtonMessage[appState.phase])
  document.getElementById("check").textContent = answerButtonMessage[appState.phase];
}

function normalizeForAnswer(s){
  return s
    .replace(/[)）]/g, "")
    .split(/・|\(|（/)
    .filter(n => n.trim() !== "");
}
function answerCheck(input,answer){
  let s;
  var judge = normalizeForAnswer(answer);
  var normalizedInput = normalizeForAnswer(input);
  if(judge.every(m => normalizedInput.includes(m))){
      s = "正解！";
    }else if(judge.some(m => normalizedInput.includes(m))){
      s = "正解";
    }else{
      s = `不正解。正解：${answer}`;
    }
  return s;
}
function nextQuestion(){
    const [original,translated] = [quizState.originalMap[quizState.currentIndex],quizState.translationMap[quizState.currentIndex]];
    const questionSentence = quizState.mode ? original : translated;
    const hintSentence = !quizState.mode ? original : translated;
    [quizState.answer,quizState.question] = extractBlank(questionSentence);
    showQuestion(quizState.question,hintSentence);
    quizState.questionSentence = questionSentence;
    quizState.hintSentence = hintSentence;
}
addEventListenerByEvent("quiz-history","click",() => {
  //ここは後で書き換える
  const overlay = document.getElementById("quiz-history-overlay")
  overlay.classList.toggle("hidden");
  overlay.textContent = appState.history;
})
addEventListenerByEvent("quiz-highlight","click",switchHighlight)
addEventListenerByEvent("check","click",majorHandler);

const quizState = {
  mode : optionBuilder.KobunGendaibun,
  originalMap : [],
  translationMap : [],
  currentIndex : 0,
  answer : "",
  question : "",
  questionSentence :"",
  hintSentence : "",
  numOfQuestion : 0,
}
function quizListBuilder(){
  let originSentenceMap = [];
  let translatedSentenceMap = [];
  appState.committedRange.forEach( aRange => {
    for(let i = aRange.min - 1; i < aRange.max; i++){
      for(const sentence of appState.words[i].example_origin){
        originSentenceMap.push(sentence);
        console.log(sentence)
      }
      for(const sentence of appState.words[i].example_translation){
        translatedSentenceMap.push(sentence);
      }
    }
  });
  const sum = originSentenceMap.length;
  return [sum,originSentenceMap,translatedSentenceMap];
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

const answerBox = document.getElementById("answer-typing");
function majorHandler(){
  switch(appState.phase){
    case phaseList.initialize :
      quizState.mode = optionBuilder.KobunGendaibun;
      [quizState.numOfQuestion,quizState.originalMap,quizState.translationMap] = quizListBuilder();
      quizState.currentIndex = 0;
      nextQuestion();
      appState.phase = phaseList.question;
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      break;
    case phaseList.wait :  
      quizState.currentIndex++;
      nextQuestion();
      appState.phase = phaseList.question;
      ChangeAnswerButtonText();
      showResult("");
      answerBox.disabled = false;
      answerBox.value = "";
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      break;
    case phaseList.question :
      const input = answerBox.value;
      appState.phase = phaseList.answerCheck;
      const s = answerCheck(input,quizState.answer);
      showResult(s);
      appState.phase = phaseList.wait;
      ChangeAnswerButtonText();
      answerBox.disabled = true;
      restoreHistory(
        input,
        quizState.answer,
        quizState.questionSentence,
        quizState.hintSentence
      );
      break;
    default:
      console.error("Unknown phase", appState.phase);
  }
}
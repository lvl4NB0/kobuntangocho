//TODO : jsonの例文の構成を変える(exampleオブジェクトの中に現代語訳と原文を入れる)、出題ロジックを作る、シャッフル機能を実装する、あとコミットしなおすのめんどくさいからjsとcssの読み込み順変えるのも後でやる

//後で大文字にする
const phaseList = Object.freeze({
  initialize : "初期化処理",
  question : "回答中",
  answerCheck : "答え合わせの処理中",
  wait : "次の問題への入力待機中",
  finished : "完了",
  nextQuestionRange : "次の出題範囲"
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
  {min : 1, max : 1}
];
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

const quizState = {
  mode : optionBuilder.KobunGendaibun,
  originalMap : [],
  quizList : {
    origin: [],
    translation: []
  },
  translationMap : [],
  currentIndex : 0,
  currentIndexInOneSet : 0,
  answer : "",
  question : "",
  correct  : "",
  questionSentence :"",
  hintSentence : "",
  numOfQuestion : 0,
  oneSet : 0,
  type : "",
  fourOption : []
}

const DOM = Object.freeze({
  translation : document.getElementById("translation"),
  question : document.getElementById("question"),
  progressBar : document.getElementById("progress-bar"),
  progressBarNum : document.getElementById("progress-bar-num"),
  result : document.getElementById("result"),
  check : document.getElementById("check"),
  overlay : document.getElementById("quiz-history-overlay"),
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
  opt4 : document.getElementById("opt4")
})

fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    appState.words = data;
    fourOptionBuilder();
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
function extractBlank(s){
    const match = s.match(/"(.*?)"/);
    if (!match) return "";
    return [match[1],s.replace(/".*?"/, "_".repeat(match[1].length))];//[answer,quiestionSentence]
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
    DOM.progressBar.style.width = `${(currentIndex/numOfQuestion)*100}%`
    DOM.progressBarNum.textContent = `${currentIndex}/${numOfQuestion}`;
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
  if(s === undefined) s = "ERROR"
  DOM.result.textContent = s;
}
function ChangeAnswerButtonText(condition){
  console.log(answerButtonMessage[condition])
  DOM.check.textContent = answerButtonMessage[condition];
}

function normalizeForAnswer(s){
  return s
    ?.replace(/[)）]/g, "")
    ?.split(/・|\(|（/)
    ?.filter(n => n.trim() !== "");
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
function GenerateExampleSentence(){
    const [original,translated] = [quizState.quizList.origin[quizState.currentIndexInOneSet],quizState.quizList.translationMap[quizState.currentIndexInOneSet]];
    const questionSentence = quizState.mode ? original : translated;
    const hintSentence = !quizState.mode ? original : translated;
    [quizState.correct,quizState.question] = extractBlank(questionSentence);
    console.log(`correct : ${quizState.correct}`)
    showQuestion(quizState.question,hintSentence);
    quizState.questionSentence = questionSentence;
    quizState.hintSentence = hintSentence;
}
function nextQuestion(type){
  GenerateExampleSentence();
  switch(type){
    case QUIZ_TYPE.fourOption:
      applyFourOptionText();
      break;
    case QUIZ_TYPE.Typing:
      break;
    case QUIZ_TYPE.fillFourOption:
      applyFourOptionText();
      break;
    case QUIZ_TYPE.fillTyping:
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
    console.log(button.id);
    selectFourOption(button.textContent,button.id);
});
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
  return [sum,originSentences.length,originSentences,translatedSentences];
}
function fourOptionBuilder(){
  for(let i = 0; i < appState.words.length; i++){
    appState.words[i].meaning.forEach( obj => {
      quizState.fourOption.push(...normalizeForAnswer(obj.text));
    })
  }
  console.log(quizState.fourOption);
}
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}
function generateChoices(){
  const pool = quizState.fourOption.filter(m => !m.includes(quizState.correct));
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
function applyFourOptionText(){
  const {choices,_} = generateChoices();
  for(let i = 0; i < 4; i++){
    DOM.option[i].textContent = choices[i]
  }
}

function majorHandler(){
  console.log(quizState.currentIndex)
  try{
  switch(appState.phase){
    case phaseList.initialize :
      quizState.currentIndex = 0;
      quizState.mode = optionBuilder.KobunGendaibun;
      quizState.type = getType();
      console.log(quizState.type)
      initializeQuestionField(quizState.type);
      [quizState.numOfQuestion,quizState.oneSet,quizState.quizList.origin,quizState.quizList.translationMap] = quizListBuilder();
      nextQuestion(quizState.type);
      appState.phase = phaseList.question;
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      showResult("");
      break;
    case phaseList.wait :  
        appState.phase = phaseList.question;
        ChangeAnswerButtonText(appState.phase);
        showResult("");
        ControlAnswerButtonAtribute(false);
        DOM.answerBox.value = "";
        nextQuestion(quizState.type);
      break;
    case phaseList.question :
      const input = DOM.answerBox.value;
      appState.phase = phaseList.answerCheck;
      const {sentence , isCorrect} = answerCheck(input,quizState.correct);
      console.log(`s : ${sentence}`)
      showResult(sentence);
      appState.phase = phaseList.wait;
      ChangeAnswerButtonText(appState.phase);
      ControlAnswerButtonAtribute(true);
      restoreHistory(
        input,
        quizState.correct,
        quizState.questionSentence,
        quizState.hintSentence,
        isCorrect
      );
      quizState.currentIndex++;
      quizState.currentIndexInOneSet++;
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      if(quizState.currentIndexInOneSet >= quizState.oneSet){
        appState.phase = phaseList.nextQuestionRange;
        console.log("DEBUG : " + `phase is ${appState.phase} currentIndexInOneSet(${quizState.currentIndexInOneSet + 1})>oneSet(${quizState.oneSet})` + getCaller())
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
      nextQuestion(quizState.type);
      completeOptionBuilder();
      quizState.type = getType();
      console.log(quizState.type)
      initializeQuestionField(quizState.type);nextQuestion(quizState.type);
      DOM.answerBox.value = "";
      appState.phase = phaseList.question;
      showQuestionProgress(quizState.numOfQuestion,quizState.currentIndex);
      break;
    case phaseList.finished :
      alert("finished process"); //showPage();
      break;
    default:
      console.error("Unknown phase", appState.phase);
  }
  }catch(e){
    alert("エラーが発生しました。ページを再読み込みしてください。")
    console.error(e);
  }
}
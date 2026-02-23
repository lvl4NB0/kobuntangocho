let words = [];
let currentIndex = 0;
let sentenceIndex = 0;
let ansQue = [];
let isHighlighted = true;
let history = [];
let limWord = 314;

//Todo:関数名変更、mvc分離、進捗描画をどうにかする、解答描画をどうにかする、そもそも製作進行

fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
    showQuestion(isHighlighted);
    initQuestion();
  });
function addEventListenerByEvent(target, event, func, secondEvent, secondFunc ,thirdEvent, thirdFunc){
  const targetEl = document.getElementById(target);
  targetEl.addEventListener(event,func);
  if(secondEvent) targetEl.addEventListener(secondEvent,secondFunc);
  if(thirdEvent) targetEl.addEventListener(thirdEvent,thirdFunc);
}
function extractBlank(s) {
  const match = s.match(/"(.*?)"/);
  if (!match) return null;

  return {
    answer: match[1],
    question: s.replace(/".*?"/, "____")
  };
}
function showQuestion(isHighlighted) {
  const s = words[currentIndex].example_origin[sentenceIndex];
  const s2 = words[currentIndex].example_translation[sentenceIndex];
  console.log(s,s2)
  ansQue = extractBlank(s2);
  console.log(ansQue);
  q = ansQue.question;
  if(isHighlighted) document.getElementById("question").textContent = s;
  else document.getElementById("question").textContent = s.replace(/"/g,"");
  document.getElementById("translation").textContent = q;
}

function initQuestion(){
    document.getElementById("progress-bar").style.width = `${(currentIndex/limWord)*100}%`
    document.getElementById("progress-bar-num").textContent = `${currentIndex}/${limWord+1}`;
    document.getElementById("result").textContent = "";
}
function restoreHistory(input,correct){
  history[currentIndex] = {usrInput : input, correct : correct};
  console.log(history);
}
//setInterval(initQuestion,10)
let clicked = true;
function answerCheck(){
  clicked = !clicked;
  const input = document.getElementById("answer-typing").value;
  const correct = ansQue.answer;

  if (input === correct) {
    document.getElementById("result").textContent = "正解！";
  } else {
    document.getElementById("result").textContent =
      `不正解。正解：${correct}`;
  }
  if(clicked){
    if (currentIndex <= limWord) currentIndex++;
    restoreHistory(input,correct);
    initQuestion();
    showQuestion();
  }
}
addEventListenerByEvent("quiz-history","click",() => {
  const overlay = document.getElementById("quiz-history-overlay")
  overlay.classList.toggle("hidden");
  overlay.textContent = history;
})
addEventListenerByEvent("check","click",answerCheck)
function toggleIsHighlight(){
  isHighlighted = !isHighlighted;
  showQuestion(isHighlighted);
}
addEventListenerByEvent("quiz-highlight","click",toggleIsHighlight)

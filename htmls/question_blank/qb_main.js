let words = [];
let currentIndex = 0;
let sentenceIndex = 0;
let ans_que = [];

fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
    showQuestion();
  });
function extractBlank(s) {
  const match = s.match(/"(.*?)"/);
  if (!match) return null;

  return {
    answer: match[1],
    question: s.replace(/".*?"/, "____")
  };
}
function showQuestion() {
  const s = words[currentIndex].example_origin[sentenceIndex];
  const s2 = words[currentIndex].example_translation[sentenceIndex];
  ans_que = extractBlank(s2);
  console.log(ans_que);
  q = ans_que.question;
  document.getElementById("question").textContent = s;
  document.getElementById("translation").textContent = q;
}

document.getElementById("check").addEventListener("click", () => {
  const input = document.getElementById("answer").value;
  const correct = ans_que.answer;

  if (input === correct) {
    document.getElementById("result").textContent = "正解！";
  } else {
    document.getElementById("result").textContent =
      `不正解。正解：${correct}`;
  }

  currentIndex++;
});

//メイン処理
function main(){
    showQuestion();

}

//replaceで問題文の""を消せるようにした方が良いかも
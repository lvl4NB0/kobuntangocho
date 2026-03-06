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

/*fetch("./words.json")
  .then(res => res.json())
  .then(data => {
    appState.words = data;
    majorHandler();
  });*/

appState.words = [
  {
    "id" : 1,
    "word": "見る",
    "Conjugation": "マ行上一段",
    "meaning": [
      {"no" : 1, "text" : "見る・会う"},
      {"no" : 2, "text" : "思う・分かる"},
      {"no" : 3, "text" : "（男女の）関係を結ぶ・結婚する・妻とする"},
      {"no" : 4, "text" : "面倒を見る・世話をする"}
    ],
    "example_origin": [
      "\"みる\"人の、心劣りせらるる本性見えむこそ、口惜しかるべけれ。(徒然・一段)",
      "はやくみし女のこと、ほめ言い出でなどするも、程経たることなれど、なほにくし。（枕・にくき物）",
      "《帝に差し上げようと大切に育ててきた娘であったが、》（娘に恋しい人ができたので）親も\"見ず\"なりにけり。（大和・一〇五段）"
    ],
    "example_translation": [
      "すばらしいと\"思う\"人が、思っていたより劣っている人だと感じられるような本性が見えるのは、残念であるにちがいない。",
      "（今の彼が）以前\"関係を結ん\"だ女性のことを、ほめて口に出したりするのも、時がたったことであっても、やはり気にくわない。",
      "(娘に恋しい人ができたので)親も（娘の）\"面倒を見\"なくなってしまった"
    ],
    "tips": "「見る」の1,2の意味は、現代語や英語のseeとほぼ同じです。大切なのは3です。高貴な女性は、父親や兄弟など身近な人以外、自分の姿を男性に見せることはありませんでしたから、「見る」ということは、相手の姿を見るような「特別な関係になる」＝「結婚する」ということを意味したのです。4は「面倒を見る」という言い方を今でもすることから分かるでしょう。",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 2,
    "word": "見す",
    "Conjugation": "サ行上一段",
    "meaning": [
      {"no" : 1, "text" : "見せる・（様子を）見させる"},
      {"no" : 2, "text" : "結婚させる"}
    ],
    "example_origin": ["宮仕へに次ぎては、親王たちにこそは\"見せ\"奉らめ。(源氏・若松下)"],
    "example_translation": ["（大切に育てている娘の将来は）宮仕へ（をさせるか、それ）に次いでは、親王たちにこそ\"結婚させ\"申し上げるのがよかろう。"],
    "tips": "「見＋す」の二単語にはなりません。ミスしないように！",
    "helps": "「親王とは天皇の子供や兄弟のことです」",
    "related_words": []
  },
  {
    "id" : 3,
    "word": "見ゆ",
    "Conjugation": "ヤ行下二段",
    "meaning": [
      {"no" : 1 , "text"  : "見える・思われる"}, 
      {"no" : 2 , "text" : "見られる・見せる"},
      {"no" : 3 , "text" : "（女性が）結婚する"}
    ],
    "example_origin": [
      "都の中とも\"見え\"ぬ所のさまなり。（更級）",
     "さて、出でていくと\"見えて\"、前栽の中に隠れて、（大和・一四九段）",
     "以下ならむ人にも\"みえ\"て、身をも助け、幼き者どもをもはぐくみ給ふべし。（平家・巻七）"
    ],
    "example_translation": [
      "都の中とも\"見え（思われ）\"ない場所の様子である。",
     "そして、（男は）出でて行くと\"見せ\"て、庭の植え込みの中に隠れて、",
     "（相手が）どのような男でも\"結婚し\"て、（あなた自身の）身を守り、幼い子供たちを（大切に）育ててください。"
    ],
    "tips": "「見ゆ」は「ゆ」に自発・可能・受身の意があり、「見える」「見ることができる」「見られる・（人に見られることはこちらから）見せる「（女性が男性に姿を見せることから）結婚する」などと訳します。",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 4,
    "word": "かいまみる（垣間見る）",
    "Conjugation": "マ行上一段",
    "meaning": [{"no" : 1 , "text" : "のぞき見る"}],
    "example_origin": ["女、をとこの家にいきて\"かいまみ\"けるを、（伊勢・六三段）"],
    "example_translation": ["女は、男の家に行って\"のぞき見\"たところ、"],
    "tips": "垣根の間（＝すき間）から（女性の家をのぞいて）見るという意です",
    "helps": "通常は男性が女性をのぞき見るのですが、これは女性が主語となるまれな事例。この女性（実はかなり年配）には男性への抑えきれない強い思いがあって、このような常識はずれの行為に及んだのです。「のぞき見」は今では犯罪ですが、当時は男女の関係が厳しく制限されていたため、こうした行為がしばしば見られました。「噂に聞く」ことと並んで昔は女性を知る重要な手段だったのです。",
    "related_words": [315]
  },
  {
    "id" : 5,
    "word": "よばふ（呼ばふ）",
    "Conjugation": "ハ行四段",
    "meaning": [
      {"no" : 1 , "text" : "呼び続ける"}, 
      {"no" : 2 , "text" : "求婚する・言い寄る"}
    ],
    "example_origin": [
      "あとに\"呼ばふ\"声あり。かへりみれば人なし。（宇治・巻十五・十一話）", 
      "《実に奥ゆかしくて、かわいらしい人だったので、》\"よばふ\"人もいと多かりけれど、かへりごともせざりけり。（大和。一四ニ段）"
    ],
    "example_translation": [
      "後ろで\"呼び続ける\"声がする。振り返ってみると誰もいない。", 
      "\"求婚する\"人も実に多かったが、返事もしなかった。"
    ],
    "tips": "動詞「呼ぶ」の未然形に反復・継続を表す助動詞の「ふ」がついてできたもので、「呼び続ける」の意です。男性が女性を呼び続け、「言い寄る・求婚する」の意になります。",
    "helps": "",
    "related_words": [316]
  },
  {
    "id" : 6,
    "word": "好く",
    "Conjugation": "カ行四段",
    "meaning": [
      {"no" : 1 , "text" : "風流を好む・芸道に熱中する"}, 
      {"no" : 2 , "text" : "色ごとを好む・恋愛に熱中する"}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": [317]
  },
  {
    "id" : 7,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  },
  {
    "id" : 0,
    "word": "",
    "Conjugation": "行段",
    "meaning": [
      {"no" : 1 , "text" : ""}, 
      {"no" : 2 , "text" : ""}
    ],
    "example_origin": ["", ""],
    "example_translation": ["", ""],
    "tips": "",
    "helps": "",
    "related_words": []
  }
]

  
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
  return [match[1],s.replace(/".*?"/, "_".repeat(betweenLength))];
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
majorHandler();
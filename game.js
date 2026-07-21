const animals = [
  {name:"סוס",emoji:"🐴",food:"🥕",foodName:"גזר",shtuzim:["הסוס לבש מכנסיים — אבל שכח איפה שמים את הפרסות!","הסוס נכנס למעלית — ולחץ על קומת האורווה!","הסוס ביקש גלידה — בטעם דהרה עם סוכריות!"]},
  {name:"חמור",emoji:"🫏",food:"🌾",foodName:"שיבולים",shtuzim:["החמור כתב שיר — אי־אה, אי־אה, וזה כל החרוז שהיה!","החמור פתח רדיו — וכל היום שידר אי־אה־אם!","החמור לקח מטרייה — כי ירד גשם של גזרים!"]},
  {name:"תרנגולת",emoji:"🐔",food:"🌽",foodName:"תירס",shtuzim:["התרנגולת טסה לירח — וחזרה עם ביצת כוכבים!","התרנגולת פתחה מחשב — וחיפשה את מקש הביצה!","התרנגולת הלכה לספרייה — וביקשה ספר עם סוף קוקוריקו!"]},
  {name:"פרה",emoji:"🐄",food:"🌿",foodName:"עשב",shtuzim:["הפרה שתתה שוקו — ואמרה: מוּ־שלם!","הפרה נכנסה לקולנוע — וביקשה כרטיס לסרט מוּ־תח!","הפרה למדה לנגן — והקימה להקת מוּ־זיקה!"]},
  {name:"כבשה",emoji:"🐑",food:"🍀",foodName:"תלתן",shtuzim:["הכבשה סרגה סוודר — לענן שהיה לו קר!","הכבשה פתחה מספרה — ועשתה לעננים תספורת!","הכבשה שיחקה מחבואים — אבל הצמר הציץ מאחורי העץ!"]},
  {name:"עז",emoji:"🐐",food:"🥬",foodName:"חסה",shtuzim:["העז עלתה על אופניים — וצלצלה מֶה־מֶה במקום בפעמון!","העז הזמינה פיצה — עם תוספת עלי גג!","העז טיפסה על שעון — כדי לראות איך הזמן עובר!"]},
  {name:"ארנב",emoji:"🐇",food:"🥕",foodName:"גזר",shtuzim:["הארנב פתח מסעדה — וכל התפריט היה גזר בתחפושת!","הארנב איחר לבית הספר — כי קפץ על כל שלולית בדרך!","הארנב קנה משקפיים — כדי לראות את הגזר מקרוב־קרוב!"]},
  {name:"חזיר",emoji:"🐷",food:"🍎",foodName:"תפוח",shtuzim:["החזיר התקלח בבוץ — כדי להיות נקי מלכלוך!","החזיר פתח מאפייה — והכין עוגת בוץ בלי בוץ!","החזיר יצא לרקוד — ועשה סיבובון עם הזנבון!"]},
  {name:"ברווז",emoji:"🦆",food:"🫛",foodName:"אפונים",shtuzim:["הברווז נעל מגפיים — כדי שהשלולית לא תירטב!","הברווז התקשר לחבר — ואמר: הלו־געגע!","הברווז נכנס למכולת — וביקש לחם עם חשבון על המקור!"]},
  {name:"חתול",emoji:"🐈",food:"🐟",foodName:"דג",shtuzim:["החתול צלצל בפעמון — ומי ענה? עכבר בטלפון!","החתול פתח בית ספר — ולימד מיאו־תמטיקה!","החתול נכנס למקרר — כי רצה להיות חתול מגניב!"]}
];

const $ = id => document.getElementById(id);
let stage = 0, soundOn = true, musicOn = true, currentAnswer = 0, locked = false;
let additionDeck = [], countingDeck = [];
let currentQuestionSpeech = "";
const lastShtuz = new Map();
const screens = ["welcome","game","success","finish"];
const backgroundMusic = $("backgroundMusic");
backgroundMusic.volume = .22;

const numberSpeech=["אֶפֶס","אַחַת","שְׁתַּיִם","שָׁלוֹשׁ","אַרְבַּע","חָמֵשׁ","שֵׁשׁ","שֶׁבַע","שְׁמוֹנֶה","תֵּשַׁע","עֶשֶׂר","אַחַת עֶשְׂרֵה","שְׁתֵּים עֶשְׂרֵה","שְׁלוֹשׁ עֶשְׂרֵה","אַרְבַּע עֶשְׂרֵה","חֲמֵשׁ עֶשְׂרֵה","שֵׁשׁ עֶשְׂרֵה","שְׁבַע עֶשְׂרֵה","שְׁמוֹנֶה עֶשְׂרֵה","תְּשַׁע עֶשְׂרֵה","עֶשְׂרִים"];
const narration={
  welcome:"יָאלְלָה נוֹעָה, יוֹצְאִים לְהַרְפַּתְקָה בְּחַוַּת הַשְּׁטוּזִים!",
  counting:"כַּמָּה פְּרִיטִים יֵשׁ כָּאן?",
  correct:"יֵשׁ! תְּשׁוּבָה נֶהֱדֶרֶת! הָאֹכֶל נֶאֱסַף!",
  wrong:"כִּמְעַט! נַסּוּ שׁוּב.",
  wellDone:"כָּל הַכָּבוֹד!",
  finish:"אֵיזֶה יֹפִי, נוֹעָה! הִצְלַחְתְּ לְהַאֲכִיל אֶת כָּל הַחַיּוֹת בְּחַוַּת הַשְּׁטוּזִים!"
};
const speechReplacements=new Map([
  ["הסוס","הַסּוּס"],["החמור","הַחֲמוֹר"],["התרנגולת","הַתַּרְנְגֹלֶת"],["הפרה","הַפָּרָה"],["הכבשה","הַכִּבְשָׂה"],
  ["העז","הָעֵז"],["הארנב","הָאַרְנָב"],["החזיר","הַחֲזִיר"],["הברווז","הַבַּרְוָז"],["החתול","הֶחָתוּל"],
  ["גלידה","גְּלִידָה"],["מעלית","מַעֲלִית"],["אורווה","אֻרְוָה"],["מטרייה","מִטְרִיָּה"],["ספרייה","סִפְרִיָּה"],
  ["קולנוע","קוֹלְנוֹעַ"],["מספרה","מִסְפָּרָה"],["אופניים","אוֹפַנַּיִם"],["מסעדה","מִסְעָדָה"],["משקפיים","מִשְׁקָפַיִם"],
  ["מאפייה","מַאֲפִיָּה"],["מכולת","מַכֹּלֶת"],["מקרר","מְקָרֵר"],["בטלפון","בַּטֵּלֵפוֹן"]
]);

function prepareSpeech(text){let prepared=text;for(const [plain,pointed] of speechReplacements)prepared=prepared.replaceAll(plain,pointed);return prepared;}

function show(id){screens.forEach(x=>$(x).classList.toggle("active",x===id));window.scrollTo({top:0,behavior:"smooth"});}
function speak(text,onDone){
  let finished=false,timer;
  const done=()=>{if(finished)return;finished=true;clearTimeout(timer);if(onDone)onDone();};
  if(!soundOn||!("speechSynthesis" in window)){timer=setTimeout(done,850);return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(prepareSpeech(text));
  const hebrewVoice=speechSynthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith("he"));
  if(hebrewVoice)u.voice=hebrewVoice;
  u.lang="he-IL";u.rate=.84;u.pitch=1.08;u.onend=done;u.onerror=done;
  timer=setTimeout(done,Math.max(3000,text.length*220));
  speechSynthesis.speak(u);
}
function shuffle(a){const result=[...a];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}

function refillAdditionDeck(){
  const questions=[];
  for(let a=0;a<=10;a++)for(let b=a;b<=10-a;b++)questions.push({a,b});
  additionDeck=shuffle(questions);
}
function refillCountingDeck(){
  const icons=["🍎","⭐","🌸","🥕","🦋","🌽","🍀","🐞"];
  countingDeck=shuffle(Array.from({length:20},(_,i)=>({count:i+1,icon:icons[i%icons.length]})));
}
function nextAddition(){if(!additionDeck.length)refillAdditionDeck();return additionDeck.pop();}
function nextCounting(){if(!countingDeck.length)refillCountingDeck();return countingDeck.pop();}
function pickShtuz(animal){
  const previous=lastShtuz.get(animal.name);
  const options=animal.shtuzim.filter(text=>text!==previous);
  const selected=options[Math.floor(Math.random()*options.length)];
  lastShtuz.set(animal.name,selected);
  return selected;
}
function makeChoices(answer){
  const maximum=answer>10?20:10;
  const alternatives=shuffle(Array.from({length:maximum+1},(_,i)=>i).filter(n=>n!==answer)).slice(0,3);
  return shuffle([answer,...alternatives]);
}
function makeQuestion(){
  const isCounting=stage%2===1;
  if(isCounting){
    const question=nextCounting();currentAnswer=question.count;
    currentQuestionSpeech=narration.counting;
    $("questionType").textContent="סופרים עד 20";
    $("questionText").textContent="כמה פריטים יש כאן?";
    $("countingVisual").replaceChildren(...Array.from({length:currentAnswer},()=>{
      const item=document.createElement("span");
      item.className="counting-item";
      item.textContent=question.icon;
      return item;
    }));
  }else{
    const question=nextAddition();currentAnswer=question.a+question.b;
    currentQuestionSpeech=`כַּמָּה זֶה ${numberSpeech[question.a]} וְעוֹד ${numberSpeech[question.b]}?`;
    $("questionType").textContent="חיבור עד 10";
    $("questionText").textContent=`כמה זה ${question.a} ועוד ${question.b}?`;
    $("countingVisual").textContent="";
  }
  $("answers").innerHTML="";
  makeChoices(currentAnswer).forEach(n=>{const b=document.createElement("button");b.className="answer-btn";b.type="button";b.textContent=n;b.addEventListener("click",()=>answer(n,b));$("answers").appendChild(b);});
  $("feedback").textContent="";$("feedback").className="feedback";
  setTimeout(()=>speak(currentQuestionSpeech),350);
}
function loadStage(){
  locked=false;const a=animals[stage];show("game");
  $("stageLabel").textContent=`תחנה ${stage+1} מתוך 10`;$("animalTitle").textContent=`${a.name} מחכה לנועה`;
  $("animalEmoji").textContent=a.emoji;$("foodEmoji").textContent=a.food;$("animalHint").textContent=`ה${a.name} אוהב ${a.foodName}. בואו נאסוף לו אוכל!`;
  $("score").textContent=stage;$("progressBar").style.width=`${(stage+1)*10}%`;makeQuestion();
}
function answer(n,btn){
  if(locked)return;
  if(n===currentAnswer){locked=true;btn.classList.add("correct");$("feedback").textContent="יש! תשובה נהדרת! האוכל נאסף 🎉";$("feedback").className="feedback good";$("animalEmoji").classList.add("happy");speak(narration.correct,()=>setTimeout(showSuccess,250));
  }else{btn.classList.add("wrong");$("feedback").textContent="כמעט! נסו שוב — נועה מאמינה בכם 💗";$("feedback").className="feedback try";speak(narration.wrong);setTimeout(()=>btn.classList.remove("wrong"),500);}
}
function showSuccess(){const a=animals[stage],shtuz=pickShtuz(a);$("successAnimal").textContent=a.emoji;$("successTitle").textContent=`ה${a.name} קיבל ${a.foodName}!`;$("shtuzText").textContent=shtuz;$("nextBtn").innerHTML=stage===animals.length-1?"לחגיגה הגדולה <span>←</span>":"לחיה הבאה <span>←</span>";show("success");speak(`${narration.wellDone} ${shtuz}`);}
function next(){stage++;if(stage>=animals.length){$("animalParade").textContent=animals.map(a=>a.emoji).join(" ");show("finish");speak(narration.finish);}else loadStage();}
function startMusic(){if(musicOn){backgroundMusic.play().catch(()=>{});}}
$("startBtn").addEventListener("click",()=>{stage=0;startMusic();loadStage();});
$("nextBtn").addEventListener("click",next);
$("restartBtn").addEventListener("click",()=>{stage=0;startMusic();loadStage();});
$("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"🔊":"🔇";$("soundBtn").setAttribute("aria-pressed",String(!soundOn));if(!soundOn&&"speechSynthesis" in window)speechSynthesis.cancel();});
$("musicBtn").addEventListener("click",()=>{musicOn=!musicOn;$("musicBtn").textContent="🎵";$("musicBtn").style.opacity=musicOn?"1":".42";$("musicBtn").setAttribute("aria-pressed",String(!musicOn));$("musicBtn").setAttribute("aria-label",musicOn?"השתקת מוזיקת הרקע":"הפעלת מוזיקת הרקע");if(musicOn)startMusic();else backgroundMusic.pause();});
window.addEventListener("load",()=>setTimeout(()=>speak(narration.welcome),700));

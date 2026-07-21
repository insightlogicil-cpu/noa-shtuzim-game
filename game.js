const animals = [
  {name:"סוס",emoji:"🐴",food:"🥕",foodName:"גזר",shtuz:"הסוס לבש מכנסיים — אבל שכח איפה שמים את הפרסות!"},
  {name:"חמור",emoji:"🫏",food:"🌾",foodName:"שיבולים",shtuz:"החמור כתב שיר — אי־אה, אי־אה, וזה כל החרוז שהיה!"},
  {name:"תרנגולת",emoji:"🐔",food:"🌽",foodName:"תירס",shtuz:"התרנגולת טסה לירח — וחזרה עם ביצת כוכבים!"},
  {name:"פרה",emoji:"🐄",food:"🌿",foodName:"עשב",shtuz:"הפרה שתתה שוקו — ואמרה: מוּ־שלם!"},
  {name:"כבשה",emoji:"🐑",food:"🍀",foodName:"תלתן",shtuz:"הכבשה סרגה סוודר — לענן שהיה לו קר!"},
  {name:"עז",emoji:"🐐",food:"🥬",foodName:"חסה",shtuz:"העז עלתה על אופניים — וצלצלה מֶה־מֶה במקום בפעמון!"},
  {name:"ארנב",emoji:"🐇",food:"🥕",foodName:"גזר",shtuz:"הארנב פתח מסעדה — וכל התפריט היה גזר בתחפושת!"},
  {name:"חזיר",emoji:"🐷",food:"🍎",foodName:"תפוח",shtuz:"החזיר התקלח בבוץ — כדי להיות נקי מלכלוך!"},
  {name:"ברווז",emoji:"🦆",food:"🫛",foodName:"אפונים",shtuz:"הברווז נעל מגפיים — כדי שהשלולית לא תירטב!"},
  {name:"חתול",emoji:"🐈",food:"🐟",foodName:"דג",shtuz:"החתול צלצל בפעמון — ומי ענה? עכבר בטלפון!"}
];

const $ = id => document.getElementById(id);
let stage = 0, soundOn = true, musicOn = true, currentAnswer = 0, locked = false;
const screens = ["welcome","game","success","finish"];
const backgroundMusic = $("backgroundMusic");
backgroundMusic.volume = .22;

function show(id){screens.forEach(x=>$(x).classList.toggle("active",x===id));window.scrollTo({top:0,behavior:"smooth"});}
function speak(text){if(!soundOn||!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="he-IL";u.rate=.88;u.pitch=1.12;speechSynthesis.speak(u);}
function shuffle(a){return [...a].sort(()=>Math.random()-.5);}
function makeQuestion(){
  const isCounting = stage%2===1;
  if(isCounting){
    currentAnswer=Math.floor(Math.random()*16)+5;
    const icon=["🍎","⭐","🌸","🥕","🦋"][stage%5];
    $("questionType").textContent="סופרים עד 20";
    $("questionText").textContent="כמה פריטים יש כאן?";
    $("countingVisual").textContent=icon.repeat(currentAnswer);
  }else{
    const a=Math.floor(Math.random()*8)+1,b=Math.floor(Math.random()*(11-a));currentAnswer=a+b;
    $("questionType").textContent="חיבור עד 10";
    $("questionText").textContent=`כמה זה ${a} ועוד ${b}?`;
    $("countingVisual").textContent="";
  }
  const choices=new Set([currentAnswer]);
  while(choices.size<4){choices.add(Math.max(0,Math.min(20,currentAnswer+Math.floor(Math.random()*7)-3)));}
  $("answers").innerHTML="";
  shuffle([...choices]).forEach(n=>{const b=document.createElement("button");b.className="answer-btn";b.type="button";b.textContent=n;b.addEventListener("click",()=>answer(n,b));$("answers").appendChild(b);});
  $("feedback").textContent="";$("feedback").className="feedback";
  setTimeout(()=>speak($("questionText").textContent),350);
}
function loadStage(){
  locked=false;const a=animals[stage];show("game");
  $("stageLabel").textContent=`תחנה ${stage+1} מתוך 10`;$("animalTitle").textContent=`${a.name} מחכה לנועה`;
  $("animalEmoji").textContent=a.emoji;$("foodEmoji").textContent=a.food;$("animalHint").textContent=`ה${a.name} אוהב ${a.foodName}. בואו נאסוף לו אוכל!`;
  $("score").textContent=stage;$("progressBar").style.width=`${(stage+1)*10}%`;makeQuestion();
}
function answer(n,btn){
  if(locked)return;
  if(n===currentAnswer){locked=true;btn.classList.add("correct");$("feedback").textContent="יש! תשובה נהדרת! האוכל נאסף 🎉";$("feedback").className="feedback good";$("animalEmoji").classList.add("happy");speak("יש! תשובה נהדרת!");setTimeout(showSuccess,1050);
  }else{btn.classList.add("wrong");$("feedback").textContent="כמעט! נסו שוב — נועה מאמינה בכם 💗";$("feedback").className="feedback try";speak("כמעט! נסו שוב");setTimeout(()=>btn.classList.remove("wrong"),500);}
}
function showSuccess(){const a=animals[stage];$("successAnimal").textContent=a.emoji;$("successTitle").textContent=`ה${a.name} קיבל ${a.foodName}!`;$("shtuzText").textContent=a.shtuz;$("nextBtn").innerHTML=stage===animals.length-1?"לחגיגה הגדולה <span>←</span>":"לחיה הבאה <span>←</span>";show("success");speak(`כל הכבוד! ${a.shtuz}`);}
function next(){stage++;if(stage>=animals.length){$("animalParade").textContent=animals.map(a=>a.emoji).join(" ");show("finish");speak("איזה יופי! האכלתם את כל החיות בחוות השטוזים!");}else loadStage();}
function startMusic(){if(musicOn){backgroundMusic.play().catch(()=>{});}}
$("startBtn").addEventListener("click",()=>{stage=0;startMusic();loadStage();});
$("nextBtn").addEventListener("click",next);
$("restartBtn").addEventListener("click",()=>{stage=0;startMusic();loadStage();});
$("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"🔊":"🔇";$("soundBtn").setAttribute("aria-pressed",String(!soundOn));if(!soundOn&&"speechSynthesis" in window)speechSynthesis.cancel();});
$("musicBtn").addEventListener("click",()=>{musicOn=!musicOn;$("musicBtn").textContent=musicOn?"🎵":"🎵";$("musicBtn").style.opacity=musicOn?"1":".42";$("musicBtn").setAttribute("aria-pressed",String(!musicOn));$("musicBtn").setAttribute("aria-label",musicOn?"השתקת מוזיקת הרקע":"הפעלת מוזיקת הרקע");if(musicOn)startMusic();else backgroundMusic.pause();});

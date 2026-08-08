const animals = [
  {name:"סוס",emoji:"🐴",food:"🥕",foodName:"גזר",shtuzim:["הסוס לבש מכנסיים — אבל שכח איפה שמים את הפרסות!","הסוס נכנס למעלית — ולחץ על קומת האורווה!","הסוס נעל גלגיליות — כדי לדהור לאט יותר!"]},
  {name:"חמור",emoji:"🫏",food:"🌾",foodName:"שיבולים",shtuzim:["החמור לבש גרביים — אבל לא מצא זוג שמתאים לארבע רגליים!","החמור נכנס לחנות כובעים — וביקש כובע עם חורים לאוזניים!","החמור לקח מטרייה — כי ירד גשם של גזרים!"]},
  {name:"תרנגולת",emoji:"🐔",food:"🌽",foodName:"תירס",shtuzim:["התרנגולת טסה לירח — וחזרה עם ביצת כוכבים!","התרנגולת ענדה שעון — כדי לדעת מתי הביצה מוכנה!","התרנגולת הלכה לספרייה — וביקשה ספר עם סוף קוקוריקו!"]},
  {name:"פרה",emoji:"🐄",food:"🌿",foodName:"עשב",shtuzim:["הפרה שתתה שוקו — ואמרה: מוּ־שלם!","הפרה נכנסה לקולנוע — וביקשה כרטיס לסרט מוּ־תח!","הפרה למדה לנגן — והקימה להקת מוּ־זיקה!"]},
  {name:"כבשה",emoji:"🐑",food:"🍀",foodName:"תלתן",shtuzim:["הכבשה סרגה סוודר — לענן שהיה לו קר!","הכבשה פתחה מספרה — ועשתה לעננים תספורת!","הכבשה עלתה על ענן — כדי לבדוק מי גנב לה את הצמר!"]},
  {name:"עז",emoji:"🐐",food:"🥬",foodName:"חסה",shtuzim:["העז עלתה על אופניים — וצלצלה מֶה־מֶה במקום בפעמון!","העז פתחה חנות נעליים — ומכרה נעלי טיפוס להרים!","העז טיפסה על שעון — כדי לראות איך הזמן עובר!"]},
  {name:"ארנב",emoji:"🐇",food:"🥕",foodName:"גזר",shtuzim:["הארנב פתח מסעדה — וכל התפריט היה גזר בתחפושת!","הארנב איחר לבית הספר — כי קפץ על כל שלולית בדרך!","הארנב קנה משקפיים — כדי לראות את הגזר מקרוב־קרוב!"]},
  {name:"חזיר",emoji:"🐷",food:"🍎",foodName:"תפוח",shtuzim:["החזיר התקלח בבוץ — כדי להיות נקי מלכלוך!","החזיר פתח מאפייה — והכין עוגת בוץ בלי בוץ!","החזיר יצא לרקוד — ועשה סיבובון עם הזנבון!"]},
  {name:"ברווז",emoji:"🦆",food:"🫛",foodName:"אפונים",shtuzim:["הברווז נעל מגפיים — כדי שהשלולית לא תירטב!","הברווז התקשר לחבר — ואמר: הלו־געגע!","הברווז נכנס למכולת — וביקש לחם עם חשבון על המקור!"]},
  {name:"חתול",emoji:"🐈",food:"🐟",foodName:"דג",shtuzim:["החתול אפה עוגה — וקישט אותה בקצפת מיאו!","החתול עלה לאוטובוס — וביקש לרדת בתחנת המיאו הבאה!","החתול לבש פיג׳מה — והלך לישון בתוך קופסת נעליים!"]}
];

const $ = id => document.getElementById(id);
const ASSET_VERSION = "20260808-5";
let stage = 0, soundOn = true, musicOn = true, currentAnswer = 0, locked = false;
let additionDeck = [], countingDeck = [];
let currentQuestionSpeech = "";
let currentRecordedAudio = null, lastWelcomeIndex = -1;
let currentShtuz = "", currentShtuzNumber = 0;
const recordedAudioCache = new Map();
const lastShtuz = new Map();
const screens = ["welcome","game","success","finish"];
const backgroundMusic = $("backgroundMusic");
backgroundMusic.volume = .22;

const numberSpeech=["אֶפֶס","אַחַת","שְׁתַּיִם","שָׁלוֹשׁ","אַרְבַּע","חָמֵשׁ","שֵׁשׁ","שֶׁבַע","שְׁמוֹנֶה","תֵּשַׁע","עֶשֶׂר","אַחַת עֶשְׂרֵה","שְׁתֵּים עֶשְׂרֵה","שְׁלוֹשׁ עֶשְׂרֵה","אַרְבַּע עֶשְׂרֵה","חֲמֵשׁ עֶשְׂרֵה","שֵׁשׁ עֶשְׂרֵה","שְׁבַע עֶשְׂרֵה","שְׁמוֹנֶה עֶשְׂרֵה","תְּשַׁע עֶשְׂרֵה","עֶשְׂרִים"];
const narration={
  welcome:"נוֹעָה, יוֹצְאִים לְהַרְפַּתְקָה בְּחַוַּת הַשְּׁטוּזִים!",
  counting:"כַּמָּה פְּרִיטִים יֵשׁ כָּאן?",
  correct:"יֵשׁ! תְּשׁוּבָה נֶהֱדֶרֶת! הָאֹכֶל נֶאֱסַף!",
  wrong:"כִּמְעַט! נַסִּי שׁוּב.",
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
function stopRecordedAudio(){
  if(!currentRecordedAudio)return;
  currentRecordedAudio.pause();currentRecordedAudio.currentTime=0;currentRecordedAudio=null;
  backgroundMusic.volume=.22;
}
function cacheRecordedAudio(file){
  if(!recordedAudioCache.has(file)){
    const request=fetch(`assets/audio-mp3/${file}?v=${ASSET_VERSION}`).then(response=>{if(!response.ok)throw new Error(`Audio ${response.status}`);return response.blob();}).then(blob=>URL.createObjectURL(blob)).catch(error=>{recordedAudioCache.delete(file);throw error;});
    recordedAudioCache.set(file,request);
  }
  return recordedAudioCache.get(file);
}
function preloadRecordedAudio(...files){files.forEach(file=>cacheRecordedAudio(file).catch(()=>{}));}
function speak(text,onDone){
  let finished=false,timer;
  const done=()=>{if(finished)return;finished=true;clearTimeout(timer);if(onDone)onDone();};
  if(!soundOn||!("speechSynthesis" in window)){timer=setTimeout(done,850);return;}
  stopRecordedAudio();
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(prepareSpeech(text));
  const hebrewVoice=speechSynthesis.getVoices().find(voice=>voice.lang.toLowerCase().startsWith("he"));
  if(hebrewVoice)u.voice=hebrewVoice;
  const isMobileSpeech=window.matchMedia("(pointer: coarse)").matches||window.innerWidth<=780;
  u.lang="he-IL";u.rate=isMobileSpeech?.70:.84;u.pitch=1.08;u.onend=done;u.onerror=done;
  timer=setTimeout(done,Math.min(6500,Math.max(3000,text.length*140)));
  speechSynthesis.speak(u);
}
function playRecorded(file,fallbackText,onDone){
  let finished=false,timer,audio=null;
  const done=()=>{if(finished)return;finished=true;clearTimeout(timer);stopRecordedAudio();if(onDone)onDone();};
  if(!soundOn){timer=setTimeout(done,500);return;}
  if("speechSynthesis" in window)speechSynthesis.cancel();
  stopRecordedAudio();
  backgroundMusic.volume=.08;
  timer=setTimeout(done,20000);
  cacheRecordedAudio(file).then(url=>{if(finished)return;audio=new Audio(url);currentRecordedAudio=audio;audio.onended=done;audio.onerror=done;audio.play().catch(done);}).catch(done);
}
function playWelcome(onDone){
  const options=Array.from({length:8},(_,i)=>i).filter(i=>i!==lastWelcomeIndex);
  const selected=options[Math.floor(Math.random()*options.length)];lastWelcomeIndex=selected;
  playRecorded(`voice-01-${String(selected+1).padStart(2,"0")}.mp3`,narration.welcome,onDone);
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
  currentShtuz=pickShtuz(a);currentShtuzNumber=stage*3+a.shtuzim.indexOf(currentShtuz)+1;preloadRecordedAudio(`shtuz-${String(currentShtuzNumber).padStart(2,"0")}.mp3`);
  $("stageLabel").textContent=`תחנה ${stage+1} מתוך 10`;$("animalTitle").textContent=`${a.name} מחכה לנועה`;
  $("animalEmoji").textContent=a.emoji;$("foodEmoji").textContent=a.food;$("animalHint").textContent=`ה${a.name} אוהב ${a.foodName}. בואו נאסוף לו אוכל!`;
  $("score").textContent=stage;$("progressBar").style.width=`${(stage+1)*10}%`;makeQuestion();
}
function answer(n,btn){
  if(locked)return;
  if(n===currentAnswer){locked=true;btn.classList.add("correct");$("feedback").textContent="יש! תשובה נהדרת! האוכל נאסף 🎉";$("feedback").className="feedback good";$("animalEmoji").classList.add("happy");showSuccess();
  }else{btn.classList.add("wrong");$("feedback").textContent="כמעט! נסי שוב — נועה מאמינה בך 💗";$("feedback").className="feedback try";playRecorded("voice-04.mp3",narration.wrong);setTimeout(()=>btn.classList.remove("wrong"),500);}
}
function showSuccess(){const a=animals[stage],nextButton=$("nextBtn");$("successAnimal").textContent=a.emoji;$("successTitle").textContent=`ה${a.name} קיבל ${a.foodName}!`;$("shtuzText").textContent=currentShtuz;nextButton.innerHTML=stage===animals.length-1?"לחגיגה הגדולה <span>←</span>":"לחיה הבאה <span>←</span>";nextButton.disabled=false;show("success");playRecorded(`shtuz-${String(currentShtuzNumber).padStart(2,"0")}.mp3`,currentShtuz);}
function next(){stage++;if(stage>=animals.length){$("animalParade").textContent=animals.map(a=>a.emoji).join(" ");show("finish");playRecorded("voice-06.mp3",narration.finish);}else loadStage();}
function startMusic(){if(musicOn){backgroundMusic.play().catch(()=>{});}}
preloadRecordedAudio("voice-03.mp3","voice-04.mp3","voice-05.mp3","voice-06.mp3");
$("startBtn").addEventListener("click",()=>{stage=0;playWelcome(()=>setTimeout(()=>{startMusic();loadStage();},250));});
$("nextBtn").addEventListener("click",next);
$("restartBtn").addEventListener("click",()=>{stage=0;startMusic();loadStage();});
$("soundBtn").addEventListener("click",()=>{soundOn=!soundOn;$("soundBtn").textContent=soundOn?"🔊":"🔇";$("soundBtn").setAttribute("aria-pressed",String(!soundOn));if(!soundOn){stopRecordedAudio();if("speechSynthesis" in window)speechSynthesis.cancel();}});
$("musicBtn").addEventListener("click",()=>{musicOn=!musicOn;$("musicBtn").textContent="🎵";$("musicBtn").style.opacity=musicOn?"1":".42";$("musicBtn").setAttribute("aria-pressed",String(!musicOn));$("musicBtn").setAttribute("aria-label",musicOn?"השתקת מוזיקת הרקע":"הפעלת מוזיקת הרקע");if(musicOn)startMusic();else backgroundMusic.pause();});


let talkAnimation;
let affection = parseInt(localStorage.getItem("affection") || "0");
let energy = parseInt(localStorage.getItem("energy") || "100");
let dtlevel = parseInt(localStorage.getItem("dtlevel") || "1");
let isSleeping = false;
let sleepStartTime = parseInt(localStorage.getItem("sleepStartTime") || "0");

const images = {
            normal: "images/立ち絵.gif",
            blush: "images/照れ.png",
            sparkle: "images/キラキラ.gif",
            sleep: "images/目閉じる.png"
        };


function updateUI() {
    document.getElementById("affection").innerText = affection;
    document.getElementById("energy").innerText = energy;
    document.getElementById("status").innerText = isSleeping ? "状態：おやすみ中…" : "状態：起きてる";
}

function saveState() {
    localStorage.setItem("affection", affection);
    localStorage.setItem("energy", energy);
    localStorage.setItem("dtlevel", dtlevel);
    localStorage.setItem("sleepStartTime", sleepStartTime);
}

function generateCalendar(year, month) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  const date = new Date(year, month - 1, 1);
  const firstDay = date.getDay();
  const lastDate = new Date(year, month, 0).getDate();

  let table = "<table><tr><th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th></tr><tr>";

  for (let i = 0; i < firstDay; i++) {
    table += "<td></td>";
  }

  for (let d = 1; d <= lastDate; d++) {
    if ((firstDay + d - 1) % 7 === 0 && d !== 1) {
      table += "</tr><tr>";
    }
    table += `<td class="calendar-day" onclick="selectDate(${year}, ${month}, ${d})">${d}</td>`;
  }

  table += "</tr></table>";
  calendar.innerHTML = table;
}

// 今日の月で表示
const today = new Date();
generateCalendar(today.getFullYear(), today.getMonth() + 1);

function selectDate(year, month, day) {
  alert(`${year}/${month}/${day} を選んだよ！`);
}


function talk() {
    if (isSleeping || energy <= 0) return;

    const speech = [
                "images/speech1.png",
                "images/speech2.png",
            ];

    const lines = [
                "お、お前今日さ、ちょっと可愛すぎなんだけど……",
                "また今日も一緒に過ごせるとか……最高だな。",
                "お前の声聞いたら……なんか、元気出てきた。",
                "……オレ、お前としゃべってる時間が一番落ち着くんだ。",
                "会話とか、くだらなくなんかねぇよ。オレはお前と喋ってる時間が、一番好きだっつの……"
            ];


    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    document.getElementById("kazuichi-line").innerText = randomLine;

    clearInterval(talkAnimation);
    const imgTag = document.getElementById("kazuichi-image");
    talkAnimation = setInterval(() => {
        const img = speech[Math.floor(Math.random() * speech.length)];
        imgTag.src = img;
    }, 200);

    affection += 1;
    energy -= 10;
    updateUI();
    saveState();
}

function snack() {
    if (isSleeping) {
        document.getElementById("kazuichi-line").innerText = "まだ寝てるみたい。";
        return;
    }
        clearInterval(talkAnimation);
    document.getElementById("kazuichi-line").innerText = "どれ食べたいか、選んでくれよ〜！";
    document.getElementById("snack-menu").style.display = "block";
}

function giveSnack(item) {
    document.getElementById("snack-menu").style.display = "none";
    const imgTag = document.getElementById("kazuichi-image");

    let response = "";
    let image = images.sparkle;
    let affectionChange = 0;

    switch(item) {
        case "コーラ":
            response = "えっ、コーラ！？めっちゃ好きなんだけど！沙汰〜〜！";
            affectionChange = 5;
            break;
        case "ビッグマック":
            response = "うぉ、まじでこれ？ガツンとくるやつ！ありがとな！";
            affectionChange = 3;
            break;
        case "わさび団子":
            response = "……お前それ絶対イジワルで選んだろ！？鼻にくる〜〜！！";
            affectionChange = -2;
            image = images.blush;
            break;
    }

    energy = Math.min(100, energy + 15);
    affection += affectionChange;
    updateUI();
    saveState();

    
    localStorage.setItem("affection", affection);
    imgTag.src = image;
    document.getElementById("kazuichi-line").innerText = response + "（好感度：" + affectionChange + "）";
}

function kiss() {
    if (isSleeping) {
        document.getElementById("kazuichi-line").innerText = "ん……？すぅ……すぅ……";
        return;
    }
    clearInterval(talkAnimation);
    document.getElementById("kazuichi-image").src = images.blush;
    document.getElementById("kazuichi-line").innerText = "っ、ちょ、お、お前今キスボタン押した！？ 童貞レベル振り切れたかも……！";
    dtlevel += 1;
    updateUI();
    saveState();
}

function pet() {
    if (isSleeping) {
        document.getElementById("kazuichi-line").innerText = "ん……なぁに……";
        return;
    }
    clearInterval(talkAnimation);
    let response = affection >= 50 ? "……もっと撫でてほしいかも。" : "な、なんだよ、急に……";
    document.getElementById("kazuichi-line").innerText = response;
    document.getElementById("kazuichi-image").src = images.blush;
    energy = Math.min(100, energy + 5);
    affection += 1;
    updateUI();
    saveState();
}

function sleepNow() {
    if(isSleeping) return;
    if (affection >= 50 || energy <= 0) {
        sleepMode();
    } else {
        document.getElementById("kazuichi-line").innerText = "……まだ眠くないかも。";
        document.getElementById("kazuichi-image").src = images.normal;
    }

}

function sleepMode() {
    clearInterval(talkAnimation);
    isSleeping = true;
    sleepStartTime = Date.now();
    document.getElementById("kazuichi-image").src = "images/sleep.gif";
    document.getElementById("kazuichi-line").innerText = "すぅ……すぅ……（夢の中でも一緒だぞ…）";
    updateUI();
    saveState();
}

function wakeUpCheck() {
    const hour = new Date().getHours();
    const now = Date.now();
    const sleptFor = now - sleepStartTime;
    const sleptLongEnough = sleptFor > 20000;  // 60秒以上寝たら起きてもいい

    if (isSleeping && sleptLongEnough && (hour >= 7 && hour < 23)) {
        isSleeping = false;
        energy = 100;
        document.getElementById("kazuichi-image").src = "images/awake.gif";
        document.getElementById("kazuichi-line").innerText = "ふあ〜……おはよ、沙汰。";
        setTimeout (function () {
            document.getElementById("kazuichi-line").innerText = "…あと10分…いや、5分…";
        console.log;
        }, 5000);
        
        updateUI();
        saveState();
    }
}

function autoSleepCheck() {
    let hour = new Date().getHours();
    if (!isSleeping && (hour >= 23 || hour < 1)) {
        if (Math.random() < 0.3) {
            sleepMode();
        }
    }
}

setInterval(() => {
    if (!isSleeping) {
        let actions = ["漫画を読む", "散歩", "買い物", "メカいじり"];
        let action = actions[Math.floor(Math.random() * actions.length)];
        document.getElementById("kazuichi-image").src = images.normal;
        document.getElementById("kazuichi-line").innerText = "…今は「" + action + "」してるらしい。";
        let cost = action === "メカいじり" ? 20 : 10;
        energy = Math.max(0, energy - cost);
        updateUI();
        saveState();
        if (energy <= 0) {
            sleepMode();
        }
    }
    wakeUpCheck();
    autoSleepCheck();
}, 10000);

updateUI();

let talkAnimation;
let affection = parseInt(localStorage.getItem("affection") || "0");

const images = {
            normal: "images/立ち絵.gif",
            blush: "images/照れ.png",
            sparkle: "images/キラキラ.gif",
            sleep: "images/目閉じる.png"
        };

function talk() {
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
}

function snack() {
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

    affection += affectionChange;
    localStorage.setItem("affection", affection);
    imgTag.src = image;
    document.getElementById("kazuichi-line").innerText = response + "（好感度：" + affection + "）";
}

function kiss() {
    clearInterval(talkAnimation);
    document.getElementById("kazuichi-image").src = images.blush;
    document.getElementById("kazuichi-line").innerText = "っ、ちょ、お、お前今キスボタン押した！？ 童貞レベル振り切れたかも……！";
}

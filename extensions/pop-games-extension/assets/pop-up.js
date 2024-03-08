//#region Confetti
!function(t,e){!function t(e,n,a,i){var o=!!(e.Worker&&e.Blob&&e.Promise&&e.OffscreenCanvas&&e.OffscreenCanvasRenderingContext2D&&e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype.transferControlToOffscreen&&e.URL&&e.URL.createObjectURL);function r(){}function l(t){var a=n.exports.Promise,i=void 0!==a?a:e.Promise;return"function"==typeof i?new i(t):(t(r,r),null)}var c,s,u,d,f,h,g,m,b=(u=Math.floor(1e3/60),d={},f=0,"function"==typeof requestAnimationFrame&&"function"==typeof cancelAnimationFrame?(c=function(t){var e=Math.random();return d[e]=requestAnimationFrame((function n(a){f===a||f+u-1<a?(f=a,delete d[e],t()):d[e]=requestAnimationFrame(n)})),e},s=function(t){d[t]&&cancelAnimationFrame(d[t])}):(c=function(t){return setTimeout(t,u)},s=function(t){return clearTimeout(t)}),{frame:c,cancel:s}),v=(m={},function(){if(h)return h;if(!a&&o){var e=["var CONFETTI, SIZE = {}, module = {};","("+t.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join("\n");try{h=new Worker(URL.createObjectURL(new Blob([e])))}catch(t){return void 0!==typeof console&&"function"==typeof console.warn&&console.warn("🎊 Could not load worker",t),null}!function(t){function e(e,n){t.postMessage({options:e||{},callback:n})}t.init=function(e){var n=e.transferControlToOffscreen();t.postMessage({canvas:n},[n])},t.fire=function(n,a,i){if(g)return e(n,null),g;var o=Math.random().toString(36).slice(2);return g=l((function(a){function r(e){e.data.callback===o&&(delete m[o],t.removeEventListener("message",r),g=null,i(),a())}t.addEventListener("message",r),e(n,o),m[o]=r.bind(null,{data:{callback:o}})}))},t.reset=function(){for(var e in t.postMessage({reset:!0}),m)m[e](),delete m[e]}}(h)}return h}),y={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:10100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function p(t,e,n){return function(t,e){return e?e(t):t}(t&&null!=t[e]?t[e]:y[e],n)}function M(t){return t<0?0:Math.floor(t)}function w(t){return parseInt(t,16)}function x(t){return t.map(C)}function C(t){var e=String(t).replace(/[^0-9a-f]/gi,"");return e.length<6&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),{r:w(e.substring(0,2)),g:w(e.substring(2,4)),b:w(e.substring(4,6))}}function k(t){t.width=document.documentElement.clientWidth,t.height=document.documentElement.clientHeight}function I(t){var e=t.getBoundingClientRect();t.width=e.width,t.height=e.height}function T(t,e,n,o,r){var c,s,u=e.slice(),d=t.getContext("2d"),f=l((function(e){function l(){c=s=null,d.clearRect(0,0,o.width,o.height),r(),e()}c=b.frame((function e(){!a||o.width===i.width&&o.height===i.height||(o.width=t.width=i.width,o.height=t.height=i.height),o.width||o.height||(n(t),o.width=t.width,o.height=t.height),d.clearRect(0,0,o.width,o.height),(u=u.filter((function(t){return function(t,e){e.x+=Math.cos(e.angle2D)*e.velocity+e.drift,e.y+=Math.sin(e.angle2D)*e.velocity+e.gravity,e.wobble+=.1,e.velocity*=e.decay,e.tiltAngle+=.1,e.tiltSin=Math.sin(e.tiltAngle),e.tiltCos=Math.cos(e.tiltAngle),e.random=Math.random()+5,e.wobbleX=e.x+10*e.scalar*Math.cos(e.wobble),e.wobbleY=e.y+10*e.scalar*Math.sin(e.wobble);var n=e.tick++/e.totalTicks,a=e.x+e.random*e.tiltCos,i=e.y+e.random*e.tiltSin,o=e.wobbleX+e.random*e.tiltCos,r=e.wobbleY+e.random*e.tiltSin;return t.fillStyle="rgba("+e.color.r+", "+e.color.g+", "+e.color.b+", "+(1-n)+")",t.beginPath(),"circle"===e.shape?t.ellipse?t.ellipse(e.x,e.y,Math.abs(o-a)*e.ovalScalar,Math.abs(r-i)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):function(t,e,n,a,i,o,r,l,c){t.save(),t.translate(e,n),t.rotate(o),t.scale(a,i),t.arc(0,0,1,r,l,c),t.restore()}(t,e.x,e.y,Math.abs(o-a)*e.ovalScalar,Math.abs(r-i)*e.ovalScalar,Math.PI/10*e.wobble,0,2*Math.PI):(t.moveTo(Math.floor(e.x),Math.floor(e.y)),t.lineTo(Math.floor(e.wobbleX),Math.floor(i)),t.lineTo(Math.floor(o),Math.floor(r)),t.lineTo(Math.floor(a),Math.floor(e.wobbleY))),t.closePath(),t.fill(),e.tick<e.totalTicks}(d,t)}))).length?c=b.frame(e):l()})),s=l}));return{addFettis:function(t){return u=u.concat(t),f},canvas:t,promise:f,reset:function(){c&&b.cancel(c),s&&s()}}}function E(t,n){var a,i=!t,r=!!p(n||{},"resize"),c=p(n,"disableForReducedMotion",Boolean),s=o&&!!p(n||{},"useWorker")?v():null,u=i?k:I,d=!(!t||!s)&&!!t.__confetti_initialized,f="function"==typeof matchMedia&&matchMedia("(prefers-reduced-motion)").matches;function h(e,n,i){for(var o,r,l,c,s,d=p(e,"particleCount",M),f=p(e,"angle",Number),h=p(e,"spread",Number),g=p(e,"startVelocity",Number),m=p(e,"decay",Number),b=p(e,"gravity",Number),v=p(e,"drift",Number),y=p(e,"colors",x),w=p(e,"ticks",Number),C=p(e,"shapes"),k=p(e,"scalar"),I=function(t){var e=p(t,"origin",Object);return e.x=p(e,"x",Number),e.y=p(e,"y",Number),e}(e),E=d,S=[],F=t.width*I.x,N=t.height*I.y;E--;)S.push((o={x:F,y:N,angle:f,spread:h,startVelocity:g,color:y[E%y.length],shape:C[(c=0,s=C.length,Math.floor(Math.random()*(s-c))+c)],ticks:w,decay:m,gravity:b,drift:v,scalar:k},r=void 0,l=void 0,r=o.angle*(Math.PI/180),l=o.spread*(Math.PI/180),{x:o.x,y:o.y,wobble:10*Math.random(),velocity:.5*o.startVelocity+Math.random()*o.startVelocity,angle2D:-r+(.5*l-Math.random()*l),tiltAngle:Math.random()*Math.PI,color:o.color,shape:o.shape,tick:0,totalTicks:o.ticks,decay:o.decay,drift:o.drift,random:Math.random()+5,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:3*o.gravity,ovalScalar:.6,scalar:o.scalar}));return a?a.addFettis(S):(a=T(t,S,u,n,i)).promise}function g(n){var o=c||p(n,"disableForReducedMotion",Boolean),g=p(n,"zIndex",Number);if(o&&f)return l((function(t){t()}));i&&a?t=a.canvas:i&&!t&&(t=function(t){var e=document.createElement("canvas");return e.style.position="fixed",e.style.top="0px",e.style.left="0px",e.style.pointerEvents="none",e.style.zIndex=t,e}(g),document.body.appendChild(t)),r&&!d&&u(t);var m={width:t.width,height:t.height};function b(){if(s){var e={getBoundingClientRect:function(){if(!i)return t.getBoundingClientRect()}};return u(e),void s.postMessage({resize:{width:e.width,height:e.height}})}m.width=m.height=null}function v(){a=null,r&&e.removeEventListener("resize",b),i&&t&&(document.body.removeChild(t),t=null,d=!1)}return s&&!d&&s.init(t),d=!0,s&&(t.__confetti_initialized=!0),r&&e.addEventListener("resize",b,!1),s?s.fire(n,m,v):h(n,m,v)}return g.reset=function(){s&&s.reset(),a&&a.reset()},g}n.exports=E(null,{useWorker:!0,resize:!0}),n.exports.create=E}(function(){return void 0!==t?t:"undefined"!=typeof self?self:this||{}}(),e,!1),t.confetti=e.exports}(window,{});
//#endregion
//#region WordList
var lowWordList = ["STYLE", "SPARK", "VOGUE", "SMART", "BRISK", "TREND", "QUICK", "CRISP", "PEACH", "SNACK"];
var midWordList = ["ROYAL", "STARS", "BLUSH", "GLEAM", "BLISS", "HAPPY", "FLASH", "FRESH", "FLUFF", "GLINT"];
var highWordList = ["LUCKY", "PIQUE", "FANCY", "SWEET", "SWANK", "GLOWS", "BLING", "SAVOR", "SLICK", "SUNNY"];
var wordDic = {
    1: lowWordList,
    2: midWordList,
    3: highWordList
}
//#endregion

var height = 6; //number of guesses
var width = 5; //length of the word

var row = 0; //current guess (attempt #)
var col = 0; //current letter for attempt

var gameOver = false;

var lowPctOff = 10;
var midPctOff = 20;
var highPctOff = 30;

var pctOff = 20;

var lowProb = 20;
var midProb = 60;
var highProb = 20;

var word = "";

var gameToPlay = "birdGame";
var delay = 10000; //0; // Set to 10000
var mobile = false;
var gameInProgress = false;

var optOut = false;

let score = 0;
let scores = [];

const checkbox = document.getElementById('pg-optOut');

let isPopUpOpen = true;

checkbox.addEventListener('change', function(event) {
  const actionButton = document.getElementById("pg-actionButton");
  const imageButton = document.getElementById("pg-imageButton");
  if (event.target.checked) {
    optOut = true;
    actionButton.textContent = "Claim";
    actionButton.style.display = "inline-block";
    imageButton.style.display = "none"
  } else {
    optOut = false;
    if (mobile && imageButton.dataset.show === "true") {
        imageButton.style.display = "inline-block";
        actionButton.style.display = "none";
    } else {
        actionButton.style.display = "inline-block";
        imageButton.style.display = "none"
    }
    document.getElementById("pg-actionButton").textContent = "Play";
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('pg-overlay');
    overlay.style.display = 'none';
    const popUp = document.getElementById('pg-popUp');
    popUp.style.display = 'none';
    document.getElementById('pg-emailForm').style.display = 'none';
    const hasPopUpDisplayed = sessionStorage.getItem('hasPopUpDisplayed');
    let imageButton = document.getElementById("pg-imageButton");
    if (!hasPopUpDisplayed || true) { // Remove true ||
        if (hasPopUpDisplayed) { closePopUp(); }
        if (window.innerWidth < 768) {
            mobile = true;
            document.getElementById("pg-exitContainerMobile").style.display = "flex";
            if (imageButton.dataset.show === "false") {
                document.getElementById("pg-actionButton").style.display = "inline-block";
                document.getElementById("pg-imageButton").style.display = "none";
            }
        } else {
            mobile = false;
            document.getElementById("pg-actionButton").style.display = "inline-block";
            document.getElementById("pg-imageButton").style.display = "none";
            document.getElementById("pg-exitContainerMobile").style.display = "none";
        }
        document.getElementById('pg-emailForm').addEventListener('keypress', function(e) {
            if (isPopUpOpen) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    validateAndProcessEmail();
                }
            }
        });

        const currentTime = Date.now();
        const storedTime = sessionStorage.getItem(`popUpStartTime`);
        const timeElapsed = storedTime ? (currentTime - parseInt(storedTime)) : 0;

        delay = popUp.dataset.delay * 1000;

        const minimumDelay = 2000; // Minimum second delay per page
        const remainingDelay = delay - timeElapsed
        const delayRemaining = remainingDelay > minimumDelay ? remainingDelay : minimumDelay;

        if (delayRemaining > 0) {
            setTimeout(function() {
                if (!hasPopUpDisplayed) {
                    popUp.style.display = 'flex';
                    overlay.style.display = 'block';
                    sessionStorage.setItem('hasPopUpDisplayed', 'true');
                } else {
                    closePopUp();
                }
            }, delayRemaining);

            sessionStorage.setItem('popUpStartTime', currentTime - timeElapsed);
        } else {
            sessionStorage.setItem('hasPopUpDisplayed', 'true');
        }
    }
})

window.onload = async function(){
    const hasPopUpDisplayed = sessionStorage.getItem('hasPopUpDisplayed');
    if (!hasPopUpDisplayed || true) { // Remove true ||
        document.getElementById('pg-email').addEventListener('focus', function(event) {
            if (isPopUpOpen) {
                event.preventDefault();
            }
        });
        initExitHover();
        const exitContainer = document.getElementById("pg-exitContainer")
        exitContainer.style.position = "absolute";
        exitContainer.style.top = "10px";
        exitContainer.style.right = "10px";
        exitContainer.style.marginLeft = "initial";
        document.getElementById("pg-right-column").style.margin = "0";
        await initDiscountOptions();
        await initGameOptions();
        word = getRandomWord();
        const imageButton = document.getElementById("pg-imageButton");
        if (gameToPlay === "wordGame") {
            imageButton.style.backgroundImage = "url('https://i.imgur.com/hUZIRqH.png')";
            document.getElementById("pg-wordGameContainer").style.display = "flex";
            document.getElementById("pg-birdGameContainer").style.display = "none";
            document.getElementById("pg-birdGameImg").style.display = "none";
            exitContainer.style.position = "initial";
            exitContainer.style.top = "initial";
            exitContainer.style.right = "initial";
            exitContainer.style.marginLeft = "93%";
            document.getElementById("pg-right-column").style.margin = "0px 0px 30px 0px";
            initializeWordGame(true, false);
        } else if (gameToPlay === "birdGame") {
            imageButton.style.backgroundImage = "url('https://i.imgur.com/L0xY2Y7.png')";
            document.getElementById("pg-wordGameContainer").style.display = "none";
            document.getElementById("pg-birdGameContainer").style.display = "flex";
            document.getElementById("pg-birdGameImg").style.display = "inline-block";
            /*exitContainer.style.position = "absolute";
            exitContainer.style.top = "10px";
            exitContainer.style.right = "10px";
            exitContainer.style.marginLeft = "initial";
            document.getElementById("pg-right-column").style.margin = "0";*/
        } else {
            closePopUpCompletely();
        }
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth < 768) {
      mobile = true;
      makeItMobile();
    } else {
      mobile = false;
      makeItDesktop();
    }
});

function handleOverlayClick(event) {
    if (gameToPlay === 'birdGame' && gameInProgress) {
        moveBird(event);
    }
    event.stopPropagation();
};

document.getElementById('pg-overlay').addEventListener('click', handleOverlayClick);
//document.getElementById('pg-overlay').addEventListener('touchstart', handleOverlayClick);

function makeItMobile() {
    if (gameInProgress) {
        document.getElementById("pg-right-column").style.display = "flex";
        document.getElementById("pg-left-column").style.display = "none"
    } else {
        document.getElementById("pg-right-column").style.display = "none";
        document.getElementById("pg-left-column").style.display = "flex";
        document.getElementById("pg-exitContainerMobile").style.display = "flex";
    }
}

function makeItDesktop() {
    document.getElementById("pg-right-column").style.display = "flex";
    document.getElementById("pg-left-column").style.display = "flex";
    document.getElementById("pg-exitContainerMobile").style.display = "none";
}

function initializeWordGame(firstInit = true, isUnlocked = true) {
    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("pg-tile");
            tile.innerText = "";
            document.getElementById("pg-board").appendChild(tile);
        }
    }

    // Create the key board
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("pg-keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key;
            } 

            if (isUnlocked) {
                keyTile.addEventListener("click", processWordGameKey);
                //keyTile.addEventListener("touchstart", processWordGameKey);
            }

            if (key == "Enter") {
                keyTile.classList.add("pg-enter-key-tile");
            } else {
                keyTile.classList.add("pg-key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.getElementById("pg-keyboard").appendChild(keyboardRow);
    }
    

    // Listen for Key Press
    if (firstInit && isUnlocked) {
        document.addEventListener("keyup", (e) => {
            if (isPopUpOpen) {
                processWordGameInput(e);
            }
        })
    }

    if (mobile) {
        makeItMobile();
    }
}

function processWordGameKey() {
    e = { "code" : this.id };
    processWordGameInput(e);
}

function processWordGameInput(e) {
    if (gameOver) return; 

    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -=1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        updateWordGame();
    }

    if (!gameOver && row == height) {
        scores.push(row + 1);
        //setUserStats(row + 1, 'wordGame')
        restartWordGame();
    }
}

function updateWordGame() {
    let guess = "";
    document.getElementById("pg-answer").innerText = "Guess a word";

    //string up the guesses into the word
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); //case sensitive
    
    //start processing guess
    let correct = 0;

    let letterCount = {};
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
           letterCount[letter] += 1;
        } 
        else {
           letterCount[letter] = 1;
        }
    }

    if (guess.length < 5) {
        return;
    }

    //first iteration, check all the correct ones first
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //Is it in the correct position?
        if (word[c] == letter) {
            currTile.classList.add("pg-correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("pg-present");
            keyTile.classList.add("pg-correct");

            correct += 1;
            letterCount[letter] -= 1; //deduct the letter count
        }

        if (correct == width) {
            document.getElementById("pg-answer").innerText = "Correct!";
            document.getElementById("pg-imageContainer").style.display = "none";
            const emailForm = document.getElementById("pg-emailForm");
            emailForm.style.display = "block";
            document.getElementById("pg-emailEntryLabel").style.display = "block";
            document.getElementById("pg-email").style.display = "inline-block";
            document.getElementById("pg-submitButton").style.display = "inline-block";
            gameOver = true;
            score = row + 1;
            const confettiLength = (mobile) ? 1500 : 2000;
            showConfetti(confettiLength);
            if (mobile) {
                setTimeout(() => {
                    switchScreens();
                }, 1000)
            } else {
                gameInProgress = false;
            }
        }
    }
    //go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // skip the letter if it has been marked correct
        if (!currTile.classList.contains("pg-correct")) {
            //Is it in the word?         //make sure we don't double count
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("pg-present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("pg-correct")) {
                    keyTile.classList.add("pg-present");
                }
                letterCount[letter] -= 1;
            } // Not in the word or (was in word but letters all used up to avoid overcount)
            else {
                if (letterCount[letter] <= -1) {
                    currTile.classList.add("pg-present");
                } else {
                    currTile.classList.add("pg-absent");
                }
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("pg-correct") && !keyTile.classList.contains("pg-present")) {
                    keyTile.classList.add("pg-absent");
                }
            }
        }
    }

    row += 1; //start new row
    col = 0; //start at 0 for new row
}

function restartWordGame() {
    let board = document.getElementById("pg-board");
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    let keyboard = document.getElementById("pg-keyboard");
    while (keyboard.firstChild) {
        keyboard.removeChild(keyboard.firstChild);
    }
    document.getElementById("pg-answer").innerText = "Try again";
    word = getRandomWord();
    row = 0;
    col = 0;
    initializeWordGame(false);
}

function showConfetti(delay) {
    const end = Date.now() + delay;

    if (this.isAnimating) return;

    this.animate(end);
}

function animate(end) {
    confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
        });
    confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
    });
    if (Date.now() < end) {
        this.isAnimating = true;
        requestAnimationFrame(() => this.animate(end));
      } else {
        this.isAnimating = false;
    }
}

function zoomOutMobile () {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (viewport) {
        viewport.content = 'initial-scale=1';
        viewport.content = 'width=device-width';
    }
}

function validateAndProcessEmail() {
    const emailInput = document.getElementById("pg-email");
    const email = emailInput.value;

    if (mobile) {
        zoomOutMobile();
    }

    if (isValidEmail(email)) {
        processEmail(email);
    } else {
        alert("Invalid email address. Please enter a valid email.");
    }
}

const proxyUrl = "/apps/handle-pop-up";

function processEmail(email) {
    fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            getDiscountOptions: false,
            getGameOptions: false,
            getUserStats: false,
            setUserStats: null,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
          if (data.validEmailGiven) {
            document.getElementById("pg-emailForm").style.display = "none";
            document.getElementById("pg-optOutContainer").style.display = "none"
            document.getElementById("pg-emailDenied").style.display = "none";
            document.getElementById("pg-discountContainer").style.marginTop = "5.75%";
            document.getElementById("pg-imageContainer").style.display = "none";
            if (optOut) {
                lowProb = 100;
                word = getRandomWord();
                document.getElementById("pg-discountPercentage").textContent = `${pctOff}% Off!`;
                document.getElementById("pg-discountPercentageContainer").style.display = "flex";
                //document.getElementById("pg-discount-box").style.background = "#000"; // Discount reveal
                document.getElementById("pg-discount-box").style.background = "transparent";
                document.getElementById("pg-discountCode").textContent = "POPGAMES-" + word;
                document.getElementById("pg-copyButton").style.display = "inline-block"
                showConfetti(5000);
            } else {
                const newPctOffTexts = [lowPctOff, midPctOff, highPctOff];
                const discountPercentage = document.getElementById("pg-discountPercentage");
                discountPercentage.textContent = `${lowPctOff}%`;
                document.getElementById("pg-discountPercentageContainer").style.display = "flex";
                let index = 0;
                const interval = setInterval(() => {
                    discountPercentage.textContent = `${newPctOffTexts[index]}%`;
                    index = (index + 1) % newPctOffTexts.length;
                }, 50)
                setTimeout(() => {
                    clearInterval(interval);
                    //document.getElementById("pg-discount-box").style.background = "#000"; // Discount reveal
                    document.getElementById("pg-discount-box").style.background = "transparent";
                    document.getElementById("pg-discountCode").textContent = "POPGAMES-" + word;
                    discountPercentage.textContent = `${pctOff}% Off!`;
                    document.getElementById("pg-copyButton").style.display = "inline-block"
                    showConfetti(5000);
                    showStats(gameToPlay, score)
                }, 1250)
            }
          } else {
            document.getElementById("pg-emailDenied").style.display = "block";
            document.getElementById("pg-discountContainer").style.marginTop = "5.5%";
          }
        })
        .catch((error) => {
          console.error(error);
        });
}

function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
}

function actionButtonPressed() {
    let keyboard = document.getElementById("pg-keyboard");
    if (!optOut) {
        gameInProgress = true;
        if (gameToPlay === "wordGame") {
            let board = document.getElementById("pg-board");
            while (board.firstChild) {
                board.removeChild(board.firstChild);
            }
            while (keyboard.firstChild) {
                keyboard.removeChild(keyboard.firstChild);
            }
            initializeWordGame();
            document.getElementById("pg-lockContainer").style.display = "none";
        } else if (gameToPlay === "birdGame") {
            setTimeout(() => {
                document.getElementById("pg-birdGameImg").style.display = "none";
                document.getElementById("pg-lockContainer").style.display = "none";
                initializeBirdGame();
            }, 500)
        }
        document.getElementById("pg-wordGameImg").style.display = "none";
        document.getElementById("pg-actionButtonContainer").style.display = "none";
        document.getElementById("pg-optOutContainer").style.display = "none";
        document.getElementById("pg-discountContainer").style.marginTop = "5.75%";
        const imageContainer = document.getElementById("pg-imageContainer");
        imageContainer.style.display = "flex";
        imageContainer.marginTop = "10.85%";
        imageContainer.marginBottom = "4.85%";
    } else {
        document.getElementById("pg-actionButtonContainer").style.display = "none";
        document.getElementById("pg-optOutContainer").style.display = "none";
        const emailForm = document.getElementById("pg-emailForm");
        emailForm.style.display = "block";
        emailForm.style.marginTop = "7.85%";
        emailForm.style.marginBottom = "2.85%";
        document.getElementById("pg-emailEntryLabel").style.display = "block";
        document.getElementById("pg-email").style.display = "inline-block";
        document.getElementById("pg-submitButton").style.display = "inline-block";
    }
}

function copyTextToClipboard() {
    var id = "pg-discountCode";

    var r = document.createRange();
    r.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    document.getElementById("pg-copyButton").style.display = "none";
    document.getElementById("pg-circleTickSmall").style.display = "inline-block";
}

function closePopUp() {
    var popUp = document.getElementById("pg-popUp");
    var overlay = document.getElementById("pg-overlay");
    var popupButton = document.getElementById("pg-popup-button"); 

    popUp.style.display = "none";
    overlay.style.display = "none";

    popupButton.style.display = "flex";

    isPopUpOpen = false;
}

function closePopUpCompletely() {
    var popUp = document.getElementById("pg-popUp");
    var overlay = document.getElementById("pg-overlay");

    overlay.parentNode.removeChild(overlay);
    popUp.parentNode.removeChild(popUp);
    
    isPopUpOpen = false;
}


function openPopUp() {
    var popUp = document.getElementById("pg-popUp");
    var overlay = document.getElementById("pg-overlay");
    var popupButton = document.getElementById("pg-popup-button");

    popUp.style.display = "flex";
    overlay.style.display = "block";

    popupButton.style.display = "none";

    isPopUpOpen = true;
}

function initExitHover() {
    const exitContainer = document.getElementById('pg-exitContainer');
    const exitButton = document.getElementById('pg-exitButton');
    const exitButtonHover = document.getElementById('pg-exitButtonHover');

    exitContainer.addEventListener('mouseover', () => {
        exitButton.style.display = "none";
        exitButtonHover.style.display = "inline-block";
    });

    exitContainer.addEventListener('mouseout', () => {
        exitButton.style.display = "inline-block";
        exitButtonHover.style.display = "none";
    });
}

function getRandomWord() {
    let randomInt = Math.floor(Math.random() * 100) + 1;
    if (randomInt <= lowProb) {
        pctOff = lowPctOff;
        randomInt = 1;
    } else if (randomInt <= lowProb + midProb) {
        pctOff = midPctOff;
        randomInt = 2;
    } else {
        pctOff = highPctOff;
        randomInt = 3;
    }
    const wordList = wordDic[randomInt];
    return wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
}

async function initDiscountOptions() {
    try {
      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: null,
            getDiscountOptions: true,
            getGameOptions: false,
            getUserStats: false,
            setUserStats: null,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch discount options");
      }
  
      const data = await response.json();
  
      const discountOptions = data.discountOptions || {};
  
      lowPctOff = discountOptions.lowPctOff != null ? Math.floor(discountOptions.lowPctOff * 100) : lowPctOff;
      midPctOff = discountOptions.midPctOff != null ? Math.floor(discountOptions.midPctOff * 100) : midPctOff;
      highPctOff = discountOptions.highPctOff != null ? Math.floor(discountOptions.highPctOff * 100) : highPctOff;
      lowProb = discountOptions.lowProb != null ? Math.floor(discountOptions.lowProb * 100) : lowProb;
      midProb = discountOptions.midProb != null ? Math.floor(discountOptions.midProb * 100) : midProb;
      highProb = discountOptions.highProb != null ? Math.floor(discountOptions.highProb * 100) : highProb;
  
      document.getElementById("pg-headerText").textContent = `Get ${lowPctOff}%, ${midPctOff}%, or ${highPctOff}% Off Your First Order`;
      document.getElementById("pg-optOutText").textContent = `Or check the box to receive ${lowPctOff}% off now: `;
    } catch (error) {
      //console.error(error);
    }
}

async function initGameOptions() {
    try {
        const response = await fetch(proxyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: null,
            getDiscountOptions: false,
            getGameOptions: true,
            getUserStats: false,
            setUserStats: null,
          }),
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch game options");
        }
    
        const data = await response.json();

        const gameOptions = data.gameOptions || {};
    
        birdGame = gameOptions.useBirdGame != null ? gameOptions.useBirdGame : false;
        wordGame = gameOptions.useWordGame != null ? gameOptions.useWordGame : false;
    
        if (birdGame && wordGame) {
            const randInt = Math.round(Math.random());
            gameToPlay = randInt ? "birdGame" : "wordGame";
        } else if (birdGame) {
            gameToPlay = "birdGame";
        } else if (wordGame) {
            gameToPlay = "wordGame";
        } else {
            gameToPlay = "none";
        }
      } catch (error) {
        //console.error(error);
    }
}

async function setUserStats(myScore, game) {
    const emailInput = document.getElementById("pg-email");
    const email = emailInput.value;
    return fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
          email: email,
          getDiscountOptions: false, 
          getGameOptions: false, 
          getUserStats: false,  
          setUserStats: { score: myScore, game: game, scores: scores }
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch((error) => {
      //console.error(error);
      throw error; // Re-throw the error for the caller to catch
    });
  }

function showStats(game, myScore) {
    const delay = 1000; // mobile ? 500 : 2000;
    setUserStats(myScore, game)
        .then(stats => {
            let avg = parseFloat(myScore);
            let best = myScore;
            if (stats.updatedUserStats != null) {
                if (game === 'wordGame') {
                    avg = (parseFloat(stats.updatedUserStats.wordGamesTotal) / parseFloat(stats.updatedUserStats.wordGamesPlayed)).toFixed(1);
                    best = stats.updatedUserStats.wordGameBest;
                } else if (game === 'birdGame') {
                    avg = (parseFloat(stats.updatedUserStats.birdGamesTotal) / parseFloat(stats.updatedUserStats.birdGamesPlayed)).toFixed(1);
                    best = stats.updatedUserStats.birdGameBest;
                }
            }
            setTimeout(function() {
                const statsContainer = document.getElementById("pg-statsContainer");
                statsContainer.style.display = "flex";
                const emailInput = document.getElementById("pg-email");
                const email = emailInput.value;
                document.getElementById("pg-statsSubtitle").textContent = email;
                document.getElementById("pg-score").textContent = myScore;
                document.getElementById("pg-avg").textContent = avg;
                document.getElementById("pg-best").textContent = best;
                document.getElementById("pg-answer").style.visibility = "hidden";
            }, delay);
        })
        .catch(error => {
            //console.error("Error fetching user stats:", error);
        });
}

function switchScreens() {
    setTimeout(function() {
        document.getElementById("pg-right-column").style.display = "none";
        document.getElementById("pg-left-column").style.display = "flex";
        document.getElementById("pg-exitContainerMobile").style.display = "flex";
        gameInProgress = false;
    }, 500);
}

//#region BirdGame
//board
let birdBoard;
let boardWidth = 360;
let boardHeight = 450;
let context;

//bird
let birdWidth = 35; //width/height ratio = 408/228 = 17/12
let birdHeight = 25;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 45; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 360;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;
let topPipe;
let bottomPipe;

//physics
let velocityX = -1.5; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.0975;

let birdGameOver = false;
let beginGame = false;

let lastPipePlacementTime = 0;
let pipePlacementInterval = 1500;

let optimalFPS = 144;
let fpsOptimizedJumpSpeed = -3;

let headerText = document.getElementById('pg-headerText');
let computedStyle = window.getComputedStyle(headerText);
let fontFamily = computedStyle.fontFamily;
let fontSize = "20px";//computedStyle.fontSize; 

function initializeBirdGame() {
    if (mobile) {
        makeItMobile();
    }
    birdBoard = document.getElementById("pg-bird-board");
    context = birdBoard.getContext("2d");

    birdImg = document.getElementById("pg-birdImg");
    topPipeImg = document.getElementById("pg-topPipeImg");
    bottomPipeImg = document.getElementById("pg-bottomPipeImg");

    topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: 0, // Set initial position
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    
    bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: 0, // Set initial position
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };

    bird = {
        x : birdX,
        y : birdY,
        width : birdImg.width,
        height : birdImg.height
    }

    if (birdImg.complete) {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    } else {
        birdImg.onload = function() {
            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }
    }

    beginGame = true;
    context.fillStyle = "white";
    context.font=`${fontSize} ${fontFamily}`;

    wrapTextCentered(context, "Score 5 to win", 22, 100, 250, 25);
    if (!mobile) {
        wrapTextCentered(context, "Click Space or W to play", 22, 135, 250, 25);
        document.addEventListener("click", moveBird);
        document.addEventListener("keydown", moveBird);
    } else {
        wrapTextCentered(context, "Tap to play", 22, 135, 250, 25);
        document.getElementById("pg-popUp").addEventListener("click", moveBird);
    }
}

let frameCount = 0;
let lastFrameTime;
let frameRate = 0;
let initialFrameCalculated = false;

function update(timestamp) {
    frameCount++
    const currentTime = performance.now();
    const timeDiff = currentTime - lastFrameTime;

    if (!initialFrameCalculated && timeDiff > 200) {
        frameRate = frameCount / (timeDiff / 1000);
        //console.log(`Frame rate: ${frameRate.toFixed(2)} FPS`);
        initialFrameCalculated = true;
        lastFrameTime = currentTime;
        adjustVariablesForFPS(frameRate);
    }

    if (initialFrameCalculated) {
        if (birdGameOver) {
            return;
        }
        context.clearRect(0, 0, birdBoard.width, birdBoard.height);

        //bird
        velocityY += gravity;
        // bird.y += velocityY;
        bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        if (bird.y > birdBoard.height) {
            birdGameOver = true;
        }

        //pipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
                pipe.passed = true;
            }

            if (detectCollision(bird, pipe)) {
                birdGameOver = true;
            }
        }

        //clear pipes
        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift(); //removes first element from the array
        }

        const elapsedTime = timestamp - lastPipePlacementTime;

        // Check if the time interval for placing pipes has elapsed
        if (elapsedTime > pipePlacementInterval) {
            placePipes();
            lastPipePlacementTime = timestamp; // Update the last placement time
        }

        //score
        context.fillStyle = "white";
        context.font=`28px ${fontFamily}`;
        context.fillText(score, 5, 30);

        if (birdGameOver) {
            if (score >= 5) {
                context.font=`20px ${fontFamily}`;
                wrapTextCentered(context, "You Win!", 22, 100, 250, 25);
                document.removeEventListener("click", moveBird);
                document.removeEventListener("keydown", moveBird);
                document.getElementById('pg-popUp').removeEventListener('click', moveBird);
                document.getElementById('pg-overlay').removeEventListener('click', handleOverlayClick);
                document.getElementById('pg-imageContainer').style.display = "none";
                const emailForm = document.getElementById("pg-emailForm");
                emailForm.style.display = "block";
                document.getElementById("pg-emailEntryLabel").style.display = "block";
                document.getElementById("pg-email").style.display = "inline-block";
                document.getElementById("pg-submitButton").style.display = "inline-block";
                const confettiLength = (mobile) ? 1500 : 2000;
                showConfetti(confettiLength);
                if (mobile) {
                    setTimeout(() => {
                        switchScreens();
                    }, 1000)
                } else {
                    gameInProgress = false;
                }
            } else {
                context.font=`20px ${fontFamily}`;
                wrapTextCentered(context, "Try Again", 22, 100, 250, 25);
                wrapTextCentered(context, "Score 5 to win", 22, 135, 250, 25);
                scores.push(score);
                //setUserStats(score, 'birdGame');
            }
        }

        lastFrameTime = currentTime;
    }

    requestAnimationFrame(update);
}

function adjustVariablesForFPS(actualFPS) {
    // Calculate the ratio between actual and optimal FPS
    let ratio = optimalFPS / actualFPS;

    // Scaling factors for each variable
    let velocityXScale = 1.0;
    let pipePlacementScale = 1.0;
    let gravityScale = 1.0;
    let jumpSpeedScale = 1.0;

    // Adjust the scaling factors based on the ratio
    velocityXScale *= ratio;
    pipePlacementScale *= ratio;
    gravityScale *= ratio;
    jumpSpeedScale *= ratio;

    // Apply the scaling factors to the variables
    velocityX = -1.5 + (-1.5 * (velocityXScale - 1));
    pipePlacementInterval = 1500; //(1500 * (pipePlacementScale - 1) / 4);
    gravity = 0.09275 + (0.09275 * (gravityScale - 1) * 2);
    fpsOptimizedJumpSpeed = -3.4 + (-3.4 * (jumpSpeedScale - 1) / 2.25);
}

function placePipes() {
    if (birdGameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = birdBoard.height/4;

    topPipe.x = pipeX;
    topPipe.y = randomPipeY;
    topPipe.passed = false;
    pipeArray.push({ ...topPipe }); // Push a copy of the topPipe object

    bottomPipe.x = pipeX;
    bottomPipe.y = randomPipeY + pipeHeight + openingSpace;
    bottomPipe.passed = false;
    pipeArray.push({ ...bottomPipe }); // Push a copy of the bottomPipe object
}

function moveBird(e) {
    if (isPopUpOpen) {
        if (e.type === "click" || e.code === "KeyW" || e.code === "Space") {
            e.preventDefault();
            if (beginGame) {
                lastFrameTime = performance.now();
                requestAnimationFrame(update);
                //setInterval(placePipes, 1500); //every 1.5 seconds
                beginGame = false;
            }

            velocityY = fpsOptimizedJumpSpeed;

            if (birdGameOver) {
                bird.y = birdY;
                pipeArray = [];
                score = 0;
                birdGameOver = false;
                //initialFrameCalculated = false;
                lastFrameTime = performance.now();
                requestAnimationFrame(update);
            }
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}


function wrapTextCentered(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    var centerX = x + maxWidth / 2; // Center X position

    for (var i = 0; i < words.length; i++) {
        var testLine = line + words[i] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            var xPos = centerX - context.measureText(line).width / 2; // Calculate centered X position
            context.fillText(line, xPos, y);
            line = words[i] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }

    var xPosLastLine = centerX - context.measureText(line).width / 2; // Calculate centered X position for last line
    context.fillText(line, xPosLastLine, y);
}
//#endregion
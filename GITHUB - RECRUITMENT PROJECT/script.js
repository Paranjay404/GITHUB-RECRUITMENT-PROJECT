// --- DOM ELEMENTS ---
const cocomelonOverlay = document.getElementById("cocomelon-overlay");
const rickrollOverlay = document.getElementById("rickroll-overlay");
const mainContent = document.getElementById("main-content");

const closeBtn = document.getElementById("close-btn");
const timerDisplay = document.getElementById("timer");

const punchBtn = document.getElementById("punch-btn");
const gifContainer = document.getElementById("gif-container");
const statusDisplay = document.getElementById("status");
const punchCountDisplay = document.getElementById("punch-count");
const timeCountDisplay = document.getElementById("time-count");
const punchTimerDisplay = document.getElementById("punch-timer-display");
const punchTimerSpan = document.getElementById("punch-timer");

const yesNoArea = document.getElementById("yes-no-area");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const clubMessage = document.getElementById("club-message");

const robuxInput = document.getElementById("robux-input");
const currencySelect = document.getElementById("currency-select");
const currencyResult = document.getElementById("currency-result");

const pppAmount = document.getElementById("ppp-amount");
const pppFrom = document.getElementById("ppp-from");
const pppTo = document.getElementById("ppp-to");
const pppResult = document.getElementById("ppp-result");

// --- STATE ---
let countdown = 5;
let punches = 0;
let isSessionActive = false;
let startTime = null;
let punchWindowTimeout = null;
let punchTickInterval = null;
const PUNCH_WINDOW_SECONDS = 5;

// --- STEP 1: CLOSE INTRO VIDEO -> 5s RICK ROLL ---
closeBtn.addEventListener("click", function () {
    cocomelonOverlay.classList.add("hidden");
    rickrollOverlay.classList.remove("hidden");

    const interval = setInterval(function () {
        countdown--;
        timerDisplay.innerText = countdown;

        if (countdown <= 0) {
            clearInterval(interval);
            rickrollOverlay.classList.add("hidden");
            mainContent.classList.remove("hidden");
        }
    }, 1000);
});

// --- STEP 2: PUNCHING GAME - HARD 5 SECOND WINDOW ---
punchBtn.addEventListener("click", function () {
    const now = Date.now();

    if (!isSessionActive) {
        startPunchSession(now);
    }

    if (!isSessionActive) return;

    punches++;
    punchCountDisplay.innerText = punches;
});

function startPunchSession(now) {
    isSessionActive = true;
    startTime = now;
    punches = 0;
    punchCountDisplay.innerText = punches;
    gifContainer.classList.remove("hidden");
    statusDisplay.innerText = "Punching in progress! Keep clicking!";

    let secondsLeft = PUNCH_WINDOW_SECONDS;
    punchTimerSpan.innerText = secondsLeft;
    punchTimerDisplay.classList.remove("hidden");

    clearInterval(punchTickInterval);
    punchTickInterval = setInterval(function () {
        secondsLeft--;
        punchTimerSpan.innerText = Math.max(secondsLeft, 0);
    }, 1000);

    clearTimeout(punchWindowTimeout);
    punchWindowTimeout = setTimeout(function () {
        stopPunchSession();
    }, PUNCH_WINDOW_SECONDS * 1000);
}

function stopPunchSession() {
    isSessionActive = false;
    clearInterval(punchTickInterval);
    gifContainer.classList.add("hidden");
    punchTimerDisplay.classList.add("hidden");

    const validTime = PUNCH_WINDOW_SECONDS.toFixed(1);
    timeCountDisplay.innerText = validTime;
    statusDisplay.innerText = `Time's up! You threw ${punches} punches in ${validTime}s!`;
}

// --- STEP 3: NO BUTTON FLEES WHEN CURSOR GETS CLOSE ---
const FLEE_DISTANCE = 90; // px

function distanceToButton(mouseX, mouseY, btn) {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.hypot(mouseX - centerX, mouseY - centerY);
}

function moveNoButtonAway() {
    const areaRect = yesNoArea.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const maxX = Math.max(areaRect.width - btnWidth, 0);
    const maxY = Math.max(areaRect.height - btnHeight, 0);

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noBtn.style.position = "absolute";
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
}

document.addEventListener("mousemove", function (e) {
    if (mainContent.classList.contains("hidden")) return;
    if (distanceToButton(e.clientX, e.clientY, noBtn) < FLEE_DISTANCE) {
        moveNoButtonAway();
    }
});

// --- STEP 4: YES/NO -> ALWAYS CELEBRATE YES ---
function celebrateYes() {
    yesBtn.classList.add("glow");
    clubMessage.classList.remove("hidden");

    setTimeout(function () {
        yesBtn.classList.remove("glow");
    }, 1200);
}

yesBtn.addEventListener("click", celebrateYes);
noBtn.addEventListener("click", celebrateYes); // in case it's ever caught

// --- STEP 5: ROBUX -> CURRENCY CONVERTER ---
// Static approximate rates for fun - not live financial data.
const ROBUX_TO_USD = 0.0125; // typical Robux purchase rate in USD
const USD_TO = {
    USD: 1,
    ARS: 1500,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83,
    JPY: 148
};
const CURRENCY_SYMBOLS = {
    USD: "$",
    ARS: "ARS$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥"
};

function updateCurrencyConverter() {
    const robux = parseFloat(robuxInput.value) || 0;
    const target = currencySelect.value;
    const usdValue = robux * ROBUX_TO_USD;
    const converted = usdValue * USD_TO[target];

    currencyResult.innerText = `${converted.toFixed(2)} ${CURRENCY_SYMBOLS[target]} (${target})`;
}

robuxInput.addEventListener("input", updateCurrencyConverter);
currencySelect.addEventListener("change", updateCurrencyConverter);

// --- STEP 6: PPP CALCULATOR (any 2 currencies, Robux included) ---
// Static approximate PPP conversion factors - illustrative only.
const PPP_TO_USD = {
    USD: 1,
    ARS: 550,
    EUR: 0.75,
    GBP: 0.70,
    INR: 23,
    JPY: 100
};

function toUsdPPP(amount, currency) {
    if (currency === "ROBUX") return amount * ROBUX_TO_USD;
    return amount / PPP_TO_USD[currency];
}

function fromUsdPPP(usdAmount, currency) {
    if (currency === "ROBUX") return usdAmount / ROBUX_TO_USD;
    return usdAmount * PPP_TO_USD[currency];
}

function updatePPPCalculator() {
    const amount = parseFloat(pppAmount.value) || 0;
    const from = pppFrom.value;
    const to = pppTo.value;

    const usdPPP = toUsdPPP(amount, from);
    const converted = fromUsdPPP(usdPPP, to);

    const toLabel = to === "ROBUX" ? "Robux" : to;
    pppResult.innerText = `${converted.toFixed(2)} ${toLabel}`;
}

pppAmount.addEventListener("input", updatePPPCalculator);
pppFrom.addEventListener("change", updatePPPCalculator);
pppTo.addEventListener("change", updatePPPCalculator);

// Initialize both calculators on load
updateCurrencyConverter();
updatePPPCalculator();
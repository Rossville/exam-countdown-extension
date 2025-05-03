import { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining } from "../common/countdown-data.js";

const currentDateElement = document.getElementById("current-date");
const currentTimeElement = document.getElementById("current-time");

const quoteTextElement = document.getElementById("quote-text");
const quoteAuthorElement = document.getElementById("quote-author");

const countdownDaysElement = document.getElementById("countdown-days");
const countdownHoursElement = document.getElementById("countdown-hours");
const countdownMonthsElement = document.getElementById("countdown-months");
const countdownMinutesElement = document.getElementById("countdown-minutes");
const countdownSecondsElement = document.getElementById("countdown-seconds");

const countdownLabelElement = document.getElementById("countdown-label");

const examBadgeElement = document.getElementById("exam-badge");

const optionsLink = document.getElementById("options-link");
const themeToggle = document.getElementById("theme-toggle");
const changeExamBtn = document.getElementById("change-exam-btn");

const backgrounds = ["https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1920", "https://images.unsplash.com/photo-1501349800519-48093d60bde0?q=80&w=1920", "https://images.unsplash.com/photo-1471970394675-613138e45da3?q=80&w=1920", "https://images.unsplash.com/photo-1510070009289-b5bc34383727?q=80&w=1920", "https://images.unsplash.com/photo-1555116505-38ab61800975?q=80&w=1920"];

let currentExam = "jee";

const motivationalQuotes = [
    { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Learning is never done without errors and defeat.", author: "Vladimir Lenin" },
    { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
];

function updateDateTime() {
    const now = new Date();

    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", dateOptions);
    currentDateElement.textContent = formattedDate;

    const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const formattedTime = now.toLocaleTimeString("en-US", timeOptions);
    currentTimeElement.textContent = formattedTime;
}

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];

    // Add a subtle fade effect
    quoteTextElement.style.opacity = 0;
    quoteAuthorElement.style.opacity = 0;

    setTimeout(() => {
        quoteTextElement.textContent = `"${quote.text}"`;
        quoteAuthorElement.textContent = `— ${quote.author}`;

        quoteTextElement.style.opacity = 1;
        quoteAuthorElement.style.opacity = 1;
    }, 300);
}

function setRandomBackground() {
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    const backgroundElement = document.querySelector(".background");

    if (backgroundElement) {
        backgroundElement.style.opacity = 0;

        setTimeout(() => {
            backgroundElement.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
            backgroundElement.style.opacity = 1;
        }, 500);
    }
}

function updateCountdown() {
    let timeRemaining;
    let examName;

    switch (currentExam) {
        case "jee":
            timeRemaining = getTimeRemaining(jeeExamDate);
            examName = "JEE Main";
            break;
        case "neet":
            timeRemaining = getTimeRemaining(neetExamDate);
            examName = "NEET";
            break;
        case "jeeAdv":
            timeRemaining = getTimeRemaining(jeeAdvExamDate);
            examName = "JEE Advanced";
            break;
    }

    if (examBadgeElement) {
        examBadgeElement.textContent = examName;
    }

    if (timeRemaining.total <= 0) {
        countdownMonthsElement.style = "--value:0";
        countdownDaysElement.style = "--value:0";
        countdownHoursElement.style = "--value:0";
        countdownMinutesElement.style = "--value:0";
        countdownSecondsElement.style = "--value:0";
        countdownLabelElement.textContent = `${examName} Exam Day Has Arrived!`;
    } else {
        countdownMonthsElement.style = `--value:${timeRemaining.month}`;
        countdownDaysElement.style = `--value:${timeRemaining.days}`;
        countdownHoursElement.style = `--value:${timeRemaining.hours}`;
        countdownMinutesElement.style = `--value:${timeRemaining.minutes}`;
        countdownSecondsElement.style = `--value:${timeRemaining.seconds}`;
    }
}
function setupEventListeners() {
    const optionsModal = document.getElementById("options-modal");
    const preferencesForm = document.getElementById("preferences-form");
    const examSelector = document.getElementById("exam-selector");
    const saveMessage = document.getElementById("save-message");

    const jeeDate = document.getElementById("jee-date");
    const neetDate = document.getElementById("neet-date");
    const jeeAdvDate = document.getElementById("jeeadv-date");

    if (jeeDate) jeeDate.textContent = jeeExamDate.toLocaleDateString();
    if (neetDate) neetDate.textContent = neetExamDate.toLocaleDateString();
    if (jeeAdvDate) jeeAdvDate.textContent = jeeAdvExamDate.toLocaleDateString();

    const showOptionsModal = function () {
        chrome.storage.sync.get(["activeExam"], function (data) {
            const activeExam = data.activeExam || "jee";

            examSelector.value = activeExam;

            optionsModal.showModal();
        });
    };

    if (changeExamBtn) {
        changeExamBtn.addEventListener("click", showOptionsModal);
    }

    if (optionsLink) {
        optionsLink.addEventListener("click", showOptionsModal);
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

            if (chrome.storage) {
                chrome.storage.sync.set({ theme: document.documentElement.dataset.theme });
            }
        });
    }

    if (preferencesForm) {
        preferencesForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let activeExam = examSelector.value;

            chrome.storage.sync.set(
                {
                    activeExam: activeExam,
                },
                function () {
                    saveMessage.textContent = "Preferences Saved!";

                    setActiveExam(activeExam);

                    setTimeout(function () {
                        saveMessage.textContent = "";
                    }, 3000);
                }
            );
        });
    }
}

function setActiveExam(exam) {
    currentExam = exam;
    updateCountdown();

    if (chrome.storage) {
        chrome.storage.sync.set({ activeExam: exam });
    }
}

function loadUserPreferences() {
    if (chrome.storage) {
        chrome.storage.sync.get(["theme", "activeExam"], function (data) {
            if (data.theme) {
                document.documentElement.dataset.theme = data.theme;
            }

            if (data.activeExam) {
                setActiveExam(data.activeExam);
            }
        });
    }
}

function initializePage() {
    setRandomBackground();
    updateDateTime();
    displayRandomQuote();
    setupEventListeners();
    loadUserPreferences();
    updateCountdown();

    setInterval(updateDateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(displayRandomQuote, 3600000);
    setInterval(setRandomBackground, 1800000);
}

document.addEventListener("DOMContentLoaded", initializePage);

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

const backgrounds = ["https://www.ghibli.jp/gallery/kimitachi016.jpg", "https://www.ghibli.jp/gallery/redturtle024.jpg", "https://www.ghibli.jp/gallery/marnie022.jpg", "https://www.ghibli.jp/gallery/kazetachinu050.jpg"];

let currentExam = "jeeAdv";
let customWallpaper = "";
let backgroundBrightness = 0.4; // Default brightness value

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

    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = now.toLocaleTimeString("en-US", timeOptions);
    currentTimeElement.textContent = formattedTime;
}

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    const quote = motivationalQuotes[randomIndex];

    quoteTextElement.style.opacity = 0;
    quoteAuthorElement.style.opacity = 0;

    setTimeout(() => {
        quoteTextElement.textContent = `"${quote.text}"`;
        quoteAuthorElement.textContent = `— ${quote.author}`;

        quoteTextElement.style.opacity = 1;
        quoteAuthorElement.style.opacity = 1;
    }, 300);
}

function setBackground() {
    const backgroundElement = document.querySelector(".background");

    if (!backgroundElement) return;

    backgroundElement.style.opacity = 0;
    document.documentElement.style.setProperty("--bg-brightness", backgroundBrightness);

    setTimeout(() => {
        if (customWallpaper) {
            backgroundElement.style.backgroundImage = `url(${customWallpaper})`;
        } else {
            const randomIndex = Math.floor(Math.random() * backgrounds.length);
            backgroundElement.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
        }
        backgroundElement.style.opacity = 1;
    }, 500);
}

function setRandomBackground() {
    if (!customWallpaper) {
        const backgroundElement = document.querySelector(".background");

        if (backgroundElement) {
            backgroundElement.style.opacity = 0;

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * backgrounds.length);
                backgroundElement.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
                backgroundElement.style.opacity = 1;
            }, 500);
        }
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
    const customWallpaperInput = document.getElementById("custom-wallpaper");
    const brightnessSlider = document.getElementById("brightness-slider");
    const preferencesForm = document.getElementById("preferences-form");
    const optionsModal = document.getElementById("options-modal");
    const examSelector = document.getElementById("exam-selector");
    const saveMessage = document.getElementById("save-message");

    const jeeDate = document.getElementById("jee-date");
    const neetDate = document.getElementById("neet-date");
    const jeeAdvDate = document.getElementById("jeeadv-date");

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    if (jeeDate) jeeDate.textContent = jeeExamDate.toLocaleDateString("en-US", dateOptions);
    if (neetDate) neetDate.textContent = neetExamDate.toLocaleDateString("en-US", dateOptions);
    if (jeeAdvDate) jeeAdvDate.textContent = jeeAdvExamDate.toLocaleDateString("en-US", dateOptions);
    const showOptionsModal = function () {
        chrome.storage.sync.get(["activeExam", "customWallpaper", "backgroundBrightness"], function (data) {
            const activeExam = data.activeExam || "jee";

            examSelector.value = activeExam;

            if (data.customWallpaper) {
                customWallpaperInput.value = data.customWallpaper;
            } else {
                customWallpaperInput.value = "";
            }

            // Set the brightness slider value
            if (data.backgroundBrightness !== undefined) {
                brightnessSlider.value = data.backgroundBrightness;
            } else {
                brightnessSlider.value = 0.4; // Default value
            }

            optionsModal.showModal();
        });
    };

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
            let wallpaperUrl = customWallpaperInput.value.trim();
            let brightness = parseFloat(brightnessSlider.value);

            chrome.storage.sync.set(
                {
                    activeExam: activeExam,
                    customWallpaper: wallpaperUrl,
                    backgroundBrightness: brightness,
                },
                function () {
                    saveMessage.textContent = "Preferences Saved!";

                    setActiveExam(activeExam);

                    customWallpaper = wallpaperUrl;
                    backgroundBrightness = brightness;
                    setBackground();

                    setTimeout(function () {
                        saveMessage.textContent = "";
                    }, 3000);
                    optionsModal.close();
                }
            );
        });
    }

    // Live preview of brightness changes
    if (brightnessSlider) {
        brightnessSlider.addEventListener("input", function () {
            document.documentElement.style.setProperty("--bg-brightness", this.value);
        });
    }
}

function updateNovatraLink(exam) {
    const novatraLink = document.getElementById("novatra-link");
    if (!novatraLink) return;

    switch (exam) {
        case "jee":
            novatraLink.href = "https://novatra.in/exams/jee-main/";
            break;
        case "jeeAdv":
            novatraLink.href = "https://novatra.in/exams/jee-advanced/";
            break;
        case "neet":
            novatraLink.href = "https://novatra.in/exams/neet/";
            break;
        default:
            novatraLink.href = "https://novatra.in/";
            break;
    }
}

function setActiveExam(exam) {
    currentExam = exam;
    updateCountdown();
    updateNovatraLink(exam);

    if (chrome.storage) {
        chrome.storage.sync.set({ activeExam: exam });
    }
}

function loadUserPreferences() {
    if (chrome.storage) {
        chrome.storage.sync.get(["theme", "activeExam", "customWallpaper", "backgroundBrightness"], function (data) {
            if (data.theme) {
                document.documentElement.dataset.theme = data.theme;
            }

            if (data.activeExam) {
                setActiveExam(data.activeExam);
            } else {
                // If no exam is selected, at least update the link
                updateNovatraLink(currentExam);
            }

            if (data.customWallpaper) {
                customWallpaper = data.customWallpaper;
            }

            if (data.backgroundBrightness !== undefined) {
                backgroundBrightness = data.backgroundBrightness;
            }

            setBackground();
        });
    } else {
        updateNovatraLink(currentExam);
        setBackground();
    }
}

function initializePage() {
    updateDateTime();
    displayRandomQuote();
    setupEventListeners();
    loadUserPreferences();
    updateCountdown();

    setInterval(updateDateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(displayRandomQuote, 3600000);

    setInterval(() => {
        if (!customWallpaper) {
            setRandomBackground();
        }
    }, 1800000);
}

document.addEventListener("DOMContentLoaded", initializePage);

import { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining } from "../common/countdown-data.js";

function updateCountdown() {
    // JEE Main countdown
    const jeeTime = getTimeRemaining(jeeExamDate);
    if (jeeTime.total <= 0) {
        document.getElementById("jee-timer").innerHTML = "<p class='font-medium text-success'>Exam day has arrived!</p>";
    } else {
        document.getElementById("jee-months").style = `--value:${jeeTime.month}`;
        document.getElementById("jee-days").style = `--value:${jeeTime.days}`;
        document.getElementById("jee-hours").style = `--value:${jeeTime.hours}`;
        document.getElementById("jee-minutes").style = `--value:${jeeTime.minutes}`;
        document.getElementById("jee-seconds").style = `--value:${jeeTime.seconds}`;
    }

    // JEE Advanced countdown
    const jeeAdvTime = getTimeRemaining(jeeAdvExamDate);
    if (jeeAdvTime.total <= 0) {
        document.getElementById("jee-adv-timer").innerHTML = "<p class='font-medium text-success'>Exam day has arrived!</p>";
    } else {
        document.getElementById("jee-adv-months").style = `--value:${jeeAdvTime.month}`;
        document.getElementById("jee-adv-days").style = `--value:${jeeAdvTime.days}`;
        document.getElementById("jee-adv-hours").style = `--value:${jeeAdvTime.hours}`;
        document.getElementById("jee-adv-minutes").style = `--value:${jeeAdvTime.minutes}`;
        document.getElementById("jee-adv-seconds").style = `--value:${jeeAdvTime.seconds}`;
    }

    // NEET countdown
    const neetTime = getTimeRemaining(neetExamDate);
    if (neetTime.total <= 0) {
        document.getElementById("neet-timer").innerHTML = "<p class='font-medium text-success'>Exam day has arrived!</p>";
    } else {
        document.getElementById("neet-months").style = `--value:${neetTime.month}`;
        document.getElementById("neet-days").style = `--value:${neetTime.days}`;
        document.getElementById("neet-hours").style = `--value:${neetTime.hours}`;
        document.getElementById("neet-minutes").style = `--value:${neetTime.minutes}`;
        document.getElementById("neet-seconds").style = `--value:${neetTime.seconds}`;
    }
}

function loadThemePreference() {
    if (chrome.storage) {
        chrome.storage.sync.get(["theme"], function (data) {
            if (data.theme) {
                document.documentElement.dataset.theme = data.theme;
            }
        });
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;

    if (chrome.storage) {
        chrome.storage.sync.set({ theme: newTheme });
    }
}

function openFullCountdown() {
    if (chrome.tabs) {
        chrome.tabs.create({ url: "../newtab/newtab.html" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    updateCountdown();
    loadThemePreference();
    setInterval(updateCountdown, 1000);

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", toggleTheme);
    }

    const openCountdownBtn = document.getElementById("openCountdownBtn");
    if (openCountdownBtn) {
        openCountdownBtn.addEventListener("click", openFullCountdown);
    }
});

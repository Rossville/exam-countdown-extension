import { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining, getCustomExamData, hasValidCustomExam } from "../newtab/newtab.js";
import browser from "webextension-polyfill";

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
    } // NEET countdown
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

    // Custom exam countdown (only if valid)
    if (hasValidCustomExam()) {
        const customExamSection = document.getElementById("custom-exam-section");
        if (customExamSection) {
            customExamSection.classList.remove("hidden");
        }

        const customExam = getCustomExamData();

        // Update custom exam badge with the name
        const customExamBadge = document.getElementById("custom-exam-badge");
        if (customExamBadge) {
            customExamBadge.textContent = customExam.name;
        }

        const customExamTime = getTimeRemaining(customExam.date);
        if (customExamTime.total <= 0) {
            document.getElementById("custom-exam-timer").innerHTML = "<p class='font-medium text-success'>Exam day has arrived!</p>";
        } else {
            document.getElementById("custom-exam-months").style = `--value:${customExamTime.month}`;
            document.getElementById("custom-exam-days").style = `--value:${customExamTime.days}`;
            document.getElementById("custom-exam-hours").style = `--value:${customExamTime.hours}`;
            document.getElementById("custom-exam-minutes").style = `--value:${customExamTime.minutes}`;
            document.getElementById("custom-exam-seconds").style = `--value:${customExamTime.seconds}`;
        }
    } else {
        // Hide custom exam section if no valid custom exam exists
        const customExamSection = document.getElementById("custom-exam-section");
        if (customExamSection) {
            customExamSection.classList.add("hidden");
        }
    }
}

function loadThemePreference() {
    browser.storage.sync.get(["theme"]).then((data) => {
        if (data.theme) {
            document.documentElement.dataset.theme = data.theme;
        }
    })
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;

    if (browser.storage) {
        browser.storage.sync.set({ theme: newTheme }).catch(function (error) {
            console.error("Error saving theme preference:", error);
        });
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

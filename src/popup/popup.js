import {
  getTimeRemaining,
  getCustomExamData,
  hasValidCustomExam,
  loadCustomExamData,
} from "../newtab/newtab.js";
import { initializePopupTodoUI } from "./popup-todo-ui.js";
import browser from "webextension-polyfill";

async function updateCountdown() {
  const storedData = await browser.storage.sync.get("countdowns");
  const countdowns = storedData.countdowns || {};

  const jeeExamDate = countdowns.jee?.date
    ? new Date(countdowns.jee.date)
    : new Date(2026, 0, 29);
  const neetExamDate = countdowns.neet?.date
    ? new Date(countdowns.neet.date)
    : new Date(2026, 4, 4);
  const jeeAdvExamDate = countdowns.jeeAdv?.date
    ? new Date(countdowns.jeeAdv.date)
    : new Date(2027, 4, 18);

  await loadCustomExamData();

  // JEE Main countdown
  const jeeTime = getTimeRemaining(jeeExamDate);
  if (jeeTime.total <= 0) {
    document.getElementById("jee-timer").innerHTML =
      "<p class='font-medium text-success'>Exam day has arrived!</p>";
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
    document.getElementById("jee-adv-timer").innerHTML =
      "<p class='font-medium text-success'>Exam day has arrived!</p>";
  } else {
    document.getElementById(
      "jee-adv-months"
    ).style = `--value:${jeeAdvTime.month}`;
    document.getElementById(
      "jee-adv-days"
    ).style = `--value:${jeeAdvTime.days}`;
    document.getElementById(
      "jee-adv-hours"
    ).style = `--value:${jeeAdvTime.hours}`;
    document.getElementById(
      "jee-adv-minutes"
    ).style = `--value:${jeeAdvTime.minutes}`;
    document.getElementById(
      "jee-adv-seconds"
    ).style = `--value:${jeeAdvTime.seconds}`;
  }

  // NEET countdown
  const neetTime = getTimeRemaining(neetExamDate);
  if (neetTime.total <= 0) {
    document.getElementById("neet-timer").innerHTML =
      "<p class='font-medium text-success'>Exam day has arrived!</p>";
  } else {
    document.getElementById("neet-months").style = `--value:${neetTime.month}`;
    document.getElementById("neet-days").style = `--value:${neetTime.days}`;
    document.getElementById("neet-hours").style = `--value:${neetTime.hours}`;
    document.getElementById(
      "neet-minutes"
    ).style = `--value:${neetTime.minutes}`;
    document.getElementById(
      "neet-seconds"
    ).style = `--value:${neetTime.seconds}`;
  }

  // Custom exam countdown
  if (hasValidCustomExam()) {
    const customExamSection = document.getElementById("custom-exam-section");

    if (customExamSection) {
      customExamSection.classList.remove("hidden");
    }

    const customExam = getCustomExamData();

    const customExamBadge = document.getElementById("custom-exam-badge");
    if (customExamBadge) {
      customExamBadge.textContent = customExam.name;
    }

    const customExamTime = getTimeRemaining(customExam.date);
    if (customExamTime.total <= 0) {
      document.getElementById("custom-exam-timer").innerHTML =
        "<p class='font-medium text-success'>Exam day has arrived!</p>";
    } else {
      document.getElementById(
        "custom-exam-months"
      ).style = `--value:${customExamTime.month}`;
      document.getElementById(
        "custom-exam-days"
      ).style = `--value:${customExamTime.days}`;
      document.getElementById(
        "custom-exam-hours"
      ).style = `--value:${customExamTime.hours}`;
      document.getElementById(
        "custom-exam-minutes"
      ).style = `--value:${customExamTime.minutes}`;
      document.getElementById(
        "custom-exam-seconds"
      ).style = `--value:${customExamTime.seconds}`;
    }
  } else {
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
  });
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

function openFullCountdown() {
  browser.tabs.create({ url: browser.runtime.getURL("newtab/newtab.html") });
}

function loadSecondsVisibility() {
  browser.storage.sync.get(["widgetVisibility"]).then((data) => {
    const showSeconds = data.widgetVisibility?.seconds !== false;

    // Hide or show all seconds containers
    const secondsContainers = [
      "custom-exam-seconds-container",
      "jee-seconds-container",
      "jee-adv-seconds-container",
      "neet-seconds-container",
    ];

    secondsContainers.forEach((id) => {
      const container = document.getElementById(id);
      if (container) {
        container.style.display = showSeconds ? "" : "none";
      }
    });
  });
}

function initializeTabs() {
  const examTab = document.getElementById("exam-tab");
  const todoTab = document.getElementById("todo-tab");
  const examContent = document.getElementById("exam-content");
  const todoContent = document.getElementById("todo-content");

  if (examTab && todoTab && examContent && todoContent) {
    examTab.addEventListener("click", () => {
      // Switch to exam tab
      examTab.classList.add("tab-active");
      todoTab.classList.remove("tab-active");
      examContent.classList.remove("hidden");
      todoContent.classList.add("hidden");
    });

    todoTab.addEventListener("click", () => {
      // Switch to todo tab
      todoTab.classList.add("tab-active");
      examTab.classList.remove("tab-active");
      todoContent.classList.remove("hidden");
      examContent.classList.add("hidden");
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  updateCountdown();
  loadThemePreference();
  loadSecondsVisibility(); // Load seconds visibility setting
  initializeTabs(); // Initialize tab functionality
  initializePopupTodoUI(); // Initialize popup todo UI
  setInterval(updateCountdown, 1000);

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Listen for changes in widgetVisibility settings
  if (browser.storage && browser.storage.onChanged) {
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "sync" && changes.widgetVisibility) {
        loadSecondsVisibility();
      }
    });
  }
});

// pomodoro timer
const play_btn = document.querySelector("#play-btn");
const pause_btn = document.querySelector("#pause-btn");
const timer_numeric = document.querySelector("#timer-numeric");
const timer_unit = document.querySelector("#timer-wrd");
const alarm_on = document.querySelector("#alarm-on");
const alarm_off = document.querySelector("#alarm-off");
const close_timer_btn = document.querySelector("#close-btn");
const show_timer_btn = document.querySelector("#focus-timer");
const pomodoro_timer_container = document.querySelector(
  "#pomodoro-timer-container"
);
const TimeUnit = Object.freeze({
  MINUTE: "mins",
  HOUR: "hrs",
  SECOND: "sec",
});

function update_timer_digit_UI(minute, second) {
  if (minute !== 0) {
    timer_numeric.textContent = minute.toString().padStart(2, "0");
    timer_unit.textContent = TimeUnit.MINUTE;
  } else {
    timer_numeric.textContent = second.toString().padStart(2, "0");
    timer_unit.textContent = TimeUnit.SECOND;
  }
}

browser.storage.local
  .get(["currentMinutes", "currentSeconds", "initialTime"])
  .then((data) => {
    const isPlaying = data.playBtn ?? false;
    time_icon_toggle(isPlaying);
    toggleIncDecButtons(!isPlaying);
    update_timer_digit_UI(
      data.currentMinutes ?? data.initialTime ?? 15,
      data.currentSeconds ?? 0
    );
  });

browser.storage.local.set({ initialTime: 15 });

// toggle time upon play/pause click
function time_icon_toggle(time_icon_toggle_btn) {
  if (time_icon_toggle_btn) {
    pause_btn.classList.remove("hidden");
    play_btn.classList.add("hidden");
  } else {
    pause_btn.classList.add("hidden");
    play_btn.classList.remove("hidden");
  }
}

function alarm_toggle(alarm_btn) {
  if (alarm_btn === alarm_on) {
    alarm_on.classList.add("hidden");
    alarm_off.classList.remove("hidden");
  } else {
    alarm_off.classList.add("hidden");
    alarm_on.classList.remove("hidden");
  }
}

function timer_toggle(timer_toggle_btn) {
  if (!timer_toggle_btn) {
    // close timer
    close_timer_btn.classList.add("hidden");
    pomodoro_timer_container.classList.add("hidden");
    show_timer_btn.classList.remove("hidden");
  } else {
    // show timer
    pomodoro_timer_container.classList.remove("hidden");
    close_timer_btn.classList.remove("hidden");
    show_timer_btn.classList.add("hidden");
  }
}

alarm_on.addEventListener("click", () => alarm_toggle(alarm_on));
alarm_off.addEventListener("click", () => alarm_toggle(alarm_off));
play_btn.addEventListener("click", async function () {
  const data = await browser.storage.local.get([
    "currentMinutes",
    "currentSeconds",
  ]);
  const min = data.currentMinutes,
    sec = data.currentSeconds;
  if (min !== undefined && sec !== undefined && (min !== 0 || sec !== 0))
    browser.runtime.sendMessage({
      action: "continueTimer",
      minutes: min,
      seconds: sec,
    });
  else {
    const data_min = await browser.storage.local.get("initialTime");
    browser.runtime.sendMessage({
      action: "startTimer",
      minutes: data_min.initialTime,
      seconds: 0,
    });
  }
  browser.storage.local.set({ playBtn: true });
  time_icon_toggle(true);
});
pause_btn.addEventListener("click", function () {
  browser.runtime.sendMessage({ action: "stopTimer" });
  browser.storage.local.set({ playBtn: false });
  time_icon_toggle(false);
});
document.querySelector("#reset-btn").addEventListener("click", function () {
  browser.runtime.sendMessage({ action: "resetTimer" });
});
close_timer_btn.addEventListener("click", () => {
  timer_toggle(false);
  browser.storage.local.set({ showPomodoroTimer: false });
  browser.runtime.sendMessage({ action: "resetTimer" });
});
show_timer_btn.addEventListener("click", () => {
  timer_toggle(true);
  browser.storage.local.set({ showPomodoroTimer: true });
});
document
  .querySelector("#incr-btn")
  .addEventListener("click", async function () {
    const { initialTime } = await browser.storage.local.get([
      "initialTime",
      "currentMinutes",
    ]);
    let newTime = initialTime ?? 15;
    if (newTime < 240) {
      newTime += 5; // in mins
      browser.storage.local.set({
        initialTime: newTime,
        currentMinutes: newTime,
        currentSeconds: 0,
        timeElapsed: 0,
      });
      update_timer_digit_UI(newTime, 0);
    }
  });
document
  .querySelector("#decr-btn")
  .addEventListener("click", async function () {
    const { initialTime } = await browser.storage.local.get([
      "initialTime",
      "currentMinutes",
    ]);
    let newTime = initialTime ?? 15;
    if (newTime > 15) {
      newTime -= 5; // in mins
      browser.storage.local.set({
        initialTime: newTime,
        currentMinutes: newTime,
        currentSeconds: 0,
        timeElapsed: 0,
      });
      update_timer_digit_UI(newTime, 0);
    }
  });

browser.storage.local.get("playBtn").then((data) => {
  time_icon_toggle(data.playBtn ?? false);
});

browser.storage.local.get("showPomodoroTimer").then((data) => {
  timer_toggle(data.showPomodoroTimer ?? false);
});

browser.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && (changes.currentMinutes || changes.currentSeconds)) {
    const min = changes.currentMinutes?.newValue ?? 0;
    const sec = changes.currentSeconds?.newValue ?? 0;
    update_timer_digit_UI(min, sec);
  }
  if (area === "local" && changes.playBtn) {
    const isPlaying = changes.playBtn.newValue;
    time_icon_toggle(isPlaying);
    toggleIncDecButtons(!isPlaying);
    time_icon_toggle(changes.playBtn.newValue);
  }
  if (area === "local" && changes.timeElapsed) {
    const timeElapsed_newVal = changes.timeElapsed.newValue;
     const data = await browser.storage.local.get(["initialTime", "currentMinutes", "currentSeconds"]);
    const totalSeconds = (data.initialTime ?? 15) * 60;
    const progress = (timeElapsed_newVal / totalSeconds) * 100;
    if (timeElapsed_newVal > 0 && timeElapsed_newVal < totalSeconds)
      updateProgressBar(progress, true);
    else
      updateProgressBar(progress, false);
  }
});

function updateProgressBar(progress, showProgressbar) {
  const pomodoroBgOuter = document.querySelector("#pomodoro-bg-outer");
  if (!pomodoroBgOuter) return;
  if (showProgressbar) {
    pomodoroBgOuter.style.background = `conic-gradient(
      #4CAF50 ${progress}%, #ccc ${progress}% 100%
    )`;
  } else {
    pomodoroBgOuter.style.background = `conic-gradient(
      #4CAF50 0%, #ccc 0% 100%
    )`;
  }
}

function toggleIncDecButtons(show) {
  const incrBtn = document.querySelector("#incr-btn");
  const decrBtn = document.querySelector("#decr-btn");
  if (show) {
    incrBtn.classList.remove("hidden");
    decrBtn.classList.remove("hidden");
    browser.storage.local.set({toggleIncDec: true});
  } else {
    incrBtn.classList.add("hidden");
    decrBtn.classList.add("hidden");
    browser.storage.local.set({toggleIncDec: false});
  }
}

browser.storage.local.get("toggleIncDec").then(data => {
  if(data.toggleIncDec !== undefined)
    toggleIncDecButtons(data.toggleIncDec);
  else
    toggleIncDecButtons(true);
})
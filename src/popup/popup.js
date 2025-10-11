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
      "neet-seconds-container"
    ];
    
    secondsContainers.forEach(id => {
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
  timer_numeric.textContent = initial_time;
  timer_unit = TimeUnit.MINUTE;
});

// pomodoro timer
const play_btn = document.querySelector('#play-btn')
const pause_btn = document.querySelector('#pause-btn');
const reset_btn = document.querySelector('#reset-btn');
const alarm_on = document.querySelector('#alarm-on');
const alarm_off = document.querySelector('#alarm-off');
const timer_numeric = document.querySelector("#timer-numeric");
const timer_unit = document.querySelector('#timer-wrd');
const close_timer_btn = document.querySelector('#close-btn');
const show_timer_btn = document.querySelector('#focus-timer');
const pomodoro_timer_container = document.querySelector('#pomodoro-timer-container');
const TimeUnit = Object.freeze({
  MINUTE: 'min',
  HOUR: 'hr',
  SECOND: 'sec'
});
let initial_time = 1; // in minutes
let timer_id = null;
let curr_seconds = 0;
let tt_num = initial_time;
let time_elapsed = 0;

function reset_initial(){
  tt_num = initial_time;
  curr_seconds = 0;
  time_elapsed = 0;
  timer_numeric.textContent = tt_num;
  timer_unit.textContent = TimeUnit.MINUTE;
  pause_btn.classList.add('hidden');
  play_btn.classList.remove('hidden');
  document.querySelector('#pomodoro-bg-outer').style.background = `conic-gradient(
    #4CAF50 0%,
    #ccc 0% 100%
  )`;
  if(timer_id){
    clearInterval(timer_id);
    timer_id=null;
  }
}
function start_timer() {
  if (timer_id) clearInterval(timer_id);
  pause_btn.classList.remove('hidden');
  play_btn.classList.add('hidden');
  timer_id = setInterval(() => {
    if (tt_num <= 0 && curr_seconds <= 0) {
      clearInterval(timer_id);
      reset_initial();
      return;
    }
    if (curr_seconds <= 0 && tt_num > 0) {
      tt_num -= 1;
      curr_seconds = 60;
    }
    curr_seconds -= 1;
    if (tt_num > 0) {
      timer_numeric.textContent = tt_num;
      timer_unit.textContent = TimeUnit.MINUTE;
    } else  {
      timer_numeric.textContent = curr_seconds;
      timer_unit.textContent = TimeUnit.SECOND;
    }
    time_elapsed++;
    let progress = (time_elapsed/(initial_time*60))*100;
    document.querySelector('#pomodoro-bg-outer').style.background = `conic-gradient(
      #4CAF50 ${progress}%, #ccc 0% 100%)`;
  }, 1000);
}

function stop_timer(){
  if(timer_id) clearInterval(timer_id);
}

// toggle time upon play/pause click
function time_toggle(time_toggle_btn){
  if(time_toggle_btn === play_btn){
    start_timer();
  }
  else{
    pause_btn.classList.add('hidden');
    play_btn.classList.remove('hidden');
    stop_timer();
  }
}

function alarm_toggle(alarm_btn){
  if(alarm_btn === alarm_on){
    alarm_on.classList.add('hidden');
    alarm_off.classList.remove('hidden');
  }
  else{
    alarm_off.classList.add('hidden');
    alarm_on.classList.remove('hidden');
  }
}

function timer_toggle(timer_toggle_btn) {
  reset_initial();
  if(timer_toggle_btn === close_timer_btn){
    // close timer
    close_timer_btn.classList.add('hidden');
    pomodoro_timer_container.classList.add('hidden');
    show_timer_btn.classList.remove('hidden');
  }
  else{
    // show timer
    pomodoro_timer_container.classList.remove('hidden');
    close_timer_btn.classList.remove('hidden');
    show_timer_btn.classList.add('hidden');
  }
}

play_btn.addEventListener('click',() => time_toggle(play_btn));
pause_btn.addEventListener('click', () => time_toggle(pause_btn));
alarm_on.addEventListener('click',() => alarm_toggle(alarm_on));
alarm_off.addEventListener('click',() => alarm_toggle(alarm_off));
close_timer_btn.addEventListener('click',() => timer_toggle(close_timer_btn));
show_timer_btn.addEventListener('click',() => timer_toggle(show_timer_btn));
reset_btn.addEventListener('click',() => reset_initial());
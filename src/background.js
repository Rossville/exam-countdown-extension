import { jeeExamDate, neetExamDate, jeeAdvExamDate } from "./common/countdown-data.js";

const countdowns = {
    jee: {
        date: jeeExamDate,
        isActive: true,
    },
    neet: {
        date: neetExamDate,
        isActive: true,
    },
    jeeAdv: {
        date: jeeAdvExamDate,
        isActive: true,
    },
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ countdowns });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCountdowns") {
        chrome.storage.sync.get("countdowns", (data) => {
            sendResponse(data.countdowns);
        });
        return true;
    }
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.countdowns) {
        countdowns.jee.isActive = changes.countdowns.newValue.jee.isActive;
        countdowns.neet.isActive = changes.countdowns.newValue.neet.isActive;
        countdowns.jeeAdv.isActive = changes.countdowns.newValue.jeeAdv.isActive;
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        showJEE: true,
        showNEET: true,
        showJEEADV: true,
    });
});

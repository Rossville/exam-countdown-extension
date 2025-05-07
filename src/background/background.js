import { jeeExamDate, neetExamDate, jeeAdvExamDate } from "../newtab/newtab.js"
import browser from "webextension-polyfill";

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

browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({ countdowns });
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCountdowns") {
        browser.storage.sync.get("countdowns").then((data) => {
            sendResponse(data.countdowns);
        });
        return true;
    }
});

browser.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.countdowns) {
        countdowns.jee.isActive = changes.countdowns.newValue.jee.isActive;
        countdowns.neet.isActive = changes.countdowns.newValue.neet.isActive;
        countdowns.jeeAdv.isActive = changes.countdowns.newValue.jeeAdv.isActive;
    }
});

browser.runtime.onInstalled.addListener(function () {
    browser.storage.sync.set({
        showJEE: true,
        showNEET: true,
        showJEEADV: true,
    });
});

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
    browser.storage.sync.set({ 
        countdowns, 
        showJEE: true, 
        showNEET: true, 
        showJEEADV: true 
    });
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCountdowns") {
        browser.storage.sync.get("countdowns").then((data) => {
            sendResponse(data.countdowns);
        });
        return true;
    }
});
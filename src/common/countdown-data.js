const jeeExamDate = new Date(2026, 0, 29); // 29 - 01 - 2026
const neetExamDate = new Date(2026, 4, 4); // 04 - 05 - 2026
const jeeAdvExamDate = new Date(2025, 4, 18); // 18 - 05 - 2025

let customExamName = "Custom Exam";
let customExamDate = null;

let storage = null;

function initStorage(storageApi) {
    storage = storageApi;
    loadCustomExamData();
}

async function loadCustomExamData() {
    if (!storage) return;

    try {
        const data = await storage.get(["customExamName", "customExamDate"]);
        if (data.customExamName) {
            customExamName = data.customExamName;
        }

        if (data.customExamDate) {
            customExamDate = new Date(data.customExamDate);
        }
    } catch (error) {
        console.error("Error loading custom exam data:", error);
    }
}

async function saveCustomExamData(name, date) {
    if (!storage) return;

    customExamName = name || "Custom Exam";
    customExamDate = date;

    try {
        await storage.set({
            customExamName: customExamName,
            customExamDate: customExamDate ? customExamDate.getTime() : null,
        });
        return true;
    } catch (error) {
        console.error("Error saving custom exam data:", error);
        return false;
    }
}

function getCustomExamData() {
    return {
        name: customExamName,
        date: customExamDate,
    };
}

function hasValidCustomExam() {
    return customExamDate && !isNaN(customExamDate.getTime());
}

function getTimeRemaining(endDate) {
    const total = endDate - new Date();

    const month = Math.floor(total / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((total % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);

    return { total, month, days, hours, minutes, seconds };
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

export { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining, formatTime, initStorage, saveCustomExamData, getCustomExamData, hasValidCustomExam };

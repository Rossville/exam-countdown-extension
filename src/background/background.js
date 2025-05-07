import browser from "webextension-polyfill";

function parseDateString(dateStr) {
	if (!dateStr) return null;
	const [day, month, year] = dateStr.split("-").map(Number);
	return new Date(year, month - 1, day);
}

async function fetchExamDates() {
	try {
		const response = await fetch("https://cdn.jsdelivr.net/gh/NovatraX/exam-countdown-extension@main/assets/exam-info.json");

		if (!response.ok) {
			throw new Error(`Failed to fetch exam dates: ${response.status}`);
		}

		const exams = await response.json();
		const countdowns = {
			jee: {date: new Date(2026, 0, 29).toISOString(), isActive: true},
			neet: {date: new Date(2026, 4, 4).toISOString(), isActive: true},
			jeeAdv: {date: new Date(2026, 4, 18).toISOString(), isActive: true},
		};

		exams.forEach((exam) => {
			const parsedDate = parseDateString(exam.date);
			if (parsedDate instanceof Date && !isNaN(parsedDate)) {
				if (exam.name === "jee") {
					countdowns.jee.date = parsedDate.toISOString();
				} else if (exam.name === "jeeAdv") {
					countdowns.jeeAdv.date = parsedDate.toISOString();
				} else if (exam.name.includes("neet")) {
					countdowns.neet.date = parsedDate.toISOString();
				}
			}
		});

		await browser.storage.sync.set({
			countdowns,
			showJEE: true,
			showNEET: true,
			showJEEADV: true,
		});

		console.log("Fetched and stored exam dates from remote source.");
	} catch (error) {
		console.error("Error fetching exam dates:", error);
	}
}

browser.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed - Fetching Data");
	fetchExamDates();
});

browser.runtime.onStartup.addListener(() => {
	console.log("Browser Started - Fetching Data");
	fetchExamDates();
});

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getCountdowns") {
		browser.storage.sync.get("countdowns").then((data) => {
			sendResponse(data.countdowns);
		});
		return true;
	}
});

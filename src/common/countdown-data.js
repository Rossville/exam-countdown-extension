const jeeExamDate = new Date(2026, 0, 29); // January 5, 2026
const neetExamDate = new Date(2025, 4, 4); // May 4, 2025
const jeeAdvExamDate = new Date(2025, 4, 18); // June 18, 2025

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

export { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining, formatTime };

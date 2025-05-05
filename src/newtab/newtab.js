import { jeeExamDate, neetExamDate, jeeAdvExamDate, getTimeRemaining, initStorage, saveCustomExamData, getCustomExamData, hasValidCustomExam } from "../common/countdown-data.js";

const currentDateElement = document.getElementById("current-date");
const currentTimeElement = document.getElementById("current-time");

const quoteTextElement = document.getElementById("quote-text");
const quoteAuthorElement = document.getElementById("quote-author");

const countdownDaysElement = document.getElementById("countdown-days");
const countdownHoursElement = document.getElementById("countdown-hours");
const countdownMonthsElement = document.getElementById("countdown-months");
const countdownMinutesElement = document.getElementById("countdown-minutes");
const countdownSecondsElement = document.getElementById("countdown-seconds");

const countdownLabelElement = document.getElementById("countdown-label");

const examBadgeElement = document.getElementById("exam-badge");

const optionsLink = document.getElementById("options-link");
const themeToggle = document.getElementById("theme-toggle");
const musicBtn = document.getElementById("music-btn");

var storage;

if (process.env.EXTENSION_PUBLIC_BROWSER == "firefox") {
    storage = browser.storage.sync;
} else {
    storage = chrome.storage.sync;
}

// Initialize countdown-data with storage API
initStorage(storage);

const backgrounds = ["https://www.ghibli.jp/gallery/kimitachi016.jpg", "https://www.ghibli.jp/gallery/redturtle024.jpg", "https://www.ghibli.jp/gallery/marnie022.jpg", "https://www.ghibli.jp/gallery/kazetachinu050.jpg"];

let currentExam = "jeeAdv";
let customWallpaper = "";
let backgroundBrightness = 0.4; // Default brightness value

const fallbackMotivationalQuotes = [
    { content: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
    { content: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { content: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { content: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { content: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { content: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
    { content: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { content: "Learning is never done without errors and defeat.", author: "Vladimir Lenin" },
    { content: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
];

function updateDateTime() {
    const now = new Date();

    const dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = now.toLocaleDateString("en-US", dateOptions);
    currentDateElement.textContent = formattedDate;

    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = now.toLocaleTimeString("en-US", timeOptions);
    currentTimeElement.textContent = formattedTime;
}

function displayRandomQuote() {
    quoteTextElement.style.opacity = 0;
    quoteAuthorElement.style.opacity = 0;

    let fallbackIndex = Math.floor(Math.random() * fallbackMotivationalQuotes.length);
    let fallbackQuote = fallbackMotivationalQuotes[fallbackIndex];

    fetch("http://api.quotable.io/quotes/random?tags=inspirational|motivational|productivity|education")
        .then((res) => res.json())
        .then((data) => {
            const quote = {
                content: data[0].content,
                author: data[0].author,
            };
            displayQuote(quote);
        })
        .catch(() => {
            displayQuote(fallbackQuote);
        });

    function displayQuote(q) {
        setTimeout(() => {
            quoteTextElement.textContent = `"${q.content}"`;
            quoteAuthorElement.textContent = `— ${q.author}`;

            quoteTextElement.style.opacity = 1;
            quoteAuthorElement.style.opacity = 1;
        }, 300);
    }
}

function setBackground() {
    const backgroundElement = document.querySelector(".background");

    if (!backgroundElement) return;

    backgroundElement.style.opacity = 0;
    document.documentElement.style.setProperty("--bg-brightness", backgroundBrightness);

    setTimeout(() => {
        if (customWallpaper) {
            backgroundElement.style.backgroundImage = `url(${customWallpaper})`;
        } else {
            const randomIndex = Math.floor(Math.random() * backgrounds.length);
            backgroundElement.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
        }
        backgroundElement.style.opacity = 1;
    }, 500);
}

function setRandomBackground() {
    if (!customWallpaper) {
        const backgroundElement = document.querySelector(".background");

        if (backgroundElement) {
            backgroundElement.style.opacity = 0;

            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * backgrounds.length);
                backgroundElement.style.backgroundImage = `url(${backgrounds[randomIndex]})`;
                backgroundElement.style.opacity = 1;
            }, 500);
        }
    }
}

function updateCountdown() {
    let timeRemaining;
    let examName;

    switch (currentExam) {
        case "jee":
            timeRemaining = getTimeRemaining(jeeExamDate);
            examName = "JEE Main";
            break;
        case "neet":
            timeRemaining = getTimeRemaining(neetExamDate);
            examName = "NEET";
            break;
        case "jeeAdv":
            timeRemaining = getTimeRemaining(jeeAdvExamDate);
            examName = "JEE Advanced";
            break;
        case "custom":
            if (hasValidCustomExam()) {
                const customExam = getCustomExamData();
                timeRemaining = getTimeRemaining(customExam.date);
                examName = customExam.name;
            } else {
                timeRemaining = { total: 0, month: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
                examName = "Custom Exam";
            }
            break;
    }

    if (examBadgeElement) {
        examBadgeElement.textContent = examName;
    }

    if (timeRemaining.total <= 0) {
        countdownMonthsElement.style = "--value:0";
        countdownDaysElement.style = "--value:0";
        countdownHoursElement.style = "--value:0";
        countdownMinutesElement.style = "--value:0";
        countdownSecondsElement.style = "--value:0";
        countdownLabelElement.textContent = `${examName} Exam Day Has Arrived!`;
    } else {
        countdownMonthsElement.style = `--value:${timeRemaining.month}`;
        countdownDaysElement.style = `--value:${timeRemaining.days}`;
        countdownHoursElement.style = `--value:${timeRemaining.hours}`;
        countdownMinutesElement.style = `--value:${timeRemaining.minutes}`;
        countdownSecondsElement.style = `--value:${timeRemaining.seconds}`;
    }
}

function setupEventListeners() {
    const customWallpaperInput = document.getElementById("custom-wallpaper");
    const brightnessSlider = document.getElementById("brightness-slider");
    const preferencesForm = document.getElementById("preferences-form");
    const optionsModal = document.getElementById("options-modal");
    const examSelector = document.getElementById("exam-selector");
    const saveMessage = document.getElementById("save-message");
    const customExamSection = document.getElementById("custom-exam-section");
    const customExamNameInput = document.getElementById("custom-exam-name");
    const customExamDateInput = document.getElementById("custom-exam-date");

    const jeeDate = document.getElementById("jee-date");
    const neetDate = document.getElementById("neet-date");
    const jeeAdvDate = document.getElementById("jeeadv-date");

    // Update exam dates in the modal
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    if (jeeDate) jeeDate.textContent = jeeExamDate.toLocaleDateString("en-US", dateOptions);
    if (neetDate) neetDate.textContent = neetExamDate.toLocaleDateString("en-US", dateOptions);
    if (jeeAdvDate) jeeAdvDate.textContent = jeeAdvExamDate.toLocaleDateString("en-US", dateOptions);
    const showOptionsModal = function () {
        storage.get().then((data) => {
            const activeExam = data.activeExam || "jee";

            examSelector.value = activeExam;

            if (data.customWallpaper) {
                customWallpaperInput.value = data.customWallpaper;
            } else {
                customWallpaperInput.value = "";
            }

            if (data.backgroundBrightness !== undefined) {
                brightnessSlider.value = data.backgroundBrightness;
            } else {
                brightnessSlider.value = 0.4;
            } // Set custom exam data if available
            const customExam = getCustomExamData();

            if (customExam.name) {
                customExamNameInput.value = customExam.name;
            } else {
                customExamNameInput.value = "";
            }

            if (hasValidCustomExam()) {
                customExamDateInput.value = customExam.date.toISOString().split("T")[0];

                // Update custom exam stat
                const customExamStat = document.getElementById("custom-exam-stat");
                const customExamStatTitle = document.getElementById("custom-exam-stat-title");
                const customExamStatDate = document.getElementById("custom-exam-stat-date");

                if (customExamStat && customExamStatTitle && customExamStatDate) {
                    customExamStat.classList.remove("hidden");
                    customExamStatTitle.textContent = customExam.name;
                    customExamStatDate.textContent = customExam.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                }
            } else {
                customExamDateInput.value = "";

                // Hide custom exam stat if no custom exam
                const customExamStat = document.getElementById("custom-exam-stat");
                if (customExamStat) {
                    customExamStat.classList.add("hidden");
                }
            }

            // Show/hide custom exam section based on selection
            if (activeExam === "custom") {
                customExamSection.classList.remove("hidden");
            } else {
                customExamSection.classList.add("hidden");
            }

            optionsModal.showModal();
        });
    };

    // Handle showing/hiding custom exam section when exam selector changes
    if (examSelector) {
        examSelector.addEventListener("change", function () {
            if (this.value === "custom") {
                customExamSection.classList.remove("hidden");
            } else {
                customExamSection.classList.add("hidden");
            }
        });
    }

    if (optionsLink) {
        optionsLink.addEventListener("click", showOptionsModal);
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";

            if (storage) {
                storage.set({ theme: document.documentElement.dataset.theme });
            }
        });
    }
    if (musicBtn) {
        const musicModal = document.getElementById("music-modal");
        const youtubeForm = document.getElementById("youtube-form");
        const youtubeUrlInput = document.getElementById("youtube-url");
        const youtubeEmbed = document.getElementById("youtube-embed");

        const defaultYoutubeUrl = "https://www.youtube.com/watch?v=n61ULEU7CO0";
        musicBtn.addEventListener("click", function () {
            musicModal.showModal();

            if (storage) {
                storage.get(["youtubeUrl"]).then((data) => {
                    if (data.youtubeUrl) {
                        youtubeUrlInput.value = data.youtubeUrl;
                        if (youtubeEmbed.innerHTML === "") {
                            loadMusicEmbed(data.youtubeUrl);
                        }
                    } else {
                        youtubeUrlInput.value = defaultYoutubeUrl;
                        if (youtubeEmbed.innerHTML === "") {
                            loadMusicEmbed(defaultYoutubeUrl);
                        }
                    }
                });
            } else {
                youtubeUrlInput.value = defaultYoutubeUrl;
                if (youtubeEmbed.innerHTML === "") {
                    loadMusicEmbed(defaultYoutubeUrl);
                }
            }
        });
        if (youtubeForm) {
            youtubeForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const musicUrl = youtubeUrlInput.value.trim();
                if (musicUrl) {
                    if (storage) {
                        storage.set({ youtubeUrl: musicUrl });
                    }
                    loadMusicEmbed(musicUrl);
                }
            });
        }

        function loadMusicEmbed(url) {
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
            const youtubeMatch = url.match(youtubeRegex);

            if (youtubeMatch && youtubeMatch[1]) {
                youtubeEmbed.classList.remove("hidden");

                const videoId = youtubeMatch[1];
                const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?si=Y_vXpY6wIItrmI9x`;
                youtubeEmbed.innerHTML = `<iframe width="100%" height="100%" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
            } else {
                youtubeEmbed.classList.remove("hidden");
                youtubeEmbed.innerHTML = "<p class='text-center py-4'>Invalid YouTube URL</p>";
            }
        }
    }
    if (preferencesForm) {
        preferencesForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let activeExam = examSelector.value;
            let wallpaperUrl = customWallpaperInput.value.trim();
            let brightness = parseFloat(brightnessSlider.value);

            // Get custom exam data
            let customName = "";
            let customDate = null;

            if (activeExam === "custom") {
                customName = customExamNameInput.value.trim();
                if (!customName) {
                    customName = "Custom Exam";
                }

                if (customExamDateInput.value) {
                    customDate = new Date(customExamDateInput.value);
                }

                // Validate date
                if (!customDate || isNaN(customDate.getTime())) {
                    saveMessage.textContent = "Please enter a valid date for your custom exam";
                    saveMessage.style.color = "red";
                    setTimeout(function () {
                        saveMessage.textContent = "";
                        saveMessage.style.color = "";
                    }, 3000);
                    return;
                }
            } // Save the custom exam data using countdown-data.js if it's custom exam
            if (activeExam === "custom" && customDate) {
                saveCustomExamData(customName, customDate);
            }

            // Save other preferences
            const dataToSave = {
                activeExam: activeExam,
                customWallpaper: wallpaperUrl,
                backgroundBrightness: brightness,
            };

            storage.set(dataToSave, function () {
                saveMessage.textContent = "Preferences Saved!";
                saveMessage.style.color = "";

                setActiveExam(activeExam);

                customWallpaper = wallpaperUrl;
                backgroundBrightness = brightness;
                setBackground();

                setTimeout(function () {
                    saveMessage.textContent = "";
                }, 3000);
                optionsModal.close();
            });
        });
    }

    // Live preview of brightness changes
    if (brightnessSlider) {
        brightnessSlider.addEventListener("input", function () {
            document.documentElement.style.setProperty("--bg-brightness", this.value);
        });
    }

    // Show or hide custom exam section based on exam selection
    if (examSelector) {
        examSelector.addEventListener("change", function () {
            const selectedExam = this.value;

            if (selectedExam === "custom") {
                customExamSection.classList.remove("hidden");
            } else {
                customExamSection.classList.add("hidden");
            }
        });
    }

    // Initialize custom exam section visibility
    if (customExamSection) {
        customExamSection.classList.add("hidden");
    }
}

function updateNovatraLink(exam) {
    const novatraLink = document.getElementById("novatra-link");
    if (!novatraLink) return;

    switch (exam) {
        case "jee":
            novatraLink.href = "https://novatra.in/exams/jee-main/";
            break;
        case "jeeAdv":
            novatraLink.href = "https://novatra.in/exams/jee-advanced/";
            break;
        case "neet":
            novatraLink.href = "https://novatra.in/exams/neet/";
            break;
        case "custom":
            novatraLink.href = "https://novatra.in/";
            break;
        default:
            novatraLink.href = "https://novatra.in/";
            break;
    }
}

function setActiveExam(exam) {
    currentExam = exam;
    updateCountdown();
    updateNovatraLink(exam);

    if (storage) {
        storage.set({ activeExam: exam });
    }
}

function loadUserPreferences() {
    if (storage) {
        storage.get().then((data) => {
            if (data.theme) {
                document.documentElement.dataset.theme = data.theme;
            }

            if (data.activeExam) {
                setActiveExam(data.activeExam);
            } else {
                // If no exam is selected, at least update the link
                updateNovatraLink(currentExam);
            }

            if (data.customWallpaper) {
                customWallpaper = data.customWallpaper;
            }

            if (data.backgroundBrightness !== undefined) {
                backgroundBrightness = data.backgroundBrightness;
            }

            setBackground();
        });
    } else {
        updateNovatraLink(currentExam);
        setBackground();
    }
}

function initializePage() {
    updateDateTime();
    displayRandomQuote();
    setupEventListeners();
    loadUserPreferences();
    updateCountdown();

    setInterval(updateDateTime, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(displayRandomQuote, 3600000);

    setInterval(() => {
        if (!customWallpaper) {
            setRandomBackground();
        }
    }, 1800000);
}

document.addEventListener("DOMContentLoaded", initializePage);

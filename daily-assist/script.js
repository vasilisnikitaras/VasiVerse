// ----- TASK MANAGEMENT -----
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function saveTasks() {
  const tasks = Array.from(taskList.children).map(li => li.textContent);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(text => addTask(text));
}

function addTask(text) {
  const li = document.createElement("li");
  li.textContent = text;
  li.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });
  taskList.appendChild(li);
}

taskInput?.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && taskInput.value.trim()) {
    addTask(taskInput.value.trim());
    saveTasks();
    taskInput.value = "";
  }
});

// ----- JOURNAL -----
const journal = document.getElementById("journal");
const journalDate = document.getElementById("journalDate");

function initJournalDate() {
  const today = new Date().toISOString().split("T")[0];
  journalDate.value = today;
  loadJournalForDate(today);
}

function loadJournalForDate(date) {
  const content = localStorage.getItem(`journal-${date}`) || "";
  journal.value = content;
}

function saveJournal() {
  const date = journalDate?.value;
  const content = journal?.value.trim();
  if (date && content !== undefined) {
    localStorage.setItem(`journal-${date}`, content);
    alert("✅ Αποθηκεύτηκε!");
  }
}

function exportJournal() {
  const date = journalDate?.value;
  const content = journal?.value.trim();
  if (!content) return alert("📭 Το ημερολόγιο είναι άδειο!");

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `journal-${date}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

journalDate?.addEventListener("change", () => {
  loadJournalForDate(journalDate.value);
});

// ----- THEME TOGGLE -----
function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}

// ----- LANGUAGE -----
function setLanguage(lang) {
  const strings = translations[lang];
  if (!strings) return;
  document.getElementById("app-title").textContent = strings.title;
  document.getElementById("todo-title").textContent = strings.todo;
  document.getElementById("journal-title").textContent = strings.journal;
  if (journal) journal.placeholder = strings.placeholder;
  localStorage.setItem("lang", lang);
}

function applySavedLanguage() {
  const lang = localStorage.getItem("lang") || (navigator.language.startsWith("el") ? "el" : "en");
  setLanguage(lang);
}

// ----- QUOTE OF THE DAY -----
function loadQuote() {
  const quoteBox = document.getElementById("quote");
  const quotes = [
    "Μην αναβάλλεις για αύριο ό,τι μπορείς να κάνεις σήμερα.",
    "Small steps every day lead to big change.",
    "Η συνήθεια είναι ο καλύτερος φίλος της πειθαρχίας.",
    "Focus on progress, not perfection.",
    "Η δύναμη είναι μέσα σου."
  ];
  if (quoteBox) {
    quoteBox.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
  }
}

// ----- JOURNAL PROMPTS -----
const prompts = [
  "What’s one moment today you’re grateful for?",
  "What challenged you today—and how did you respond?",
  "Describe a small win you had today.",
  "What did you learn about yourself recently?",
  "How do you want to feel tomorrow?",
  "What would your ideal day look like?"
];

// ----- INIT -----
window.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  applySavedLanguage();
  loadTasks();
  initJournalDate();
  loadQuote();

  const promptText = document.getElementById("prompt-text");
  const promptBtn = document.getElementById("new-prompt-btn");

  function showRandomPrompt() {
    const index = Math.floor(Math.random() * prompts.length);
    promptText.textContent = prompts[index];
  }

  promptBtn?.addEventListener("click", showRandomPrompt);
  if (promptText) showRandomPrompt();
});

// ----- EXPORTING GLOBALS -----
window.setLanguage = setLanguage;
window.toggleTheme = toggleTheme;
window.saveJournal = saveJournal;
window.exportJournal = exportJournal;

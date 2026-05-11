/* ========== 1) Theme Toggle ========== */

const html = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const sun = document.getElementById("sunIcon");
const moon = document.getElementById("moonIcon");

function setTheme(mode) {
    html.setAttribute("data-theme", mode);
    sun.classList.toggle("active", mode === "light");
    moon.classList.toggle("active", mode === "dark");
    localStorage.setItem("theme", mode);
}

setTheme(localStorage.getItem("theme") || "dark");

themeBtn.addEventListener("click", () => {
    const newMode = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(newMode);
});


/* ========== 2) Tasks ========== */

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-task-btn");
const list = document.getElementById("tasks-list");
const current = document.getElementById("current-task-text");

function save() {
    const tasks = [...list.querySelectorAll("li span")].map(s => s.textContent);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("currentTask", current.textContent);
}

function addTask(text) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    const del = document.createElement("button");
    del.textContent = "✖";
    del.className = "delete-task";

    span.onclick = () => {
        current.textContent = text;
        save();
    };

    del.onclick = () => {
        li.remove();
        if (current.textContent === text) current.textContent = "No task yet";
        save();
    };

    li.append(span, del);
    list.appendChild(li);
}

function load() {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const cur = localStorage.getItem("currentTask") || "No task yet";

    list.innerHTML = "";
    tasks.forEach(addTask);
    current.textContent = cur;
}

load();

addBtn.onclick = () => {
    const value = taskInput.value.trim();
    if (!value) return;
    addTask(value);
    current.textContent = value;
    taskInput.value = "";
    save();
};


/* ========== 3) Timer ========== */

let time = 25 * 60;
let running = false;
let timerId = null;

const display = document.querySelector(".timer-display");
const circle = document.querySelector(".progress-ring__circle");

const radius = circle.r.baseVal.value;
const total = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${total} ${total}`;
circle.style.strokeDashoffset = total;

function updateProgress() {
    circle.style.strokeDashoffset = total - (time / (25 * 60)) * total;
}

function start() {
    if (running) return;
    running = true;

    timerId = setInterval(() => {
        const m = Math.floor(time / 60);
        const s = time % 60;

        display.textContent = `${m}:${s.toString().padStart(2, "0")}`;
        updateProgress();

        if (time <= 0) {
            clearInterval(timerId);
            running = false;
            display.textContent = "Done!";
            alert("You did it 🌿 Proud of you.");
        }

        time--;
    }, 1000);
}

document.getElementById("start-btn").onclick = start;
document.getElementById("pause-btn").onclick = () => {
    clearInterval(timerId);
    running = false;
};
document.getElementById("reset-btn").onclick = () => {
    clearInterval(timerId);
    running = false;
    time = 25 * 60;
    display.textContent = "25:00";
    circle.style.strokeDashoffset = total;
};









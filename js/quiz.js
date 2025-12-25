/* =========================
   CONFIG
========================= */
// All questions worth 1 mark
const difficultyPoints = { easy: 1, medium: 1, hard: 1 };

// 🔊 Sounds
const correctSound = new Audio("assets/sounds/correct.mp3");
const wrongSound = new Audio("assets/sounds/wrong.mp3");
const warningSound = new Audio("assets/sounds/warning.mp3");

/* =========================
   USER CHECK
========================= */
let user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "login.html";

/* =========================
   QUIZ SETTINGS
========================= */
let selectedCategory = localStorage.getItem("selectedCategory");
let selectedDifficulty = localStorage.getItem("selectedDifficulty");

if (!selectedCategory || !selectedDifficulty) {
    alert("Select category and difficulty first");
    window.location.href = "dashboard.html";
}

/* =========================
   DOM ELEMENTS
========================= */
const questionEl = document.getElementById("question");
const optionsContainer = document.getElementById("optionsContainer");
const progressEl = document.getElementById("progress");
const progressBar = document.getElementById("progressBar");
const timerEl = document.getElementById("timer");
const themeToggle = document.getElementById("themeToggle");

document.getElementById("username").textContent = "User: " + user.username;

/* =========================
   STATE
========================= */
let questions = [];
let index = 0;
let score = 0;
let quizFinished = false;

/* =========================
   LOAD QUESTIONS
========================= */
async function loadQuizQuestions() {
    const res = await fetch(
        `https://online-quiz-platform-gjin.onrender.com/questions?category=${selectedCategory}&difficulty=${selectedDifficulty}`
    );
    questions = await res.json();

    if (questions.length === 0) {
        alert("No questions available");
        window.location.href = "dashboard.html";
        return;
    }

    shuffleArray(questions);
    loadQuestion();
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/* =========================
   TIMER (AUTO SUBMIT)
========================= */
const initialTime = 10 * 60; // 10 mins
let totalTime = initialTime;
let warningPlayed = false;

const timerInterval = setInterval(() => {
    let min = Math.floor(totalTime / 60);
    let sec = totalTime % 60;

    timerEl.textContent =
        `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;

    if (totalTime === 10 && !warningPlayed) {
        warningSound.play();
        warningPlayed = true;
    }

    if (totalTime <= 0) {
        clearInterval(timerInterval);
        finishQuiz(); // auto submit on timeout
        return;
    }

    totalTime--;
}, 1000);

/* =========================
   LOAD QUESTION
========================= */
function loadQuestion() {
    const q = questions[index];

    questionEl.textContent = q.question;
    progressEl.textContent = `Question ${index + 1} / ${questions.length}`;
    optionsContainer.innerHTML = "";

    const shuffledOptions = [...q.options];
    shuffleArray(shuffledOptions);

    shuffledOptions.forEach(optionText => {
        const btn = document.createElement("button");
        btn.className = "option";
        btn.textContent = optionText;
        btn.onclick = () => checkAnswer(btn, q);
        optionsContainer.appendChild(btn);
    });
}

/* =========================
   CHECK ANSWER
========================= */
function checkAnswer(btn, question) {
    if (quizFinished) return;

    const points = difficultyPoints[question.difficulty]; // always 1
    const allBtns = optionsContainer.querySelectorAll("button");

    if (btn.textContent === question.answer) {
        btn.classList.add("correct");
        score += points; // add 1 mark
        correctSound.play();
    } else {
        btn.classList.add("wrong");
        wrongSound.play();
        // Highlight correct answer
        allBtns.forEach(b => {
            if (b.textContent === question.answer)
                b.classList.add("correct");
        });
    }

    // Disable all buttons
    allBtns.forEach(b => b.disabled = true);

    // Update progress bar
    progressBar.style.width = ((index + 1) / questions.length) * 100 + "%";

    setTimeout(() => {
        index++;
        if (index < questions.length) loadQuestion();
        else finishQuiz();
    }, 1000);
}

/* =========================
   FINISH QUIZ
========================= */
async function finishQuiz() {
    if (quizFinished) return;
    quizFinished = true;

    clearInterval(timerInterval);
    progressBar.style.width = "100%";

    const totalMarks = questions.length; // each question = 1 mark

    await fetch("https://online-quiz-platform-gjin.onrender.com/quizHistory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user.username, score, total: totalMarks, category: selectedCategory, date: new Date().toLocaleString() }) });

    // Save certificate
    function generateCertificateId() {
        return "CERT-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    }

    localStorage.setItem("certificateData", JSON.stringify({
        certId: generateCertificateId(),
        username: user.username,
        score,
        total: totalMarks,
        category: selectedCategory,
        date: new Date().toLocaleDateString()
    }));

    window.location.href = "result.html";
}

/* =========================
   THEME TOGGLE
========================= */
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.onclick = () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
};

/* =========================
   START QUIZ
========================= */
loadQuizQuestions();




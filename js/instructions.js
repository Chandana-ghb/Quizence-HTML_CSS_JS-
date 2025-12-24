/* =========================
   USER CHECK
========================= */
const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) window.location.href = "login.html";

/* =========================
   QUIZ SETTINGS
========================= */
const selectedCategory = localStorage.getItem("selectedCategory");
const selectedDifficulty = localStorage.getItem("selectedDifficulty");

if (!selectedCategory || !selectedDifficulty) {
    alert("Select category and difficulty first");
    window.location.href = "dashboard.html";
}

/* =========================
   MARKING SCHEME
========================= */
// Every correct answer = 1 mark
const difficultyPoints = { easy: 1, medium: 1, hard: 1 };

/* =========================
   DOM ELEMENTS
========================= */
const qCountEl = document.getElementById("qCount");
const marksRuleEl = document.getElementById("marksRule");

/* =========================
   LOAD INSTRUCTIONS DATA
========================= */
async function loadInstructions() {
    try {
        const res = await fetch(
            `https://online-quiz-platform-gjin.onrender.com/questions?category=${selectedCategory}&difficulty=${selectedDifficulty}`
        );
        const questions = await res.json();

        if (questions.length === 0) {
            alert("No questions available");
            window.location.href = "dashboard.html";
            return;
        }

        // Total Questions
        qCountEl.textContent = questions.length;

        // Marks Rule
        marksRuleEl.textContent = `1 mark per correct answer`;

    } catch (err) {
        console.error(err);
        alert("Failed to load instructions");
    }
}

loadInstructions();

/* =========================
   START QUIZ
========================= */
function startQuiz() {
    window.location.href = "quiz.html";
}


// 🔐 Protect admin
let admin = JSON.parse(localStorage.getItem("currentUser"));
if (!admin || admin.email !== "admin@quizence.com") {
    alert("Access denied");
    window.location.href = "login.html";
}

// DOM elements
const q = document.getElementById("q");
const o1 = document.getElementById("o1");
const o2 = document.getElementById("o2");
const o3 = document.getElementById("o3");
const o4 = document.getElementById("o4");
const ans = document.getElementById("ans");
const category = document.getElementById("category");
const difficulty = document.getElementById("difficulty");
const list = document.getElementById("questionList");

let editId = null;

// ==========================
// Load Questions from JSON Server
// ==========================
async function loadQuestions() {
    const res = await fetch("https://online-quiz-platform-gjin.onrender.com/questions");
    const questions = await res.json();
    showQuestions(questions);
}

// ==========================
// Show Questions
// ==========================
function showQuestions(questions) {
    list.innerHTML = "";
    questions.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <b>[${item.category}]:</b> ${item.question}<br>
            <small>Answer: ${item.answer}</small><br>
            <button onclick="editQuestion('${item.id}')">✏️ Edit</button>
            <button onclick="deleteQuestion('${item.id}')">❌ Delete</button>
            <hr>
        `;
        list.appendChild(li);
    });
}

// ==========================
// Add / Update Question
// ==========================
async function addQuestion() {
    if (!q.value || !o1.value || !o2.value || !o3.value || !o4.value ||
        !ans.value || !category.value || !difficulty.value) {
        alert("Please fill all fields");
        return;
    }

    const questionObj = {
        question: q.value,
        options: [o1.value, o2.value, o3.value, o4.value],
        answer: ans.value,
        category: category.value,
        difficulty: difficulty.value
    };

    if (editId) {
        await fetch(`https://online-quiz-platform-gjin.onrender.com/questions/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionObj)
        });
        editId = null;
    } else {
        await fetch("https://online-quiz-platform-gjin.onrender.com/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionObj)
        });
    }

    clearForm();
    loadQuestions();
}

// ==========================
// Edit Question
// ==========================
async function editQuestion(id) {
    const res = await fetch(`https://online-quiz-platform-gjin.onrender.com/questions/${id}`);
    const item = await res.json();

    q.value = item.question;
    o1.value = item.options[0];
    o2.value = item.options[1];
    o3.value = item.options[2];
    o4.value = item.options[3];
    ans.value = item.answer;
    category.value = item.category;
    difficulty.value = item.difficulty;

    editId = id;
}

// ==========================
// Delete Question
// ==========================
async function deleteQuestion(id) {
    if (!confirm("Delete this question?")) return;
    await fetch(`https://online-quiz-platform-gjin.onrender.com/questions/${id}`, { method: "DELETE" });
    loadQuestions();
}

// ==========================
// Clear Form
// ==========================
function clearForm() {
    q.value = "";
    o1.value = "";
    o2.value = "";
    o3.value = "";
    o4.value = "";
    ans.value = "";
    category.value = "";
    difficulty.value = "";
}

function goBack() {
    window.location.href = "admin-panel.html";
}

loadQuestions();


// 🔐 Protect admin page
const admin = JSON.parse(localStorage.getItem("currentUser"));

if (!admin || admin.role !== "admin") {
  alert("Access denied! Admins only.");
  window.location.href = "login.html";
}

// DOM elements
const userCountEl = document.getElementById("userCount");
const tbody = document.querySelector("#userTable tbody");

// Fetch users from JSON Server
async function loadUsers() {
  try {
    const res = await fetch("https://online-quiz-platform-gjin.onrender.com/users");
    const users = await res.json();

    // Exclude admin
    const normalUsers = users.filter(user => user.role === "user");

    // Show count
    userCountEl.textContent = normalUsers.length;

    // Clear table
    tbody.innerHTML = "";

    // Populate table
    normalUsers.forEach((user, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error(error);
    alert("❌ Unable to load users");
  }
}

// Navigation
function goQuestions() {
  window.location.href = "admin-questions.html";
}

function adminLogout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Load data
loadUsers();


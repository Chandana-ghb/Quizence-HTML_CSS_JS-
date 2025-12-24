async function signup(event) {
  if (event) event.preventDefault(); // prevent page reload

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageEl = document.getElementById("message");

  messageEl.style.color = "red";
  messageEl.textContent = "";

  // Validation
  if (!username || !email || !password) {
    messageEl.textContent = "All fields are required";
    return;
  }

  if (username.length < 3) {
    messageEl.textContent = "Username must be at least 3 characters";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageEl.textContent = "Enter valid email";
    return;
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordPattern.test(password)) {
    messageEl.textContent = "Password must contain letters & numbers (min 6)";
    return;
  }

  try {
    // Check if email already exists
    const checkRes = await fetch(`https://online-quiz-platform-gjin.onrender.com/users?email=${email}`);
    if (!checkRes.ok) throw new Error("Network error");
    const existingUsers = await checkRes.json();

    if (existingUsers.length > 0) {
      messageEl.textContent = "Email already registered. Please login.";
      return;
    }

    // Save user to JSON server
    const res = await fetch("https://online-quiz-platform-gjin.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role: "user" }),
    });

    if (!res.ok) throw new Error("Failed to save user");

    // Success message
    messageEl.style.color = "green";
    messageEl.textContent = "Registration successful! Redirecting to login...";

    console.log("Redirect in 1.5s");
    setTimeout(() => {
      console.log("Redirecting now");
      window.location.replace("login.html"); // reliable redirect
    }, 1500);

  } catch (err) {
    console.error(err);
    messageEl.style.color = "red";
    messageEl.textContent = err.message || "Signup failed";
  }
}


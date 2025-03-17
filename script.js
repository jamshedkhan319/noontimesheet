document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const appScreen = document.getElementById("app");

  // Default password
  const validPassword = "noon13579";

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;

    if (password === validPassword) {
      // Hide login screen and show app screen
      loginScreen.style.display = "none";
      appScreen.style.display = "flex";
    } else {
      alert("Invalid password. Please try again.");
    }
  });
});

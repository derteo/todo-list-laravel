const PORT = 8000;
const API_HOST = "http://localhost:" + PORT + "/api";

// se già loggato, vai direttamente all'app
if (localStorage.getItem("sanctum_token")) {
    window.location.href = "../index.html";
}

const loginBtn      = document.getElementById("loginBtn");
const emailField    = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");
const errorMsg      = document.getElementById("errorMsg");

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
}

function hideError() {
    errorMsg.classList.add("hidden");
}

loginBtn.addEventListener("click", async () => {
    hideError();

    const email    = emailField.value.trim();
    const password = passwordField.value;

    if (!email || !password) {
        showError("Inserisci email e password.");
        return;
    }

    loginBtn.value    = "...";
    loginBtn.disabled = true;

    try {
        const res = await fetch(API_HOST + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            showError(data.message || "Credenziali non valide.");
            return;
        }

        localStorage.setItem("sanctum_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        window.location.href = "../index.html";

    } catch (err) {
        showError("Impossibile connettersi al server.");
    } finally {
        loginBtn.value    = "Accedi";
        loginBtn.disabled = false;
    }
});

passwordField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loginBtn.click();
});
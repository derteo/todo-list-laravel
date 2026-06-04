const PORT = 8000;
const API_HOST = "http://localhost:" + PORT + "/api";

// se già loggato, vai direttamente all'app
if (localStorage.getItem("sanctum_token")) {
    window.location.href = "../index.html";
}

const registerBtn          = document.getElementById("registerBtn");
const nameField            = document.getElementById("nameField");
const emailField           = document.getElementById("emailField");
const passwordField        = document.getElementById("passwordField");
const passwordConfirmField = document.getElementById("passwordConfirmField");
const errorMsg             = document.getElementById("errorMsg");

function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
}

function hideError() {
    errorMsg.classList.add("hidden");
}

registerBtn.addEventListener("click", async () => {
    hideError();

    const name                  = nameField.value.trim();
    const email                 = emailField.value.trim();
    const password              = passwordField.value;
    const password_confirmation = passwordConfirmField.value;

    if (!name || !email || !password || !password_confirmation) {
        showError("Compila tutti i campi.");
        return;
    }

    if (password.length < 8) {
        showError("La password deve essere di almeno 8 caratteri.");
        return;
    }

    if (password !== password_confirmation) {
        showError("Le password non coincidono.");
        return;
    }

    registerBtn.value    = "...";
    registerBtn.disabled = true;

    try {
        const res = await fetch(API_HOST + "/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, password_confirmation }),
        });

        const data = await res.json();

        if (!res.ok) {
            if (data.errors) {
                const first = Object.values(data.errors)[0];
                showError(Array.isArray(first) ? first[0] : first);
            } else {
                showError(data.message || "Errore durante la registrazione.");
            }
            return;
        }

        localStorage.setItem("sanctum_token", data.token);
        localStorage.setItem("user_name", data.user?.name || "");
        window.location.href = "../index.html";

    } catch (err) {
        showError("Impossibile connettersi al server.");
    } finally {
        registerBtn.value    = "Crea account";
        registerBtn.disabled = false;
    }
});

passwordConfirmField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") registerBtn.click();
});
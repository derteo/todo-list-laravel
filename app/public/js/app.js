const PORT = 8000;
const API_HOST = "http://localhost:" + PORT;

/* COSTANTI */
const listNameField = document.getElementById("listNameField");
const addListButton = document.getElementById("addListButton");
const delListButton = document.getElementById("delListButton");
const addListConfirm = document.getElementById("addListConfirm");

const notesContentField = document.getElementById("notesContentField");
const addNoteButton = document.getElementById("addNoteButton");
const delNoteButton = document.getElementById("delNoteButton");

const listsTable = document.getElementById("result1");
const notesTable = document.getElementById("result2");

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", reset);

/* PULIZIA CAMPI */
function clear(string) {
    const hid = document.querySelectorAll(".toHide");

    hid.forEach((value, index) => {
        hid[index].classList.add("hidden");
    });

    if (string == "reset") {
        addListButton.classList.remove("hidden");
    } else if (string == "addList") {
        listNameField.classList.remove("hidden");
        addListConfirm.classList.remove("hidden");
    } else if (string == "addNote") {
        notesContentField.classList.remove("hidden");
        addNoteButton.classList.remove("hidden");
    }
}

/* CHIAMATE GET */
async function getLists() {
    listsTable.innerHTML = "";

    const trH = document.createElement("tr");
    const thId = document.createElement("th");
    const thName = document.createElement("th");
    const thDel = document.createElement("th");

    thId.textContent = "ID Lista";
    thName.textContent = "Nome Lista";
    thDel.textContent = "Elimina";

    trH.append(thId, thName, thDel);
    listsTable.append(trH);

    const data = await apiRequest(API_HOST + "/lists", "GET", null);

    Array.from(data).forEach((value, index) => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdName = document.createElement("td");
        const tdDel = document.createElement("td");

        tdId.textContent = value.id;
        tdId.style.cursor = "pointer";
        tdId.title =
            "al click: mostra i campi per aggiungere una nota per la lista cliccata";
        tdId.addEventListener("click", () => {
            clear("addNote");
            idLista = value.id;
        });

        // Click sul nome per modificarlo inline
        tdName.textContent = value.name;
        tdName.style.cursor = "text";
        tdName.title = "al click: modifica il nome della lista";
        tdName.addEventListener("click", () => {
            if (tdName.querySelector("input")) return;

            const oldName = tdName.textContent;
            tdName.innerHTML = "";

            const input = document.createElement("input");
            input.type = "text";
            input.value = oldName;
            tdName.append(input);
            input.focus();

            input.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    //premi invio => fa la put solo se non è nullo e diverso dal vecchio
                    if (input.value === "" || input.value === oldName) {
                        tdName.textContent = oldName;
                        return;
                    }

                    const body = { name: input.value };
                    await apiRequest(
                        API_HOST + "/list/" + value.id,
                        "PUT",
                        body,
                    );

                    await getLists();
                }

                if (e.key === "Escape") {
                    // premi esc => ritorna al nome iniziale
                    tdName.textContent = oldName;
                }
            });

            input.addEventListener("blur", () => {
                // Se l'input è ancora lì (nessun Enter premuto), ripristina
                if (tdName.querySelector("input")) {
                    tdName.textContent = oldName;
                }
            });
        });

        const delBtn = document.createElement("input");
        delBtn.type = "button";
        delBtn.value = "x";
        delBtn.style.cursor = "pointer";

        delBtn.addEventListener("click", async () => {
            await apiRequest(API_HOST + "/list/" + value.id, "DELETE", null);

            await getLists();
            await getNotes();
            await reset();
        });

        tdDel.append(delBtn);

        tr.append(tdId, tdName, tdDel);
        listsTable.append(tr);
    });
}

async function getNotes() {
    notesTable.innerHTML = "";

    const trH = document.createElement("tr");
    const thId = document.createElement("th");
    const thName = document.createElement("th");
    const thLista = document.createElement("th");
    const thTodo = document.createElement("th");
    const thDel = document.createElement("th");

    thId.textContent = "ID Nota";
    thName.textContent = "Contenuto Nota";
    thLista.textContent = "ID Lista";
    thTodo.textContent = "ToDo";
    thDel.textContent = "Elimina";

    trH.append(thId, thName, thLista, thTodo, thDel);
    notesTable.append(trH);

    const data = await apiRequest(API_HOST + "/notes", "GET", null);
    // console.log(typeof data); --> OBJECT
    Array.from(data).forEach((value, index) => {
        const tr = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdName = document.createElement("td");
        const tdLista = document.createElement("td");
        const tdTodo = document.createElement("td");
        const tdDel = document.createElement("td");

        tdId.textContent = value.id;
        tdName.textContent = value.content;
        tdName.style.cursor = "pointer";
        tdName.title = "al click: cambia nome della nota";
        tdName.addEventListener("click", () => {
            if (tdName.querySelector("input")) return;

            const oldContent = tdName.textContent;
            tdName.innerHTML = "";

            const input = document.createElement("input");
            input.type = "text";
            input.value = oldContent;
            tdName.append(input);
            input.focus();

            input.addEventListener("keydown", async (e) => {
                if (e.key === "Enter") {
                    //premi invio => fa la put solo se non è nullo e diverso dal vecchio
                    if (input.value === "" || input.value === oldContent) {
                        tdName.textContent = oldContent;
                        return;
                    }

                    const body = { content: input.value };
                    await apiRequest(
                        API_HOST + "/note/" + value.id + "/content",
                        "PUT",
                        body,
                    );

                    await getNotes();
                }

                if (e.key === "Escape") {
                    // premi esc => ritorna al nome iniziale
                    tdName.textContent = oldContent;
                }
            });
        });

        tdLista.textContent = value.lists_id;

        tdTodo.textContent = value.todo;
        tdTodo.style.cursor = "pointer";
        tdTodo.title = "al click: segna la nota come fatta/da fare";
        tdTodo.addEventListener("click", async () => {
            if (value.todo == "todo") {
                const body = {
                    todo: "done",
                };
                await apiRequest(
                    API_HOST + "/note/" + value.id + "/todo",
                    "PUT",
                    body,
                );
            } else {
                const body = {
                    todo: "todo",
                };
                await apiRequest(
                    API_HOST + "/note/" + value.id + "/todo",
                    "PUT",
                    body,
                );
            }
            await getNotes();
        });

        const delBtn = document.createElement("input");
        delBtn.type = "button";
        delBtn.value = "x";
        delBtn.style.cursor = "pointer";

        delBtn.addEventListener("click", async () => {
            await apiRequest(API_HOST + "/note/" + value.id, "DELETE", null);

            await getLists();
            await getNotes();
            await reset();
        });

        tdDel.append(delBtn);

        tr.append(tdId, tdName, tdLista, tdTodo, tdDel);
        notesTable.append(tr);
    });
}

async function reset() {
    clear("reset");
    await getLists();
    await getNotes();
}

document.addEventListener("DOMContentLoaded", async () => {
    await reset();
});

let idLista;

/* CHIAMATE POST */
addNoteButton.addEventListener("click", async () => {
    if (notesContentField.value == "")
        return console.log("contenuto nota non valido!");

    body = {
        content: notesContentField.value,
        todo: "todo",
        lists_id: idLista,
    };

    await apiRequest(API_HOST + "/note", "POST", body);

    notesContentField.value = "";

    await reset();
});

addListButton.addEventListener("click", () => {
    clear("addList");
});

addListConfirm.addEventListener("click", async () => {
    if (listNameField.value == "") return console.log("nome lista non valido!");

    body = { name: listNameField.value };

    await apiRequest(API_HOST + "/list", "POST", body);

    listNameField.value = "";

    await reset();
});

/* ------------------- API REQUEST DEFINITION ---------------------- */
async function apiRequest(url, method, data) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (method !== "GET" && data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (err) {
        throw err;
    }
}

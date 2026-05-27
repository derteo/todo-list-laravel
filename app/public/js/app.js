const PORT = 8000;
const API_HOST = "http://localhost:" + PORT + "/api";

/* COSTANTI */
const listNameField = document.getElementById("listNameField");
const addListButton = document.getElementById("addListButton");
const addListConfirm = document.getElementById("addListConfirm");
const delListButton = document.getElementById("delListButton");

const notesContentField = document.getElementById("notesContentField");
const addNoteButton = document.getElementById("addNoteButton");
const delNoteButton = document.getElementById("delNoteButton");

const listsTable = document.getElementById("result1");
const notesTable = document.getElementById("result2");
const listFilterSelect = document.getElementById("listFilterSelect");
const addNoteSection = document.getElementById("addNoteSection");

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", reset);

/* PULIZIA CAMPI */
function clear(string) {
    const hid = document.querySelectorAll(".toHide");
    hid.forEach((el) => el.classList.add("hidden"));

    if (string == "reset") {
        addListButton.classList.remove("hidden");
    } else if (string == "addList") {
        listNameField.classList.remove("hidden");
        addListConfirm.classList.remove("hidden");
    }
}

let idLista = null;
let allChecklists = [];

/* DROPDOWN FILTER */
function populateDropdown(checklists) {
    const prev = listFilterSelect.value;
    listFilterSelect.innerHTML = '<option value="">Tutte le liste</option>';
    checklists.forEach((cl) => {
        const opt = document.createElement("option");
        opt.value = cl.id;
        opt.textContent = cl.name;
        listFilterSelect.append(opt);
    });
    // ripristina selezione se ancora esiste
    if (prev && checklists.find((cl) => String(cl.id) === prev)) {
        listFilterSelect.value = prev;
        idLista = parseInt(prev);
    } else {
        listFilterSelect.value = "";
        idLista = null;
    }
    updateAddNoteVisibility();
}

function updateAddNoteVisibility() {
    if (idLista) {
        addNoteSection.classList.remove("hidden");
        const selected = allChecklists.find((cl) => cl.id === idLista);
        document.getElementById("addNoteLabel").textContent = selected
            ? `Aggiungi nota a "${selected.name}"`
            : "Aggiungi nota";
    } else {
        addNoteSection.classList.add("hidden");
    }
}

listFilterSelect.addEventListener("change", () => {
    idLista = listFilterSelect.value ? parseInt(listFilterSelect.value) : null;
    updateAddNoteVisibility();
    renderFilteredNotes();
});

/* CHIAMATE GET */
async function getChecklists() {
    listsTable.innerHTML = "";

    const trH = document.createElement("tr");
    const thName = document.createElement("th");
    const thDel = document.createElement("th");
    thName.textContent = "Nome Lista";
    thDel.textContent = "Elimina";
    trH.append(thName, thDel);
    listsTable.append(trH);

    const data = await apiRequest(API_HOST + "/checklists", "GET", null);
    allChecklists = Array.from(data);

    allChecklists.forEach((value) => {
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdDel = document.createElement("td");

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
                    if (input.value === "" || input.value === oldName) {
                        tdName.textContent = oldName;
                        return;
                    }
                    await apiRequest(
                        API_HOST + "/checklists/" + value.id,
                        "PUT",
                        { name: input.value },
                    );
                    await getChecklists();
                    populateDropdown(allChecklists);
                }
                if (e.key === "Escape") tdName.textContent = oldName;
            });

            input.addEventListener("blur", () => {
                if (tdName.querySelector("input")) tdName.textContent = oldName;
            });
        });

        const delBtn = document.createElement("input");
        delBtn.type = "button";
        delBtn.value = "x";
        delBtn.style.cursor = "pointer";
        delBtn.addEventListener("click", async () => {
            await apiRequest(API_HOST + "/checklists/" + value.id, "PUT", {
                paranoid: 1,
            });
            await reset();
        });

        tdDel.append(delBtn);
        tr.append(tdName, tdDel);
        listsTable.append(tr);
    });

    populateDropdown(allChecklists);
}

let allNotes = [];

async function getNotes() {
    const data = await apiRequest(API_HOST + "/notes", "GET", null);
    allNotes = Array.from(data);
    renderFilteredNotes();
}

function renderFilteredNotes() {
    notesTable.innerHTML = "";

    const trH = document.createElement("tr");
    const thName = document.createElement("th");
    const thLista = document.createElement("th");
    const thTodo = document.createElement("th");
    const thDel = document.createElement("th");
    thName.textContent = "Contenuto Nota";
    thLista.textContent = "Lista";
    thTodo.textContent = "ToDo";
    thDel.textContent = "Elimina";
    trH.append(thName, thLista, thTodo, thDel);
    notesTable.append(trH);

    const filtered = idLista
        ? allNotes.filter((n) => n.checklist_id === idLista)
        : allNotes;

    filtered.forEach((value) => {
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        const tdLista = document.createElement("td");
        const tdTodo = document.createElement("td");
        const tdDel = document.createElement("td");

        tdName.textContent = value.content;
        tdName.style.cursor = "pointer";
        tdName.title = "al click: cambia contenuto della nota";
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
                    if (input.value === "" || input.value === oldContent) {
                        tdName.textContent = oldContent;
                        return;
                    }
                    await apiRequest(API_HOST + "/notes/" + value.id, "PUT", {
                        content: input.value,
                    });
                    await getNotes();
                }
                if (e.key === "Escape") tdName.textContent = oldContent;
            });

            input.addEventListener("blur", () => {
                if (tdName.querySelector("input")) {
                    tdName.textContent = oldContent;
                }
            });
        });

        tdLista.textContent = value.checklist ? value.checklist.name : "—";

        tdTodo.textContent = value.todo;
        tdTodo.style.cursor = "pointer";
        tdTodo.title = "al click: segna la nota come fatta/da fare";
        tdTodo.addEventListener("click", async () => {
            const body = { todo: value.todo == "todo" ? "done" : "todo" };
            await apiRequest(API_HOST + "/notes/" + value.id, "PUT", body);
            await getNotes();
        });

        const delBtn = document.createElement("input");
        delBtn.type = "button";
        delBtn.value = "x";
        delBtn.style.cursor = "pointer";
        delBtn.addEventListener("click", async () => {
            await apiRequest(API_HOST + "/notes/" + value.id, "PUT", {
                paranoid: 1,
            });
            await getNotes();
        });

        tdDel.append(delBtn);
        tr.append(tdName, tdLista, tdTodo, tdDel);
        notesTable.append(tr);
    });
}

async function reset() {
    clear("reset");
    await getChecklists();
    await getNotes();
}

document.addEventListener("DOMContentLoaded", async () => {
    await reset();
});

/* CHIAMATE POST */
addNoteButton.addEventListener("click", async () => {
    if (!notesContentField.value) return;
    if (!idLista) return;

    await apiRequest(API_HOST + "/notes", "POST", {
        content: notesContentField.value,
        todo: "todo",
        checklist_id: idLista,
        paranoid: 0,
    });

    notesContentField.value = "";
    await getNotes();
});

addListButton.addEventListener("click", () => {
    clear("addList");
});

addListConfirm.addEventListener("click", async () => {
    if (!listNameField.value) return;

    await apiRequest(API_HOST + "/checklists", "POST", {
        name: listNameField.value,
        paranoid: 0,
    });

    listNameField.value = "";
    await reset();
});

/* API REQUEST */
async function apiRequest(url, method, data) {
    const options = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (method !== "GET" && data) options.body = JSON.stringify(data);
    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (err) {
        throw err;
    }
}

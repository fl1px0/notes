const list = document.querySelector('.content');
const BtnSearch = document.querySelector('.search_button');
const SearchText = document.querySelector('.forma_input');
const menu = document.querySelectorAll('.tegs_li');
const btnNote = document.querySelector('.menu_button');


const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('ModalTitle');
const modalSelect = document.getElementById('ModalSelect');
const modalSaveBtn = document.getElementById('ModalButtonSave');
const modalDeleteBtn = document.getElementById('ModalButtonDelete');
const modalCloseBtn = document.getElementById('btnModalClose');

let editingItem = null;

const tags = ["Все", "Идеи", "Личное", "Работа", "Список покупок"];
const notes = initData();
let activeTag = "Все";

function createNote(note) {
    const item = document.createElement('div');
    item.classList.add('zadachi');
    item.innerHTML = `
        <div class="zadachi_item">
            <div class="zadachi_item-top">
                <span>${note.title}</span>
            </div>
            <div class="zadachi_item-down">
                <span>${note.date}</span>
            </div>
        </div>
    `;

    item.addEventListener('click', () => {
        editingItem = note;
        openModal();
    });

    return item;
}

function initData() {
    const raw = localStorage.getItem('notes');
    return raw ? JSON.parse(raw) : [];
}

function saveToLocal() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function NotesFilter() {
    const text = SearchText.value.toLowerCase();
    let filtered = notes.filter(n => n.title.toLowerCase().includes(text));

    if (activeTag !== "Все") filtered = filtered.filter(n => n.tag === activeTag);

    return filtered;
}

function render() {
    const container = document.querySelector('.content');
    const old = container.querySelectorAll('.zadachi');
    old.forEach(el => el.remove());

    const filtered = NotesFilter();

    if (filtered.length === 0) {
        const msg = document.createElement('div');
        msg.innerText = "Ничего не найдено";
        msg.style.marginTop = "20px";
        container.appendChild(msg);
        return;
    }

    for (let note of filtered) {
        container.appendChild(createNote(note));
    }
}

function openModal() {
    overlay.classList.add('opened');
    modalTitle.value = editingItem.title;
    modalSelect.value = editingItem.tag;

    modalDeleteBtn.style.display = editingItem ? 'block' : 'none';
}

function closeModal() {
    overlay.classList.remove('opened');
    modalTitle.value = "";
    modalSelect.value = "Все";
    editingItem = null;
}

function saveNote() {
    if (!editingItem) {
        return;
    }

    editingItem.title = modalTitle.value;
    editingItem.tag = modalSelect.value;
    editingItem.date = new Date().toLocaleDateString();

    saveToLocal();
    render();
    closeModal();
}

function deleteNote() {
    const index = notes.indexOf(editingItem);
    notes.splice(index, 1);
    saveToLocal();
    render();
    closeModal();
}

function newNote() {
    const note = {
        title: "",
        tag: "Все",
        date: new Date().toLocaleDateString(),
    };
    notes.unshift(note);
    editingItem = note;
    openModal();
}

function init() {
    render();

    menu.forEach(tag => {
        tag.addEventListener('click', () => {
            activeTag = tag.textContent.trim();
            render();
        });
    });

    BtnSearch.addEventListener('click', render);
    btnNote.addEventListener('click', newNote);

    modalCloseBtn.addEventListener('click', closeModal);
    modalSaveBtn.addEventListener('click', saveNote);
    modalDeleteBtn.addEventListener('click', deleteNote);
}

init();
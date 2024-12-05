// DOM Elements
const titleInput = document.getElementById('titleInput');
const descInput = document.getElementById('descInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesContainer = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');

// Notes Array
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Initialize App
renderNotes();

// Add Note
addNoteBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const category = categorySelect.value;

  if (!title || !desc || !category) {
    alert('Please fill in all fields!');
    return;
  }

  if (addNoteBtn.innerText === 'Update Note') {
    // Updating existing note
    const noteIndex = addNoteBtn.getAttribute('data-index');
    notes[noteIndex] = { ...notes[noteIndex], title, desc, category };
    addNoteBtn.innerText = 'Add Note';
    addNoteBtn.removeAttribute('data-index');
  } else {
    // Adding a new note
    notes.push({ title, desc, category, favorite: false });
  }

  saveToLocalStorage();
  renderNotes();
  clearInputs();
});

// Render Notes
function renderNotes(filteredNotes = notes) {
  notesContainer.innerHTML = '';
  filteredNotes.forEach((note, index) => {
    const noteCard = document.createElement('div');
    noteCard.classList.add('note-card');

    noteCard.innerHTML = `
      <h3>${note.title} <span class="note-category">(${note.category})</span></h3>
      <p>${note.desc}</p>
      <div class="btn-group">
        <button class="edit-btn" onclick="editNote(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteNote(${index})">Delete</button>
        <button class="fav-btn ${note.favorite ? 'favorited' : ''}" onclick="toggleFavorite(${index})">
          ${note.favorite ? '★ Favorite' : '☆ Mark as Favorite'}
        </button>
      </div>
    `;

    notesContainer.appendChild(noteCard);
  });
}

// Save Notes to Local Storage
function saveToLocalStorage() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Clear Inputs
function clearInputs() {
  titleInput.value = '';
  descInput.value = '';
  categorySelect.value = '';
}

// Edit Note
function editNote(index) {
  const note = notes[index];
  titleInput.value = note.title;
  descInput.value = note.desc;
  categorySelect.value = note.category;

  addNoteBtn.innerText = 'Update Note';
  addNoteBtn.setAttribute('data-index', index);
}

// Delete Note
function deleteNote(index) {
  notes.splice(index, 1);
  saveToLocalStorage();
  renderNotes();
}

// Toggle Favorite
function toggleFavorite(index) {
  notes[index].favorite = !notes[index].favorite;
  saveToLocalStorage();
  renderNotes();
}

// Search Notes
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(query) || note.desc.toLowerCase().includes(query)
  );
  renderNotes(filteredNotes);
});

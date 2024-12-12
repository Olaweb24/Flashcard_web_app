// Selectors
const questionInput = document.getElementById("card-question");
const answerInput = document.getElementById("card-answer");
const categoryInput = document.getElementById("card-category");
const addCardBtn = document.getElementById("add-card-btn");
const searchBox = document.getElementById("search-box");
const filterCategory = document.getElementById("filter-category");
const flashcardsContainer = document.getElementById("flashcards-container");
const cardsLearnedSpan = document.getElementById("cards-learned");
const exportBtn = document.getElementById("export-btn");
const importInput = document.getElementById("import-input");

// Local Storage
let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
let cardsLearned = parseInt(localStorage.getItem("cardsLearned")) || 0;

// Add Card
addCardBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();
  const answer = answerInput.value.trim();
  const category = categoryInput.value.trim();

  if (question && answer && category) {
    flashcards.push({ question, answer, category, learned: false });
    updateLocalStorage();
    renderCards();
    questionInput.value = "";
    answerInput.value = "";
    categoryInput.value = "";
  }
});

// Render Cards
function renderCards() {
  flashcardsContainer.innerHTML = "";
  const filteredCards = flashcards.filter(card => 
    card.question.includes(searchBox.value) &&
    (filterCategory.value === "all" || card.category === filterCategory.value)
  );

  filteredCards.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "flashcard";
    cardDiv.innerHTML = `
      <p><strong>Q:</strong> ${card.question}</p>
      <p><strong>A:</strong> ${card.answer}</p>
      <p><strong>Category:</strong> ${card.category}</p>
      <button onclick="deleteCard(${index})">Delete</button>
      <button onclick="markLearned(${index})">Mark as Learned</button>
    `;
    flashcardsContainer.appendChild(cardDiv);
  });

  updateProgress();
  populateCategories();
}

function deleteCard(index) {
  flashcards.splice(index, 1);
  updateLocalStorage();
  renderCards();
}

function markLearned(index) {
  flashcards[index].learned = true;
  cardsLearned++;
  updateLocalStorage();
  renderCards();
}

function updateProgress() {
  cardsLearnedSpan.textContent = cardsLearned;
}

function populateCategories() {
  const categories = [...new Set(flashcards.map(card => card.category))];
  filterCategory.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filterCategory.appendChild(option);
  });
}

function updateLocalStorage() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  localStorage.setItem("cardsLearned", cardsLearned);
}

// Search and Filter
searchBox.addEventListener("input", renderCards);
filterCategory.addEventListener("change", renderCards);

// Export
exportBtn.addEventListener("click", () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flashcards));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.href = dataStr;
  downloadAnchor.download = "flashcards.json";
  downloadAnchor.click();
});

// Import
importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    flashcards = JSON.parse(e.target.result);
    updateLocalStorage();
    renderCards();
  };
  reader.readAsText(file);
});

// Initialize App
renderCards();

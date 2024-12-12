document.addEventListener("DOMContentLoaded", () => {
    const flashcardsDiv = document.querySelector(".flashcards");
    const createBox = document.querySelector(".create-box");
    const statsBox = document.querySelector(".stats-box");
    const categoryFilter = document.getElementById("categoryFilter");

    let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [];
    let stats = { reviewed: 0, correct: 0 };
    let quizIndex = 0;
    let quizMode = false;

    // Display all flashcards
    function displayFlashcards(cards = flashcards) {
        flashcardsDiv.innerHTML = "";
        cards.forEach((card, index) => createFlashcardElement(card, index));
        updateProgress();
    }

    function createFlashcardElement(card, index) {
        const div = document.createElement("div");
        div.className = "flashcard";
        div.innerHTML = `<h3>${card.category || "Uncategorized"}</h3>
                         <p>Q: ${card.question}</p>
                         <p style="display:none;">A: ${card.answer}</p>`;
        div.addEventListener("click", () => {
            const answer = div.querySelector("p:nth-child(3)");
            answer.style.display = answer.style.display === "none" ? "block" : "none";
            stats.reviewed++;
            updateProgress();
        });
        flashcardsDiv.appendChild(div);
    }

    function addFlashcard() {
        const question = document.getElementById("question").value.trim();
        const answer = document.getElementById("answer").value.trim();
        const category = document.getElementById("category").value;

        if (!question || !answer) return alert("Question and answer are required!");

        flashcards.push({ question, answer, category });
        localStorage.setItem("flashcards", JSON.stringify(flashcards));
        displayFlashcards();
        hideCreateBox();
    }

    function searchFlashcards() {
        const query = document.getElementById("search").value.toLowerCase();
        const filtered = flashcards.filter(flashcard =>
            flashcard.question.toLowerCase().includes(query) ||
            flashcard.answer.toLowerCase().includes(query)
        );
        displayFlashcards(filtered);
    }

    function filterByCategory() {
        const selectedCategory = categoryFilter.value;
        const filtered = selectedCategory
            ? flashcards.filter(card => card.category === selectedCategory)
            : flashcards;
        displayFlashcards(filtered);
    }

    function clearFlashcards() {
        if (confirm("Are you sure you want to delete all flashcards?")) {
            flashcards = [];
            localStorage.removeItem("flashcards");
            displayFlashcards();
        }
    }

    function exportFlashcards() {
        const blob = new Blob([JSON.stringify(flashcards)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "flashcards.json";
        a.click();
    }

    function importFlashcards() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.addEventListener("change", (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                flashcards = JSON.parse(event.target.result);
                localStorage.setItem("flashcards", JSON.stringify(flashcards));
                displayFlashcards();
            };
            reader.readAsText(file);
        });
        input.click();
    }

    function updateProgress() {
        const accuracy = stats.reviewed > 0 ? ((stats.correct / stats.reviewed) * 100).toFixed(2) : 0;
        document.getElementById("progress").textContent =
            `Flashcards Reviewed: ${stats.reviewed} | Correct Answers: ${stats.correct} | Accuracy: ${accuracy}%`;
        statsBox.style.display = "block";
    }

    function startQuiz() {
        quizMode = true;
        quizIndex = 0;
        displayQuiz();
    }

    function displayQuiz() {
        if (quizIndex >= flashcards.length) {
            alert("Quiz complete!");
            endQuiz();
            return;
        }
        document.querySelector(".quiz-box").style.display = "block";
        document.getElementById("quiz-question").textContent = flashcards[quizIndex].question;
    }

    function checkQuizAnswer() {
        const userAnswer = document.getElementById("quiz-answer").value.trim();
        if (userAnswer === flashcards[quizIndex].answer) {
            stats.correct++;
            alert("Correct!");
        } else {
            alert(`Wrong! Correct answer: ${flashcards[quizIndex].answer}`);
        }
        stats.reviewed++;
        quizIndex++;
        updateProgress();
        document.getElementById("quiz-answer").value = "";
        displayQuiz();
    }

    function endQuiz() {
        quizMode = false;
        document.querySelector(".quiz-box").style.display = "none";
        updateProgress();
    }

    function showCreateBox() { createBox.style.display = "block"; }
    function hideCreateBox() { createBox.style.display = "none"; }

    displayFlashcards();
});





 // Request notification permission
 if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Dynamic in-page reminder
function showReminderMessage() {
    const reminderElement = document.getElementById("reminderMessage");
    reminderElement.textContent = "🔔 Reminder: Keep practicing your flashcards to stay sharp!";

    // Remove the message after 10 seconds
    setTimeout(() => {
        reminderElement.textContent = "";
    }, 10000);
}

// Browser notification reminder
function sendReminderNotification() {
    if (Notification.permission === "granted") {
        new Notification("Flashcard Reminder", {
            body: "Time to review your flashcards and keep learning!",
            icon: "https://example.com/icon.png" // Optional icon
        });
    }
}

// Combine both reminders every 5 minutes
setInterval(() => {
    showReminderMessage();
    sendReminderNotification();
}, 300000); // 5 minutes
let allQuestions = [];
let questions = [];
let current = 0;
let score = 0;
let selected = null;
let streak = 0;
let difficulty = "Easy";

let categoryStats = {
    ISDM: { correct: 0, total: 0 },
    SEC: { correct: 0, total: 0 },
    SOC: { correct: 0, total: 0 }
};

fetch("questions.json")
.then(res => res.json())
.then(data => {
    allQuestions = data;
});

function startSection(section) {

    document.getElementById("sectionScreen").classList.add("hidden");
    document.getElementById("quizScreen").classList.remove("hidden");

    questions = allQuestions.filter(q => q.section === section);

    questions = shuffle(questions);

    loadQuestion();
}

function loadQuestion() {

    selected = null;

    let q = questions[current];

    document.getElementById("questionText").innerText = q.question;
    document.getElementById("answers").innerHTML = "";

    document.getElementById("progressText").innerText =
        `Question ${current + 1} of ${questions.length}`;

    document.getElementById("difficultyText").innerText = difficulty;

    document.getElementById("progressFill").style.width =
        ((current / questions.length) * 100) + "%";

    q.choices.forEach((choice, i) => {
        let div = document.createElement("div");
        div.className = "answer";
        div.innerText = choice;

        div.onclick = () => {
            document.querySelectorAll(".answer").forEach(a => a.classList.remove("selected"));
            div.classList.add("selected");
            selected = i;
        };

        document.getElementById("answers").appendChild(div);
    });

    document.getElementById("feedback").innerHTML = "";
    document.getElementById("nextBtn").classList.add("hidden");
}

function submitAnswer() {

    if (selected === null) {
        alert("Select an answer");
        return;
    }

    let q = questions[current];

    categoryStats[q.section].total++;

    if (selected === q.correctAnswer) {
        score++;
        streak++;
        categoryStats[q.section].correct++;

        document.getElementById("feedback").innerHTML =
            `<p style="color:lightgreen;">Correct</p><p>${q.explanation}</p>`;

    } else {
        streak = 0;

        document.getElementById("feedback").innerHTML =
            `<p style="color:red;">Incorrect</p><p>${q.explanation}</p>`;
    }

    adjustDifficulty();

    document.getElementById("nextBtn").classList.remove("hidden");
}

function adjustDifficulty() {

    if (streak === 3) {
        difficulty = "Medium";
        alert("These must be too easy for you… let’s make it a little harder.");
    }

    if (streak === 6) {
        difficulty = "Hard";
        alert("You’re on fire. Increasing difficulty.");
    }
}

function nextQuestion() {

    current++;

    if (current >= questions.length) {
        endQuiz();
        return;
    }

    loadQuestion();
}

function endQuiz() {

    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("resultsScreen").classList.remove("hidden");

    let percent = Math.round((score / questions.length) * 100);

    document.getElementById("scorePercent").innerText = percent + "%";

    let breakdownHTML = "";

    for (let key in categoryStats) {
        let stat = categoryStats[key];
        if (stat.total > 0) {
            let pct = Math.round((stat.correct / stat.total) * 100);
            breakdownHTML += `<p>${key}: ${pct}%</p>`;
        }
    }

    document.getElementById("categoryBreakdown").innerHTML = breakdownHTML;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
// Define variables to hold data
let courseData;
let selectedTee = 'mens';
let selectedCourseId = '11819'; // Default course ID
let scores = {}; // Object to store scores for each player

// Fetch golf course data from the API
async function fetchCourseData(courseId) {
    const response = await fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseId}.txt`);
    const data = await response.json();
    courseData = data;
}

// Function to populate the scorecard table
function displayScorecard() {
    const scorecardSection = document.getElementById('scorecard');
    scorecardSection.innerHTML = ''; // Clear existing content

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    headerRow.innerHTML = '<th>Player</th><th>Hole</th><th>Par</th><th>Yardage</th>';
    for (let i = 1; i <= 18; i++) {
        const cell = headerRow.insertCell();
        cell.textContent = i;
    }
    // Add columns for holes 17 and 18
    headerRow.innerHTML += '<th>17</th><th>18</th>';

    for (let i = 1; i <= 4; i++) {
        const playerName = document.getElementById(`player${i}-name`).value;
        const playerRow = table.insertRow();
        playerRow.insertCell().textContent = playerName;
        for (let j = 1; j <= 18; j++) {
            const cell = playerRow.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.id = `player${i}-hole${j}`;
            cell.appendChild(input);
        }
        // Add empty cells for holes 17 and 18
        playerRow.insertCell();
        playerRow.insertCell();
    }
}

// Function to update total scores
function updateTotalScores() {
    for (let i = 1; i <= 4; i++) {
        let totalScore = 0;
        for (let j = 1; j <= 18; j++) {
            const score = parseInt(document.getElementById(`player${i}-hole${j}`).value) || 0;
            totalScore += score;
        }
        document.getElementById(`total-hole${i}`).value = totalScore;
    }
}
// Function to save scores for the current course to local storage
function saveScoresToLocalStorage() {
    localStorage.setItem(`course${selectedCourseId}-scores`, JSON.stringify(scores));
}
// Function to load scores for the current course from local storage
function loadScoresFromLocalStorage() {
    const savedScores = localStorage.getItem(`course${selectedCourseId}-scores`);
    if (savedScores) {
        scores = JSON.parse(savedScores);
    } else {
        scores = {}; // Initialize scores if not found in local storage
    }
}
// Function to handle player input and update scores
function updateScorecard() {
    displayScorecard();
    updateTotalScores();
}
// Function to handle course selection change
function handleCourseChange() {
    selectedCourseId = document.getElementById('course-select').value;
    loadScoresFromLocalStorage(); // Load scores for the selected course from local storage
    displayScorecard(); // Display the scorecard for the selected course
    updateTotalScores(); // Update total scores based on loaded scores
}
// Initialize the app
async function init() {
    await fetchCourseData(selectedCourseId); // Fetch data for the default course
    loadScoresFromLocalStorage(); // Load scores for the default course from local storage
    displayScorecard();
    updateTotalScores();
}
// Call the init function to start the app
init();
// Event listener for course selection change
document.getElementById('course-select').addEventListener('change', function() {
    handleCourseChange();
});
// Event listener for player input change
document.getElementById('scorecard').addEventListener('input', function() {
    updateTotalScores(); // Update total scores when player inputs change
    saveScoresToLocalStorage(); // Save scores to local storage when player inputs change
});

let courseData = {
    tees: {
        mens: [],
        ladies: [],
        seniors: []
    },
    players: [
        { name: 'Player 1', scores: [] },
        { name: 'Player 2', scores: [] },
        { name: 'Player 3', scores: [] },
        { name: 'Player 4', scores: [] }
    ],
    selectedTees: 'mens'
};

async function fetchCourseData(courseID) {
    try {
        const response = await fetch(`https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${courseID}.txt`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching course data:', error);
    }
}

async function initializeCourse(courseID) {
    const courseInfo = await fetchCourseData(courseID);
    if (courseInfo) {
        courseData.tees.mens = courseInfo.holes;
        courseData.tees.ladies = courseInfo.holes; // Assuming ladies play from the same tees
        courseData.tees.seniors = courseInfo.holes; // Assuming seniors play from the same tees
        renderScoreInfo();
        renderScorecard();
    }
}

function updateTees(selected) {
    courseData.selectedTees = selected;
    renderScoreInfo();
    renderScorecard();
}

function renderScoreInfo() {
    const scoreInfoTable = document.getElementById('score-info-table');
    scoreInfoTable.innerHTML = ''; // Clear existing rows
    // Add rows for hole yardage and par
    courseData.tees[courseData.selectedTees].forEach((hole, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>Hole ${index + 1}</td>
            <td>Yardage: ${hole.yardage}</td>
            <td>Par: ${hole.par}</td>
        `;
        scoreInfoTable.appendChild(row);
    });
}

function renderScorecard() {
    const scorecard = document.getElementById('scorecard');
    scorecard.innerHTML = ''; // Clear existing rows
    // Add header row for players
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th></th>`;
    courseData.players.forEach(player => {
        headerRow.innerHTML += `<th>${player.name}</th>`;
    });
    scorecard.appendChild(headerRow);
    // Add rows for each hole with player scores
    courseData.tees[courseData.selectedTees].forEach((hole, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Hole ${index + 1}</td>`;
        courseData.players.forEach(player => {
            const score = player.scores[index] || '';
            row.innerHTML += `<td contenteditable="true" oninput="updatePlayerScore(${index}, '${player.name}', this)">${score}</td>`;
        });
        scorecard.appendChild(row);
    });
    // Add total row
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = '<td>Total</td>';
    courseData.players.forEach(player => {
        const totalScore = player.scores.reduce((acc, score) => acc + parseInt(score) || 0, 0);
        totalRow.innerHTML += `<td>${totalScore}</td>`;
    });
    scorecard.appendChild(totalRow);
}

function updatePlayerScore(holeIndex, playerName, cell) {
    const score = parseInt(cell.textContent) || '';
    const player = 'players';
    // existing function definitions go here

    function updatePlayerScore(holeIndex, playerName, cell) {
    const score = parseInt(cell.textContent) || '';
    const player = courseData.players.find(player => player.name === playerName);
    if (player) {
        player.scores[holeIndex] = score;
        updateTotalRow();
    }
}}

function updateTotalRow() {
    const totalRow = document.querySelector('#scorecard .total-row');
    courseData.players.forEach((player, index) => {
        const totalScore = player.scores.reduce((acc, score) => acc + parseInt(score) || 0, 0);
        totalRow.children[index + 1].textContent = totalScore;
    });
}


// Initialize the course
initializeCourse(11819); // You can change the course ID as needed
// Sample texts for typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. Typing is an essential skill in today's digital world.",
    "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation.",
    "The only way to learn a new programming language is by writing programs in it. The more you code, the better you become at solving problems.",
    "Creativity is intelligence having fun. The computer was born to solve problems that did not exist before. Technology is best when it brings people together.",
    "In the middle of difficulty lies opportunity. The advance of technology is based on making it fit in so that you don't really even notice it."
];

// DOM elements
const textDisplay = document.getElementById('text-display');
const userInput = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const resultsSection = document.getElementById('results');
const timerProgress = document.getElementById('timer-progress');
const timerText = document.getElementById('time');
const timerTextDisplay = document.getElementById('timer-text');

// Stats elements
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const resultWpm = document.getElementById('result-wpm');
const resultAccuracy = document.getElementById('result-accuracy');
const resultCorrect = document.getElementById('result-correct');
const resultTotal = document.getElementById('result-total');
const resultTime = document.getElementById('result-time');

// Test variables
let currentText = '';
let timer;
let timeLeft = 60;
let testStarted = false;
let totalTyped = 0;
let correctTyped = 0;
let startTime;
let endTime;

// Initialize the app
function init() {
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    userInput.addEventListener('input', checkInput);
}

// Start the typing test
function startTest() {
    if (testStarted) return;
    
    testStarted = true;
    currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    displayText();
    
    userInput.disabled = false;
    userInput.placeholder = "Start typing...";
    userInput.focus();
    userInput.value = '';
    
    startBtn.classList.add('hidden');
    resetBtn.classList.remove('hidden');
    
    // Start timer
    startTime = new Date().getTime();
    timer = setInterval(updateTimer, 1000);
    
    // Reset stats
    totalTyped = 0;
    correctTyped = 0;
    updateStats();
}

// Reset the typing test
function resetTest() {
    clearInterval(timer);
    testStarted = false;
    timeLeft = 60;
    
    userInput.disabled = true;
    userInput.value = '';
    userInput.placeholder = "Start typing here when the test begins...";
    
    startBtn.classList.remove('hidden');
    resetBtn.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    timerProgress.style.width = '100%';
    timerText.textContent = '60s';
    timerTextDisplay.textContent = '1:00';
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100%';
}

// Display the text to type
function displayText() {
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textDisplay.appendChild(span);
    });
    
    // Highlight first character
    if (textDisplay.firstChild) {
        textDisplay.firstChild.classList.add('current');
    }
}

// Check user input against the text
function checkInput() {
    const inputText = userInput.value;
    totalTyped = inputText.length;
    
    // Reset all spans to default
    const spans = textDisplay.querySelectorAll('span');
    spans.forEach(span => {
        span.className = '';
    });
    
    let correctCount = 0;
    
    // Check each character
    for (let i = 0; i < inputText.length; i++) {
        if (i < spans.length) {
            if (inputText[i] === spans[i].textContent) {
                spans[i].classList.add('correct');
                correctCount++;
            } else {
                spans[i].classList.add('incorrect');
            }
        }
    }
    
    correctTyped = correctCount;
    
    // Highlight current character
    if (inputText.length < spans.length) {
        spans[inputText.length].classList.add('current');
    }
    
    updateStats();
    
    // End test if all characters are typed
    if (inputText.length === currentText.length) {
        endTest();
    }
}

// Update timer
function updateTimer() {
    timeLeft--;
    
    if (timeLeft <= 0) {
        endTest();
        return;
    }
    
    const progressPercentage = (timeLeft / 60) * 100;
    timerProgress.style.width = `${progressPercentage}%`;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerText.textContent = `${timeLeft}s`;
    timerTextDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Update statistics
function updateStats() {
    // Calculate WPM (5 characters = 1 word)
    const elapsedTime = (60 - timeLeft) || 1; // Prevent division by zero
    const wpm = Math.round((correctTyped / 5) / (elapsedTime / 60));
    wpmDisplay.textContent = wpm;
    
    // Calculate accuracy
    const accuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
    accuracyDisplay.textContent = `${accuracy}%`;
}

// End the typing test
function endTest() {
    clearInterval(timer);
    testStarted = false;
    endTime = new Date().getTime();
    
    userInput.disabled = true;
    resultsSection.classList.remove('hidden');
    
    // Calculate final stats
    const totalTime = Math.max(1, (endTime - startTime) / 1000);
    const finalWpm = Math.round((correctTyped / 5) / (totalTime / 60));
    const finalAccuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
    
    // Display final results
    resultWpm.textContent = finalWpm;
    resultAccuracy.textContent = `${finalAccuracy}%`;
    resultCorrect.textContent = correctTyped;
    resultTotal.textContent = totalTyped;
    resultTime.textContent = `${Math.round(totalTime)}s`;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
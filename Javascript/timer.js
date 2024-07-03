let timerInterval;
let timerDuration = 180; // 3 minutes in seconds

updateTimerDisplay();
        
function startStopTimer() {
if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
} else {
    timerInterval = setInterval(() => {
        if (timerDuration > 0) {
            timerDuration--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            playAlarm(); // Play alarm when timer reaches 0
        }
    }, 1000);
}
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerDuration = 180; // Reset timer to 3 minutes
    updateTimerDisplay();
    stopAlarm(); // Stop alarm when timer is reset
}

function playAlarm() {
    const alarmElement = document.getElementById('alarmSound');
    alarmElement.currentTime = 0;
    alarmElement.play();
}

function stopAlarm() {
    const alarmElement = document.getElementById('alarmSound');
    alarmElement.pause();
    alarmElement.currentTime = 0;
}

function toggleSound() {
    const soundCheckbox = document.getElementById('soundToggle');
    const audioElements = document.querySelectorAll('audio');

    audioElements.forEach(audio => {
        if (soundCheckbox.checked) {
            audio.muted = false;
        } else {
            audio.muted = true;
        }
    });
}
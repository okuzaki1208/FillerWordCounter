let timerInterval;
let timerDuration = 180; // 3 minutes in seconds
let initialTimerDuration = 180; // Variable to store the initial timer duration

updateTimerDisplay();

function startStopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    } else {
        // Save the current timer duration as the initial duration
        initialTimerDuration = timerDuration;
        
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
    // Reset timer to the initial duration
    timerDuration = initialTimerDuration;
    updateTimerDisplay();
    stopAlarm(); // Stop alarm when timer is reset
}

function adjustTime(unit, amount) {
    if (unit === 'hours') {
        timerDuration += amount * 3600;
    } else if (unit === 'minutes') {
        timerDuration += amount * 60;
    } else if (unit === 'seconds') {
        timerDuration += amount;
    }
    if (timerDuration < 0) timerDuration = 0;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const hours = Math.floor(timerDuration / 3600);
    const minutes = Math.floor((timerDuration % 3600) / 60);
    const seconds = timerDuration % 60;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = formattedTime;
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

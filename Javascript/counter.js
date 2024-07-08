let recognition;
let fillerCount = 0;
const fillerWords = [
    'えっと', 'あの ', 'うん ', 'その ',
    'えー', 'あー', 'でー', 'まあ',
    'おー', 'なんか',
    'て言うか', 'と言うか',
    'ていうか', 'というか',
    'いや ', 'じゃあ',
    'ほら'
];
const transcriptBox = document.getElementById('transcriptBox');
const fillerOptions = document.getElementById('fillerOptions');
let activeFillers = new Set(fillerWords);
let fillerWordCounts = {};
let interimTranscript = '';
let timeoutId;
let totalTranscript = ''; // To store the total transcript

createFillerOptions();
startRecognition();

fillerWords.forEach(word => {
    fillerWordCounts[word] = 0;
});

function createFillerOptions() {
    fillerWords.forEach(word => {
        const option = document.createElement('div');
        option.className = 'filler-option';
        option.innerHTML = `
            <label>
                <input type="checkbox" value="${word}" checked>
                ${word}
            </label>
            <span id="count-${word}" class="individual-counter">0</span>
        `;
        option.querySelector('input').addEventListener('change', (e) => {
            if (e.target.checked) {
                activeFillers.add(word);
            } else {
                activeFillers.delete(word);
            }
        });
        fillerOptions.appendChild(option);
    });
}

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = function(event) {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;

        if (transcript.trim() !== '') { // Check if transcript is not empty
            processTranscript(transcript);
            totalTranscript += transcript; // Add to total transcript
        }

        // Clear previous timeout and set a new one
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            recognition.stop();
            console.log("声が小さいか、話し方が早すぎるようです。落ち着いてハッキリと話しましょう！");
        }, 3000);
    };

    recognition.onend = function() {
        recognition.start();
    };

    recognition.start();
}

let lastDetectionTime = {}; // Object to store last detection time of each word

function processTranscript(transcript) {
    updateTranscriptBox(transcript);

    activeFillers.forEach(word => {
        const regex = new RegExp(word, 'g');
        const matches = transcript.match(regex);

        if (matches) {
            const currentTime = Date.now();

            // Check if enough time has passed since last detection
            if (!lastDetectionTime[word] || (currentTime - lastDetectionTime[word] > 5000)) {
                const count = matches.length;
                fillerCount += count;
                fillerWordCounts[word] += count;
                updateCounter();
                updateIndividualCounter(word);
                highlightFillerOption(word);
                playSoundEffect(); // Play sound effect when a filler word is detected

                // Update last detection time for this word
                lastDetectionTime[word] = currentTime;
            }
        }
    });
}

function updateCounter() {
    const counterElement = document.getElementById('fillerCount');
    counterElement.textContent = fillerCount;
    counterElement.classList.add('highlight');
    setTimeout(() => {
        counterElement.classList.remove('highlight');
    }, 1500);
}

function updateIndividualCounter(word) {
    const counterElement = document.getElementById(`count-${word}`);
    counterElement.textContent = fillerWordCounts[word];
    counterElement.classList.add('highlight');
    setTimeout(() => {
        counterElement.classList.remove('highlight');
    }, 2000);
}

function updateTranscriptBox(text) {
    transcriptBox.textContent = text;
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
}

function highlightFillerOption(word) {
    const optionElement = document.querySelector(`[value="${word}"]`).parentElement.parentElement;
    optionElement.classList.add('highlight');
    setTimeout(() => {
        optionElement.classList.remove('highlight');
    }, 1000);
}

function playSoundEffect() {
    const audioElement = document.getElementById('seSound');
    audioElement.currentTime = 0;
    audioElement.play();
}

function resetCounters() {
    fillerCount = 0;
    fillerWords.forEach(word => {
        fillerWordCounts[word] = 0;
        updateIndividualCounter(word);
    });
    updateCounter();
}

document.addEventListener('DOMContentLoaded', function() {
    const addWordButton = document.getElementById('addWordButton');
    const wordInput = document.getElementById('wordInput');

    // Function to add word when Enter key is pressed
    wordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            addWord();
        }
    });

    addWordButton.addEventListener('click', addWord); // Call addWord function when button is clicked

    function addWord() {
        const newWord = wordInput.value.trim();
        if (newWord !== '') {
            fillerWords.push(newWord);
            fillerWordCounts[newWord] = 0;
            activeFillers.add(newWord);
            wordInput.value = ''; // Clear input field
            updateFillerOptions(); // Update options with preserved checkbox state
        }
    }

    // Function to update filler options with preserved checkbox state
    function updateFillerOptions() {
        const currentActiveFillers = new Set(activeFillers); // Preserve current active fillers

        // Save current counts before clearing fillerOptions
        const currentCounts = {};
        fillerWords.forEach(word => {
            currentCounts[word] = fillerWordCounts[word] || 0;
        });

        fillerOptions.innerHTML = ''; // Clear current options

        fillerWords.forEach(word => {
            const option = document.createElement('div');
            option.className = 'filler-option';
            const isChecked = currentActiveFillers.has(word); // Check if word was previously active

            option.innerHTML = `
                <label>
                    <input type="checkbox" value="${word}" ${isChecked ? 'checked' : ''}>
                    ${word}
                </label>
                <span id="count-${word}" class="individual-counter">${currentCounts[word]}</span>
            `;
            option.querySelector('input').addEventListener('change', (e) => {
                if (e.target.checked) {
                    activeFillers.add(word);
                } else {
                    activeFillers.delete(word);
                }
            });
            fillerOptions.appendChild(option);
        });
    }

// Interval to check text length every 5 seconds
setInterval(() => {
    if (totalTranscript.length >= 500) {
        console.log(`話し方が早すぎます！もっとゆっくり！ [判定された文字数: ${totalTranscript.length}]`);
        totalTranscript = ''; // Clear total transcript
        totalTranscript.length = 0;
        updateTranscriptBox(''); // Clear the display transcript
    }
    
}, 5000);

// Reset length and totalTranscript on page load
totalTranscript = ''; // Clear total transcript
totalTranscript.length = 0;
updateTranscriptBox(''); // Clear the display transcript
});

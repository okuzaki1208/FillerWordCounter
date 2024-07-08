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
let startTime;
let totalTranscriptLength = 0;

createFillerOptions();
startRecognition();
resetTranscriptAndSpeedDetectionPeriodically();

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

    recognition.onstart = function() {
        startTime = Date.now();
        console.log('Recognition started.');
    };

    recognition.onresult = function(event) {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;

        if (transcript.trim() !== '') { // Check if transcript is not empty
            processTranscript(transcript);
        }

        // Update total transcript length
        totalTranscriptLength += transcript.length;
        // console.log(`現在のトータルトランスクリプト長さ: ${totalTranscriptLength} 文字`);
    };

    recognition.onend = function() {
        recognition.start();
        console.log('Recognition restarted.');
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
                console.log(`'${word}' 検出: ${count} 回 (${fillerWordCounts[word]} 総数)`);
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

function resetTranscript() {
    interimTranscript = '';
    totalTranscriptLength = 0;
    // console.log('トランスクリプトをリセットしました。');
}

function resetSpeedDetection() {
    startTime = Date.now(); // Reset start time for speed calculation
    totalTranscriptLength = 0; // Reset total transcript length
    // console.log('速度判定をリセットしました。');
}

let sensitivity = 50; // Initial sensitivity value

document.addEventListener('DOMContentLoaded', function() {
    const speedMonitor = document.getElementById('speedMonitor');
    const sensitivityValue = document.getElementById('sensitivityValue');
    const decreaseButton = document.getElementById('decreaseSensitivity');
    const increaseButton = document.getElementById('increaseSensitivity');

    speedMonitor.textContent = '(-.-- 字/秒)';
    sensitivityValue.textContent = sensitivity;

    let decreaseTimeout;
    let increaseTimeout;
    const initialDelay = 500; // Initial delay in milliseconds
    const repeatDelay = 50; // Repeat delay in milliseconds

    // Decrease sensitivity button long press handling
    decreaseButton.addEventListener('mousedown', function() {
        decreaseTimeout = setTimeout(function() {
            decreaseSensitivity();
            decreaseTimeout = setInterval(decreaseSensitivity, repeatDelay);
        }, initialDelay);
    });

    decreaseButton.addEventListener('mouseup', function() {
        clearTimeout(decreaseTimeout);
        clearInterval(decreaseTimeout);
    });

    decreaseButton.addEventListener('mouseleave', function() {
        clearTimeout(decreaseTimeout);
        clearInterval(decreaseTimeout);
    });

    // Increase sensitivity button long press handling
    increaseButton.addEventListener('mousedown', function() {
        increaseTimeout = setTimeout(function() {
            increaseSensitivity();
            increaseTimeout = setInterval(increaseSensitivity, repeatDelay);
        }, initialDelay);
    });

    increaseButton.addEventListener('mouseup', function() {
        clearTimeout(increaseTimeout);
        clearInterval(increaseTimeout);
    });

    increaseButton.addEventListener('mouseleave', function() {
        clearTimeout(increaseTimeout);
        clearInterval(increaseTimeout);
    });

    decreaseButton.addEventListener('click', decreaseSensitivity);
    increaseButton.addEventListener('click', increaseSensitivity);
});

function decreaseSensitivity() {
    if (sensitivity > 1) {
        sensitivity--;
        sensitivityValue.textContent = sensitivity;
        calculateAndLogSpeed();
    }
}

function increaseSensitivity() {
    if (sensitivity < 100) {
        sensitivity++;
        sensitivityValue.textContent = sensitivity;
        calculateAndLogSpeed();
    }
}

function calculateAndLogSpeed() {
    // Skip speed detection if totalTranscriptLength is 100 or less
    if (totalTranscriptLength <= 100) {
        // console.log(`トータルトランスクリプト長さが短すぎて、速度判定をスキップします。`);
        return;
    }

    let speakingSpeed = totalTranscriptLength / (100 - sensitivity); // characters per second over 15000ms

    // Define a threshold for speaking speed (adjust as needed)
    const speedThreshold = 6.00; // example: 6.00 characters per second

    if (speakingSpeed > speedThreshold) {
        document.getElementById('speedMessage').textContent = '話す速度が速すぎます。落ち着いてスピーチしてください。';
        // document.getElementById('speedMessage').style.display = 'block';
        document.getElementById('speedMessage').style.color = 'red';
    } else {
        document.getElementById('speedMessage').style.color = '#f0f0f0';
        // document.getElementById('speedMessage').style.display = 'none';
    }

    if (speakingSpeed > 9.99) {
        speakingSpeed = 9.99; // Cap speed at 9.99 if it exceeds 10
    }

    const speedMonitor = document.getElementById('speedMonitor');
    if (speakingSpeed > speedThreshold) {
        speedMonitor.style.color = 'red'; // Change color to red if speed exceeds threshold
    } else {
        speedMonitor.style.color = 'black'; // Reset color to black if speed is below threshold
    }

    speedMonitor.textContent = `(${speakingSpeed.toFixed(2)} 字/秒)`;
    // console.log(`(${speakingSpeed.toFixed(2)} 字/秒)`);
    
}


function resetTranscriptAndSpeedDetectionPeriodically() {
    setInterval(() => {
        calculateAndLogSpeed();
        resetTranscript();
        resetSpeedDetection();
    }, 3000);
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
});

// メンバーリストの定義
const members = [
    "奥崎",
    "梅田さん",
    "亀ヶ澤さん",
    "小山明美さん",
    "小山由紀子さん",
    "錦さん",
    "西崎さん",
    "平山さん",
    "向平さん",
    "村山さん",
    "和田さん"
];

// 日直の選択肢を取得
const dailySpeakerSelect = document.getElementById('dailySpeaker');

// スピーチ順をランダマイズする関数
function randomizeOrder() {
    // 日直の選択肢を取得
    const dailySpeaker = dailySpeakerSelect.value;

    // 日直を除外したメンバーリストを作成
    const filteredMembers = members.filter(member => member !== dailySpeaker);

    // メンバーリストをシャッフルする
    const randomizedMembers = shuffleArray(filteredMembers);

    // 表示用の要素を取得
    const randomizedOrder = document.getElementById('randomizedOrder');

    // メンバーリストを縦に表示するためのHTML文字列を生成
    const membersList = randomizedMembers.map(member => `<p>${member}</p>`).join('');

    // HTMLに挿入
    randomizedOrder.innerHTML = membersList;

    // ランダマイズ後のスタイル変更
    const speechOrder = document.getElementById('randomizedOrder');
    speechOrder.style.backgroundColor = '#ffffff'; // 背景色を黒に設定
    speechOrder.style.border = '1px solid #ccc'; // 境界線を黒に設定
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

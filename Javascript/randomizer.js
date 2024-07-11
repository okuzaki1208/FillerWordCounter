// メンバーリストの定義
let members = [
    "奥崎",
    "梅田",
    "亀ヶ澤",
    "小山明美",
    "小山由紀子",
    "錦",
    "西崎",
    "向平",
    "平山",
    "村山",
    "和田"
];

// 日直の選択肢を取得
const dailySpeakerSelect = document.getElementById('dailySpeaker');
const addHonorificDailySpeakerCheckbox = document.getElementById('addHonorificDailySpeaker');
const addHonorificSpeechOrderCheckbox = document.getElementById('addHonorificSpeechOrder');
const honorificDailySpeakerInput = document.getElementById('honorificDailySpeaker');
const honorificSpeechOrderInput = document.getElementById('honorificSpeechOrder');
const memberNamesTextarea = document.getElementById('memberNames');
const numberOfMembersInput = document.getElementById('numberOfMembers');
const numberOfMembersEnablerCheckbox = document.getElementById('numberOfMembersEnabler');

// ページロード時に日直の選択肢とメンバーの名前を生成
window.onload = function() {
    // 日直の選択肢を生成
    members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        dailySpeakerSelect.appendChild(option);
    });

    // メンバーの名前をテキストエリアに表示
    memberNamesTextarea.value = members.join('\n');
};

// スピーチ順をランダマイズする関数
function randomizeOrder() {
    // 日直の選択肢を取得
    const dailySpeaker = dailySpeakerSelect.value;

    // 日直を除外したメンバーリストを作成
    let filteredMembers = members.filter(member => member !== dailySpeaker);
    
    // メンバーの名前を更新
    updateMembersList();

    // メンバーリストをシャッフルする
    const randomizedMembers = shuffleArray(filteredMembers);

    // メンバーリストを保存しておく
    window.randomizedMembers = randomizedMembers;

    // スピーチ順の表示を更新
    updateSpeechOrder();
}

// メンバーリストを更新する関数
function updateMembersList() {
    // メンバーの名前を更新
    const newMemberNames = memberNamesTextarea.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    if (numberOfMembersEnablerCheckbox.checked) {
        // メンバーの人数が有効化されている場合
        const filteredMembers = newMemberNames.filter(member => member !== dailySpeakerSelect.value); // 日直を除外
        members = shuffleArray(filteredMembers).slice(0, numberOfMembersInput.value);
    } else {
        // メンバーの人数が無効化されている場合
        members = shuffleArray(newMemberNames).slice(0, 100);
    }
}

// スピーチ順の表示を更新する関数
function updateSpeechOrder() {
    // 表示用の要素を取得
    const randomizedOrder = document.getElementById('randomizedOrder');

    // 敬称を付けるかどうかチェックボックスの状態を確認
    const addHonorificSpeechOrder = addHonorificSpeechOrderCheckbox.checked;
    
    // メンバーリストを縦に表示するためのHTML文字列を生成
    const membersList = window.randomizedMembers.map(member => `<p>${addHonorificSpeechOrder ? member + honorificSpeechOrderInput.value : member}</p>`).join('');

    // HTMLに挿入
    randomizedOrder.innerHTML = membersList;

    // ランダマイズ後のスタイル変更
    const speechOrder = document.getElementById('randomizedOrder');
    speechOrder.style.backgroundColor = '#ffffff'; // 背景色を白に設定
    speechOrder.style.border = '1px solid #ccc'; // 境界線を設定
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

// 敬称チェックボックスの変更に応じて日直の表示を更新
addHonorificDailySpeakerCheckbox.addEventListener('change', function() {
    updateDailySpeaker();
});

// 日直の表示を更新する関数
function updateDailySpeaker() {
    const selectedOption = dailySpeakerSelect.options[dailySpeakerSelect.selectedIndex];
    const addHonorificDailySpeaker = addHonorificDailySpeakerCheckbox.checked;
    selectedOption.textContent = addHonorificDailySpeaker ? selectedOption.value + honorificDailySpeakerInput.value : selectedOption.value;
}

// 敬称チェックボックスの変更に応じてスピーチ順の表示を更新
addHonorificSpeechOrderCheckbox.addEventListener('change', function() {
    updateSpeechOrder();
});

// 日直が変更されたときに日直の表示を更新するイベントリスナー
dailySpeakerSelect.addEventListener('change', function() {
    resetDailySpeakerHonorifics();
    updateDailySpeaker();
});

// 日直の敬称をリセットする関数
function resetDailySpeakerHonorifics() {
    for (let i = 0; i < dailySpeakerSelect.options.length; i++) {
        dailySpeakerSelect.options[i].textContent = dailySpeakerSelect.options[i].value;
    }
}

// 高度な設定をトグルする関数
function toggleAdvancedSettings() {
    const advancedSettings = document.getElementById('advancedSettings');
    if (advancedSettings.style.display === 'none') {
        advancedSettings.style.display = 'block';
    } else {
        advancedSettings.style.display = 'none';
    }
}

// テキストエリアの内容をプルダウンメニューに適用する関数
function applyTextToDropdown() {
    const memberNamesTextarea = document.getElementById('memberNames');
    const memberNamesDropdown = document.getElementById('dailySpeaker');

    // テキストエリアの値を改行で分割して、プルダウンメニューのオプションを更新
    const names = memberNamesTextarea.value.split('\n').map(name => name.trim()).filter(name => name !== '');
    
    // 現在のプルダウンメニューをクリア
    memberNamesDropdown.innerHTML = '';

    // 新しいオプションを追加
    names.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        memberNamesDropdown.appendChild(option);
    });
}

    // 高度な設定の表示/非表示を切り替える関数
    function toggleAdvancedSettings() {
        var advancedSettingsDiv = document.getElementById('advancedSettings');
        var advancedSettingsToggleBtn = document.getElementById('advancedSettingsToggleBtn');
        
        if (advancedSettingsDiv.style.display === 'none') {
            advancedSettingsDiv.style.display = 'block';
            advancedSettingsToggleBtn.textContent = '閉じる';
        } else {
            advancedSettingsDiv.style.display = 'none';
            advancedSettingsToggleBtn.textContent = '高度な設定を開く';
        }
    }

// メンバーの人数設定をトグルする関数
function toggleNumberOfMembers() {
    const numberOfMembersInput = document.getElementById('numberOfMembers');
    numberOfMembersInput.disabled = !numberOfMembersEnablerCheckbox.checked;

    // メンバーリストを更新
    updateMembersList();

    // スピーチ順をランダマイズ
    randomizeOrder();
}

// ページロード時に日直の表示を更新
updateDailySpeaker();
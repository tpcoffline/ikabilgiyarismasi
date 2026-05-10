// --- Ses Üretici (Web Audio API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let suspenseOscillator = null, suspenseGain = null, suspenseLfo = null;

function initAudio() { if (audioCtx.state === 'suspended') audioCtx.resume(); }

function playSuspenseSound() {
    stopSuspenseSound();
    suspenseOscillator = audioCtx.createOscillator();
    suspenseGain = audioCtx.createGain();
    suspenseLfo = audioCtx.createOscillator();
    suspenseOscillator.type = 'triangle'; suspenseOscillator.frequency.value = 110;
    suspenseLfo.type = 'sine'; suspenseLfo.frequency.value = 2.5;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 0.5;
    suspenseLfo.connect(lfoGain); lfoGain.connect(suspenseGain.gain);
    suspenseOscillator.connect(suspenseGain); suspenseGain.connect(audioCtx.destination);
    suspenseGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    suspenseOscillator.start(); suspenseLfo.start();
}

function stopSuspenseSound() {
    if (suspenseOscillator) {
        suspenseOscillator.stop(); suspenseLfo.stop();
        suspenseOscillator.disconnect(); suspenseGain.disconnect();
        suspenseOscillator = null;
    }
}

function playCorrectSound() {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);
    osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2);
    osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.start(); osc.stop(audioCtx.currentTime + 0.6);
}

function playWrongSound() {
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.start(); osc.stop(audioCtx.currentTime + 0.3);
}

function playWinSound() {
    [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination); osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + i * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.15 + 0.8);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.8);
    });
}

// --- Oyun Değişkenleri ---
// Sorular questions.js dosyasından yüklenir (fileQuestions değişkeni)

let questions = [], currentQuestionIndex = 0, revealedPieces = 0;
const totalPieces = 5;
let askedQuestions = [], isAnswering = false;
let gameStartTime = 0, questionStartTime = 0, totalTimeSpent = 0, correctAnswers = 0;
let currentGameQuestions = []; // Bu turda sorulacak sorular
let currentGameQuestionIdx = 0;
let anonymousCounter = 0;

// --- Ayarlar ---
let quizSettings = { questionCount: 5, difficultyMap: [0,0,1,1,2], timePerQuestion: 15 };
// 0=kolay, 1=orta, 2=zor

function loadSettings() {
    const saved = localStorage.getItem('ika_quiz_settings');
    if (saved) quizSettings = JSON.parse(saved);
    else saveSettings_data();
}

function saveSettings_data() {
    localStorage.setItem('ika_quiz_settings', JSON.stringify(quizSettings));
}

// --- Leaderboard ---
let leaderboard = [];

function loadLeaderboard() {
    const saved = localStorage.getItem('ika_leaderboard');
    if (saved) leaderboard = JSON.parse(saved);
    const ac = localStorage.getItem('ika_anon_counter');
    if (ac) anonymousCounter = parseInt(ac);
}

function saveLeaderboard() {
    localStorage.setItem('ika_leaderboard', JSON.stringify(leaderboard));
    localStorage.setItem('ika_anon_counter', anonymousCounter.toString());
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    if (leaderboard.length === 0) {
        list.innerHTML = '<div class="lb-empty"><i class="fas fa-medal"></i> Henüz kimse yarışmadı!</div>';
        return;
    }
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    list.innerHTML = sorted.map((entry, i) => {
        const rankClass = i < 3 ? `lb-rank-${i+1}` : 'lb-rank-default';
        return `<div class="lb-entry">
            <div class="lb-rank ${rankClass}">${i+1}</div>
            <span class="lb-name">${entry.name}</span>
            <span class="lb-score">${entry.score} puan</span>
            <span class="lb-details">${entry.correct}/${entry.total} · ${entry.time}s</span>
        </div>`;
    }).join('');
}

function renderAdminLeaderboard() {
    const list = document.getElementById('admin-leaderboard-list');
    if (!list) return;
    const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
    if (sorted.length === 0) {
        list.innerHTML = '<div class="lb-empty">Kayıt yok</div>';
        return;
    }
    list.innerHTML = sorted.map((e, i) =>
        `<div class="admin-lb-entry"><span>${i+1}. ${e.name}</span><span>${e.score} puan</span></div>`
    ).join('');
}

function clearLeaderboard() {
    if (confirm('Tüm sıralama verilerini silmek istediğinize emin misiniz?')) {
        leaderboard = []; anonymousCounter = 0;
        saveLeaderboard(); renderAdminLeaderboard(); renderLeaderboard();
    }
}

// --- Skor Hesaplama ---
function calculateScore(correctCount, totalCount, timeSeconds) {
    // Her doğru cevap: 100 * zorluk çarpanı (kolay=1, orta=1.5, zor=2)
    // Süre bonusu: soru başı ortalama 10 saniyeden hızlı cevaplarsan bonus
    let baseScore = 0;
    currentGameQuestions.forEach((q, i) => {
        if (i < correctCount) {
            const mult = q.difficulty === 'zor' ? 2 : q.difficulty === 'orta' ? 1.5 : 1;
            baseScore += 100 * mult;
        }
    });
    const avgTimePerQ = totalCount > 0 ? timeSeconds / totalCount : 0;
    const timeBonus = Math.max(0, Math.round((10 - avgTimePerQ) * 5 * correctCount));
    return Math.round(baseScore + timeBonus);
}

function getUniqueName(name) {
    const existing = leaderboard.filter(e => e.name === name || e.name.match(new RegExp(`^${escapeRegex(name)}\\d+$`)));
    if (existing.length === 0) return name;
    // Aynı isim var, numaralandır
    const exactMatch = leaderboard.some(e => e.name === name);
    if (!exactMatch) return name;
    // name1, name2... bul
    let num = 1;
    while (leaderboard.some(e => e.name === name + num)) num++;
    return name + num;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Skor Kaydetme ---
function saveScore(withName) {
    let name = document.getElementById('win-name-input').value.trim();
    if (!withName || !name) {
        anonymousCounter++;
        name = 'Yarışmacı' + anonymousCounter;
    } else {
        name = getUniqueName(name);
    }
    const time = (totalTimeSpent / 1000).toFixed(1);
    const score = calculateScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
    leaderboard.push({ name, score, correct: correctAnswers, total: currentGameQuestions.length, time });
    saveLeaderboard(); returnToMainMenu();
}

function saveScoreLose(withName) {
    let name = document.getElementById('lose-name-input').value.trim();
    if (!withName || !name) {
        anonymousCounter++;
        name = 'Yarışmacı' + anonymousCounter;
    } else {
        name = getUniqueName(name);
    }
    const time = (totalTimeSpent / 1000).toFixed(1);
    const score = calculateScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
    leaderboard.push({ name, score, correct: correctAnswers, total: currentGameQuestions.length, time });
    saveLeaderboard(); returnToMainMenu();
}

function skipAndReturn() { returnToMainMenu(); }

// --- Sorular ---
window.onload = () => { loadQuestions(); loadSettings(); loadLeaderboard(); renderLeaderboard(); };

function loadQuestions() {
    // questions.js dosyasından direkt yüklenir
    questions = typeof fileQuestions !== 'undefined' ? [...fileQuestions] : [];
    questions.forEach(q => { if (!q.difficulty) q.difficulty = 'kolay'; });
}

function saveQuestions() {
    // Admin panelinden eklenen sorular sadece o oturumda geçerli
    // Kalıcı olması için Dışa Aktar ile questions.js dosyasını güncelle
}

// --- Ana Menü ---
function returnToMainMenu() {
    stopSuspenseSound(); stopTimer();
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('lose-screen').classList.add('hidden');
    document.getElementById('timer-bar-container').classList.add('hidden');
    const puzzle = document.getElementById('puzzle-container');
    puzzle.style.opacity = "0"; puzzle.classList.add('hidden');
    document.getElementById('main-menu-area').classList.remove('hidden');
    const logoContainer = document.getElementById('logo-container');
    logoContainer.classList.remove('logo-top'); logoContainer.classList.add('logo-center');
    revealedPieces = 0; askedQuestions = []; isAnswering = false;
    correctAnswers = 0; totalTimeSpent = 0;
    renderLeaderboard();
}

// --- Timer ---
let timerInterval = null;

let pausedTime = 0; // Animasyonlarda duraklatılan toplam süre
let pauseStart = 0;

function startTimer() {
    questionStartTime = Date.now();
    pausedTime = 0;
    const maxTime = quizSettings.questionCount * (quizSettings.timePerQuestion || 15);
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - gameStartTime - pausedTime) / 1000;
        document.getElementById('timer-text').textContent = elapsed.toFixed(1) + 's';
        // Bar dolu başlar, azalır
        const remaining = Math.max(0, 100 - (elapsed / maxTime) * 100);
        document.getElementById('timer-bar').style.width = remaining + '%';
        // Renk geçişi: yeşil → sarı → kırmızı
        if (remaining > 50) {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #00ffcc, #00cc66)';
        } else if (remaining > 25) {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #ffcc00, #ff9900)';
        } else {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #ff3333, #cc0000)';
        }
    }, 100);
}

function pauseTimer() {
    pauseStart = Date.now();
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function resumeTimer() {
    if (pauseStart) {
        pausedTime += Date.now() - pauseStart;
        pauseStart = 0;
    }
    const maxTime = quizSettings.questionCount * (quizSettings.timePerQuestion || 15);
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - gameStartTime - pausedTime) / 1000;
        document.getElementById('timer-text').textContent = elapsed.toFixed(1) + 's';
        const remaining = Math.max(0, 100 - (elapsed / maxTime) * 100);
        document.getElementById('timer-bar').style.width = remaining + '%';
        if (remaining > 50) {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #00ffcc, #00cc66)';
        } else if (remaining > 25) {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #ffcc00, #ff9900)';
        } else {
            document.getElementById('timer-bar').style.background = 'linear-gradient(90deg, #ff3333, #cc0000)';
        }
    }, 100);
}

function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    pauseStart = 0;
}

// --- Oyun Başlatma ---
function selectGameQuestions() {
    const count = quizSettings.questionCount;
    const diffMap = quizSettings.difficultyMap;
    const diffNames = ['kolay', 'orta', 'zor'];
    let selected = [];

    for (let i = 0; i < count; i++) {
        const targetDiff = diffNames[diffMap[i] || 0];
        const pool = questions.filter((q, qi) => q.difficulty === targetDiff && !selected.includes(qi));
        if (pool.length > 0) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            selected.push(questions.indexOf(pick));
        } else {
            // Yeterli soru yoksa herhangi birinden al
            const fallback = questions.filter((q, qi) => !selected.includes(qi));
            if (fallback.length > 0) {
                const pick = fallback[Math.floor(Math.random() * fallback.length)];
                selected.push(questions.indexOf(pick));
            }
        }
    }
    currentGameQuestions = selected.map(i => questions[i]);
    currentGameQuestionIdx = 0;
}

function startAnimation() {
    const neededCount = quizSettings.questionCount;
    if (questions.length < neededCount) {
        alert(`Oyuna başlamak için en az ${neededCount} soru eklemelisiniz! (Şu an: ${questions.length})`);
        return;
    }
    initAudio();
    document.getElementById('main-menu-area').classList.add('hidden');
    const logoContainer = document.getElementById('logo-container');
    logoContainer.classList.remove('logo-center'); logoContainer.classList.add('logo-top');

    setTimeout(() => {
        const puzzle = document.getElementById('puzzle-container');
        puzzle.classList.remove('hidden');
        setTimeout(() => { puzzle.style.opacity = "1"; }, 50);
        startGame();
    }, 1000);
}

function startGame() {
    revealedPieces = 0; askedQuestions = []; correctAnswers = 0; totalTimeSpent = 0; pausedTime = 0;
    selectGameQuestions();
    document.getElementById('win-screen').classList.add('hidden');
    document.getElementById('lose-screen').classList.add('hidden');
    document.getElementById('quiz-area').classList.remove('hidden');
    document.getElementById('timer-bar-container').classList.remove('hidden');

    for (let i = 1; i <= totalPieces; i++) {
        const piece = document.querySelector(`.piece-${i}`);
        piece.classList.remove('piece-revealed', 'piece-flashing');
    }

    gameStartTime = Date.now();
    document.getElementById('timer-bar').style.width = '100%';
    startTimer();
    triggerQuestionAnimation();
}

function triggerQuestionAnimation() {
    isAnswering = true;
    const puzzle = document.getElementById('puzzle-container');
    const quizArea = document.getElementById('quiz-area');
    puzzle.style.transform = "translateY(50px) scale(0.95)";
    quizArea.style.opacity = "0"; quizArea.style.transform = "translateY(20px)";

    setTimeout(() => {
        loadNextQuestionData();
        puzzle.style.transform = "translateY(0) scale(1)";
        quizArea.style.opacity = "1"; quizArea.style.transform = "translateY(0)";
        setTimeout(() => { isAnswering = false; questionStartTime = Date.now(); }, 500);
    }, 400);
}

let shuffledCorrectIndex = 0;

function loadNextQuestionData() {
    if (currentGameQuestionIdx >= currentGameQuestions.length) return;
    const selectedQ = currentGameQuestions[currentGameQuestionIdx];
    currentQuestionIndex = questions.indexOf(selectedQ);

    // Zorluk etiketi
    const badge = document.getElementById('difficulty-badge');
    const diffLabels = { kolay: '🟢 Kolay', orta: '🟡 Orta', zor: '🔴 Zor' };
    badge.textContent = diffLabels[selectedQ.difficulty] || '🟢 Kolay';
    badge.className = 'difficulty-badge diff-' + (selectedQ.difficulty || 'kolay');

    // Şıkları karıştır
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const shuffledOptions = indices.map(i => selectedQ.options[i]);
    shuffledCorrectIndex = indices.indexOf(parseInt(selectedQ.correct));

    document.getElementById('question-text').innerText = selectedQ.text;
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, index) => {
        btn.innerText = shuffledOptions[index];
        btn.className = 'option-btn';
        btn.onclick = () => handleAnswer(btn, index);
    });
}

function handleAnswer(btn, selectedIndex) {
    if (isAnswering) return;
    isAnswering = true;

    const q = currentGameQuestions[currentGameQuestionIdx];
    const qTime = Date.now() - questionStartTime;
    totalTimeSpent += qTime;

    // Cevap verildi, timer dursun (animasyon süresi sayılmasın)
    pauseTimer();

    // Yapboz parça indeksi: hangi parça yanacak
    const pieceIdx = Math.floor((currentGameQuestionIdx / currentGameQuestions.length) * totalPieces) + 1;
    const targetPiece = document.querySelector(`.piece-${Math.min(pieceIdx, totalPieces)}`);

    btn.classList.add('option-selected');
    playSuspenseSound();
    if (targetPiece) targetPiece.classList.add('piece-flashing');

    setTimeout(() => {
        stopSuspenseSound();
        if (targetPiece) targetPiece.classList.remove('piece-flashing');

        if (selectedIndex === shuffledCorrectIndex) {
            btn.classList.replace('option-selected', 'option-correct');
            if (targetPiece) targetPiece.classList.add('piece-revealed');
            playCorrectSound();
            correctAnswers++;
            revealedPieces++;
            currentGameQuestionIdx++;

            setTimeout(() => {
                if (currentGameQuestionIdx >= currentGameQuestions.length) {
                    showWinScreen();
                } else {
                    resumeTimer();
                    triggerQuestionAnimation();
                }
            }, 1500);
        } else {
            btn.classList.replace('option-selected', 'option-wrong');
            document.querySelectorAll('.option-btn')[shuffledCorrectIndex].classList.add('option-correct');
            playWrongSound();
            currentGameQuestionIdx++;
            setTimeout(() => { showLoseScreen(); }, 1500);
        }
    }, 1500);
}

function showWinScreen() {
    stopTimer();
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('timer-bar-container').classList.add('hidden');
    const ws = document.getElementById('win-screen');
    ws.classList.remove('hidden');
    playWinSound();

    const time = (totalTimeSpent / 1000).toFixed(1);
    const score = calculateScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
    document.getElementById('win-score-display').innerHTML =
        `<span class="score-value">${score} Puan</span>
         <span class="score-detail">${correctAnswers}/${currentGameQuestions.length} doğru · ${time} saniye</span>`;
    document.getElementById('win-name-input').value = '';
}

function showLoseScreen() {
    stopTimer();
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('timer-bar-container').classList.add('hidden');
    const ls = document.getElementById('lose-screen');
    ls.classList.remove('hidden');

    const time = (totalTimeSpent / 1000).toFixed(1);
    const score = calculateScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
    document.getElementById('lose-score-display').innerHTML =
        `<span class="score-value">${score} Puan</span>
         <span class="score-detail">${correctAnswers}/${currentGameQuestions.length} doğru · ${time} saniye</span>`;
    document.getElementById('lose-name-input').value = '';
}

// --- Admin Paneli ---
function checkAdminPassword() {
    const pwd = prompt("Admin Şifresi:");
    if (pwd === "14531071") {
        document.getElementById('admin-modal').classList.remove('hidden');
        renderAdminQuestions(); loadSettingsUI(); renderAdminLeaderboard();
    } else if (pwd !== null) { alert("Hatalı şifre!"); }
}

function closeAdmin() { document.getElementById('admin-modal').classList.add('hidden'); }

// --- Ayarlar UI ---
function loadSettingsUI() {
    document.getElementById('settings-question-count').value = quizSettings.questionCount;
    document.getElementById('settings-time-per-question').value = quizSettings.timePerQuestion || 15;
    renderDiffDistribution();
}

function renderDiffDistribution() {
    const count = parseInt(document.getElementById('settings-question-count').value) || 5;
    const container = document.getElementById('difficulty-distribution');
    // difficultyMap boyutunu ayarla
    while (quizSettings.difficultyMap.length < count) quizSettings.difficultyMap.push(0);
    quizSettings.difficultyMap = quizSettings.difficultyMap.slice(0, count);

    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const val = quizSettings.difficultyMap[i] || 0;
        container.innerHTML += `<div class="diff-row">
            <span>Soru ${i+1}:</span>
            <select onchange="updateDiffMap(${i}, this.value)">
                <option value="0" ${val===0?'selected':''}>🟢 Kolay</option>
                <option value="1" ${val===1?'selected':''}>🟡 Orta</option>
                <option value="2" ${val===2?'selected':''}>🔴 Zor</option>
            </select>
        </div>`;
    }
}

function updateDiffMap(idx, val) { quizSettings.difficultyMap[idx] = parseInt(val); }

document.addEventListener('change', (e) => {
    if (e.target.id === 'settings-question-count') renderDiffDistribution();
});

function saveSettings() {
    quizSettings.questionCount = parseInt(document.getElementById('settings-question-count').value) || 5;
    quizSettings.timePerQuestion = parseInt(document.getElementById('settings-time-per-question').value) || 15;
    saveSettings_data();
    alert('Ayarlar kaydedildi!');
}

// --- Soru Listesi ---
let currentFilter = 'all';

function filterQuestions(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderAdminQuestions();
}

function renderAdminQuestions() {
    const list = document.getElementById('questions-list');
    const countBadge = document.getElementById('q-count');
    list.innerHTML = ''; countBadge.innerText = questions.length;

    const filtered = currentFilter === 'all' ? questions : questions.filter(q => q.difficulty === currentFilter);

    filtered.forEach((q) => {
        const index = questions.indexOf(q);
        const correctLetter = ['A', 'B', 'C', 'D'][q.correct];
        const correctText = q.options[q.correct];
        const diff = q.difficulty || 'kolay';
        const diffLabels = { kolay: '🟢 Kolay', orta: '🟡 Orta', zor: '🔴 Zor' };
        const diffColors = { kolay: '#00cc66', orta: '#ffcc00', zor: '#ff3333' };

        const card = document.createElement('div');
        card.className = 'q-card'; card.setAttribute('data-diff', diff);
        card.innerHTML = `<div class="q-info">
                <div class="q-text">${index + 1}. ${q.text}</div>
                <div class="q-ans"><i class="fas fa-check-circle"></i> Doğru: ${correctLetter} (${correctText})</div>
                <span class="q-diff-tag" style="background:${diffColors[diff]}22;color:${diffColors[diff]};border:1px solid ${diffColors[diff]}44">${diffLabels[diff]}</span>
            </div>
            <button class="delete-btn" onclick="deleteQuestion(${index})" title="Soruyu Sil"><i class="fas fa-trash-alt"></i></button>`;
        list.appendChild(card);
    });
}

function addQuestion() {
    const text = document.getElementById('new-q-text').value;
    const opts = [0,1,2,3].map(i => document.getElementById('opt-'+i).value);
    const correct = document.getElementById('correct-opt').value;
    const difficulty = document.getElementById('difficulty-opt').value;

    if (!text || opts.some(o => !o)) { alert("Lütfen tüm alanları doldurun."); return; }

    questions.push({ text, options: opts, correct: parseInt(correct), difficulty });
    saveQuestions(); renderAdminQuestions();
    document.getElementById('new-q-text').value = '';
    [0,1,2,3].forEach(i => document.getElementById('opt-'+i).value = '');
    document.getElementById('correct-opt').value = '0';
    document.getElementById('difficulty-opt').value = 'kolay';
    alert("Soru başarıyla eklendi!");
}

function deleteQuestion(index) {
    if (confirm("Bu soruyu silmek istediğinize emin misiniz?")) {
        questions.splice(index, 1); saveQuestions(); renderAdminQuestions();
    }
}

// --- JSON Dışa / İçe Aktarma ---
function exportQuestions() {
    const jsContent = 'const fileQuestions = ' + JSON.stringify(questions, null, 4) + ';';
    const blob = new Blob([jsContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'questions.js';
    a.click(); URL.revokeObjectURL(url);
}

function reloadFromFile() {
    // questions.js dosyasından tekrar yükle
    questions = typeof fileQuestions !== 'undefined' ? [...fileQuestions] : [];
    questions.forEach(q => { if (!q.difficulty) q.difficulty = 'kolay'; });
    renderAdminQuestions();
    alert(questions.length + ' soru questions.js dosyasından yeniden yüklendi!');
}
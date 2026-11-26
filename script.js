/**
 * BARÜ İKA Arena — Unified App Controller
 * Manages:
 * - Mode Hub (3D BARKUT Yarışçı vs Klasik Bilgi Yarışması)
 * - Dual Tabbed Leaderboards (same features & schema across both modes)
 * - Quiz Mode (with PS4 △○✕□ + Keyboard 1-4 + Touch support)
 * - Race Mode Bridge (questions provider, settings, results & leaderboard save)
 * - Confetti Celebration System
 * - Admin Panel (Race settings, Quiz settings, Question Bank CRUD, Dual Leaderboard Management)
 */
(function () {
    'use strict';

    // --- GLOBAL STATE ---
    let currentScreen = 'hub'; // 'hub' | 'quiz' | 'race'
    let questions = [];
    let usedRaceQuestionIndices = new Set();

    // Quiz Mode State
    let currentGameQuestions = [];
    let currentGameQuestionIdx = 0;
    let revealedPieces = 0;
    const totalPieces = 5;
    let isAnswering = false;
    let gameStartTime = 0;
    let questionStartTime = 0;
    let totalTimeSpent = 0;
    let correctAnswers = 0;
    let shuffledCorrectIndex = 0;
    let timerInterval = null;
    let pausedTime = 0;
    let pauseStart = 0;
    let quizPhase = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'

    // Race Result State
    let lastRaceSummary = null;

    // Hub PS4 Menu Focus State (0 = Race, 1 = Quiz)
    let hubFocusIndex = 0;

    // Settings
    const defaultRaceSettings = {
        trackSize: 'medium',
        splitCount: 3,
        laserDuration: 12,
        quizTimeBonus: 5,
        speedPercent: 100,
        aimAssist: 'medium',
        autoDrive: false,
        droneSpeed: 'normal',
        obstacleDensity: 'normal',
        bilgiQuestionTime: 15
    };
    let quizSettings = { questionCount: 5, difficultyMap: [0, 0, 1, 1, 2], timePerQuestion: 15 };
    let raceSettings = { ...defaultRaceSettings };

    // Leaderboards (Separate tabs with identical features!)
    let quizLeaderboard = [];
    let raceLeaderboard = [];
    let anonymousCounter = 0;
    let activeLeaderboardTab = 'race';
    let activeAdminLbTab = 'race';
    let currentQuestionFilter = 'all';

    // --- CONFETTI SYSTEM ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
    let confettiPieces = [];
    let confettiRunning = false;

    function resizeConfetti() {
        if (!confettiCanvas) return;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    window.launchConfetti = function (count) {
        if (!confettiCtx) return;
        resizeConfetti();
        const colors = ['#00f5d4', '#0ea5e9', '#f97316', '#facc15', '#ec4899', '#10b981'];
        const n = count || 80;
        for (let i = 0; i < n; i++) {
            confettiPieces.push({
                x: window.innerWidth * (0.2 + Math.random() * 0.6),
                y: window.innerHeight * 0.25 + (Math.random() - 0.5) * 120,
                vx: (Math.random() - 0.5) * 14,
                vy: -4 - Math.random() * 11,
                w: 7 + Math.random() * 7,
                h: 5 + Math.random() * 5,
                rot: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.28,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0,
                maxLife: 95 + Math.random() * 55
            });
        }
        if (!confettiRunning) {
            confettiRunning = true;
            requestAnimationFrame(tickConfetti);
        }
    };

    function tickConfetti() {
        if (!confettiCtx) return;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        for (let i = confettiPieces.length - 1; i >= 0; i--) {
            const p = confettiPieces[i];
            p.life++;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.28;
            p.vx *= 0.99;
            p.rot += p.vRot;
            if (p.life >= p.maxLife) {
                confettiPieces.splice(i, 1);
                continue;
            }
            const alpha = Math.max(0, 1 - p.life / p.maxLife);
            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate(p.rot);
            confettiCtx.globalAlpha = alpha;
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            confettiCtx.restore();
        }
        if (confettiPieces.length > 0) {
            requestAnimationFrame(tickConfetti);
        } else {
            confettiRunning = false;
        }
    }

    // --- STORAGE & INITIALIZATION ---
    function loadQuestions() {
        questions = typeof fileQuestions !== 'undefined' ? fileQuestions.map(q => ({ ...q, difficulty: q.difficulty || 'kolay' })) : [];
        const badge = document.getElementById('hub-q-count');
        if (badge) badge.textContent = questions.length;
    }

    function loadSettings() {
        try {
            const savedQ = localStorage.getItem('ika_quiz_settings');
            if (savedQ) quizSettings = { ...quizSettings, ...JSON.parse(savedQ) };
            const savedR = localStorage.getItem('ika_race_settings_v2');
            if (savedR) raceSettings = { ...raceSettings, ...JSON.parse(savedR) };
        } catch (e) {}
    }

    function persistQuizSettings() {
        localStorage.setItem('ika_quiz_settings', JSON.stringify(quizSettings));
    }

    function persistRaceSettings() {
        localStorage.setItem('ika_race_settings_v2', JSON.stringify(raceSettings));
    }

    function loadLeaderboards() {
        try {
            // Backward-compatible with existing 'ika_leaderboard' key!
            const savedQuiz = localStorage.getItem('ika_leaderboard');
            if (savedQuiz) quizLeaderboard = JSON.parse(savedQuiz);
            const savedRace = localStorage.getItem('ika_race_leaderboard');
            if (savedRace) raceLeaderboard = JSON.parse(savedRace);
            const ac = localStorage.getItem('ika_anon_counter');
            if (ac) anonymousCounter = parseInt(ac, 10) || 0;
        } catch (e) {}
    }

    function saveLeaderboards() {
        localStorage.setItem('ika_leaderboard', JSON.stringify(quizLeaderboard));
        localStorage.setItem('ika_race_leaderboard', JSON.stringify(raceLeaderboard));
        localStorage.setItem('ika_anon_counter', String(anonymousCounter));
    }

    function escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function escapeHTML(str) {
        return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    function getUniqueName(list, name) {
        if (!list.some(e => e.name === name)) return name;
        let num = 1;
        while (list.some(e => e.name === name + num)) num++;
        return name + num;
    }

    // --- LEADERBOARD RENDERING ---
    window.switchLeaderboardTab = function (tab) {
        activeLeaderboardTab = tab;
        document.querySelectorAll('.lb-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lb === tab);
        });
        renderLeaderboard();
    };

    function renderLeaderboard() {
        const listEl = document.getElementById('leaderboard-list');
        if (!listEl) return;

        const data = activeLeaderboardTab === 'race' ? raceLeaderboard : quizLeaderboard;
        if (data.length === 0) {
            listEl.innerHTML = activeLeaderboardTab === 'race'
                ? '<div class="lb-empty"><i class="fas fa-flag-checkered"></i> Henüz kimse yarışmadı! İlk rekoru sen kır!</div>'
                : '<div class="lb-empty"><i class="fas fa-medal"></i> Henüz bilgi yarışması kaydı yok!</div>';
            return;
        }

        const isRace = activeLeaderboardTab === 'race';
        const sorted = [...data].sort((a, b) => {
            if (isRace) {
                const ta = typeof a.netTime === 'number' ? a.netTime : 9999;
                const tb = typeof b.netTime === 'number' ? b.netTime : 9999;
                return ta - tb; // En kısa net süre 1. sırada!
            }
            return b.score - a.score;
        });
        listEl.innerHTML = sorted.map((entry, i) => {
            const rankClass = i < 3 ? `lb-rank-${i + 1}` : 'lb-rank-default';
            const rankSymbol = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
            const mainScore = isRace
                ? `${(typeof entry.netTime === 'number' ? entry.netTime : 0).toFixed(1)} sn`
                : `${Number(entry.score).toLocaleString('tr-TR')} puan`;
            const detail = isRace
                ? `⏱️ ${(entry.rawTime || 0).toFixed(1)}s − ⏳ ${(entry.bonusSeconds || 0).toFixed(0)}s · 🎯 ${entry.drones || 0}`
                : `${entry.correct}/${entry.total} doğru · ⏱️ ${entry.time}s`;
            return `<div class="lb-entry">
                <div class="lb-rank ${rankClass}">${rankSymbol}</div>
                <span class="lb-name">${escapeHTML(entry.name)}</span>
                <span class="lb-score">${mainScore}</span>
                <span class="lb-details">${detail}</span>
            </div>`;
        }).join('');
    }

    // --- SCREEN NAVIGATION ---
    window.returnToHub = function () {
        SoundFX.stopSuspense();
        stopQuizTimer();
        if (RaceGame.isRunning()) RaceGame.stop();

        currentScreen = 'hub';
        quizPhase = 'idle';

        document.getElementById('top-bar').classList.remove('hidden');
        document.getElementById('back-to-hub-btn').classList.add('hidden');
        document.getElementById('hub-screen').classList.remove('hidden');
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('race-screen').classList.add('hidden');
        document.getElementById('race-result-overlay').classList.add('hidden');

        RaceGame.setShowcaseActive(true);
        renderLeaderboard();
        updateHubFocusVisual();
    };

    function updateHubFocusVisual() {
        const c0 = document.getElementById('mode-card-race');
        const c1 = document.getElementById('mode-card-quiz');
        if (!c0 || !c1) return;
        const showFocus = InputManager.isGamepadConnected();
        c0.classList.toggle('ps4-focused', showFocus && hubFocusIndex === 0);
        c1.classList.toggle('ps4-focused', showFocus && hubFocusIndex === 1);
    }

    // --- RACE MODE BRIDGE ---
    window.getRaceQuestion = function () {
        if (questions.length === 0) loadQuestions();
        if (usedRaceQuestionIndices.size >= questions.length) {
            usedRaceQuestionIndices.clear();
        }
        const avail = [];
        for (let i = 0; i < questions.length; i++) {
            if (!usedRaceQuestionIndices.has(i)) avail.push(i);
        }
        const pickIdx = avail[Math.floor(Math.random() * avail.length)];
        usedRaceQuestionIndices.add(pickIdx);
        return questions[pickIdx];
    };

    window.startRaceMode = function () {
        SoundFX.init();
        SoundFX.playClick();
        currentScreen = 'race';
        RaceGame.setShowcaseActive(false);

        document.getElementById('top-bar').classList.add('hidden');
        document.getElementById('hub-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.add('hidden');
        document.getElementById('race-screen').classList.remove('hidden');
        document.getElementById('race-result-overlay').classList.add('hidden');

        const mount = document.getElementById('race-canvas-container');
        RaceGame.start(mount, raceSettings, handleRaceFinished);
    };

    window.restartRaceMode = function () {
        document.getElementById('race-result-overlay').classList.add('hidden');
        document.getElementById('race-pause-overlay').classList.add('hidden');
        const mount = document.getElementById('race-canvas-container');
        RaceGame.start(mount, raceSettings, handleRaceFinished);
    };

    function handleRaceFinished(summary) {
        lastRaceSummary = summary;
        const overlay = document.getElementById('race-result-overlay');
        const iconEl = document.getElementById('race-res-icon');
        const titleEl = document.getElementById('race-res-title');
        const subEl = document.getElementById('race-res-subtitle');

        iconEl.textContent = '🏁';
        titleEl.textContent = 'YARIŞ TAMAMLANDI!';
        titleEl.style.color = '#00f5d4';
        subEl.textContent = '74 BARKUT 74 ile bitiş çizgisini geçtin! En kısa net süre kazanır.';

        document.getElementById('race-score-display').innerHTML =
            `<span class="score-value">${summary.netTime.toFixed(1)} sn</span>
             <span class="score-detail">⏱️ Pist Süresi: ${summary.rawTime.toFixed(1)} sn &nbsp;−&nbsp; ⏳ Kazanılan: ${summary.bonusSeconds.toFixed(1)} sn</span>`;

        document.getElementById('race-stats-grid').innerHTML = `
            <div class="rstat-chip"><small>🎯 Drone</small><strong>${summary.dronesDestroyed}</strong></div>
            <div class="rstat-chip"><small>🧠 Bilgi</small><strong>${summary.bilgiCorrect}/${summary.bilgiTotal}</strong></div>
            <div class="rstat-chip"><small>💥 Duba</small><strong>${summary.conesHit || 0}</strong></div>
            <div class="rstat-chip"><small>🔥 Max Kombo</small><strong>x${summary.maxCombo}</strong></div>
        `;

        const nameInput = document.getElementById('race-name-input');
        nameInput.value = '';
        overlay.classList.remove('hidden');
    }

    window.saveRaceScore = function (withName) {
        if (!lastRaceSummary) return returnToHub();
        let name = document.getElementById('race-name-input').value.trim();
        if (!withName || !name) {
            anonymousCounter++;
            name = 'Yarışmacı' + anonymousCounter;
        } else {
            name = getUniqueName(raceLeaderboard, name);
        }
        raceLeaderboard.push({
            name,
            netTime: lastRaceSummary.netTime,
            rawTime: lastRaceSummary.rawTime,
            bonusSeconds: lastRaceSummary.bonusSeconds,
            drones: lastRaceSummary.dronesDestroyed,
            bilgiCorrect: lastRaceSummary.bilgiCorrect,
            hourglassCount: lastRaceSummary.hourglassCount
        });
        saveLeaderboards();
        activeLeaderboardTab = 'race';
        switchLeaderboardTab('race');
        returnToHub();
    };

    window.skipRaceAndReturn = function () {
        activeLeaderboardTab = 'race';
        switchLeaderboardTab('race');
        returnToHub();
    };

    // ==================== QUIZ MODE ====================
    function selectQuizQuestions() {
        const count = quizSettings.questionCount;
        const diffMap = quizSettings.difficultyMap;
        const diffNames = ['kolay', 'orta', 'zor'];
        const selected = [];

        for (let i = 0; i < count; i++) {
            const targetDiff = diffNames[diffMap[i] || 0];
            const pool = questions.filter((q, qi) => q.difficulty === targetDiff && !selected.includes(qi));
            if (pool.length > 0) {
                const pick = pool[Math.floor(Math.random() * pool.length)];
                selected.push(questions.indexOf(pick));
            } else {
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

    window.startQuizMode = function () {
        const needed = quizSettings.questionCount;
        if (questions.length < needed) {
            alert(`Oyuna başlamak için en az ${needed} soru eklemelisiniz! (Şu an: ${questions.length})`);
            return;
        }
        SoundFX.init();
        SoundFX.playClick();
        RaceGame.setShowcaseActive(false);

        currentScreen = 'quiz';
        quizPhase = 'playing';

        document.getElementById('hub-screen').classList.add('hidden');
        document.getElementById('race-screen').classList.add('hidden');
        document.getElementById('quiz-screen').classList.remove('hidden');
        document.getElementById('back-to-hub-btn').classList.remove('hidden');

        revealedPieces = 0;
        correctAnswers = 0;
        totalTimeSpent = 0;
        pausedTime = 0;
        isAnswering = false;

        selectQuizQuestions();

        document.getElementById('win-screen').classList.add('hidden');
        document.getElementById('lose-screen').classList.add('hidden');
        document.getElementById('quiz-area').classList.remove('hidden');
        document.getElementById('puzzle-container').classList.remove('hidden');
        document.getElementById('timer-bar-container').classList.remove('hidden');
        document.querySelector('.quiz-top-meta').classList.remove('hidden');

        for (let i = 1; i <= totalPieces; i++) {
            const piece = document.querySelector(`.piece-${i}`);
            if (piece) piece.classList.remove('piece-revealed', 'piece-flashing');
        }

        gameStartTime = Date.now();
        document.getElementById('timer-bar').style.width = '100%';
        startQuizTimer();
        triggerQuestionAnimation();
    };

    function updateQuizTimerTick() {
        const maxTime = quizSettings.questionCount * (quizSettings.timePerQuestion || 15);
        const elapsed = (Date.now() - gameStartTime - pausedTime) / 1000;
        const tText = document.getElementById('timer-text');
        const tBar = document.getElementById('timer-bar');
        if (tText) tText.textContent = elapsed.toFixed(1) + 's';
        const remaining = Math.max(0, 100 - (elapsed / maxTime) * 100);
        if (tBar) {
            tBar.style.width = remaining + '%';
            if (remaining > 50) tBar.style.background = 'linear-gradient(90deg, #00f5d4, #10b981)';
            else if (remaining > 25) tBar.style.background = 'linear-gradient(90deg, #facc15, #f97316)';
            else tBar.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
        }
    }

    function startQuizTimer() {
        stopQuizTimer();
        questionStartTime = Date.now();
        pausedTime = 0;
        timerInterval = setInterval(updateQuizTimerTick, 100);
    }

    function pauseQuizTimer() {
        pauseStart = Date.now();
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    }

    function resumeQuizTimer() {
        if (pauseStart) {
            pausedTime += Date.now() - pauseStart;
            pauseStart = 0;
        }
        timerInterval = setInterval(updateQuizTimerTick, 100);
    }

    function stopQuizTimer() {
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        pauseStart = 0;
    }

    function triggerQuestionAnimation() {
        isAnswering = true;
        const puzzle = document.getElementById('puzzle-container');
        const quizArea = document.getElementById('quiz-area');
        puzzle.style.transform = 'scale(0.97)';
        quizArea.style.opacity = '0';
        quizArea.style.transform = 'translateY(14px)';

        setTimeout(() => {
            if (currentScreen !== 'quiz') return;
            loadNextQuestionData();
            puzzle.style.transform = 'scale(1)';
            quizArea.style.opacity = '1';
            quizArea.style.transform = 'translateY(0)';
            setTimeout(() => {
                isAnswering = false;
                questionStartTime = Date.now();
            }, 320);
        }, 280);
    }

    function loadNextQuestionData() {
        if (currentGameQuestionIdx >= currentGameQuestions.length) return;
        const selectedQ = currentGameQuestions[currentGameQuestionIdx];

        const prog = document.getElementById('quiz-progress-pill');
        if (prog) prog.textContent = `Soru ${currentGameQuestionIdx + 1} / ${currentGameQuestions.length}`;

        const badge = document.getElementById('difficulty-badge');
        const diffLabels = { kolay: '🟢 Kolay', orta: '🟡 Orta', zor: '🔴 Zor' };
        badge.textContent = diffLabels[selectedQ.difficulty] || '🟢 Kolay';
        badge.className = 'difficulty-badge diff-' + (selectedQ.difficulty || 'kolay');

        // Shuffle options
        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        const shuffledOptions = indices.map(i => selectedQ.options[i]);
        shuffledCorrectIndex = indices.indexOf(parseInt(selectedQ.correct, 10));

        document.getElementById('question-text').textContent = selectedQ.text;

        const letters = ['A', 'B', 'C', 'D'];
        const ps4Icons = ['△', '○', '✕', '□'];
        const btns = document.querySelectorAll('#options-container .option-btn');
        btns.forEach((btn, idx) => {
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="opt-key-badge"><span class="kb-key">${letters[idx]}</span><span class="ps4-key">${ps4Icons[idx]}</span></span><span>${escapeHTML(shuffledOptions[idx])}</span>`;
            btn.onclick = () => handleQuizAnswer(btn, idx);
        });
    }

    function handleQuizAnswer(btn, selectedIndex) {
        if (isAnswering || currentScreen !== 'quiz' || quizPhase !== 'playing') return;
        isAnswering = true;

        const qTime = Date.now() - questionStartTime;
        totalTimeSpent += qTime;
        pauseQuizTimer();

        const pieceIdx = Math.floor((currentGameQuestionIdx / currentGameQuestions.length) * totalPieces) + 1;
        const targetPiece = document.querySelector(`.piece-${Math.min(pieceIdx, totalPieces)}`);

        btn.classList.add('option-selected');
        SoundFX.playSuspense();
        if (targetPiece) targetPiece.classList.add('piece-flashing');

        setTimeout(() => {
            if (currentScreen !== 'quiz') return;
            SoundFX.stopSuspense();
            if (targetPiece) targetPiece.classList.remove('piece-flashing');

            if (selectedIndex === shuffledCorrectIndex) {
                btn.classList.replace('option-selected', 'option-correct');
                if (targetPiece) targetPiece.classList.add('piece-revealed');
                SoundFX.playCorrect();
                InputManager.rumble('correct');
                correctAnswers++;
                revealedPieces++;
                currentGameQuestionIdx++;

                setTimeout(() => {
                    if (currentScreen !== 'quiz') return;
                    if (currentGameQuestionIdx >= currentGameQuestions.length) {
                        showQuizResult(true);
                    } else {
                        resumeQuizTimer();
                        triggerQuestionAnimation();
                    }
                }, 1250);
            } else {
                btn.classList.replace('option-selected', 'option-wrong');
                const allBtns = document.querySelectorAll('#options-container .option-btn');
                if (allBtns[shuffledCorrectIndex]) allBtns[shuffledCorrectIndex].classList.add('option-correct');
                SoundFX.playWrong();
                InputManager.rumble('wrong');
                currentGameQuestionIdx++;
                setTimeout(() => {
                    if (currentScreen === 'quiz') showQuizResult(false);
                }, 1350);
            }
        }, 1200);
    }

    function calculateQuizScore(correctCount, totalCount, timeSeconds) {
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

    function showQuizResult(isWin) {
        stopQuizTimer();
        quizPhase = isWin ? 'win' : 'lose';

        document.getElementById('quiz-area').classList.add('hidden');
        document.getElementById('timer-bar-container').classList.add('hidden');
        document.querySelector('.quiz-top-meta').classList.add('hidden');

        const time = (totalTimeSpent / 1000).toFixed(1);
        const score = calculateQuizScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
        const html = `<span class="score-value">${score.toLocaleString('tr-TR')} Puan</span>
                      <span class="score-detail">${correctAnswers}/${currentGameQuestions.length} doğru · ${time} saniye</span>`;

        if (isWin) {
            SoundFX.playWin();
            InputManager.rumble('win');
            window.launchConfetti(100);
            document.getElementById('win-score-display').innerHTML = html;
            document.getElementById('win-name-input').value = '';
            document.getElementById('win-screen').classList.remove('hidden');
        } else {
            document.getElementById('lose-score-display').innerHTML = html;
            document.getElementById('lose-name-input').value = '';
            document.getElementById('lose-screen').classList.remove('hidden');
        }
    }

    window.saveQuizScore = function (withName, isWin) {
        const inputId = isWin ? 'win-name-input' : 'lose-name-input';
        let name = document.getElementById(inputId).value.trim();
        if (!withName || !name) {
            anonymousCounter++;
            name = 'Yarışmacı' + anonymousCounter;
        } else {
            name = getUniqueName(quizLeaderboard, name);
        }
        const time = (totalTimeSpent / 1000).toFixed(1);
        const score = calculateQuizScore(correctAnswers, currentGameQuestions.length, totalTimeSpent / 1000);
        quizLeaderboard.push({ name, score, correct: correctAnswers, total: currentGameQuestions.length, time });
        saveLeaderboards();
        activeLeaderboardTab = 'quiz';
        switchLeaderboardTab('quiz');
        returnToHub();
    };

    window.skipQuizAndReturn = function () {
        activeLeaderboardTab = 'quiz';
        switchLeaderboardTab('quiz');
        returnToHub();
    };

    // ==================== ADMIN PANEL ====================
    window.checkAdminPassword = function () {
        const pwd = prompt('Admin Şifresi:');
        if (pwd === '14531071') {
            document.getElementById('admin-modal').classList.remove('hidden');
            renderAdminQuestions();
            loadSettingsUI();
            renderAdminLeaderboard();
        } else if (pwd !== null) {
            alert('Hatalı şifre!');
        }
    };

    window.closeAdmin = function () {
        document.getElementById('admin-modal').classList.add('hidden');
    };

    window.updateRaceSpeedLabel = function (val) {
        const num = parseInt(val, 10) || 100;
        const tag = num < 85 ? 'Yavaş' : num <= 110 ? 'Normal' : num <= 130 ? 'Hızlı' : 'Süper';
        const el = document.getElementById('race-set-speed-val');
        if (el) el.textContent = `%${num} (${tag})`;
    };

    function loadSettingsUI() {
        // Quiz settings
        document.getElementById('settings-question-count').value = quizSettings.questionCount;
        document.getElementById('settings-time-per-question').value = quizSettings.timePerQuestion || 15;
        renderDiffDistribution();

        // Race settings
        document.getElementById('race-set-track-size').value = raceSettings.trackSize;
        document.getElementById('race-set-split-count').value = raceSettings.splitCount;
        document.getElementById('race-set-laser-dur').value = raceSettings.laserDuration;
        document.getElementById('race-set-quiz-bonus').value = raceSettings.quizTimeBonus;
        document.getElementById('race-set-speed').value = raceSettings.speedPercent || 100;
        updateRaceSpeedLabel(raceSettings.speedPercent || 100);
        document.getElementById('race-set-aim-assist').value = raceSettings.aimAssist || 'medium';
        document.getElementById('race-set-auto-drive').value = raceSettings.autoDrive === true ? 'true' : 'false';
        document.getElementById('race-set-drone-speed').value = raceSettings.droneSpeed || 'normal';
        document.getElementById('race-set-obstacles').value = raceSettings.obstacleDensity || 'normal';
        document.getElementById('race-set-bilgi-time').value = raceSettings.bilgiQuestionTime || 15;
    }

    function renderDiffDistribution() {
        const count = parseInt(document.getElementById('settings-question-count').value, 10) || 5;
        const container = document.getElementById('difficulty-distribution');
        while (quizSettings.difficultyMap.length < count) quizSettings.difficultyMap.push(0);
        quizSettings.difficultyMap = quizSettings.difficultyMap.slice(0, count);

        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const val = quizSettings.difficultyMap[i] || 0;
            container.innerHTML += `<div class="diff-row">
                <span>Soru ${i + 1}:</span>
                <select onchange="updateDiffMap(${i}, this.value)">
                    <option value="0" ${val === 0 ? 'selected' : ''}>🟢 Kolay</option>
                    <option value="1" ${val === 1 ? 'selected' : ''}>🟡 Orta</option>
                    <option value="2" ${val === 2 ? 'selected' : ''}>🔴 Zor</option>
                </select>
            </div>`;
        }
    }

    window.updateDiffMap = function (idx, val) {
        quizSettings.difficultyMap[idx] = parseInt(val, 10);
    };

    document.addEventListener('change', (e) => {
        if (e.target.id === 'settings-question-count') renderDiffDistribution();
    });

    window.saveSettings = function () {
        quizSettings.questionCount = parseInt(document.getElementById('settings-question-count').value, 10) || 5;
        quizSettings.timePerQuestion = parseInt(document.getElementById('settings-time-per-question').value, 10) || 15;
        persistQuizSettings();
        alert('Bilgi Yarışması ayarları kaydedildi!');
    };

    window.saveRaceSettings = function () {
        raceSettings.trackSize = document.getElementById('race-set-track-size').value || 'medium';
        raceSettings.splitCount = parseInt(document.getElementById('race-set-split-count').value, 10) || 3;
        raceSettings.laserDuration = Math.max(6, Math.min(30, parseInt(document.getElementById('race-set-laser-dur').value, 10) || 12));
        raceSettings.quizTimeBonus = Math.max(2, Math.min(15, parseInt(document.getElementById('race-set-quiz-bonus').value, 10) || 5));
        raceSettings.speedPercent = Math.max(60, Math.min(150, parseInt(document.getElementById('race-set-speed').value, 10) || 100));
        raceSettings.aimAssist = document.getElementById('race-set-aim-assist').value || 'medium';
        raceSettings.autoDrive = document.getElementById('race-set-auto-drive').value === 'true';
        raceSettings.droneSpeed = document.getElementById('race-set-drone-speed').value || 'normal';
        raceSettings.obstacleDensity = document.getElementById('race-set-obstacles').value || 'normal';
        raceSettings.bilgiQuestionTime = Math.max(8, Math.min(45, parseInt(document.getElementById('race-set-bilgi-time').value, 10) || 15));
        persistRaceSettings();
        alert('Yarış Modu ayarları kaydedildi!');
    };

    window.resetRaceSettings = function () {
        raceSettings = { ...defaultRaceSettings };
        persistRaceSettings();
        loadSettingsUI();
        alert('Yarış Modu ayarları varsayılana sıfırlandı!');
    };

    window.filterQuestions = function (filter, btn) {
        currentQuestionFilter = filter;
        document.querySelectorAll('.difficulty-filter .filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        renderAdminQuestions();
    };

    function renderAdminQuestions() {
        const list = document.getElementById('questions-list');
        const countBadge = document.getElementById('q-count');
        list.innerHTML = '';
        countBadge.textContent = questions.length;
        const hubQ = document.getElementById('hub-q-count');
        if (hubQ) hubQ.textContent = questions.length;

        const filtered = currentQuestionFilter === 'all' ? questions : questions.filter(q => q.difficulty === currentQuestionFilter);
        const diffLabels = { kolay: '🟢 Kolay', orta: '🟡 Orta', zor: '🔴 Zor' };
        const diffColors = { kolay: '#10b981', orta: '#facc15', zor: '#ef4444' };

        filtered.forEach(q => {
            const index = questions.indexOf(q);
            const correctLetter = ['A', 'B', 'C', 'D'][q.correct];
            const diff = q.difficulty || 'kolay';
            const card = document.createElement('div');
            card.className = 'q-card';
            card.setAttribute('data-diff', diff);
            card.innerHTML = `<div class="q-info">
                <div class="q-text">${index + 1}. ${escapeHTML(q.text)}</div>
                <div class="q-ans"><i class="fas fa-check-circle"></i> ${correctLetter}: ${escapeHTML(q.options[q.correct])}</div>
                <span class="q-diff-tag" style="background:${diffColors[diff]}22;color:${diffColors[diff]};border:1px solid ${diffColors[diff]}44">${diffLabels[diff]}</span>
            </div>
            <button class="delete-btn" onclick="deleteQuestion(${index})" title="Soruyu Sil"><i class="fas fa-trash-alt"></i></button>`;
            list.appendChild(card);
        });
    }

    window.addQuestion = function () {
        const text = document.getElementById('new-q-text').value.trim();
        const opts = [0, 1, 2, 3].map(i => document.getElementById('opt-' + i).value.trim());
        const correct = parseInt(document.getElementById('correct-opt').value, 10);
        const difficulty = document.getElementById('difficulty-opt').value;

        if (!text || opts.some(o => !o)) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        questions.push({ text, options: opts, correct, difficulty });
        renderAdminQuestions();
        document.getElementById('new-q-text').value = '';
        [0, 1, 2, 3].forEach(i => { document.getElementById('opt-' + i).value = ''; });
        alert('Soru başarıyla eklendi!');
    };

    window.deleteQuestion = function (index) {
        if (confirm('Bu soruyu silmek istediğinize emin misiniz?')) {
            questions.splice(index, 1);
            renderAdminQuestions();
        }
    };

    window.exportQuestions = function () {
        const jsContent = 'const fileQuestions = ' + JSON.stringify(questions, null, 4) + ';';
        const blob = new Blob([jsContent], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questions.js';
        a.click();
        URL.revokeObjectURL(url);
    };

    window.reloadFromFile = function () {
        loadQuestions();
        renderAdminQuestions();
        alert(questions.length + ' soru questions.js dosyasından yeniden yüklendi!');
    };

    window.switchAdminLbTab = function (tab, btn) {
        activeAdminLbTab = tab;
        document.querySelectorAll('.admin-lb-tabs .filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        renderAdminLeaderboard();
    };

    function renderAdminLeaderboard() {
        const list = document.getElementById('admin-leaderboard-list');
        if (!list) return;
        const isRace = activeAdminLbTab === 'race';
        const data = isRace ? raceLeaderboard : quizLeaderboard;
        const sorted = [...data].sort((a, b) => {
            if (isRace) return (a.netTime ?? 9999) - (b.netTime ?? 9999);
            return b.score - a.score;
        });
        if (sorted.length === 0) {
            list.innerHTML = '<div class="lb-empty" style="padding:14px;">Kayıt yok</div>';
            return;
        }
        list.innerHTML = sorted.map((e, i) => {
            const val = isRace
                ? `${(typeof e.netTime === 'number' ? e.netTime : 0).toFixed(1)} sn`
                : `${Number(e.score).toLocaleString('tr-TR')} puan`;
            return `<div class="admin-lb-entry"><span>${i + 1}. ${escapeHTML(e.name)}</span><span>${val}</span></div>`;
        }).join('');
    }

    window.clearCurrentAdminLeaderboard = function () {
        const label = activeAdminLbTab === 'race' ? 'Yarış Modu' : 'Bilgi Yarışması';
        if (confirm(`${label} sıralama verilerini silmek istediğinize emin misiniz?`)) {
            if (activeAdminLbTab === 'race') raceLeaderboard = [];
            else quizLeaderboard = [];
            saveLeaderboards();
            renderAdminLeaderboard();
            renderLeaderboard();
        }
    };

    window.clearAllLeaderboards = function () {
        if (confirm('Her iki modun TÜM sıralama verilerini silmek istediğinize emin misiniz?')) {
            raceLeaderboard = [];
            quizLeaderboard = [];
            anonymousCounter = 0;
            saveLeaderboards();
            renderAdminLeaderboard();
            renderLeaderboard();
        }
    };

    // --- GLOBAL INPUT ACTIONS (PS4 + Keyboard in Hub & Quiz Mode!) ---
    function bindGlobalInput() {
        InputManager.onAction((action, data) => {
            if (!document.getElementById('admin-modal').classList.contains('hidden')) {
                if (action === 'pause') closeAdmin();
                return;
            }

            if (currentScreen === 'hub') {
                if (action === 'navLeft' || action === 'navUp') {
                    hubFocusIndex = 0;
                    updateHubFocusVisual();
                } else if (action === 'navRight' || action === 'navDown') {
                    hubFocusIndex = 1;
                    updateHubFocusVisual();
                } else if (action === 'confirm') {
                    if (InputManager.isGamepadConnected()) {
                        if (hubFocusIndex === 0) startRaceMode();
                        else startQuizMode();
                    }
                }
            } else if (currentScreen === 'quiz') {
                if (action === 'answer' && quizPhase === 'playing' && !isAnswering) {
                    const btns = document.querySelectorAll('#options-container .option-btn');
                    if (btns[data]) handleQuizAnswer(btns[data], data);
                } else if (action === 'pause' || (action === 'back' && quizPhase !== 'playing')) {
                    returnToHub();
                }
            }
        });
    }

    // --- BOOT ---
    window.addEventListener('DOMContentLoaded', () => {
        loadQuestions();
        loadSettings();
        loadLeaderboards();
        renderLeaderboard();
        InputManager.start();
        bindGlobalInput();
        resizeConfetti();
        window.addEventListener('resize', resizeConfetti);

        // Mount live spinning 3D BARKUT 74 model showcase on the Race card!
        const showcaseHost = document.getElementById('barkut-3d-showcase');
        if (showcaseHost && window.RaceGame) {
            setTimeout(() => RaceGame.initShowcase(showcaseHost), 80);
        }
    });
})();

/**
 * BARÜ İKA — Synthesized Web Audio Sound Engine
 * 100% offline, zero external audio assets needed.
 * Supports Quiz Mode + 3D Yarışçı Race Mode + Laser Mini-Game + Dynamic Motor Hum.
 */
window.SoundFX = (function () {
    'use strict';

    let ctx = null;
    let muted = false;

    // Quiz suspense nodes
    let suspenseOsc = null;
    let suspenseGain = null;
    let suspenseLfo = null;

    // Continuous UGV electric motor hum nodes
    let engineRunning = false;
    let engineOsc1 = null;
    let engineOsc2 = null;
    let engineGain = null;
    let engineFilter = null;

    // Active Varex exhaust nodes (so we can cleanly cut off if paused/stopped/retriggered)
    let varexNodes = [];

    function ensureContext() {
        if (!ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return null;
            ctx = new AudioCtx();
        }
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }
        return ctx;
    }

    function init() {
        ensureContext();
    }

    function isMuted() {
        return muted;
    }

    function setMuted(val) {
        muted = !!val;
        if (muted) {
            stopSuspense();
            stopVarex();
            if (engineGain && ctx) {
                engineGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
            }
        }
        document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
            btn.innerHTML = muted
                ? '<i class="fas fa-volume-mute"></i>'
                : '<i class="fas fa-volume-up"></i>';
            btn.title = muted ? 'Sesi Aç' : 'Sesi Kapat';
        });
    }

    function toggleMute() {
        setMuted(!muted);
        return muted;
    }

    // --- QUIZ SOUNDS ---
    function playSuspense() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        stopSuspense();
        suspenseOsc = c.createOscillator();
        suspenseGain = c.createGain();
        suspenseLfo = c.createOscillator();
        suspenseOsc.type = 'triangle';
        suspenseOsc.frequency.value = 110;
        suspenseLfo.type = 'sine';
        suspenseLfo.frequency.value = 2.6;
        const lfoGain = c.createGain();
        lfoGain.gain.value = 0.08;
        suspenseLfo.connect(lfoGain);
        lfoGain.connect(suspenseGain.gain);
        suspenseOsc.connect(suspenseGain);
        suspenseGain.connect(c.destination);
        suspenseGain.gain.setValueAtTime(0.14, c.currentTime);
        suspenseOsc.start();
        suspenseLfo.start();
    }

    function stopSuspense() {
        if (suspenseOsc) {
            try { suspenseOsc.stop(); } catch (e) {}
            try { suspenseLfo.stop(); } catch (e) {}
            try { suspenseOsc.disconnect(); suspenseGain.disconnect(); } catch (e) {}
            suspenseOsc = null;
            suspenseGain = null;
            suspenseLfo = null;
        }
    }

    function playCorrect() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((f, idx) => {
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            osc.connect(g);
            g.connect(c.destination);
            const t = c.currentTime + idx * 0.08;
            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(0.22, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            osc.start(t);
            osc.stop(t + 0.38);
        });
    }

    function playWrong() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(175, c.currentTime);
        osc.frequency.linearRampToValueAtTime(95, c.currentTime + 0.35);
        osc.connect(g);
        g.connect(c.destination);
        g.gain.setValueAtTime(0.2, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.36);
        osc.start();
        osc.stop(c.currentTime + 0.38);
    }

    function playWin() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        // Victory brass chord progression
        const seq = [440, 554.37, 659.25, 880, 1108.73];
        seq.forEach((freq, i) => {
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            osc.connect(g);
            g.connect(c.destination);
            const t = c.currentTime + i * 0.11;
            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(0.24, t + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
            osc.start(t);
            osc.stop(t + 0.9);
        });

        // Synthesized crowd applause burst (bandpass filtered noise)
        playApplause(1.8);
    }

    function playApplause(durationSec) {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const dur = durationSec || 1.5;
        const bufferSize = Math.floor(c.sampleRate * dur);
        const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            // Subtle clapping modulation envelope
            const mod = 0.55 + 0.45 * Math.sin(i / (c.sampleRate * 0.018));
            data[i] = (Math.random() * 2 - 1) * mod;
        }
        const noise = c.createBufferSource();
        noise.buffer = buffer;

        const filter = c.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1400;
        filter.Q.value = 0.9;

        const g = c.createGain();
        const now = c.currentTime;
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.11, now + 0.2);
        g.gain.exponentialRampToValueAtTime(0.001, now + dur);

        noise.connect(filter);
        filter.connect(g);
        g.connect(c.destination);
        noise.start(now);
        noise.stop(now + dur);
    }

    // --- RACING & LASER SOUNDS ---
    function startEngine() {
        const c = ensureContext();
        if (!c || engineRunning) return;
        engineRunning = true;

        engineOsc1 = c.createOscillator();
        engineOsc2 = c.createOscillator();
        engineFilter = c.createBiquadFilter();
        engineGain = c.createGain();

        engineOsc1.type = 'sawtooth';
        engineOsc2.type = 'triangle';
        engineOsc1.frequency.value = 55;
        engineOsc2.frequency.value = 110;

        engineFilter.type = 'lowpass';
        engineFilter.frequency.value = 260;

        engineGain.gain.value = 0.0001;

        engineOsc1.connect(engineFilter);
        engineOsc2.connect(engineFilter);
        engineFilter.connect(engineGain);
        engineGain.connect(c.destination);

        engineOsc1.start();
        engineOsc2.start();
    }

    function updateEngine(speedRatio, isTurbo, active) {
        if (!engineRunning || !ctx || !engineGain) return;
        const now = ctx.currentTime;
        if (muted || !active) {
            engineGain.gain.setTargetAtTime(0.0001, now, 0.08);
            return;
        }
        const clamped = Math.max(0, Math.min(1.5, speedRatio));
        const baseFreq = 54 + clamped * 92 + (isTurbo ? 42 : 0);
        engineOsc1.frequency.setTargetAtTime(baseFreq, now, 0.06);
        engineOsc2.frequency.setTargetAtTime(baseFreq * 2.02, now, 0.06);
        engineFilter.frequency.setTargetAtTime(220 + clamped * 520 + (isTurbo ? 450 : 0), now, 0.06);
        engineGain.gain.setTargetAtTime(0.045 + clamped * 0.04 + (isTurbo ? 0.025 : 0), now, 0.08);
    }

    function stopEngine() {
        stopVarex();
        if (!engineRunning) return;
        engineRunning = false;
        try {
            engineOsc1.stop();
            engineOsc2.stop();
            engineOsc1.disconnect();
            engineOsc2.disconnect();
            engineFilter.disconnect();
            engineGain.disconnect();
        } catch (e) {}
        engineOsc1 = engineOsc2 = engineFilter = engineGain = null;
    }

    function playCountdown(isGo) {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = isGo ? 'triangle' : 'sine';
        osc.frequency.value = isGo ? 880 : 440;
        osc.connect(g);
        g.connect(c.destination);
        const dur = isGo ? 0.45 : 0.18;
        g.gain.setValueAtTime(0.24, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
        osc.start();
        osc.stop(c.currentTime + dur + 0.02);
    }

    function playHourglass(isGold) {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const notes = isGold ? [659.25, 880, 1174.66, 1567.98] : [587.33, 880, 1174.66];
        notes.forEach((f, i) => {
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'sine';
            osc.frequency.value = f;
            osc.connect(g);
            g.connect(c.destination);
            const t = c.currentTime + i * 0.055;
            g.gain.setValueAtTime(0.2, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            osc.start(t);
            osc.stop(t + 0.27);
        });
    }

    function stopVarex() {
        varexNodes.forEach(n => {
            try { if (typeof n.stop === 'function') n.stop(); } catch (e) {}
            try { n.disconnect(); } catch (e) {}
        });
        varexNodes = [];
    }

    function makeDistortionCurve(amount) {
        const samples = 256;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
    }

    // 5-second throaty Varex exhaust roar with burble & backfire pops!
    function playVarexExhaust(durationSec) {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        stopVarex();

        const dur = durationSec || 5.0;
        const now = c.currentTime;

        // 1. Deep growling primary & sub exhaust oscillators
        const oscMain = c.createOscillator();
        const oscSub = c.createOscillator();
        const oscRasp = c.createOscillator();
        oscMain.type = 'sawtooth';
        oscSub.type = 'square';
        oscRasp.type = 'sawtooth';

        // Rev up -> shift -> roar -> burble down
        oscMain.frequency.setValueAtTime(62, now);
        oscMain.frequency.exponentialRampToValueAtTime(148, now + 1.35);
        oscMain.frequency.setValueAtTime(102, now + 1.48); // gear shift!
        oscMain.frequency.exponentialRampToValueAtTime(172, now + 3.4);
        oscMain.frequency.exponentialRampToValueAtTime(76, now + dur);

        oscSub.frequency.setValueAtTime(31, now);
        oscSub.frequency.exponentialRampToValueAtTime(74, now + 1.35);
        oscSub.frequency.setValueAtTime(51, now + 1.48);
        oscSub.frequency.exponentialRampToValueAtTime(86, now + 3.4);
        oscSub.frequency.exponentialRampToValueAtTime(38, now + dur);

        oscRasp.frequency.setValueAtTime(126, now);
        oscRasp.frequency.exponentialRampToValueAtTime(298, now + 1.35);
        oscRasp.frequency.setValueAtTime(206, now + 1.48);
        oscRasp.frequency.exponentialRampToValueAtTime(346, now + 3.4);
        oscRasp.frequency.exponentialRampToValueAtTime(150, now + dur);

        // 2. Exhaust flutter LFO (gives that iconic Varex deep burble!)
        const lfo = c.createOscillator();
        const lfoGain = c.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(19, now);
        lfo.frequency.linearRampToValueAtTime(28, now + 3.2);
        lfo.frequency.linearRampToValueAtTime(14, now + dur);
        lfoGain.gain.value = 0.22;

        // 3. Overdrive WaveShaper + Resonant Exhaust Filter
        const shaper = c.createWaveShaper();
        shaper.curve = makeDistortionCurve(34);
        shaper.oversample = '2x';

        const filter = c.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 4.2;
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(1450, now + 1.35);
        filter.frequency.setValueAtTime(780, now + 1.48);
        filter.frequency.exponentialRampToValueAtTime(1850, now + 3.4);
        filter.frequency.exponentialRampToValueAtTime(360, now + dur);

        const masterGain = c.createGain();
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.26, now + 0.12);
        masterGain.gain.setValueAtTime(0.24, now + dur - 0.55);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        const subGain = c.createGain();
        subGain.gain.value = 0.55;
        const raspGain = c.createGain();
        raspGain.gain.value = 0.35;

        oscMain.connect(shaper);
        oscSub.connect(subGain);
        subGain.connect(shaper);
        oscRasp.connect(raspGain);
        raspGain.connect(shaper);

        lfo.connect(lfoGain);
        lfoGain.connect(masterGain.gain);

        shaper.connect(filter);
        filter.connect(masterGain);
        masterGain.connect(c.destination);

        oscMain.start(now);
        oscSub.start(now);
        oscRasp.start(now);
        lfo.start(now);

        oscMain.stop(now + dur + 0.05);
        oscSub.stop(now + dur + 0.05);
        oscRasp.stop(now + dur + 0.05);
        lfo.stop(now + dur + 0.05);

        varexNodes.push(oscMain, oscSub, oscRasp, lfo, shaper, filter, masterGain);

        // 4. Exhaust Backfire / Crackles ("pat-pat-pat!") on shift & decel!
        const popTimes = [1.44, 3.65, 3.88, 4.18, 4.46];
        popTimes.forEach((pt, idx) => {
            if (pt >= dur - 0.1) return;
            const popDur = 0.085;
            const bufLen = Math.floor(c.sampleRate * popDur);
            const buf = c.createBuffer(1, bufLen, c.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufLen; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.28));
            }
            const src = c.createBufferSource();
            src.buffer = buf;

            const bp = c.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = idx === 0 ? 480 : (340 + (idx % 2) * 190);
            bp.Q.value = 1.6;

            const pg = c.createGain();
            pg.gain.setValueAtTime(0.38, now + pt);
            pg.gain.exponentialRampToValueAtTime(0.001, now + pt + popDur);

            src.connect(bp);
            bp.connect(pg);
            pg.connect(c.destination);
            src.start(now + pt);
            src.stop(now + pt + popDur + 0.01);
            varexNodes.push(src, bp, pg);
        });
    }

    function playTurbo() {
        playVarexExhaust(5.0);
    }

    function playBump() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'triangle';
        const now = c.currentTime;
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.22);
        osc.connect(g);
        g.connect(c.destination);
        g.gain.setValueAtTime(0.32, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    function playForkAlert() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        [523.25, 698.46].forEach((f, idx) => {
            const osc = c.createOscillator();
            const g = c.createGain();
            osc.type = 'triangle';
            osc.frequency.value = f;
            osc.connect(g);
            g.connect(c.destination);
            const t = c.currentTime + idx * 0.12;
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc.start(t);
            osc.stop(t + 0.24);
        });
    }

    function playLaser() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sawtooth';
        const now = c.currentTime;
        osc.frequency.setValueAtTime(1180, now);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.16);
        osc.connect(g);
        g.connect(c.destination);
        g.gain.setValueAtTime(0.17, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.start(now);
        osc.stop(now + 0.19);
    }

    function playDroneHit(combo) {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        // Punchy low explosion thump
        const boom = c.createOscillator();
        const bg = c.createGain();
        boom.type = 'sine';
        boom.frequency.setValueAtTime(170, now);
        boom.frequency.exponentialRampToValueAtTime(42, now + 0.2);
        boom.connect(bg);
        bg.connect(c.destination);
        bg.gain.setValueAtTime(0.28, now);
        bg.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        boom.start(now);
        boom.stop(now + 0.24);

        // Escalating combo chime!
        const chime = c.createOscillator();
        const cg = c.createGain();
        chime.type = 'triangle';
        const pitch = 540 * Math.pow(1.09, Math.min(8, (combo || 1) - 1));
        chime.frequency.setValueAtTime(pitch, now + 0.03);
        chime.frequency.setValueAtTime(pitch * 1.25, now + 0.10);
        chime.connect(cg);
        cg.connect(c.destination);
        cg.gain.setValueAtTime(0.22, now + 0.03);
        cg.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        chime.start(now + 0.03);
        chime.stop(now + 0.30);
    }

    function playLowTimeTick() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = 920;
        osc.connect(g);
        g.connect(c.destination);
        g.gain.setValueAtTime(0.11, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07);
        osc.start();
        osc.stop(c.currentTime + 0.08);
    }

    function playClick() {
        if (muted) return;
        const c = ensureContext();
        if (!c) return;
        const osc = c.createOscillator();
        const g = c.createGain();
        osc.type = 'sine';
        osc.frequency.value = 660;
        osc.connect(g);
        g.connect(c.destination);
        g.gain.setValueAtTime(0.08, c.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
        osc.start();
        osc.stop(c.currentTime + 0.06);
    }

    return {
        init,
        isMuted,
        setMuted,
        toggleMute,
        playSuspense,
        stopSuspense,
        playCorrect,
        playWrong,
        playWin,
        playApplause,
        startEngine,
        updateEngine,
        stopEngine,
        playCountdown,
        playHourglass,
        playTurbo,
        playVarexExhaust,
        stopVarex,
        playBump,
        playForkAlert,
        playLaser,
        playDroneHit,
        playLowTimeTick,
        playClick
    };
})();

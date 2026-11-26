/**
 * BARÜ İKA — Unified Input Controller (PS4 DualShock 4 + Keyboard + Touch)
 * Features:
 * - Automatic DualShock 4 Gamepad API detection & smooth deadzone/response curve
 * - Dual-Rumble haptic feedback presets for PS4 controllers
 * - Easy stand-friendly controls (auto-accelerate option, direct face-button quiz answers)
 * - Clean edge-triggered action callbacks for Menu, Quiz, Driving, and Laser Mini-Game
 */
window.InputManager = (function () {
    'use strict';

    // Control mode: 'auto' | 'ps4' | 'keyboard' | 'touch'
    let preferredMode = localStorage.getItem('ika_control_mode') || 'auto';
    let gamepadConnected = false;
    let gamepadName = '';
    let activeGamepadIndex = null;

    // Keyboard state
    const keys = {};
    // Touch virtual button state
    const touchState = {
        left: false,
        right: false,
        gas: false,
        brake: false,
        fire: false
    };

    // Previous gamepad button state for edge detection
    let prevButtons = [];
    let prevAxisDir = { x: 0, y: 0 };
    let listeners = [];

    // Continuous polled state
    const state = {
        steer: 0,         // -1 (left) .. +1 (right)
        accelerate: 0,    // 0 .. 1
        brake: 0,         // 0 .. 1
        turboHeld: false,
        aimX: 0,          // -1 .. +1
        aimY: 0,          // -1 .. +1
        isGamepadActive: false
    };

    function applyDeadzone(val, dz) {
        if (Math.abs(val) < dz) return 0;
        const sign = Math.sign(val);
        const norm = (Math.abs(val) - dz) / (1 - dz);
        // Gentle ease curve for super smooth, forgiving steering & aiming!
        return sign * (0.65 * norm + 0.35 * norm * norm);
    }

    function getActiveGamepad() {
        if (!navigator.getGamepads) return null;
        const pads = navigator.getGamepads();
        if (activeGamepadIndex !== null && pads[activeGamepadIndex]) {
            return pads[activeGamepadIndex];
        }
        for (let i = 0; i < pads.length; i++) {
            if (pads[i] && pads[i].connected) {
                activeGamepadIndex = i;
                return pads[i];
            }
        }
        return null;
    }

    function isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }

    function getEffectiveMode() {
        if (preferredMode !== 'auto') return preferredMode;
        if (gamepadConnected) return 'ps4';
        if (isTouchDevice() && window.innerWidth <= 1024) return 'touch';
        return 'keyboard';
    }

    function setPreferredMode(mode) {
        preferredMode = mode;
        localStorage.setItem('ika_control_mode', mode);
        updateControlUI();
    }

    function getPreferredMode() {
        return preferredMode;
    }

    function updateControlUI() {
        const eff = getEffectiveMode();
        document.body.setAttribute('data-control-mode', eff);

        // Update selector pills
        document.querySelectorAll('.control-pill').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === preferredMode);
        });

        // Update live status badges
        const badgeText = gamepadConnected
            ? '🎮 PS4 Kolu Bağlı'
            : (eff === 'touch' ? '📱 Dokunmatik Mod' : '⌨️ Klavye Modu');

        document.querySelectorAll('.gamepad-status-badge').forEach(el => {
            el.textContent = badgeText;
            el.classList.toggle('connected', gamepadConnected);
        });

        // Toggle touch overlay visibility when racing
        const touchControls = document.getElementById('race-touch-controls');
        if (touchControls) {
            const showTouch = eff === 'touch' || (preferredMode === 'auto' && isTouchDevice());
            touchControls.classList.toggle('touch-enabled', showTouch);
        }
    }

    function emitAction(action, data) {
        listeners.forEach(fn => {
            try { fn(action, data); } catch (e) {}
        });
    }

    function onAction(fn) {
        listeners.push(fn);
        return () => {
            listeners = listeners.filter(l => l !== fn);
        };
    }

    // PS4 DualShock 4 Haptic Rumble!
    function rumble(preset) {
        const gp = getActiveGamepad();
        if (!gp || !gp.vibrationActuator) return;

        const presets = {
            laser:     { duration: 70,  weakMagnitude: 0.45, strongMagnitude: 0.15 },
            drone:     { duration: 150, weakMagnitude: 0.85, strongMagnitude: 0.60 },
            turbo:     { duration: 320, weakMagnitude: 0.55, strongMagnitude: 0.40 },
            hit:       { duration: 240, weakMagnitude: 0.40, strongMagnitude: 0.90 },
            hourglass: { duration: 110, weakMagnitude: 0.50, strongMagnitude: 0.15 },
            correct:   { duration: 180, weakMagnitude: 0.65, strongMagnitude: 0.25 },
            wrong:     { duration: 280, weakMagnitude: 0.30, strongMagnitude: 0.85 },
            win:       { duration: 500, weakMagnitude: 0.80, strongMagnitude: 0.65 }
        };

        const p = presets[preset] || presets.laser;
        try {
            if (typeof gp.vibrationActuator.playEffect === 'function') {
                gp.vibrationActuator.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: p.duration,
                    weakMagnitude: p.weakMagnitude,
                    strongMagnitude: p.strongMagnitude
                }).catch(() => {});
            }
        } catch (e) {}
    }

    function isInputFocused() {
        const active = document.activeElement;
        return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    }

    // --- KEYBOARD EVENTS ---
    window.addEventListener('keydown', (e) => {
        if (isInputFocused()) return;
        const code = e.code;
        const wasDown = !!keys[code];
        keys[code] = true;

        if (!wasDown) {
            if (code === 'Space') {
                emitAction('fire');
            } else if (code === 'Escape') {
                emitAction('pause');
            } else if (code === 'Enter') {
                emitAction('confirm');
            } else if (code === 'Digit1' || code === 'Numpad1') {
                emitAction('answer', 0);
            } else if (code === 'Digit2' || code === 'Numpad2') {
                emitAction('answer', 1);
            } else if (code === 'Digit3' || code === 'Numpad3') {
                emitAction('answer', 2);
            } else if (code === 'Digit4' || code === 'Numpad4') {
                emitAction('answer', 3);
            } else if (code === 'KeyC') {
                emitAction('camera');
            }
        }

        // Prevent arrow/space page scrolling while playing
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(code)) {
            const raceScreen = document.getElementById('race-screen');
            const quizArea = document.getElementById('quiz-area');
            if ((raceScreen && !raceScreen.classList.contains('hidden')) ||
                (quizArea && !quizArea.classList.contains('hidden'))) {
                e.preventDefault();
            }
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // --- GAMEPAD CONNECTION EVENTS ---
    window.addEventListener('gamepadconnected', (e) => {
        gamepadConnected = true;
        activeGamepadIndex = e.gamepad.index;
        gamepadName = e.gamepad.id || 'PS4 DualShock 4';
        prevButtons = e.gamepad.buttons.map(b => b.pressed);
        updateControlUI();
        rumble('correct');
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        if (e.gamepad.index === activeGamepadIndex) {
            activeGamepadIndex = null;
        }
        const stillAny = getActiveGamepad();
        gamepadConnected = !!stillAny;
        updateControlUI();
    });

    // Bind virtual touch controls
    function bindTouchButton(id, prop, actionName) {
        const el = document.getElementById(id);
        if (!el) return;
        const onStart = (ev) => {
            ev.preventDefault();
            touchState[prop] = true;
            el.classList.add('pressed');
            if (actionName) emitAction(actionName);
        };
        const onEnd = (ev) => {
            ev.preventDefault();
            touchState[prop] = false;
            el.classList.remove('pressed');
        };
        el.addEventListener('touchstart', onStart, { passive: false });
        el.addEventListener('touchend', onEnd, { passive: false });
        el.addEventListener('touchcancel', onEnd, { passive: false });
        el.addEventListener('mousedown', onStart);
        window.addEventListener('mouseup', () => {
            if (touchState[prop]) {
                touchState[prop] = false;
                el.classList.remove('pressed');
            }
        });
    }

    function initTouchBindings() {
        bindTouchButton('touch-left', 'left');
        bindTouchButton('touch-right', 'right');
        bindTouchButton('touch-gas', 'gas');
        bindTouchButton('touch-brake', 'brake');
    }

    // Master polling loop (runs smoothly at 60fps for PS4 Gamepad support even in menus & Quiz!)
    function pollLoop() {
        const gp = getActiveGamepad();
        if (gp && !gamepadConnected) {
            gamepadConnected = true;
            gamepadName = gp.id || 'PS4 DualShock 4';
            updateControlUI();
        }

        let steer = 0;
        let accelerate = 0;
        let brake = 0;
        let aimX = 0;
        let aimY = 0;
        let turboHeld = false;

        // 1. Keyboard inputs
        if (!isInputFocused()) {
            if (keys['ArrowLeft'] || keys['KeyA']) steer -= 1;
            if (keys['ArrowRight'] || keys['KeyD']) steer += 1;
            if (keys['ArrowUp'] || keys['KeyW']) accelerate = 1;
            if (keys['ArrowDown'] || keys['KeyS']) brake = 1;

            aimX = steer;
            if (keys['ArrowUp'] || keys['KeyW']) aimY -= 1;
            if (keys['ArrowDown'] || keys['KeyS']) aimY += 1;
        }

        // 2. Touch virtual inputs
        if (touchState.left) steer -= 1;
        if (touchState.right) steer += 1;
        if (touchState.gas) accelerate = 1;
        if (touchState.brake) brake = 1;

        // 3. PS4 DualShock 4 Gamepad inputs
        // Standard W3C Gamepad mapping for DualShock 4:
        // Buttons: 0=Cross(✕), 1=Circle(○), 2=Square(□), 3=Triangle(△),
        //          4=L1, 5=R1, 6=L2, 7=R2, 8=Share, 9=Options, 10=L3, 11=R3,
        //          12=DUp, 13=DDown, 14=DLeft, 15=DRight
        // Axes: 0=LX, 1=LY, 2=RX, 3=RY
        state.isGamepadActive = false;
        if (gp) {
            const lx = applyDeadzone(gp.axes[0] || 0, 0.14);
            const ly = applyDeadzone(gp.axes[1] || 0, 0.14);
            const rx = applyDeadzone(gp.axes[2] || 0, 0.14);
            const ry = applyDeadzone(gp.axes[3] || 0, 0.14);

            const btns = gp.buttons;
            const pressed = (i) => !!(btns[i] && (btns[i].pressed || btns[i].value > 0.35));
            const justPressed = (i) => pressed(i) && !prevButtons[i];

            const dLeft = pressed(14);
            const dRight = pressed(15);
            const dUp = pressed(12);
            const dDown = pressed(13);

            // Steering (Left Stick X or D-Pad Left/Right)
            const gpSteer = Math.abs(lx) > 0.01 ? lx : (dLeft ? -1 : dRight ? 1 : 0);
            if (Math.abs(gpSteer) > 0.01) {
                steer = gpSteer;
                state.isGamepadActive = true;
            }

            // Gas: Left Stick UP (ly < 0) OR D-Pad UP OR R2 trigger!
            // Brake: Left Stick DOWN (ly > 0) OR D-Pad DOWN OR L2 trigger OR □!
            const r2Val = btns[7] ? (btns[7].pressed ? Math.max(btns[7].value, 1) : btns[7].value) : 0;
            const l2Val = btns[6] ? (btns[6].pressed ? Math.max(btns[6].value, 1) : btns[6].value) : 0;

            const stickGas = ly < -0.05 ? Math.min(1, -ly) : 0;
            const stickBrake = ly > 0.10 ? Math.min(1, ly) : 0;
            const gpGas = Math.max(r2Val > 0.08 ? r2Val : 0, stickGas, dUp ? 1 : 0);
            const gpBrake = Math.max(l2Val > 0.08 ? l2Val : 0, stickBrake, dDown ? 1 : 0, pressed(2) ? 1 : 0);

            if (gpGas > 0.05) {
                accelerate = Math.max(accelerate, gpGas);
                state.isGamepadActive = true;
            }
            if (gpBrake > 0.05) {
                brake = Math.max(brake, gpBrake);
                state.isGamepadActive = true;
            }

            // Aiming in Cesaret Laser Mode (Left Stick OR Right Stick OR D-Pad)
            const gpAimX = Math.abs(rx) > Math.abs(lx) ? rx : (Math.abs(lx) > 0.01 ? lx : (dLeft ? -1 : dRight ? 1 : 0));
            const gpAimY = Math.abs(ry) > Math.abs(ly) ? ry : (Math.abs(ly) > 0.01 ? ly : (dUp ? -1 : dDown ? 1 : 0));
            if (Math.abs(gpAimX) > 0.01 || Math.abs(gpAimY) > 0.01) {
                aimX = gpAimX;
                aimY = gpAimY;
                state.isGamepadActive = true;
            }

            // Edge-triggered actions
            // Quiz / Bilgi direct face buttons: △(3)=A, ○(1)=B, ✕(0)=C, □(2)=D
            if (justPressed(3)) emitAction('answer', 0); // Triangle -> A
            if (justPressed(1)) {
                emitAction('answer', 1); // Circle -> B (in quiz/bilgi)
                emitAction('back');
            }
            if (justPressed(0)) {
                emitAction('answer', 2); // Cross -> C (in quiz/bilgi)
                emitAction('confirm');
                emitAction('fire');
            }
            if (justPressed(2)) emitAction('answer', 3); // Square -> D

            // R2 / R1 -> Fire laser in Cesaret
            if (justPressed(7) || justPressed(5)) emitAction('fire');

            // L1 -> Toggle camera angle
            if (justPressed(4)) emitAction('camera');

            // Options (9) -> Pause / Menu
            if (justPressed(9)) emitAction('pause');

            // Menu navigation (D-Pad or Stick flick)
            const curDirX = dLeft || lx < -0.55 ? -1 : (dRight || lx > 0.55 ? 1 : 0);
            const curDirY = dUp || ly < -0.55 ? -1 : (dDown || ly > 0.55 ? 1 : 0);
            if (curDirX !== 0 && curDirX !== prevAxisDir.x) emitAction(curDirX < 0 ? 'navLeft' : 'navRight');
            if (curDirY !== 0 && curDirY !== prevAxisDir.y) emitAction(curDirY < 0 ? 'navUp' : 'navDown');
            prevAxisDir.x = curDirX;
            prevAxisDir.y = curDirY;

            prevButtons = btns.map((b, i) => pressed(i));
        }

        state.steer = Math.max(-1, Math.min(1, steer));
        state.accelerate = Math.max(0, Math.min(1, accelerate));
        state.brake = Math.max(0, Math.min(1, brake));
        state.turboHeld = turboHeld;
        state.aimX = Math.max(-1, Math.min(1, aimX));
        state.aimY = Math.max(-1, Math.min(1, aimY));

        requestAnimationFrame(pollLoop);
    }

    function start() {
        initTouchBindings();
        updateControlUI();
        requestAnimationFrame(pollLoop);
    }

    return {
        start,
        state,
        onAction,
        rumble,
        setPreferredMode,
        getPreferredMode,
        getEffectiveMode,
        updateControlUI,
        isGamepadConnected: () => gamepadConnected
    };
})();

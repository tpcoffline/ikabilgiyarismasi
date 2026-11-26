/**
 * BARÜ İKA — 3D TRT Çocuk "Yarışçı" Race Mode + BARKUT Laser Drone Mini-Game
 * Features:
 * - Curving vibrant 3D track with BARÜ / ROBOTXPERT / 74 BARKUT 74 banners, trees, hills & clouds
 * - Spinning 3D Hourglasses (+3s / +5s), glowing Turbo/Nitro pads, and physics-bouncing traffic cones
 * - Iconic TRT Yarışçı Road Splits: LEFT = BİLGİ YOLU (Quiz from questions.js), RIGHT = CESARET YOLU (3D Laser Drone Mini-Game!)
 * - Full PS4 DualShock 4, Keyboard, Mouse, and Touch support with aim-assist & rumble
 */
window.RaceGame = (function () {
    'use strict';

    // Three.js core objects
    let renderer = null;
    let scene = null;
    let camera = null;
    let containerEl = null;
    let animFrameId = null;
    let isRunning = false;

    // World & entities
    let barkut = null;
    let worldGroup = null;
    let fxGroup = null;
    let droneGroup = null;

    // Track config (overridden by raceSettings from Admin Panel)
    let config = {
        trackLength: 2100,   // short: 1500, medium: 2100, long: 2800
        splitCount: 3,       // 2, 3, or 4
        laserDuration: 12,
        quizTimeBonus: 5,
        speedScale: 1.0,     // 0.60 .. 1.50
        aimAssist: 'medium', // 'off' | 'low' | 'medium' | 'high'
        autoDrive: false,    // false = full manual car control (default!)
        droneSpeedMult: 1.0, // slow: 0.68, normal: 1.0, fast: 1.38
        obstacleDensity: 'normal', // 'off' | 'low' | 'normal' | 'high'
        bilgiQuestionTime: 15
    };

    const AIM_ASSIST_PROFILES = {
        off:    { lockRadius: 0.0,  pullStrength: 0,  screenHit: 0.048, rayMult: 1.0 },
        low:    { lockRadius: 0.07, pullStrength: 4,  screenHit: 0.072, rayMult: 1.12 },
        medium: { lockRadius: 0.11, pullStrength: 8,  screenHit: 0.095, rayMult: 1.25 },
        high:   { lockRadius: 0.17, pullStrength: 14, screenHit: 0.135, rayMult: 1.55 }
    };

    // Track state
    let splits = [];          // { dist, triggered, alerted, archGroup }
    let turboPads = [];       // { mesh, dist, offset, triggered }
    let obstacles = [];       // { mesh, dist, offset, hit, vx, vy, vz, rotSpeed }
    let particles = [];       // { mesh, vx, vy, vz, life, maxLife }
    let laserBeams = [];      // { mesh, life, maxLife }

    // Gameplay state machine: 'idle' | 'countdown' | 'racing' | 'bilgi' | 'cesaret' | 'cesaret_summary' | 'paused' | 'finished'
    let phase = 'idle';
    let prePausePhase = 'racing';
    let lastTimestamp = 0;
    let elapsedTotal = 0;

    // Vehicle physics state
    let distZ = 0;            // 0 .. config.trackLength (world z = -distZ)
    let lateralX = 0;         // offset from road centerline (-6.0 .. +6.0, wider at splits)
    let speed = 0;            // units/sec
    let baseCruiseSpeed = 48; // cruise speed when autoDrive=true
    let maxManualSpeed = 64;  // full gas top speed
    let turboTimer = 0;
    let crashTimer = 0;       // 2-second full stall penalty on cone/duba hit!
    let nitroCharge = 50;     // 0 .. 100
    let cameraMode = 0;       // 0 = standard 3rd-person, 1 = close dynamic
    let shakeTimer = 0;
    let shakeMag = 0;

    // Race stopwatch & bonus time bank (TRT Yarışçı style: Net Time = Elapsed - Bonus!)
    let raceElapsed = 0;      // counts UP from 0.0s while racing
    let bonusSeconds = 0;     // collected seconds subtracted at finish
    let combo = 1;
    let maxCombo = 1;
    let conesHit = 0;
    let dronesDestroyed = 0;
    let droneCreditCounter = 0; // every 3 drones = -1 sn!
    let bilgiCorrect = 0;
    let bilgiTotal = 0;

    // Countdown state
    let countdownTimer = 0;
    let lastCountdownInt = 4;

    // Bilgi Gate state
    let activeQuestion = null;
    let activeShuffledCorrect = 0;
    let bilgiTimer = 15;
    let bilgiAnswered = false;

    // Cesaret Laser Mini-Game state
    let cesaretTimeLeft = 12;
    let cesaretSummaryTimer = 0;
    let cesaretDronesHitThisRound = 0;
    let cesaretTimeEarnedThisRound = 0;
    let cesaretScoreEarnedThisRound = 0;
    let drones = [];
    let droneSpawnCooldown = 0;
    let laserFireCooldown = 0;
    let reticleX = 0.5;       // normalized screen 0..1
    let reticleY = 0.42;      // normalized screen 0..1
    let lockedDrone = null;

    let actionUnsub = null;
    let onFinishCallback = null;

    // Cached reusable geometries/materials
    let roadHalfWidthNormal = 7.2;

    // --- ANALYTICAL SMOOTH TRACK CURVES ---
    // Straightens cleanly near every Road Split so the 2-way fork is symmetrical & super readable!
    function getSplitStraightFactor(dist) {
        let factor = 1.0;
        for (let i = 0; i < splits.length; i++) {
            const d = Math.abs(dist - splits[i].dist);
            if (d < 120) {
                const t = Math.max(0, (d - 45) / 75);
                const smooth = t * t * (3 - 2 * t);
                factor = Math.min(factor, smooth);
            }
        }
        // Also straighten near Start (0..80) and Finish (last 100m)
        if (dist < 90) {
            const t = dist / 90;
            factor = Math.min(factor, t * t * (3 - 2 * t));
        }
        const rem = config.trackLength - dist;
        if (rem < 110) {
            const t = Math.max(0, rem / 110);
            factor = Math.min(factor, t * t * (3 - 2 * t));
        }
        return factor;
    }

    function getRoadX(dist) {
        const raw = Math.sin(dist * 0.0085) * 20 + Math.sin(dist * 0.019 + 1.1) * 8;
        return raw * getSplitStraightFactor(dist);
    }

    function getRoadY(dist) {
        const raw = Math.sin(dist * 0.011) * 1.6 + Math.cos(dist * 0.0055) * 1.1;
        return Math.max(0, (raw + 2.2) * 0.5 * getSplitStraightFactor(dist));
    }

    function getRoadSlopeX(dist) {
        const eps = 0.8;
        return (getRoadX(dist + eps) - getRoadX(dist - eps)) / (2 * eps);
    }

    function getRoadHalfWidth(dist) {
        let w = roadHalfWidthNormal;
        for (let i = 0; i < splits.length; i++) {
            const d = Math.abs(dist - splits[i].dist);
            if (d < 95) {
                const t = 1 - Math.max(0, (d - 22) / 73);
                const smooth = t * t * (3 - 2 * t);
                w = Math.max(w, roadHalfWidthNormal + smooth * 3.8); // up to 11.0m half-width (22m total!)
            }
        }
        return w;
    }

    // --- PROCEDURAL TEXTURES ---
    function createRoadTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 512;
        const ctx = c.getContext('2d');

        // Crisp dark asphalt
        ctx.fillStyle = '#2d323b';
        ctx.fillRect(0, 0, 512, 512);

        // Subtle asphalt grain
        for (let i = 0; i < 3000; i++) {
            const gx = Math.random() * 512;
            const gy = Math.random() * 512;
            const b = 36 + Math.floor(Math.random() * 24);
            ctx.fillStyle = `rgb(${b},${b + 2},${b + 6})`;
            ctx.fillRect(gx, gy, 2, 2);
        }

        // Red-white racing curbs on outer edges
        const curbW = 28;
        for (let y = 0; y < 512; y += 64) {
            ctx.fillStyle = (y / 64) % 2 === 0 ? '#ef233c' : '#f8f9fa';
            ctx.fillRect(0, y, curbW, 64);
            ctx.fillRect(512 - curbW, y, curbW, 64);
        }

        // Solid crisp white shoulder lines
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(curbW + 8, 0, 8, 512);
        ctx.fillRect(512 - curbW - 16, 0, 8, 512);

        // Dashed lane markings (3 lanes)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let y = 20; y < 512; y += 128) {
            ctx.fillRect(174, y, 8, 70);
            ctx.fillRect(330, y, 8, 70);
        }

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, config.trackLength / 24);
        tex.anisotropy = 8;
        return tex;
    }

    function createBannerTexture(title, subtitle, bg1, bg2, accent) {
        const c = document.createElement('canvas');
        c.width = 1024;
        c.height = 256;
        const ctx = c.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 1024, 256);
        grad.addColorStop(0, bg1);
        grad.addColorStop(1, bg2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 256);

        ctx.strokeStyle = accent;
        ctx.lineWidth = 14;
        ctx.strokeRect(10, 10, 1004, 236);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 94px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 12;
        ctx.fillText(title, 512, 105);

        ctx.shadowBlur = 0;
        ctx.fillStyle = accent;
        ctx.font = '800 44px "Segoe UI", Arial, sans-serif';
        ctx.fillText(subtitle, 512, 192);

        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 8;
        return tex;
    }

    function createCheckeredTexture() {
        const c = document.createElement('canvas');
        c.width = 512;
        c.height = 128;
        const ctx = c.getContext('2d');
        const sq = 32;
        for (let y = 0; y < 128; y += sq) {
            for (let x = 0; x < 512; x += sq) {
                ctx.fillStyle = ((x / sq + y / sq) % 2 === 0) ? '#ffffff' : '#111317';
                ctx.fillRect(x, y, sq, sq);
            }
        }
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        return tex;
    }

    function createTurboPadTexture() {
        const c = document.createElement('canvas');
        c.width = 256;
        c.height = 512;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#06182c';
        ctx.fillRect(0, 0, 256, 512);

        // Glowing neon chevrons pointing forward (-Y in UV)
        ctx.strokeStyle = '#00f5d4';
        ctx.lineWidth = 22;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#00f5d4';
        ctx.shadowBlur = 18;
        [120, 255, 390].forEach(cy => {
            ctx.beginPath();
            ctx.moveTo(40, cy + 55);
            ctx.lineTo(128, cy - 35);
            ctx.lineTo(216, cy + 55);
            ctx.stroke();
        });
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 4;
        return tex;
    }

    // --- 3D OBJECT FACTORIES ---
    function createHourglassMesh(isGold) {
        const g = new THREE.Group();
        const capMat = new THREE.MeshStandardMaterial({
            color: isGold ? 0xffd700 : 0x00e5ff,
            emissive: isGold ? 0xaa6600 : 0x006688,
            emissiveIntensity: 0.6,
            roughness: 0.25,
            metalness: 0.8
        });
        const glassMat = new THREE.MeshStandardMaterial({
            color: isGold ? 0xfff0a0 : 0x80ffff,
            emissive: isGold ? 0xffb700 : 0x00f5d4,
            emissiveIntensity: 0.85,
            transparent: true,
            opacity: 0.85,
            roughness: 0.15
        });

        // Top & bottom caps
        const capGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.14, 16);
        const topCap = new THREE.Mesh(capGeo, capMat);
        topCap.position.y = 0.72;
        g.add(topCap);
        const botCap = new THREE.Mesh(capGeo, capMat);
        botCap.position.y = -0.72;
        g.add(botCap);

        // Twin glass cones meeting in the middle
        const topCone = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.68, 14), glassMat);
        topCone.rotation.x = Math.PI;
        topCone.position.y = 0.34;
        g.add(topCone);

        const botCone = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.68, 14), glassMat);
        botCone.position.y = -0.34;
        g.add(botCone);

        // Glowing halo ring around it for high readability!
        const ringMat = new THREE.MeshBasicMaterial({
            color: isGold ? 0xffdd33 : 0x00ffcc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.55
        });
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.74, 0.88, 24), ringMat);
        g.add(ring);

        return g;
    }

    function createConeObstacle() {
        const g = new THREE.Group();
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 0.12, 0.95),
            new THREE.MeshStandardMaterial({ color: 0x22252b, roughness: 0.8 })
        );
        base.position.y = 0.06;
        g.add(base);

        const cone = new THREE.Mesh(
            new THREE.ConeGeometry(0.38, 1.15, 12),
            new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.45 })
        );
        cone.position.y = 0.68;
        cone.castShadow = true;
        g.add(cone);

        // Reflective white stripe
        const stripe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.25, 0.24, 12),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x555555 })
        );
        stripe.position.y = 0.72;
        g.add(stripe);

        return g;
    }

    function createRoadSplitGate(dist) {
        const group = new THREE.Group();
        const cx = getRoadX(dist);
        const cy = getRoadY(dist);
        group.position.set(cx, cy, -dist);

        const pillarGeo = new THREE.BoxGeometry(0.9, 7.6, 0.9);
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.65, metalness: 0.4 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xf97316, emissive: 0xea580c, emissiveIntensity: 0.65, metalness: 0.4 });
        const centerMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.5, metalness: 0.5 });

        // Three pillars: Left (-10.6), Center (0), Right (+10.6)
        const pLeft = new THREE.Mesh(pillarGeo, blueMat);
        pLeft.position.set(-10.6, 3.8, 0);
        group.add(pLeft);

        const pCenter = new THREE.Mesh(new THREE.BoxGeometry(1.1, 7.8, 1.4), centerMat);
        pCenter.position.set(0, 3.9, 0);
        group.add(pCenter);

        const pRight = new THREE.Mesh(pillarGeo, redMat);
        pRight.position.set(10.6, 3.8, 0);
        group.add(pRight);

        // Central lane divider barrier leading up to center pillar (makes left vs right super clear!)
        const divider = new THREE.Mesh(
            new THREE.BoxGeometry(0.65, 0.7, 34),
            new THREE.MeshStandardMaterial({ color: 0x1e293b, emissive: 0x0f172a, roughness: 0.5 })
        );
        divider.position.set(0, 0.35, 17);
        group.add(divider);

        const dividerStrip = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.14, 34),
            new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.8 })
        );
        dividerStrip.position.set(0, 0.72, 17);
        group.add(dividerStrip);

        // LEFT ARCH BANNER: BİLGİ YOLU
        const bilgiTex = createBannerTexture(
            'BİLGİ YOLU',
            `SORU ÇÖZ · -${config.quizTimeBonus} sn`,
            '#0369a1', '#0284c7', '#7dd3fc'
        );
        const bilgiBoard = new THREE.Mesh(
            new THREE.BoxGeometry(10.2, 2.55, 0.7),
            new THREE.MeshStandardMaterial({ map: bilgiTex, emissive: 0x075985, emissiveIntensity: 0.25 })
        );
        bilgiBoard.position.set(-5.3, 6.6, 0);
        group.add(bilgiBoard);

        // RIGHT ARCH BANNER: CESARET YOLU
        const cesaretTex = createBannerTexture(
            'CESARET YOLU',
            '3 DRONE VUR · -1 sn',
            '#c2410c', '#dc2626', '#fde047'
        );
        const cesaretBoard = new THREE.Mesh(
            new THREE.BoxGeometry(10.2, 2.55, 0.7),
            new THREE.MeshStandardMaterial({ map: cesaretTex, emissive: 0x9a3412, emissiveIntensity: 0.25 })
        );
        cesaretBoard.position.set(5.3, 6.6, 0);
        group.add(cesaretBoard);

        // Translucent energy curtains inside each portal
        const leftCurtain = new THREE.Mesh(
            new THREE.PlaneGeometry(9.6, 5.2),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
        );
        leftCurtain.position.set(-5.3, 2.6, 0);
        group.add(leftCurtain);

        const rightCurtain = new THREE.Mesh(
            new THREE.PlaneGeometry(9.6, 5.2),
            new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0.16, side: THREE.DoubleSide })
        );
        rightCurtain.position.set(5.3, 2.6, 0);
        group.add(rightCurtain);

        // Glowing lane floor pads in front of each gate
        const leftPad = new THREE.Mesh(
            new THREE.PlaneGeometry(7.2, 24),
            new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.22 })
        );
        leftPad.rotation.x = -Math.PI / 2;
        leftPad.position.set(-5.3, 0.05, 16);
        group.add(leftPad);

        const rightPad = new THREE.Mesh(
            new THREE.PlaneGeometry(7.2, 24),
            new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.22 })
        );
        rightPad.rotation.x = -Math.PI / 2;
        rightPad.position.set(5.3, 0.05, 16);
        group.add(rightPad);

        return group;
    }

    function createFinishArch(dist) {
        const group = new THREE.Group();
        group.position.set(getRoadX(dist), getRoadY(dist), -dist);

        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x008b74, emissiveIntensity: 0.45 });
        [-8.2, 8.2].forEach(px => {
            const p = new THREE.Mesh(new THREE.BoxGeometry(1.1, 8.5, 1.1), pillarMat);
            p.position.set(px, 4.25, 0);
            group.add(p);
        });

        const checkTex = createCheckeredTexture();
        const bar = new THREE.Mesh(
            new THREE.BoxGeometry(17.6, 1.4, 0.9),
            new THREE.MeshStandardMaterial({ map: checkTex })
        );
        bar.position.set(0, 7.6, 0);
        group.add(bar);

        const topTex = createBannerTexture('BİTİŞ ÇİZGİSİ', 'BARÜ İKA · 74 BARKUT 74', '#0f172a', '#0c4a6e', '#00f5d4');
        const topSign = new THREE.Mesh(
            new THREE.BoxGeometry(16.8, 2.2, 0.8),
            new THREE.MeshStandardMaterial({ map: topTex })
        );
        topSign.position.set(0, 9.4, 0);
        group.add(topSign);

        // Checkered road finish strip
        const strip = new THREE.Mesh(
            new THREE.PlaneGeometry(14.5, 4.0),
            new THREE.MeshBasicMaterial({ map: checkTex })
        );
        strip.rotation.x = -Math.PI / 2;
        strip.position.y = 0.06;
        group.add(strip);

        return group;
    }

    function createStylizedTree() {
        const g = new THREE.Group();
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.4, 2.2, 7),
            new THREE.MeshStandardMaterial({ color: 0x6b4226, roughness: 0.9 })
        );
        trunk.position.y = 1.1;
        g.add(trunk);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x1b8a4b, roughness: 0.8 });
        const c1 = new THREE.Mesh(new THREE.ConeGeometry(2.0, 3.4, 7), leafMat);
        c1.position.y = 3.4;
        g.add(c1);
        const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.45, 2.7, 7), new THREE.MeshStandardMaterial({ color: 0x22a85c, roughness: 0.8 }));
        c2.position.y = 5.2;
        g.add(c2);
        return g;
    }

    function createDrone3D(type) {
        // Types: 'scout' (+2s, green), 'striker' (+4s, amber), 'command' (+6s, gold/red)
        const cfg = {
            scout:   { color: 0x10b981, emissive: 0x059669, scale: 1.25, bonusTime: 2, points: 100, speed: 6.5, label: 'KEŞİF DRONE' },
            striker: { color: 0xf59e0b, emissive: 0xd97706, scale: 1.05, bonusTime: 4, points: 220, speed: 10.5, label: 'HIZLI FPV' },
            command: { color: 0xef4444, emissive: 0xfacc15, scale: 1.15, bonusTime: 6, points: 400, speed: 13.0, label: 'ALTIN KOMUTA' }
        }[type];

        const g = new THREE.Group();

        // Central core body
        const bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1f2937,
            roughness: 0.35,
            metalness: 0.75
        });
        const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), bodyMat);
        core.scale.set(1.2, 0.55, 1.2);
        g.add(core);

        // Glowing colored sensor eye & beacon
        const glowMat = new THREE.MeshStandardMaterial({
            color: cfg.color,
            emissive: cfg.color,
            emissiveIntensity: 1.6
        });
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), glowMat);
        eye.position.set(0, -0.05, 0.42);
        g.add(eye);

        // 4 arms + spinning rotors
        const armMat = new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.7, roughness: 0.4 });
        const rotorMat = new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
        const rotors = [];

        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 0.12), armMat);
            arm.position.set(sx * 0.52, 0.05, sz * 0.52);
            arm.rotation.y = (sx * sz > 0) ? -Math.PI / 4 : Math.PI / 4;
            g.add(arm);

            const rotor = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.42, 16), rotorMat);
            rotor.rotation.x = -Math.PI / 2;
            rotor.position.set(sx * 0.85, 0.15, sz * 0.85);
            g.add(rotor);
            rotors.push(rotor);
        });

        // Target highlight ring (bigger glowing ring on Command gold drone!)
        const targetRing = new THREE.Mesh(
            new THREE.RingGeometry(1.1, 1.28, 28),
            new THREE.MeshBasicMaterial({
                color: type === 'command' ? 0xfacc15 : cfg.color,
                transparent: true,
                opacity: type === 'command' ? 0.85 : 0.45,
                side: THREE.DoubleSide
            })
        );
        g.add(targetRing);

        g.scale.setScalar(cfg.scale);

        return {
            mesh: g,
            rotors,
            targetRing,
            type,
            bonusTime: cfg.bonusTime,
            points: cfg.points,
            baseSpeed: cfg.speed * (config.droneSpeedMult || 1.0),
            label: cfg.label,
            colorHex: cfg.color,
            hitRadius: 1.55 * cfg.scale
        };
    }

    // --- BUILD WORLD ---
    function buildWorld() {
        if (worldGroup) scene.remove(worldGroup);
        if (fxGroup) scene.remove(fxGroup);
        if (droneGroup) scene.remove(droneGroup);

        worldGroup = new THREE.Group();
        fxGroup = new THREE.Group();
        droneGroup = new THREE.Group();
        scene.add(worldGroup);
        scene.add(fxGroup);
        scene.add(droneGroup);

        splits = [];
        turboPads = [];
        obstacles = [];
        particles = [];
        laserBeams = [];
        drones = [];

        // 1. Place Road Splits evenly along track
        const sc = Math.max(1, Math.min(4, config.splitCount || 3));
        for (let i = 1; i <= sc; i++) {
            const frac = i / (sc + 1);
            const dist = Math.round(config.trackLength * frac);
            splits.push({ dist, triggered: false, alerted: false, archGroup: null });
        }

        // 2. Build curved 3D Road Ribbon Mesh
        const step = 4;
        const numSteps = Math.ceil((config.trackLength + 160) / step);
        const positions = [];
        const uvs = [];
        const indices = [];

        for (let i = 0; i <= numSteps; i++) {
            const d = -40 + i * step;
            const cx = getRoadX(Math.max(0, d));
            const cy = getRoadY(Math.max(0, d));
            const hw = getRoadHalfWidth(Math.max(0, d));
            const z = -d;

            positions.push(cx - hw, cy + 0.02, z);
            positions.push(cx + hw, cy + 0.02, z);

            const v = d / (config.trackLength);
            uvs.push(0, v);
            uvs.push(1, v);

            if (i < numSteps) {
                const base = i * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 1, base + 3, base + 2);
            }
        }

        const roadGeo = new THREE.BufferGeometry();
        roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        roadGeo.setIndex(indices);
        roadGeo.computeVertexNormals();

        const roadMat = new THREE.MeshStandardMaterial({
            map: createRoadTexture(),
            roughness: 0.78,
            metalness: 0.08
        });
        const roadMesh = new THREE.Mesh(roadGeo, roadMat);
        roadMesh.receiveShadow = true;
        worldGroup.add(roadMesh);

        // 3. Vibrant Green Ground Plane & Rolling Hills
        const groundGeo = new THREE.PlaneGeometry(500, config.trackLength + 500, 1, 1);
        groundGeo.rotateX(-Math.PI / 2);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x38a169, roughness: 0.95 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.position.set(0, -0.25, -config.trackLength / 2);
        ground.receiveShadow = true;
        worldGroup.add(ground);

        // Distant stylized mountain hills + fluffy clouds
        const hillMat1 = new THREE.MeshStandardMaterial({ color: 0x2f855a, roughness: 0.95 });
        const hillMat2 = new THREE.MeshStandardMaterial({ color: 0x276749, roughness: 0.95 });
        for (let d = 0; d < config.trackLength + 200; d += 120) {
            const cx = getRoadX(d);
            [-1, 1].forEach(side => {
                const r = 24 + (d % 17) * 1.4;
                const h = 14 + ((d * 3) % 19);
                const hill = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), side < 0 ? hillMat1 : hillMat2);
                hill.position.set(cx + side * (48 + (d % 25)), h * 0.42 - 1, -d);
                worldGroup.add(hill);
            });
        }

        // Fluffy sky clouds
        const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
        for (let d = 40; d < config.trackLength + 180; d += 110) {
            const cg = new THREE.Group();
            const px = getRoadX(d) + (Math.sin(d) * 70);
            const py = 32 + (d % 14);
            for (let b = 0; b < 3; b++) {
                const puff = new THREE.Mesh(new THREE.SphereGeometry(3.2 + (b === 1 ? 1.5 : 0), 8, 8), cloudMat);
                puff.position.set((b - 1) * 3.4, b === 1 ? 0.9 : 0, 0);
                cg.add(puff);
            }
            cg.position.set(px, py, -d);
            worldGroup.add(cg);
        }

        // 4. Roadside Trees & BARÜ / ROBOTXPERT Sponsor Banners
        const banner1 = createBannerTexture('BARÜ İKA KULÜBÜ', '74 BARKUT 74 · ROBOTXPERT', '#0f172a', '#0c4a6e', '#00f5d4');
        const banner2 = createBannerTexture('BARTIN ÜNİVERSİTESİ', 'YARIŞÇI · BİLGİ & CESARET', '#1e1b4b', '#312e81', '#fbbf24');

        for (let d = 25; d < config.trackLength; d += 34) {
            const cx = getRoadX(d);
            const cy = getRoadY(d);
            const hw = getRoadHalfWidth(d);

            // Trees on both sides
            [-1, 1].forEach(side => {
                const tree = createStylizedTree();
                const distFromRoad = hw + 5.5 + ((d * 7 + (side > 0 ? 3 : 0)) % 9);
                tree.position.set(cx + side * distFromRoad, cy - 0.2, -d);
                const s = 0.85 + ((d % 5) * 0.12);
                tree.scale.setScalar(s);
                worldGroup.add(tree);
            });

            // Periodic glowing sponsor arches / roadside billboards
            if (d % 204 === 25) {
                const side = ((d / 204) % 2 === 0) ? 1 : -1;
                const board = new THREE.Mesh(
                    new THREE.BoxGeometry(7.2, 2.2, 0.35),
                    new THREE.MeshStandardMaterial({ map: side > 0 ? banner1 : banner2 })
                );
                board.position.set(cx + side * (hw + 4.8), cy + 2.6, -d);
                board.rotation.y = side > 0 ? -0.45 : 0.45;
                worldGroup.add(board);
            }
        }

        // 5. Road Split Portals (BİLGİ vs CESARET!)
        splits.forEach(sp => {
            sp.archGroup = createRoadSplitGate(sp.dist);
            worldGroup.add(sp.archGroup);
        });

        // 6. Finish Line Arch
        worldGroup.add(createFinishArch(config.trackLength));

        // 7. Populate Turbo Pads & Traffic Cones (Dubas) along the track (No hourglasses!)
        const turboTex = createTurboPadTexture();
        const turboMat = new THREE.MeshBasicMaterial({ map: turboTex, transparent: true, opacity: 0.94 });

        function isNearSplit(d) {
            return splits.some(sp => Math.abs(d - sp.dist) < 70);
        }

        const lanes = [-4.4, 0, 4.4];
        const obsStepMap = { off: 70, low: 58, normal: 42, high: 32 };
        const obsProbMap = { off: 0, low: 0.45, normal: 0.68, high: 0.80 };
        const spawnStep = obsStepMap[config.obstacleDensity] || 42;
        const obsProb = obsProbMap[config.obstacleDensity] !== undefined ? obsProbMap[config.obstacleDensity] : 0.68;

        for (let d = 70; d < config.trackLength - 65; d += spawnStep) {
            if (isNearSplit(d)) continue;
            const cx = getRoadX(d);
            const cy = getRoadY(d);

            if (Math.random() < obsProb) {
                // Traffic Cone (Duba) — 2-second stop penalty if hit!
                const offset = lanes[Math.floor(Math.random() * 3)];
                const cone = createConeObstacle();
                cone.position.set(cx + offset, cy, -d);
                worldGroup.add(cone);
                obstacles.push({ mesh: cone, dist: d, offset, hit: false, vx: 0, vy: 0, vz: 0, rotSpeed: 0 });
            } else {
                // Glowing Turbo/Nitro Pad
                const offset = lanes[Math.floor(Math.random() * 3)];
                const pad = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 7.5), turboMat);
                pad.rotation.x = -Math.PI / 2;
                pad.position.set(cx + offset, cy + 0.08, -d);
                worldGroup.add(pad);
                turboPads.push({ mesh: pad, dist: d, offset, triggered: false });
            }
        }
    }

    // --- PARTICLE & LASER FX ---
    function spawnExplosion(pos, colorHex, count) {
        const n = count || 18;
        const geo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
        for (let i = 0; i < n; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0xffffff : colorHex, transparent: true, opacity: 1 });
            const m = new THREE.Mesh(geo, mat);
            m.position.copy(pos);
            fxGroup.add(m);
            particles.push({
                mesh: m,
                vx: (Math.random() - 0.5) * 18,
                vy: (Math.random() - 0.2) * 16,
                vz: (Math.random() - 0.5) * 18,
                life: 0,
                maxLife: 0.45 + Math.random() * 0.35
            });
        }
    }

    function spawnLaserBeam(startPos, endPos, isHit) {
        // Thick bright laser cylinder between BARKUT roof turret & target
        const dir = new THREE.Vector3().subVectors(endPos, startPos);
        const len = dir.length();
        const cylGeo = new THREE.CylinderGeometry(isHit ? 0.09 : 0.055, isHit ? 0.14 : 0.08, len, 8);
        cylGeo.rotateX(Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({
            color: isHit ? 0xff2a55 : 0x00f5d4,
            transparent: true,
            opacity: 0.95
        });
        const beam = new THREE.Mesh(cylGeo, mat);
        beam.position.copy(startPos).addScaledVector(dir, 0.5);
        beam.lookAt(endPos);
        fxGroup.add(beam);
        laserBeams.push({ mesh: beam, life: 0, maxLife: 0.18 });
    }

    function updateFX(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life += dt;
            if (p.life >= p.maxLife) {
                fxGroup.remove(p.mesh);
                particles.splice(i, 1);
            } else {
                p.mesh.position.x += p.vx * dt;
                p.mesh.position.y += p.vy * dt;
                p.mesh.position.z += p.vz * dt;
                p.vy -= 22 * dt;
                p.mesh.rotation.x += 8 * dt;
                p.mesh.rotation.y += 6 * dt;
                const ratio = 1 - p.life / p.maxLife;
                p.mesh.material.opacity = ratio;
                p.mesh.scale.setScalar(ratio);
            }
        }

        for (let i = laserBeams.length - 1; i >= 0; i--) {
            const b = laserBeams[i];
            b.life += dt;
            if (b.life >= b.maxLife) {
                fxGroup.remove(b.mesh);
                laserBeams.splice(i, 1);
            } else {
                const ratio = 1 - b.life / b.maxLife;
                b.mesh.material.opacity = ratio;
                b.mesh.scale.set(ratio, ratio, 1);
            }
        }
    }

    // --- FLOATING HUD POPUPS ---
    function showFloatingBanner(text, type) {
        const el = document.getElementById('race-floating-banner');
        if (!el) return;
        el.textContent = text;
        el.className = 'race-floating-banner show ' + (type || 'info');
        clearTimeout(el._hideTimeout);
        el._hideTimeout = setTimeout(() => {
            el.classList.remove('show');
        }, 2100);
    }

    function spawnScreenPopup(text, screenX, screenY, color) {
        const host = document.getElementById('race-popups');
        if (!host) return;
        const div = document.createElement('div');
        div.className = 'race-popup-item';
        div.textContent = text;
        div.style.left = screenX + 'px';
        div.style.top = screenY + 'px';
        if (color) div.style.color = color;
        host.appendChild(div);
        setTimeout(() => div.remove(), 950);
    }

    function flashTimerDelta(seconds) {
        const el = document.getElementById('race-timer-bonus');
        if (!el) return;
        el.textContent = `-${seconds} sn!`;
        el.classList.remove('pop');
        void el.offsetWidth;
        el.classList.add('pop');
    }

    // --- BİLGİ GATE LOGIC ---
    function enterBilgiGate() {
        phase = 'bilgi';
        bilgiTotal++;
        bilgiAnswered = false;
        bilgiTimer = config.bilgiQuestionTime || 15;
        SoundFX.updateEngine(0, false, false);

        const q = (typeof window.getRaceQuestion === 'function')
            ? window.getRaceQuestion()
            : { text: 'Türkiye\'nin başkenti neresidir?', options: ['Ankara', 'İstanbul', 'İzmir', 'Bursa'], correct: 0, difficulty: 'kolay' };

        activeQuestion = q;

        // Shuffle options
        const indices = [0, 1, 2, 3];
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        activeShuffledCorrect = indices.indexOf(parseInt(q.correct, 10));

        const diffMap = {
            kolay: { label: '🟢 Kolay', bonus: Math.max(2, config.quizTimeBonus - 1) },
            orta:  { label: '🟡 Orta',  bonus: config.quizTimeBonus },
            zor:   { label: '🔴 Zor',   bonus: config.quizTimeBonus + 1 }
        };
        const info = diffMap[q.difficulty] || diffMap.kolay;

        const overlay = document.getElementById('bilgi-gate-overlay');
        document.getElementById('bilgi-diff-badge').textContent = `${info.label} · -${info.bonus} sn`;
        document.getElementById('bilgi-question-text').textContent = q.text;
        document.getElementById('bilgi-feedback').textContent = '';
        document.getElementById('bilgi-feedback').className = 'bilgi-feedback';

        const ps4Icons = ['△', '○', '✕', '□'];
        const letters = ['A', 'B', 'C', 'D'];
        const btns = overlay.querySelectorAll('.bilgi-option-btn');
        btns.forEach((btn, idx) => {
            btn.className = 'bilgi-option-btn';
            btn.innerHTML = `<span class="opt-key-badge"><span class="kb-key">${letters[idx]}</span><span class="ps4-key">${ps4Icons[idx]}</span></span><span class="opt-label">${q.options[indices[idx]]}</span>`;
            btn.onclick = () => answerBilgi(idx);
        });

        overlay.classList.remove('hidden');
        SoundFX.playForkAlert();
    }

    function answerBilgi(idx) {
        if (phase !== 'bilgi' || bilgiAnswered) return;
        bilgiAnswered = true;

        const overlay = document.getElementById('bilgi-gate-overlay');
        const btns = overlay.querySelectorAll('.bilgi-option-btn');
        const fb = document.getElementById('bilgi-feedback');
        const q = activeQuestion;

        const diffMap = {
            kolay: { bonus: Math.max(2, config.quizTimeBonus - 1) },
            orta:  { bonus: config.quizTimeBonus },
            zor:   { bonus: config.quizTimeBonus + 1 }
        };
        const info = diffMap[q.difficulty] || diffMap.kolay;

        if (idx === activeShuffledCorrect) {
            if (btns[idx]) btns[idx].classList.add('correct');
            bilgiCorrect++;
            combo = Math.min(5, combo + 1);
            maxCombo = Math.max(maxCombo, combo);
            bonusSeconds += info.bonus;
            nitroCharge = Math.min(100, nitroCharge + 40);
            flashTimerDelta(info.bonus);
            SoundFX.playCorrect();
            InputManager.rumble('correct');
            if (typeof window.launchConfetti === 'function') window.launchConfetti(35);

            fb.textContent = `DOĞRU! -${info.bonus} sn süre indirimi! TURBO ÇIKIŞ!`;
            fb.className = 'bilgi-feedback ok';

            setTimeout(() => {
                overlay.classList.add('hidden');
                if (phase === 'bilgi') {
                    phase = 'racing';
                    turboTimer = 2.6;
                    SoundFX.playTurbo();
                    showFloatingBanner(`⚡ BİLGİ TURBO! -${info.bonus} sn`, 'turbo');
                }
            }, 1350);
        } else {
            if (idx >= 0 && btns[idx]) btns[idx].classList.add('wrong');
            if (btns[activeShuffledCorrect]) btns[activeShuffledCorrect].classList.add('correct');
            combo = 1;
            SoundFX.playWrong();
            InputManager.rumble('wrong');

            fb.textContent = idx < 0
                ? 'Süre doldu! Yola devam ediliyor...'
                : 'Yanlış cevap! Moral bozma, yarışa devam!';
            fb.className = 'bilgi-feedback bad';

            setTimeout(() => {
                overlay.classList.add('hidden');
                if (phase === 'bilgi') {
                    phase = 'racing';
                    speed = Math.max(speed, 30);
                }
            }, 1500);
        }
    }

    // --- CESARET GATE: BARKUT 3D LAZER DRONE MİNİ-OYUNU ---
    function enterCesaretGate() {
        phase = 'cesaret';
        cesaretTimeLeft = config.laserDuration || 12;
        cesaretDronesHitThisRound = 0;
        cesaretTimeEarnedThisRound = 0;
        cesaretScoreEarnedThisRound = 0;
        droneSpawnCooldown = 0.1;
        laserFireCooldown = 0;
        reticleX = 0.5;
        reticleY = 0.42;
        lockedDrone = null;

        // Auto-center BARKUT in the middle of the road & cleanly past the split arch pillars!
        distZ = Math.min(config.trackLength - 40, distZ + 10);
        lateralX = 0;
        const centerX = getRoadX(distZ);
        const centerY = getRoadY(distZ);
        barkut.root.position.set(centerX, centerY, -distZ);
        barkut.root.rotation.set(0, 0, 0);
        barkut.chassis.rotation.z = 0;
        camera.position.set(centerX, centerY + 2.4, -distZ + 2.55);

        // Clear any leftover drones
        clearDrones();
        SoundFX.stopVarex();
        SoundFX.updateEngine(0, false, false);
        SoundFX.playForkAlert();

        document.getElementById('race-screen').classList.add('cesaret-active');
        document.getElementById('cesaret-hud').classList.remove('hidden');
        document.getElementById('cesaret-summary').classList.add('hidden');
        updateCesaretHUD();

        // Spawn initial wave of 5 drones spread across distinct sky zones (left/right/high/low)!
        const initialZones = [
            { x: -18, y: 11.5, dir:  1 },
            { x:  18, y: 12.0, dir: -1 },
            { x: -14, y:  4.2, dir:  1 },
            { x:  15, y:  5.0, dir: -1 },
            { x:   0, y: 13.2, dir:  1 }
        ];
        initialZones.forEach(z => spawnDrone(true, z));
    }

    function clearDrones() {
        drones.forEach(d => droneGroup.remove(d.mesh));
        drones = [];
    }

    function spawnDrone(initialSpread, zone) {
        const r = Math.random();
        const type = r < 0.48 ? 'scout' : (r < 0.82 ? 'striker' : 'command');
        const d = createDrone3D(type);

        // Wide open 3D sky arena centered directly ahead of BARKUT
        const cx = barkut.root.position.x;
        const cy = barkut.root.position.y;
        const cz = barkut.root.position.z;

        const dir = zone ? zone.dir : (Math.random() < 0.5 ? 1 : -1);
        const depth = 19 + Math.random() * 17; // 19..36 units ahead
        // Horizontal roam limit scales with depth so drones cover full left-to-right screen!
        const roamHalfX = 16 + (depth - 19) * 0.65; // ~16..27 units each side!
        const startX = zone
            ? cx + zone.x + (Math.random() - 0.5) * 4
            : (initialSpread ? cx + (Math.random() - 0.5) * roamHalfX * 1.9 : cx - dir * (roamHalfX + 2));
        const baseY = zone
            ? cy + zone.y
            : cy + 3.0 + Math.random() * 11.2; // wide vertical spread: low skimmers to high flyers!

        d.mesh.position.set(startX, baseY, cz - depth);
        d.dir = dir;
        d.baseY = baseY;
        d.bobAmp = (d.type === 'scout' ? 1.4 : 2.5) + Math.random() * 1.1;
        d.bobSpeed = 1.9 + Math.random() * 1.8;
        d.bobPhase = Math.random() * Math.PI * 2;
        d.centerX = cx;
        d.minY = cy + 2.4;
        d.maxY = cy + 15.5;
        d.roamHalfX = roamHalfX;
        d.depth = depth;
        d.zDir = Math.random() < 0.5 ? 1 : -1;
        d.baseZ = cz - depth;

        droneGroup.add(d.mesh);
        drones.push(d);
    }

    function updateCesaretHUD() {
        const tEl = document.getElementById('cesaret-timer');
        const hitsEl = document.getElementById('cesaret-hits');
        const bonusEl = document.getElementById('cesaret-bonus');
        if (tEl) tEl.textContent = Math.max(0, cesaretTimeLeft).toFixed(1) + 's';
        if (hitsEl) hitsEl.textContent = `${cesaretDronesHitThisRound} (${droneCreditCounter}/3)`;
        if (bonusEl) bonusEl.textContent = '-' + cesaretTimeEarnedThisRound + ' sn';
    }

    function updateCesaretMiniGame(dt) {
        cesaretTimeLeft -= dt;

        // Smoothly keep BARKUT centered & straight forward for clean panoramic turret view
        barkut.root.rotation.y = THREE.MathUtils.lerp(barkut.root.rotation.y, 0, Math.min(1, dt * 8));
        barkut.chassis.rotation.z = THREE.MathUtils.lerp(barkut.chassis.rotation.z, 0, Math.min(1, dt * 8));

        // Panoramic camera right behind/above BARKUT's roof laser turret
        const bx = barkut.root.position.x;
        const by = barkut.root.position.y;
        const bz = barkut.root.position.z;

        const targetCamPos = new THREE.Vector3(bx, by + 2.4, bz + 2.55);
        camera.position.lerp(targetCamPos, Math.min(1, dt * 8));
        camera.fov = THREE.MathUtils.lerp(camera.fov, 68, Math.min(1, dt * 6));
        camera.updateProjectionMatrix();
        camera.lookAt(bx, by + 6.4, bz - 24);

        // Move reticle with PS4 Stick or Keyboard
        const inp = InputManager.state;
        const aimSpeed = 0.88;
        if (Math.abs(inp.aimX) > 0.01 || Math.abs(inp.aimY) > 0.01) {
            reticleX = Math.max(0.05, Math.min(0.95, reticleX + inp.aimX * aimSpeed * dt));
            reticleY = Math.max(0.10, Math.min(0.86, reticleY + inp.aimY * aimSpeed * dt));
        }

        // Update drones & compute projected screen positions for smart aim-assist!
        droneSpawnCooldown -= dt;
        if (drones.length < 6 && droneSpawnCooldown <= 0) {
            spawnDrone(false);
            droneSpawnCooldown = 0.55;
        }

        const aa = AIM_ASSIST_PROFILES[config.aimAssist] || AIM_ASSIST_PROFILES.medium;
        let bestDrone = null;
        let bestDist = aa.lockRadius > 0 ? aa.lockRadius : 0.045;
        const proj = new THREE.Vector3();

        for (let i = drones.length - 1; i >= 0; i--) {
            const d = drones[i];
            d.bobPhase += dt * d.bobSpeed;
            d.mesh.position.x += d.dir * d.baseSpeed * dt;
            const nextY = d.baseY + Math.sin(d.bobPhase) * d.bobAmp;
            d.mesh.position.y = Math.max(d.minY, Math.min(d.maxY, nextY));
            d.mesh.position.z = d.baseZ + Math.cos(d.bobPhase * 0.6) * 3.5;

            // Bounce across the full wide firing gallery!
            if (d.mesh.position.x > d.centerX + d.roamHalfX) d.dir = -1;
            if (d.mesh.position.x < d.centerX - d.roamHalfX) d.dir = 1;

            // Spin rotors & face camera with target ring
            d.rotors.forEach(r => { r.rotation.z += dt * 24; });
            d.targetRing.lookAt(camera.position);

            // Project to screen 0..1
            proj.copy(d.mesh.position).project(camera);
            const sx = (proj.x + 1) * 0.5;
            const sy = (1 - proj.y) * 0.5;
            d.screenX = sx;
            d.screenY = sy;

            const dist2D = Math.hypot(sx - reticleX, sy - reticleY);
            if (dist2D < bestDist && proj.z < 1) {
                bestDist = dist2D;
                bestDrone = d;
            }
        }

        lockedDrone = bestDrone;

        // Gentle magnetic snap pull when aim-assist is enabled
        if (lockedDrone && aa.pullStrength > 0 && Math.abs(inp.aimX) < 0.35 && Math.abs(inp.aimY) < 0.35) {
            reticleX = THREE.MathUtils.lerp(reticleX, lockedDrone.screenX, Math.min(1, dt * aa.pullStrength));
            reticleY = THREE.MathUtils.lerp(reticleY, lockedDrone.screenY, Math.min(1, dt * aa.pullStrength));
        }

        // Update reticle DOM element
        const retEl = document.getElementById('laser-reticle');
        if (retEl) {
            retEl.style.left = (reticleX * 100) + '%';
            retEl.style.top = (reticleY * 100) + '%';
            retEl.classList.toggle('locked', !!lockedDrone);
            const tag = document.getElementById('reticle-target-tag');
            if (tag) {
                tag.textContent = lockedDrone ? `${lockedDrone.label} · KİLİTLENDİ` : 'HEDEF ARA';
            }
        }

        // Aim BARKUT's 3D roof laser turret toward the reticle!
        const aimRay = new THREE.Raycaster();
        aimRay.setFromCamera(new THREE.Vector2(reticleX * 2 - 1, -(reticleY * 2 - 1)), camera);
        const aimPoint = lockedDrone
            ? lockedDrone.mesh.position.clone()
            : aimRay.ray.origin.clone().addScaledVector(aimRay.ray.direction, 26);

        const localTarget = barkut.root.worldToLocal(aimPoint.clone());
        const yaw = Math.atan2(-localTarget.x, -localTarget.z);
        const horiz = Math.hypot(localTarget.x, localTarget.z);
        const pitch = Math.atan2(localTarget.y - 1.4, Math.max(0.5, horiz));
        barkut.turretYaw.rotation.y = THREE.MathUtils.lerp(barkut.turretYaw.rotation.y, yaw, Math.min(1, dt * 16));
        barkut.turretPitch.rotation.x = THREE.MathUtils.lerp(barkut.turretPitch.rotation.x, pitch, Math.min(1, dt * 16));

        laserFireCooldown = Math.max(0, laserFireCooldown - dt);
        updateCesaretHUD();

        // Finish Cesaret round when timer hits 0
        if (cesaretTimeLeft <= 0) {
            finishCesaretRound();
        }
    }

    function fireLaser(overrideScreenX, overrideScreenY) {
        if (phase !== 'cesaret' || laserFireCooldown > 0) return;
        laserFireCooldown = 0.16;

        if (typeof overrideScreenX === 'number' && typeof overrideScreenY === 'number') {
            reticleX = overrideScreenX;
            reticleY = overrideScreenY;
        }

        const ndc = new THREE.Vector2(reticleX * 2 - 1, -(reticleY * 2 - 1));
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, camera);

        // Compute turret muzzle world position
        const startPos = new THREE.Vector3();
        barkut.laserTip.getWorldPosition(startPos);

        // Check hit against drones (scaled by Admin Aim-Assist level!)
        const aa = AIM_ASSIST_PROFILES[config.aimAssist] || AIM_ASSIST_PROFILES.medium;
        let hitDrone = null;
        let hitDist = Infinity;
        const proj = new THREE.Vector3();

        for (let i = 0; i < drones.length; i++) {
            const d = drones[i];
            proj.copy(d.mesh.position).project(camera);
            const sx = (proj.x + 1) * 0.5;
            const sy = (1 - proj.y) * 0.5;
            const screenDist = Math.hypot(sx - reticleX, sy - reticleY);
            const rayDist = raycaster.ray.distanceToPoint(d.mesh.position);

            if (screenDist < aa.screenHit || rayDist < d.hitRadius * aa.rayMult) {
                if (screenDist < hitDist) {
                    hitDist = screenDist;
                    hitDrone = d;
                }
            }
        }

        SoundFX.playLaser();
        InputManager.rumble('laser');

        if (hitDrone) {
            const pos = hitDrone.mesh.position.clone();
            spawnLaserBeam(startPos, pos, true);
            spawnExplosion(pos, hitDrone.colorHex, 22);

            combo = Math.min(5, combo + 1);
            maxCombo = Math.max(maxCombo, combo);
            dronesDestroyed++;
            cesaretDronesHitThisRound++;
            droneCreditCounter++;

            SoundFX.playDroneHit(combo);
            InputManager.rumble('drone');
            shakeTimer = 0.12;
            shakeMag = 0.12;

            // Every 3 drones destroyed = -1 sn time reduction!
            const px = (typeof hitDrone.screenX === 'number' ? hitDrone.screenX : reticleX) * window.innerWidth;
            const py = (typeof hitDrone.screenY === 'number' ? hitDrone.screenY : reticleY) * window.innerHeight;
            if (droneCreditCounter >= 3) {
                droneCreditCounter -= 3;
                cesaretTimeEarnedThisRound += 1;
                SoundFX.playHourglass(true);
                spawnScreenPopup('🔥 3/3 DRONE! -1 sn!', px, py, '#facc15');
            } else {
                spawnScreenPopup(`🎯 ${droneCreditCounter}/3 DRONE`, px, py, '#00f5d4');
            }

            // Remove destroyed drone
            droneGroup.remove(hitDrone.mesh);
            const idx = drones.indexOf(hitDrone);
            if (idx >= 0) drones.splice(idx, 1);

            updateCesaretHUD();
        } else {
            const missPoint = raycaster.ray.origin.clone().addScaledVector(raycaster.ray.direction, 38);
            spawnLaserBeam(startPos, missPoint, false);
        }
    }

    function finishCesaretRound() {
        phase = 'cesaret_summary';
        cesaretSummaryTimer = 2.0;
        clearDrones();

        if (cesaretTimeEarnedThisRound > 0) {
            bonusSeconds += cesaretTimeEarnedThisRound;
            flashTimerDelta(cesaretTimeEarnedThisRound);
            SoundFX.playHourglass(true);
            if (typeof window.launchConfetti === 'function') window.launchConfetti(30);
        }

        const sumEl = document.getElementById('cesaret-summary');
        document.getElementById('cesaret-sum-hits').textContent = `${cesaretDronesHitThisRound} Drone Vuruldu!`;
        document.getElementById('cesaret-sum-time').textContent = `-${cesaretTimeEarnedThisRound} saniye süre indirimi kazanıldı!`;
        sumEl.classList.remove('hidden');
    }

    // --- MAIN RACING UPDATE ---
    function updateRacing(dt) {
        const inp = InputManager.state;

        // Stopwatch counts UP while driving!
        raceElapsed += dt;

        // Real car physics: full manual gas/coast/brake (no manual turbo — ONLY Speed Pads!) + 2s cone crash stall!
        const sp = config.speedScale || 1.0;
        const maxMan = maxManualSpeed * sp;

        if (crashTimer > 0) {
            // Stalled for 2 seconds after slamming into a duba/cone!
            crashTimer -= dt;
            turboTimer = 0;
            speed = Math.max(0, speed - 90 * dt);
        } else if (turboTimer > 0) {
            turboTimer -= dt;
            speed = THREE.MathUtils.lerp(speed, 84 * sp, Math.min(1, dt * 6));
        } else if (config.autoDrive) {
            // Optional easy auto-cruise mode (off by default)
            let targetSpeed = baseCruiseSpeed * sp;
            if (inp.accelerate > 0.08) targetSpeed = baseCruiseSpeed * sp + (maxMan - baseCruiseSpeed * sp) * inp.accelerate;
            if (inp.brake > 0.08) targetSpeed = Math.max(0, targetSpeed - 42 * sp * inp.brake);
            speed = THREE.MathUtils.lerp(speed, targetSpeed, Math.min(1, dt * 4.2));
        } else {
            // FULL MANUAL CAR CONTROL: Gas accelerates, Brake stops fast, No Gas coasts down to 0!
            if (inp.brake > 0.08) {
                speed = Math.max(0, speed - 62 * sp * inp.brake * dt);
            } else if (inp.accelerate > 0.05) {
                const topForThrottle = maxMan * (0.35 + 0.65 * inp.accelerate);
                if (speed < topForThrottle) {
                    speed = Math.min(topForThrottle, speed + 36 * sp * inp.accelerate * dt);
                } else {
                    speed = Math.max(topForThrottle, speed - 18 * sp * dt);
                }
            } else {
                // Natural engine braking & rolling resistance down to complete stop (0 km/h)!
                speed = Math.max(0, speed - 16 * sp * dt);
            }
        }

        distZ += speed * dt;

        // Speed-coupled steering: car only turns when moving (real vehicle feel!)
        const roadHW = getRoadHalfWidth(distZ);
        const maxLat = roadHW - 1.55;
        const moveSteerFactor = crashTimer > 0 ? 0 : Math.min(1, speed / 15);
        const steerSpeed = (13.5 + (speed / 70) * 4.5) * (0.7 + 0.3 * sp) * moveSteerFactor;
        lateralX += inp.steer * steerSpeed * dt;
        lateralX = Math.max(-maxLat, Math.min(maxLat, lateralX));

        // Position BARKUT accurately on the curving 3D road
        const roadCenterX = getRoadX(distZ);
        const roadY = getRoadY(distZ);
        const slopeX = getRoadSlopeX(distZ);

        barkut.root.position.set(roadCenterX + lateralX, roadY, -distZ);
        const roadYaw = Math.atan(-slopeX);
        barkut.root.rotation.y = roadYaw - inp.steer * 0.16;
        barkut.updateMotion(speed, -inp.steer, dt, elapsedTotal);
        barkut.setTurboVisual(turboTimer > 0, Math.min(1, turboTimer));
        barkut.setBrakingVisual(inp.brake > 0.2);

        // Reset turret smoothly forward while driving
        barkut.turretYaw.rotation.y = THREE.MathUtils.lerp(barkut.turretYaw.rotation.y, 0, Math.min(1, dt * 6));
        barkut.turretPitch.rotation.x = THREE.MathUtils.lerp(barkut.turretPitch.rotation.x, 0, Math.min(1, dt * 6));

        // Update Engine Audio
        SoundFX.updateEngine(speed / 65, turboTimer > 0, true);

        // Dynamic Third-Person Camera (shows the iconic BARÜ & 74 BARKUT 74 rear plate!)
        const camBack = cameraMode === 0 ? 6.6 : 4.9;
        const camHeight = cameraMode === 0 ? 3.25 : 2.35;
        const targetCam = new THREE.Vector3(
            barkut.root.position.x - slopeX * 2.5,
            barkut.root.position.y + camHeight,
            barkut.root.position.z + camBack
        );
        if (shakeTimer > 0) {
            shakeTimer -= dt;
            targetCam.x += (Math.random() - 0.5) * shakeMag;
            targetCam.y += (Math.random() - 0.5) * shakeMag;
        }
        camera.position.lerp(targetCam, Math.min(1, dt * 9));

        const targetFov = turboTimer > 0 ? 74 : (58 + (speed / 70) * 7);
        camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, Math.min(1, dt * 5));
        camera.updateProjectionMatrix();

        camera.lookAt(
            barkut.root.position.x + slopeX * 6,
            barkut.root.position.y + 1.15,
            barkut.root.position.z - 14
        );

        // Toggle speed lines effect during Turbo
        const speedLines = document.getElementById('turbo-speed-lines');
        if (speedLines) speedLines.classList.toggle('active', turboTimer > 0);

        // --- COLLISIONS: SPEED PADS (5-Second Varex Exhaust Boost!) ---
        for (let i = 0; i < turboPads.length; i++) {
            const p = turboPads[i];
            if (p.triggered) continue;
            if (Math.abs(distZ - p.dist) < 4.2 && Math.abs(lateralX - p.offset) < 2.1) {
                p.triggered = true;
                turboTimer = 5.0;
                SoundFX.playVarexExhaust(5.0);
                InputManager.rumble('turbo');
                showFloatingBanner('🔥 SPEED PAD! VAREX AÇILDI!', 'turbo');
            }
        }

        // --- COLLISIONS: TRAFFIC CONES (DUBAS — 2s FULL STOP PENALTY!) ---
        for (let i = 0; i < obstacles.length; i++) {
            const ob = obstacles[i];
            if (ob.hit) {
                ob.mesh.position.x += ob.vx * dt;
                ob.mesh.position.y += ob.vy * dt;
                ob.mesh.position.z += ob.vz * dt;
                ob.vy -= 25 * dt;
                ob.mesh.rotation.x += ob.rotSpeed * dt;
                ob.mesh.rotation.z += ob.rotSpeed * 0.7 * dt;
                if (ob.mesh.position.y < -5) ob.mesh.visible = false;
                continue;
            }
            if (Math.abs(distZ - ob.dist) < 1.8 && Math.abs(lateralX - ob.offset) < 1.45) {
                ob.hit = true;
                conesHit++;
                ob.vx = (lateralX >= ob.offset ? -1 : 1) * (8 + Math.random() * 6);
                ob.vy = 12;
                ob.vz = -Math.max(18, speed * 0.8);
                ob.rotSpeed = 14;
                speed = 0;
                crashTimer = 2.0;
                turboTimer = 0;
                SoundFX.stopVarex();
                combo = 1;
                shakeTimer = 0.45;
                shakeMag = 0.48;
                SoundFX.playBump();
                InputManager.rumble('hit');
                spawnExplosion(ob.mesh.position, 0xff5a1f, 16);
                showFloatingBanner('💥 DUBAYA ÇARPTIN! 2 sn DURDURULDUN!', 'warn');
            }
        }

        // --- CHECK ROAD SPLITS (BİLGİ vs CESARET!) ---
        for (let i = 0; i < splits.length; i++) {
            const sp = splits[i];
            const distToSplit = sp.dist - distZ;
            if (!sp.alerted && distToSplit < 175 && distToSplit > 20) {
                sp.alerted = true;
                SoundFX.playForkAlert();
                showFloatingBanner('⚡ YOL AYRIMI!  ← SOL: BİLGİ   |   SAĞ: CESARET →', 'fork');
            }
            if (!sp.triggered && distZ >= sp.dist) {
                sp.triggered = true;
                if (lateralX < 0) {
                    enterBilgiGate();
                } else {
                    enterCesaretGate();
                }
                return;
            }
        }

        // --- CHECK FINISH LINE ---
        if (distZ >= config.trackLength) {
            endRace(true);
        }
    }

    function endRace() {
        phase = 'finished';
        SoundFX.updateEngine(0, false, false);
        SoundFX.stopEngine();

        const speedLines = document.getElementById('turbo-speed-lines');
        if (speedLines) speedLines.classList.remove('active');

        const rawTime = parseFloat(raceElapsed.toFixed(1));
        const savedSeconds = parseFloat(bonusSeconds.toFixed(1));
        const netTime = parseFloat(Math.max(0.0, raceElapsed - bonusSeconds).toFixed(1));

        SoundFX.playWin();
        InputManager.rumble('win');
        if (typeof window.launchConfetti === 'function') window.launchConfetti(110);

        if (typeof onFinishCallback === 'function') {
            onFinishCallback({
                completed: true,
                rawTime,
                bonusSeconds: savedSeconds,
                netTime,
                conesHit,
                dronesDestroyed,
                bilgiCorrect,
                bilgiTotal,
                maxCombo
            });
        }
    }

    // --- UPDATE LIVE HUD ---
    function updateHUD() {
        const timerEl = document.getElementById('race-timer-value');
        const timerBox = document.getElementById('race-timer-pill');
        if (timerEl) timerEl.textContent = raceElapsed.toFixed(1) + 's';
        if (timerBox) {
            timerBox.classList.remove('warning', 'danger');
        }

        const bonusEl = document.getElementById('race-bonus-value');
        if (bonusEl) {
            const bStr = Number.isInteger(bonusSeconds) ? bonusSeconds.toString() : bonusSeconds.toFixed(1);
            bonusEl.textContent = `-${bStr} sn`;
        }

        const comboEl = document.getElementById('race-combo-badge');
        if (comboEl) {
            comboEl.textContent = `🔥 x${combo}`;
            comboEl.classList.toggle('active', combo > 1);
        }

        const speedEl = document.getElementById('race-speed-value');
        if (speedEl) {
            const kmh = Math.round(speed * 1.65);
            speedEl.textContent = kmh;
        }

        const nitroFill = document.getElementById('race-nitro-fill');
        if (nitroFill) {
            const pct = Math.max(0, Math.min(100, (turboTimer / 5.0) * 100));
            nitroFill.style.width = Math.round(pct) + '%';
            nitroFill.classList.toggle('ready', turboTimer > 0);
        }

        // Live TRT Yarışçı Track Progress Minimap
        const pct = Math.max(0, Math.min(100, (distZ / config.trackLength) * 100));
        const fill = document.getElementById('track-progress-fill');
        const marker = document.getElementById('track-player-marker');
        const pctEl = document.getElementById('track-progress-pct');
        if (fill) fill.style.width = pct + '%';
        if (marker) marker.style.left = pct + '%';
        if (pctEl) pctEl.textContent = Math.round(pct) + '%';
    }

    function renderTrackSplitMarkers() {
        const host = document.getElementById('track-split-markers');
        if (!host) return;
        host.innerHTML = '';
        splits.forEach(sp => {
            const pct = (sp.dist / config.trackLength) * 100;
            const dot = document.createElement('div');
            dot.className = 'track-split-dot';
            dot.style.left = pct + '%';
            dot.title = 'Yol Ayrımı (Bilgi / Cesaret)';
            host.appendChild(dot);
        });
    }

    // --- MAIN ANIMATION LOOP ---
    function animate(ts) {
        if (!isRunning) return;
        animFrameId = requestAnimationFrame(animate);

        if (!lastTimestamp) lastTimestamp = ts;
        const dt = Math.min(0.05, (ts - lastTimestamp) / 1000);
        lastTimestamp = ts;
        elapsedTotal += dt;

        if (phase === 'countdown') {
            countdownTimer -= dt;
            // Cinematic intro orbit sweep around BARKUT showing front & rear!
            const t = Math.max(0, countdownTimer / 3.2);
            const angle = t * Math.PI * 1.15;
            const radius = 6.2;
            camera.position.set(
                barkut.root.position.x + Math.sin(angle) * radius,
                barkut.root.position.y + 2.4 + t * 0.8,
                barkut.root.position.z + Math.cos(angle) * radius
            );
            camera.lookAt(barkut.root.position.x, barkut.root.position.y + 0.9, barkut.root.position.z);

            const cdNum = Math.ceil(countdownTimer);
            const cdEl = document.getElementById('race-countdown');
            if (cdNum !== lastCountdownInt && cdNum > 0) {
                lastCountdownInt = cdNum;
                if (cdEl) {
                    cdEl.textContent = cdNum;
                    cdEl.classList.remove('hidden', 'go');
                }
                SoundFX.playCountdown(false);
            }
            if (countdownTimer <= 0) {
                phase = 'racing';
                if (cdEl) {
                    cdEl.textContent = 'BAŞLA!';
                    cdEl.classList.add('go');
                    setTimeout(() => cdEl.classList.add('hidden'), 750);
                }
                SoundFX.playCountdown(true);
                SoundFX.startEngine();
            }
        } else if (phase === 'racing') {
            updateRacing(dt);
        } else if (phase === 'bilgi') {
            if (!bilgiAnswered) {
                bilgiTimer -= dt;
                const bar = document.getElementById('bilgi-timer-fill');
                const maxBilgiT = config.bilgiQuestionTime || 15;
                if (bar) bar.style.width = Math.max(0, (bilgiTimer / maxBilgiT) * 100) + '%';
                if (bilgiTimer <= 0) {
                    answerBilgi(-1);
                }
            }
        } else if (phase === 'cesaret') {
            updateCesaretMiniGame(dt);
        } else if (phase === 'cesaret_summary') {
            cesaretSummaryTimer -= dt;
            if (cesaretSummaryTimer <= 0) {
                document.getElementById('race-screen').classList.remove('cesaret-active');
                document.getElementById('cesaret-hud').classList.add('hidden');
                document.getElementById('cesaret-summary').classList.add('hidden');
                phase = 'racing';
                turboTimer = 2.4;
                SoundFX.playTurbo();
                if (cesaretTimeEarnedThisRound > 0) {
                    showFloatingBanner(`🎯 CESARET TAMAM! -${cesaretTimeEarnedThisRound} sn`, 'turbo');
                }
            }
        }

        updateFX(dt);
        updateHUD();
        renderer.render(scene, camera);
    }

    // --- THREE.JS INIT & EVENTS ---
    function initRenderer(container) {
        containerEl = container;
        if (renderer) return;

        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x56ccf2);
        scene.fog = new THREE.Fog(0x7dd3fc, 95, 290);

        camera = new THREE.PerspectiveCamera(62, (container.clientWidth || window.innerWidth) / (container.clientHeight || window.innerHeight), 0.2, 420);

        // Bright sunny TRT Yarışçı outdoor lighting
        const hemi = new THREE.HemisphereLight(0xe0f7ff, 0x2f855a, 0.95);
        scene.add(hemi);

        const sun = new THREE.DirectionalLight(0xfffbeb, 1.15);
        sun.position.set(45, 85, 35);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 1024;
        sun.shadow.mapSize.height = 1024;
        scene.add(sun);

        // Create BARKUT 74 3D UGV once
        barkut = BarkutModel.createBarkutUGV();
        scene.add(barkut.root);

        // Mouse & Touch aiming/firing on the 3D canvas for Cesaret Laser Mini-Game!
        const dom = renderer.domElement;
        dom.addEventListener('pointermove', (e) => {
            if (phase !== 'cesaret') return;
            const rect = dom.getBoundingClientRect();
            reticleX = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
            reticleY = Math.max(0.08, Math.min(0.88, (e.clientY - rect.top) / rect.height));
        });

        dom.addEventListener('pointerdown', (e) => {
            if (phase !== 'cesaret') return;
            e.preventDefault();
            const rect = dom.getBoundingClientRect();
            const sx = Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width));
            const sy = Math.max(0.08, Math.min(0.88, (e.clientY - rect.top) / rect.height));
            fireLaser(sx, sy);
        });

        window.addEventListener('resize', handleResize);
    }

    function handleResize() {
        if (!renderer || !containerEl || !isRunning) return;
        const w = containerEl.clientWidth || window.innerWidth;
        const h = containerEl.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    // --- PUBLIC CONTROLS ---
    function start(container, raceSettings, onFinish) {
        initRenderer(container);
        onFinishCallback = onFinish;

        // Apply admin settings
        const lengthMap = { short: 1500, medium: 2100, long: 2800 };
        const droneSpeedMap = { slow: 0.68, normal: 1.0, fast: 1.38 };
        config.trackLength = lengthMap[raceSettings.trackSize] || 2100;
        config.splitCount = Number(raceSettings.splitCount) || 3;
        config.laserDuration = Number(raceSettings.laserDuration) || 12;
        config.quizTimeBonus = Number(raceSettings.quizTimeBonus) || 5;
        config.speedScale = Math.max(0.6, Math.min(1.5, (Number(raceSettings.speedPercent) || 100) / 100));
        config.aimAssist = AIM_ASSIST_PROFILES[raceSettings.aimAssist] ? raceSettings.aimAssist : 'medium';
        config.autoDrive = raceSettings.autoDrive === true;
        config.droneSpeedMult = droneSpeedMap[raceSettings.droneSpeed] || 1.0;
        config.obstacleDensity = raceSettings.obstacleDensity || 'normal';
        config.bilgiQuestionTime = Number(raceSettings.bilgiQuestionTime) || 15;

        // Reset state
        distZ = 0;
        lateralX = 0;
        speed = 0;
        turboTimer = 0;
        crashTimer = 0;
        nitroCharge = 55;
        raceElapsed = 0;
        bonusSeconds = 0;
        combo = 1;
        maxCombo = 1;
        conesHit = 0;
        dronesDestroyed = 0;
        droneCreditCounter = 0;
        bilgiCorrect = 0;
        bilgiTotal = 0;
        countdownTimer = 3.2;
        lastCountdownInt = 4;
        elapsedTotal = 0;
        lastTimestamp = 0;

        buildWorld();
        renderTrackSplitMarkers();

        // Position BARKUT at Start Line
        barkut.root.position.set(getRoadX(0), getRoadY(0), 0);
        barkut.root.rotation.set(0, 0, 0);
        barkut.setTurboVisual(false, 0);

        // Hide sub-overlays
        document.getElementById('bilgi-gate-overlay').classList.add('hidden');
        document.getElementById('cesaret-hud').classList.add('hidden');
        document.getElementById('cesaret-summary').classList.add('hidden');
        document.getElementById('race-pause-overlay').classList.add('hidden');

        // Subscribe to InputManager edge actions
        if (actionUnsub) actionUnsub();
        actionUnsub = InputManager.onAction((action, data) => {
            if (!isRunning) return;
            if (action === 'answer' && phase === 'bilgi') {
                answerBilgi(data);
            } else if (action === 'fire' && phase === 'cesaret') {
                fireLaser();
            } else if (action === 'camera' && phase === 'racing') {
                cameraMode = (cameraMode + 1) % 2;
                showFloatingBanner(cameraMode === 0 ? '📷 Geniş Kamera' : '📷 Yakın Aksiyon Kamerası', 'info');
            } else if (action === 'pause') {
                togglePause();
            }
        });

        phase = 'countdown';
        isRunning = true;
        handleResize();
        SoundFX.init();
        InputManager.updateControlUI();

        cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(animate);
    }

    function togglePause() {
        if (!isRunning || phase === 'finished' || phase === 'countdown') return;
        const pauseEl = document.getElementById('race-pause-overlay');
        if (phase === 'paused') {
            phase = prePausePhase;
            lastTimestamp = 0;
            if (pauseEl) pauseEl.classList.add('hidden');
        } else {
            prePausePhase = phase;
            phase = 'paused';
            SoundFX.updateEngine(0, false, false);
            if (pauseEl) pauseEl.classList.remove('hidden');
        }
    }

    function toggleCamera() {
        if (!isRunning) return;
        cameraMode = (cameraMode + 1) % 2;
        showFloatingBanner(cameraMode === 0 ? '📷 Geniş Kamera' : '📷 Yakın Aksiyon Kamerası', 'info');
    }

    function stop() {
        isRunning = false;
        phase = 'idle';
        cancelAnimationFrame(animFrameId);
        SoundFX.stopEngine();
        if (actionUnsub) {
            actionUnsub();
            actionUnsub = null;
        }
        const ids = ['bilgi-gate-overlay', 'cesaret-hud', 'cesaret-summary', 'race-pause-overlay', 'race-countdown'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        const sl = document.getElementById('turbo-speed-lines');
        if (sl) sl.classList.remove('active');
        const rs = document.getElementById('race-screen');
        if (rs) rs.classList.remove('cesaret-active');
    }

    // --- LIGHTWEIGHT 3D BARKUT SHOWCASE FOR MAIN HUB ---
    let showcaseRenderer = null;
    let showcaseRaf = null;
    let showcaseActive = false;

    function initShowcase(canvasHost) {
        if (!canvasHost || typeof THREE === 'undefined') return;
        if (showcaseRenderer) {
            showcaseActive = true;
            return;
        }
        const w = canvasHost.clientWidth || 320;
        const h = canvasHost.clientHeight || 200;
        const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        r.setSize(w, h);
        canvasHost.innerHTML = '';
        canvasHost.appendChild(r.domElement);
        showcaseRenderer = r;

        const s = new THREE.Scene();
        const c = new THREE.PerspectiveCamera(36, w / h, 0.1, 40);
        c.position.set(2.9, 2.05, 3.35);
        c.lookAt(0, 0.72, 0);

        s.add(new THREE.HemisphereLight(0xdff8ff, 0x1e293b, 1.1));
        const key = new THREE.DirectionalLight(0xffffff, 1.15);
        key.position.set(5, 8, 6);
        s.add(key);
        const rim = new THREE.DirectionalLight(0x00f5d4, 0.65);
        rim.position.set(-5, 3, -5);
        s.add(rim);

        // Glowing tech turntable ring underneath BARKUT
        const disc = new THREE.Mesh(
            new THREE.RingGeometry(1.45, 1.62, 48),
            new THREE.MeshBasicMaterial({ color: 0x00f5d4, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
        );
        disc.rotation.x = -Math.PI / 2;
        disc.position.y = 0.02;
        s.add(disc);

        const model = BarkutModel.createBarkutUGV();
        s.add(model.root);

        showcaseActive = true;
        let t = 0;
        function loop() {
            showcaseRaf = requestAnimationFrame(loop);
            if (!showcaseActive) return;
            t += 0.012;
            model.root.rotation.y = t;
            model.updateMotion(12, Math.sin(t * 1.5) * 0.2, 0.016, t);
            r.render(s, c);
        }
        loop();
    }

    function setShowcaseActive(val) {
        showcaseActive = !!val;
    }

    return {
        start,
        stop,
        togglePause,
        toggleCamera,
        initShowcase,
        setShowcaseActive,
        isRunning: () => isRunning
    };
})();

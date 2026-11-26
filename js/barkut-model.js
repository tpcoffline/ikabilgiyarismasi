/**
 * 74 BARKUT 74 — Faithful 3D UGV Model Builder (Three.js)
 * Built to match BARÜ İKA Kulübü / ROBOTXPERT physical UGV photos:
 * - Gunmetal grey boxy main chassis with sloped front hood
 * - Flat closed roof lid with twin dark charcoal racing stripes continuing down the front hood
 * - Crisp CanvasTexture decals: Bartın Üniversitesi (2008) crest, BARÜ wordmark, ROBOTXPERT logo, TR 74 BARKUT 74 plates
 * - 4 oversized knobby tractor-tread off-road tires with silver steel rims & chain/axle undercarriage
 * - Compact roof-mounted tactical Laser Turret for the Cesaret mini-game
 */
window.BarkutModel = (function () {
    'use strict';

    // Helper: draw Bartın Üniversitesi circular seal on a 2D canvas
    function drawBaruSeal(ctx, cx, cy, r) {
        ctx.save();
        // Outer white ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Royal blue main circle
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.93, 0, Math.PI * 2);
        ctx.fillStyle = '#0c56b8';
        ctx.fill();

        // Inner white circle
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.62, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Stylized BARÜ inner blue mark (abstract U / book / shield)
        ctx.fillStyle = '#0c56b8';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.34, cy - r * 0.24);
        ctx.lineTo(cx - r * 0.14, cy - r * 0.36);
        ctx.lineTo(cx - r * 0.14, cy + r * 0.14);
        ctx.quadraticCurveTo(cx, cy + r * 0.28, cx + r * 0.16, cy + r * 0.12);
        ctx.lineTo(cx + r * 0.16, cy - r * 0.36);
        ctx.lineTo(cx + r * 0.34, cy - r * 0.24);
        ctx.lineTo(cx + r * 0.34, cy + r * 0.15);
        ctx.quadraticCurveTo(cx, cy + r * 0.46, cx - r * 0.34, cy + r * 0.15);
        ctx.closePath();
        ctx.fill();

        // Inner accent bar
        ctx.fillStyle = '#1890ff';
        ctx.fillRect(cx - r * 0.06, cy - r * 0.28, r * 0.12, r * 0.36);

        // Top curved label text (simplified crisp arc text)
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(r * 0.21)}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const topText = 'BARTIN ÜNİVERSİTESİ';
        const startAngle = -Math.PI * 0.86;
        const endAngle = -Math.PI * 0.14;
        const step = (endAngle - startAngle) / (topText.length - 1);
        for (let i = 0; i < topText.length; i++) {
            const a = startAngle + i * step;
            ctx.save();
            ctx.translate(cx + Math.cos(a) * r * 0.78, cy + Math.sin(a) * r * 0.78);
            ctx.rotate(a + Math.PI / 2);
            ctx.fillText(topText[i], 0, 0);
            ctx.restore();
        }

        // Bottom "2008"
        ctx.font = `bold ${Math.round(r * 0.22)}px Arial, sans-serif`;
        ctx.fillText('2008', cx, cy + r * 0.77);
        ctx.restore();
    }

    // Helper: draw BARÜ stylized logo + BARTIN ÜNİVERSİTESİ
    function drawBaruWordmark(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);

        ctx.fillStyle = '#f5f7fa';
        ctx.font = '900 112px "Segoe UI", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('BARU', 0, 0);

        // Stylized accent/umlaut swoosh above U (matches photo BARÜ logo)
        ctx.strokeStyle = '#f5f7fa';
        ctx.lineWidth = 11;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(278, -56);
        ctx.quadraticCurveTo(304, -64, 318, -76);
        ctx.stroke();

        // Subtitle BARTIN ÜNİVERSİTESİ
        ctx.font = '700 26px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#dce9ff';
        ctx.strokeStyle = '#0c56b8';
        ctx.lineWidth = 3;
        const sub = 'B A R T I N   Ü N İ V E R S İ T E S İ';
        ctx.strokeText(sub, 4, 62);
        ctx.fillText(sub, 4, 62);

        ctx.restore();
    }

    // Helper: draw ROBOTXPERT logo (white ROBOT / PERT with striking red mechanical X)
    function drawRobotXpert(ctx, cx, cy, scale) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);

        ctx.textBaseline = 'middle';
        ctx.font = '900 italic 66px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = '#f8f9fa';
        ctx.textAlign = 'right';
        ctx.fillText('ROBOT', -48, 0);

        // Red-orange mechanical X
        ctx.save();
        ctx.strokeStyle = '#e53935';
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-34, -46);
        ctx.lineTo(34, 46);
        ctx.moveTo(34, -46);
        ctx.lineTo(-34, 46);
        ctx.stroke();

        ctx.strokeStyle = '#ff8a65';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-30, -40);
        ctx.lineTo(30, 40);
        ctx.moveTo(30, -40);
        ctx.lineTo(-30, 40);
        ctx.stroke();
        ctx.restore();

        ctx.textAlign = 'left';
        ctx.fillStyle = '#f8f9fa';
        ctx.fillText('PERT', 46, 0);
        ctx.restore();
    }

    // Helper: draw authentic Turkish license plate "TR | 74 BARKUT 74"
    function drawLicensePlate(ctx, x, y, w, h) {
        ctx.save();
        // Plate drop shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.fillRect(x + 3, y + 4, w, h);

        // White plate background
        ctx.fillStyle = '#f7f8fa';
        ctx.fillRect(x, y, w, h);

        // Outer black frame
        ctx.strokeStyle = '#181a1d';
        ctx.lineWidth = Math.max(4, h * 0.055);
        ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

        // Left blue TR band
        const trW = w * 0.11;
        ctx.fillStyle = '#0c47a1';
        ctx.fillRect(x + 4, y + 4, trW, h - 8);

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(h * 0.34)}px Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TR', x + 4 + trW / 2, y + h * 0.65);

        // Plate text "74 BARKUT 74"
        ctx.fillStyle = '#111317';
        ctx.font = `900 ${Math.round(h * 0.62)}px "Arial Narrow", "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('74 BARKUT 74', x + trW + (w - trW) / 2, y + h * 0.53);

        ctx.restore();
    }

    // Helper: draw subtle brushed gunmetal surface + corner rivets
    function fillGunmetalBase(ctx, w, h) {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#66686b');
        grad.addColorStop(0.5, '#585a5d');
        grad.addColorStop(1, '#4c4e51');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Subtle panel edge highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, w - 4, h - 4);

        // Corner rivets
        const rivets = [[22, 22], [w - 22, 22], [22, h - 22], [w - 22, h - 22], [w / 2, 22]];
        ctx.fillStyle = '#9aa0a6';
        rivets.forEach(([rx, ry]) => {
            ctx.beginPath();
            ctx.arc(rx, ry, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function createBackPanelTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 768;
        const ctx = canvas.getContext('2d');

        fillGunmetalBase(ctx, 1024, 768);
        drawBaruSeal(ctx, 215, 295, 128);
        drawBaruWordmark(ctx, 375, 290, 1.38);
        drawLicensePlate(ctx, 212, 560, 600, 130);

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 8;
        return tex;
    }

    function createSidePanelTexture(mirror) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');

        fillGunmetalBase(ctx, 1024, 640);

        ctx.save();
        // Place BARÜ + ROBOTXPERT nicely in the main rectangular rear/mid area
        // Note: on left side front is on left (x=0..250 is sloped nose), on right side front is on right
        const offsetX = mirror ? 85 : 235;
        drawBaruSeal(ctx, offsetX + 105, 210, 96);
        drawBaruWordmark(ctx, offsetX + 225, 208, 1.05);
        drawRobotXpert(ctx, offsetX + 350, 445, 1.15);
        ctx.restore();

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 8;
        return tex;
    }

    function createStripedPanelTexture(includePlate) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        fillGunmetalBase(ctx, 1024, 1024);

        // Two iconic dark charcoal racing stripes running down center (matches photo 1 & 2)
        ctx.fillStyle = '#26282b';
        ctx.fillRect(365, 0, 102, 1024);
        ctx.fillRect(557, 0, 102, 1024);

        // Crisp subtle sheen line on stripes
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(375, 0, 14, 1024);
        ctx.fillRect(567, 0, 14, 1024);

        if (includePlate) {
            drawLicensePlate(ctx, 212, 540, 600, 290);
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 8;
        return tex;
    }

    function createWheel() {
        const wheelGroup = new THREE.Group();

        const tireRadius = 0.34;
        const tireWidth = 0.25;

        // Main rubber tire carcass
        const tireMat = new THREE.MeshStandardMaterial({
            color: 0x1c1e21,
            roughness: 0.9,
            metalness: 0.08
        });
        const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 24);
        tireGeo.rotateZ(Math.PI / 2);
        const tireMesh = new THREE.Mesh(tireGeo, tireMat);
        tireMesh.castShadow = true;
        wheelGroup.add(tireMesh);

        // Chunky tractor-tread lugs around the circumference (exact rugged knobby look from photos!)
        const lugMat = new THREE.MeshStandardMaterial({
            color: 0x26292d,
            roughness: 0.95,
            metalness: 0.05
        });
        const lugGeo = new THREE.BoxGeometry(tireWidth * 0.52, 0.055, 0.075);
        const numLugs = 12;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const sideShift = (i % 2 === 0 ? 1 : -1) * (tireWidth * 0.22);
            const lug = new THREE.Mesh(lugGeo, lugMat);
            lug.position.set(
                sideShift,
                Math.cos(angle) * (tireRadius + 0.015),
                Math.sin(angle) * (tireRadius + 0.015)
            );
            lug.rotation.x = angle;
            lug.rotation.y = (i % 2 === 0 ? 0.35 : -0.35); // chevron angle!
            wheelGroup.add(lug);
        }

        // Light silver steel wheel rim (matches photos)
        const rimMat = new THREE.MeshStandardMaterial({
            color: 0xbac0c8,
            roughness: 0.38,
            metalness: 0.72
        });
        const rimGeo = new THREE.CylinderGeometry(0.185, 0.185, tireWidth + 0.018, 18);
        rimGeo.rotateZ(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, rimMat);
        wheelGroup.add(rim);

        // Center hub cap
        const hubMat = new THREE.MeshStandardMaterial({
            color: 0x565c64,
            roughness: 0.4,
            metalness: 0.8
        });
        const hubGeo = new THREE.CylinderGeometry(0.068, 0.068, tireWidth + 0.04, 12);
        hubGeo.rotateZ(Math.PI / 2);
        wheelGroup.add(new THREE.Mesh(hubGeo, hubMat));

        // 4 Lug bolts on outer side
        const boltGeo = new THREE.CylinderGeometry(0.014, 0.014, tireWidth + 0.036, 6);
        boltGeo.rotateZ(Math.PI / 2);
        for (let b = 0; b < 4; b++) {
            const a = (b / 4) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, hubMat);
            bolt.position.set(0, Math.cos(a) * 0.115, Math.sin(a) * 0.115);
            wheelGroup.add(bolt);
        }

        return wheelGroup;
    }

    function createBarkutUGV() {
        const root = new THREE.Group();
        const chassis = new THREE.Group();
        root.add(chassis);

        const gunmetalMat = new THREE.MeshStandardMaterial({
            color: 0x5a5c60,
            roughness: 0.52,
            metalness: 0.45
        });
        const darkMetalMat = new THREE.MeshStandardMaterial({
            color: 0x22252a,
            roughness: 0.65,
            metalness: 0.55
        });

        // --- 1. CORE CHASSIS PROFILE (Box rear + sloped armored front nose) ---
        // Coordinates: -Z is FORWARD, +Z is BACK (standard Three.js forward)
        // Width: 1.48 (x: -0.74 to +0.74)
        // Rear z: +1.05, Front nose bottom z: -1.08
        // Belly y: 0.30, Roof base y: 1.24
        const bodyWidth = 1.48;

        // Main boxy rear/mid hull (z from -0.35 to +1.05, y from 0.30 to 1.24)
        const mainBoxGeo = new THREE.BoxGeometry(bodyWidth, 0.94, 1.40);
        const mainBox = new THREE.Mesh(mainBoxGeo, gunmetalMat);
        mainBox.position.set(0, 0.77, 0.35);
        mainBox.castShadow = true;
        mainBox.receiveShadow = true;
        chassis.add(mainBox);

        // Front lower nose box (z from -1.08 to -0.35, y from 0.30 to 0.56)
        const frontLowerGeo = new THREE.BoxGeometry(bodyWidth, 0.26, 0.73);
        const frontLower = new THREE.Mesh(frontLowerGeo, gunmetalMat);
        frontLower.position.set(0, 0.43, -0.715);
        frontLower.castShadow = true;
        chassis.add(frontLower);

        // Sloped hood wedge connecting (z=-0.35, y=1.10) down to (z=-1.08, y=0.56)
        const wedgeShape = new THREE.Shape();
        wedgeShape.moveTo(0, 0);          // z=-0.35, y=0.56
        wedgeShape.lineTo(0.73, 0);       // z=-1.08, y=0.56
        wedgeShape.lineTo(0, 0.54);       // z=-0.35, y=1.10
        wedgeShape.closePath();

        const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, {
            depth: bodyWidth,
            bevelEnabled: false
        });
        // Rotate so shape X maps to -Z, shape Y maps to +Y, extrusion depth maps to X
        wedgeGeo.rotateY(Math.PI / 2);
        const wedgeMesh = new THREE.Mesh(wedgeGeo, gunmetalMat);
        wedgeMesh.position.set(-bodyWidth / 2, 0.56, -0.35);
        wedgeMesh.castShadow = true;
        chassis.add(wedgeMesh);

        // --- 2. CLOSED FLAT ROOF LID (matching Photo 1!) ---
        const roofStripeTex = createStripedPanelTexture(false);
        const roofMat = new THREE.MeshStandardMaterial({
            map: roofStripeTex,
            roughness: 0.48,
            metalness: 0.35
        });
        // Slightly overhanging flat lid (1.56 wide x 1.48 long x 0.055 thick)
        const lidGeo = new THREE.BoxGeometry(1.56, 0.055, 1.48);
        const lidMaterials = [
            gunmetalMat, gunmetalMat,
            roofMat, gunmetalMat,
            gunmetalMat, gunmetalMat
        ];
        const lid = new THREE.Mesh(lidGeo, lidMaterials);
        lid.position.set(0, 1.268, 0.35);
        lid.castShadow = true;
        lid.receiveShadow = true;
        chassis.add(lid);

        // --- 3. STRIPED SLOPED FRONT HOOD & FRONT UPPER LIP + FRONT BUMPER WITH PLATE ---
        const hoodLen = Math.hypot(0.73, 0.54); // ~0.908
        const hoodAngle = Math.atan2(0.54, 0.73); // ~36.5 deg
        const hoodDecalGeo = new THREE.PlaneGeometry(bodyWidth - 0.02, hoodLen);
        const hoodDecalMat = new THREE.MeshStandardMaterial({
            map: roofStripeTex,
            roughness: 0.48,
            metalness: 0.35
        });
        const hoodDecal = new THREE.Mesh(hoodDecalGeo, hoodDecalMat);
        hoodDecal.position.set(0, 0.56 + 0.27 + 0.006, -0.35 - 0.365 - 0.005);
        hoodDecal.rotation.x = -Math.PI / 2 + hoodAngle;
        chassis.add(hoodDecal);

        // Upper vertical lip between roof & sloped hood (with stripes)
        const upperLipGeo = new THREE.PlaneGeometry(bodyWidth - 0.02, 0.145);
        const upperLip = new THREE.Mesh(upperLipGeo, hoodDecalMat);
        upperLip.position.set(0, 1.172, -0.354);
        upperLip.rotation.y = Math.PI;
        chassis.add(upperLip);

        // Front lower bumper decal with stripes + TR 74 BARKUT 74 license plate
        const frontBumperTex = createStripedPanelTexture(true);
        const frontBumperMat = new THREE.MeshStandardMaterial({
            map: frontBumperTex,
            roughness: 0.45,
            metalness: 0.3
        });
        const frontBumperDecal = new THREE.Mesh(new THREE.PlaneGeometry(bodyWidth - 0.02, 0.26), frontBumperMat);
        frontBumperDecal.position.set(0, 0.43, -1.084);
        frontBumperDecal.rotation.y = Math.PI;
        chassis.add(frontBumperDecal);

        // --- 4. BACK PANEL DECAL (BARÜ Seal + BARÜ + TR 74 BARKUT 74) ---
        const backTex = createBackPanelTexture();
        const backMat = new THREE.MeshStandardMaterial({
            map: backTex,
            roughness: 0.45,
            metalness: 0.32
        });
        const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(bodyWidth - 0.01, 0.93), backMat);
        backPlane.position.set(0, 0.77, 1.054);
        chassis.add(backPlane);

        // --- 5. LEFT & RIGHT SIDE PANEL DECALS (BARÜ + ROBOTXPERT) ---
        const rightSideTex = createSidePanelTexture(false);
        const leftSideTex = createSidePanelTexture(true);

        const rightMat = new THREE.MeshStandardMaterial({ map: rightSideTex, roughness: 0.46, metalness: 0.32 });
        const leftMat = new THREE.MeshStandardMaterial({ map: leftSideTex, roughness: 0.46, metalness: 0.32 });

        // Side plane spans main box length (1.39) cleanly without hanging over the sloped nose
        const rightPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.39, 0.92), rightMat);
        rightPlane.position.set(bodyWidth / 2 + 0.005, 0.77, 0.35);
        rightPlane.rotation.y = Math.PI / 2;
        chassis.add(rightPlane);

        const leftPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.39, 0.92), leftMat);
        leftPlane.position.set(-bodyWidth / 2 - 0.005, 0.77, 0.35);
        leftPlane.rotation.y = -Math.PI / 2;
        chassis.add(leftPlane);

        // --- 6. SLEEK LED HEADLIGHTS & BRAKE/TURBO TAIL LIGHTS ---
        const headlightMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xdff8ff,
            emissiveIntensity: 1.4
        });
        const tailLightMat = new THREE.MeshStandardMaterial({
            color: 0xff2233,
            emissive: 0xff1122,
            emissiveIntensity: 1.1
        });
        const turboGlowMat = new THREE.MeshStandardMaterial({
            color: 0x00f5d4,
            emissive: 0x00f5d4,
            emissiveIntensity: 0.0,
            transparent: true,
            opacity: 0.0
        });

        [-0.56, 0.56].forEach(x => {
            const hl = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.03), headlightMat);
            hl.position.set(x, 0.49, -1.088);
            chassis.add(hl);

            const tl = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.055, 0.03), tailLightMat);
            tl.position.set(x, 0.39, 1.058);
            chassis.add(tl);
        });

        // Subtle cyan underglow / exhaust thruster glow during Turbo Boost
        const turboBar = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.07, 0.08), turboGlowMat);
        turboBar.position.set(0, 0.31, 1.05);
        chassis.add(turboBar);

        // --- 7. UNDERCARRIAGE AXLES & CHAIN DRIVE DETAILS (matches Photo 1 & 4) ---
        const axleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.88, 10);
        axleGeo.rotateZ(Math.PI / 2);
        [-0.64, 0.64].forEach(zPos => {
            const axle = new THREE.Mesh(axleGeo, darkMetalMat);
            axle.position.set(0, 0.34, zPos);
            chassis.add(axle);

            // Sprockets near wheels
            [-0.68, 0.68].forEach(xPos => {
                const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 10).rotateZ(Math.PI / 2), darkMetalMat);
                sprocket.position.set(xPos, 0.34, zPos);
                chassis.add(sprocket);
            });
        });

        // --- 8. COMPACT TACTICAL ROOF LASER TURRET POD (for Cesaret Mini-Game!) ---
        const turretBase = new THREE.Group();
        turretBase.position.set(0, 1.295, -0.02);
        chassis.add(turretBase);

        const pedMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.08, 16), darkMetalMat);
        pedMesh.position.y = 0.04;
        turretBase.add(pedMesh);

        const turretYaw = new THREE.Group();
        turretYaw.position.y = 0.11;
        turretBase.add(turretYaw);

        const turretBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.13, 0.26), darkMetalMat);
        turretBody.castShadow = true;
        turretYaw.add(turretBody);

        // Cyan status strip on turret
        const turretStripMat = new THREE.MeshStandardMaterial({
            color: 0x00f5d4,
            emissive: 0x00f5d4,
            emissiveIntensity: 0.9
        });
        const turretStrip = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.025, 0.18), turretStripMat);
        turretStrip.position.y = 0.055;
        turretYaw.add(turretStrip);

        const turretPitch = new THREE.Group();
        turretPitch.position.set(0, 0.01, -0.10);
        turretYaw.add(turretPitch);

        const barrelGeo = new THREE.CylinderGeometry(0.032, 0.04, 0.34, 12);
        barrelGeo.rotateX(Math.PI / 2);
        const barrel = new THREE.Mesh(barrelGeo, new THREE.MeshStandardMaterial({
            color: 0x333840,
            roughness: 0.3,
            metalness: 0.85
        }));
        barrel.position.z = -0.14;
        turretPitch.add(barrel);

        // Glowing laser emitter tip
        const lensMat = new THREE.MeshStandardMaterial({
            color: 0xff3b3b,
            emissive: 0xff1e38,
            emissiveIntensity: 1.5
        });
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 12), lensMat);
        lens.position.z = -0.31;
        turretPitch.add(lens);

        // --- 9. FOUR KNOBBY OFF-ROAD WHEELS ---
        const wheels = [];
        const frontWheelPivots = [];
        const wheelPositions = [
            { x: -0.92, z: -0.64, front: true },
            { x:  0.92, z: -0.64, front: true },
            { x: -0.92, z:  0.64, front: false },
            { x:  0.92, z:  0.64, front: false }
        ];

        wheelPositions.forEach(wp => {
            const pivot = new THREE.Group();
            pivot.position.set(wp.x, 0.355, wp.z);
            const wheel = createWheel();
            pivot.add(wheel);
            root.add(pivot);
            wheels.push(wheel);
            if (wp.front) frontWheelPivots.push(pivot);
        });

        return {
            root,
            chassis,
            wheels,
            frontWheelPivots,
            turretYaw,
            turretPitch,
            laserTip: lens,
            tailLightMat,
            turboGlowMat,
            turretStripMat,
            setTurboVisual(active, intensity) {
                const v = active ? (intensity || 1) : 0;
                turboGlowMat.emissiveIntensity = v * 2.5;
                turboGlowMat.opacity = v * 0.85;
            },
            setBrakingVisual(braking) {
                tailLightMat.emissiveIntensity = braking ? 3.2 : 1.0;
            },
            updateMotion(speed, steerAngle, dt, time) {
                // Spin all 4 wheels
                const spinDelta = (speed / 0.35) * dt;
                wheels.forEach(w => { w.rotation.x -= spinDelta; });

                // Steer front wheels
                frontWheelPivots.forEach(p => { p.rotation.y = steerAngle * 0.42; });

                // Dynamic body roll & subtle off-road suspension bounce
                chassis.rotation.z = THREE.MathUtils.lerp(chassis.rotation.z, -steerAngle * 0.08, Math.min(1, dt * 8));
                chassis.position.y = Math.sin(time * (8 + speed * 0.35)) * Math.min(0.018, speed * 0.0005);
            }
        };
    }

    return {
        createBarkutUGV
    };
})();

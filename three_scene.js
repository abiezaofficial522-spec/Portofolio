/* ==========================================================================
   three-scene.js
   Scene 3D persisten (fixed background) yang berubah pose mengikuti scroll.
   Objek utama: kamera DSLR yang dibangun dari primitive Three.js (r128),
   jadi ga butuh file model .glb eksternal.
   ========================================================================== */
(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;

    /* ---------------------------------------------------------------------
       Renderer, scene, camera
    --------------------------------------------------------------------- */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if ('outputEncoding' in renderer) renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const perspCamera = new THREE.PerspectiveCamera(
        45, window.innerWidth / window.innerHeight, 0.1, 100
    );
    perspCamera.position.set(0, 0, 8);

    /* ---------------------------------------------------------------------
       Lighting — key + red rim light (biar nyatu sama aksen merah brand)
    --------------------------------------------------------------------- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff4757, 2.4, 25);
    rimLight.position.set(-4, 1.5, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.5, 25);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);

    /* ---------------------------------------------------------------------
       Bangun model kamera DSLR dari primitive
    --------------------------------------------------------------------- */
    function buildCameraModel() {
        const group = new THREE.Group();

        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1b1a1d, metalness: 0.65, roughness: 0.35 });
        const trimMat = new THREE.MeshStandardMaterial({ color: 0x2d2b30, metalness: 0.7, roughness: 0.3 });
        const accentMat = new THREE.MeshStandardMaterial({ color: 0xff4757, metalness: 0.5, roughness: 0.3 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x0d1b2a, metalness: 0.9, roughness: 0.08 });

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.9), bodyMat);
        group.add(body);

        const topPlate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.18, 0.9), trimMat);
        topPlate.position.y = 0.74;
        group.add(topPlate);

        const prism = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.32, 0.7), trimMat);
        prism.position.set(-0.1, 1.0, 0);
        group.add(prism);

        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.3, 0.95), bodyMat);
        grip.position.set(1.15, -0.05, 0.05);
        group.add(grip);

        const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 1.6, 32), trimMat);
        lensBarrel.rotation.x = Math.PI / 2;
        lensBarrel.position.set(-0.3, 0, 1.5);
        group.add(lensBarrel);

        const lensRingAccent = new THREE.Mesh(new THREE.TorusGeometry(0.63, 0.05, 16, 48), accentMat);
        lensRingAccent.rotation.x = Math.PI / 2;
        lensRingAccent.position.set(-0.3, 0, 1.9);
        group.add(lensRingAccent);

        const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32), glassMat);
        lensGlass.position.set(-0.3, 0, 2.31);
        group.add(lensGlass);

        const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 16), accentMat);
        shutterBtn.position.set(1.2, 0.75, 0.3);
        group.add(shutterBtn);

        const hotShoe = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.2), trimMat);
        hotShoe.position.set(-0.1, 0.88, 0);
        group.add(hotShoe);

        [
            [-1.15, 0.1, 0.42],
            [1.2, 0.6, -0.42],
        ].forEach(([x, y, z]) => {
            const lug = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), trimMat);
            lug.position.set(x, y, z);
            group.add(lug);
        });

        group.scale.setScalar(0.85);
        return group;
    }

    const cameraModel = buildCameraModel();
    scene.add(cameraModel);

    /* ---------------------------------------------------------------------
       Partikel ambient buat kedalaman (dikurangin di mobile)
    --------------------------------------------------------------------- */
    const particleCount = isMobile ? 180 : 450;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 40;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 8;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.045, transparent: true, opacity: 0.45 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ---------------------------------------------------------------------
       Keyframe pose per section — di-lerp mengikuti progres scroll
    --------------------------------------------------------------------- */
    const sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
    const keyframes = {
        home:     { pos: [1.5, 0.1, 0],     rot: [0.1, 0.6, 0],     scale: 1 },
        about:    { pos: [-1.6, 0.25, -1],  rot: [0.15, -0.7, 0.05], scale: 0.95 },
        skills:   { pos: [1.7, -0.2, -1.6], rot: [-0.1, 2.3, 0.1],  scale: 0.8 },
        projects: { pos: [-1.8, 0.15, -2],  rot: [0.2, -2.4, -0.05], scale: 0.72 },
        contact:  { pos: [0, -0.05, -1],    rot: [0.05, 0.3, 0],    scale: 0.9 },
    };

    const sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    function getScrollState() {
        const scrollY = window.scrollY;
        const offset = window.innerHeight * 0.5;
        let idx = 0;
        for (let i = 0; i < sectionEls.length; i++) {
            if (scrollY >= sectionEls[i].offsetTop - offset) idx = i;
        }
        let t = 0;
        const current = sectionEls[idx];
        const next = sectionEls[idx + 1];
        if (current && next) {
            const start = current.offsetTop - offset;
            const end = next.offsetTop - offset;
            t = THREE.MathUtils.clamp((scrollY - start) / Math.max(end - start, 1), 0, 1);
        }
        return { idx, t };
    }

    /* current / target pose state, di-lerp tiap frame biar mulus */
    const currentPos = new THREE.Vector3(...keyframes.home.pos);
    const currentRot = new THREE.Euler(...keyframes.home.rot);
    let currentScale = keyframes.home.scale;
    const targetPos = new THREE.Vector3();
    const targetRot = new THREE.Euler();
    let targetScale = 1;

    cameraModel.position.copy(currentPos);
    cameraModel.rotation.copy(currentRot);
    cameraModel.scale.setScalar(currentScale);

    function updateTarget() {
        const { idx, t } = getScrollState();
        const a = keyframes[sectionIds[idx]];
        const b = keyframes[sectionIds[Math.min(idx + 1, sectionIds.length - 1)]];
        targetPos.set(
            THREE.MathUtils.lerp(a.pos[0], b.pos[0], t),
            THREE.MathUtils.lerp(a.pos[1], b.pos[1], t),
            THREE.MathUtils.lerp(a.pos[2], b.pos[2], t)
        );
        targetRot.set(
            THREE.MathUtils.lerp(a.rot[0], b.rot[0], t),
            THREE.MathUtils.lerp(a.rot[1], b.rot[1], t),
            THREE.MathUtils.lerp(a.rot[2], b.rot[2], t)
        );
        targetScale = THREE.MathUtils.lerp(a.scale, b.scale, t);
    }

    /* ---------------------------------------------------------------------
       Parallax mouse ringan (skip di mobile & reduced motion)
    --------------------------------------------------------------------- */
    let mouseX = 0;
    let mouseY = 0;
    if (!isMobile && !prefersReducedMotion) {
        window.addEventListener('pointermove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
    }

    /* ---------------------------------------------------------------------
       Render loop
    --------------------------------------------------------------------- */
    const clock = new THREE.Clock();
    let rafId = null;

    function animate() {
        rafId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        updateTarget();
        currentPos.lerp(targetPos, 0.06);
        currentRot.x += (targetRot.x - currentRot.x) * 0.06;
        currentRot.y += (targetRot.y - currentRot.y) * 0.06;
        currentRot.z += (targetRot.z - currentRot.z) * 0.06;
        currentScale += (targetScale - currentScale) * 0.06;

        cameraModel.position.set(
            currentPos.x,
            currentPos.y + Math.sin(elapsed * 0.8) * 0.05,
            currentPos.z
        );
        cameraModel.rotation.set(
            currentRot.x + mouseY * 0.12,
            currentRot.y + mouseX * 0.18,
            currentRot.z
        );
        cameraModel.scale.setScalar(currentScale);

        particles.rotation.y = elapsed * 0.015;

        renderer.render(scene, perspCamera);
    }

    if (prefersReducedMotion) {
        // Statis: satu pose tenang, tanpa animasi scroll/mouse/idle-bob.
        cameraModel.position.copy(new THREE.Vector3(...keyframes.home.pos));
        cameraModel.rotation.set(...keyframes.home.rot);
        cameraModel.scale.setScalar(keyframes.home.scale);
        renderer.render(scene, perspCamera);
    } else {
        animate();
    }

    /* ---------------------------------------------------------------------
       Resize & visibility handling
    --------------------------------------------------------------------- */
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            perspCamera.aspect = window.innerWidth / window.innerHeight;
            perspCamera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            if (prefersReducedMotion) renderer.render(scene, perspCamera);
        }, 150);
    });

    document.addEventListener('visibilitychange', () => {
        if (prefersReducedMotion) return;
        if (document.hidden) {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
        } else if (!rafId) {
            animate();
        }
    });
})();
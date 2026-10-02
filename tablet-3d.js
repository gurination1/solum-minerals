/**
 * Farm Minerals - Procedural 3D Bio-Carbon Tablet & Scroll River Kinematics
 * 100% Code-Generated Three.js WebGL Model + High-Fidelity Isometric 2D Fallback
 * Webflow a-7 (Tablet Slide River Motion) & a-11 (Entrance) Kinematics
 */

(function () {
  'use strict';

  // Authentic SOLUM MINERALS Brand Emblem Vectors (Bio-Mineral Seed Motif)
  const EMBLEM_SVG_PATHS = [
    "M-2,34 C-18,26 -28,8 -24,-12 C-20,-28 -2,-38 -2,-38 C-2,-38 -8,-20 -6,-4 C-4,10 6,24 -2,34 Z",
    "M2,34 C18,26 28,8 24,-12 C20,-28 2,-38 2,-38 C2,-38 8,-20 6,-4 C4,10 -6,24 2,34 Z",
    "M0,-18.5 A4.5,4.5 0 1,1 0,-9.5 A4.5,4.5 0 1,1 0,-18.5 Z"
  ];

  // --- Procedural Texture Generator for WebGL ---
  function createTabletTextures() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 1. Dark charcoal bio-carbon base
    ctx.fillStyle = '#262922';
    ctx.fillRect(0, 0, size, size);

    // 2. Micro-surface mineral noise (nutrient matrix)
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    let seed = 42;
    function rand() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    for (let i = 0; i < data.length; i += 4) {
      const n = (rand() - 0.5) * 32;
      const grain = (rand() - 0.5) * 14;
      data[i] = Math.min(255, Math.max(0, data[i] + n + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n + grain * 0.9));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.8 + grain * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    // Fine crystalline flakes
    for (let j = 0; j < 3200; j++) {
      const rx = rand() * size;
      const ry = rand() * size;
      const rRad = 0.5 + rand() * 1.5;
      const brightness = 40 + rand() * 55;
      ctx.fillStyle = `rgba(${brightness + 15}, ${brightness + 25}, ${brightness}, ${0.18 + rand() * 0.25})`;
      ctx.beginPath();
      ctx.arc(rx, ry, rRad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Compression Ridge Ring (Squircle groove)
    ctx.save();
    ctx.lineWidth = 14;
    ctx.strokeStyle = 'rgba(14, 16, 12, 0.55)';
    ctx.beginPath();
    const pad = 140;
    const r = 160;
    const w = size - pad * 2;
    const h = size - pad * 2;
    ctx.roundRect(pad, pad, w, h, r);
    ctx.stroke();

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(85, 95, 75, 0.35)';
    ctx.stroke();
    ctx.restore();

    // 4. Debossed Authentic Farm Minerals Brand Emblem
    const cx = size / 2;
    const cy = size / 2;

    ctx.save();
    ctx.translate(cx, cy);

    const emblemScale = 5.4; // Spans ~390px centered on 1024px face
    ctx.scale(emblemScale, emblemScale);
    ctx.translate(0, 2);

    // Deep debossed cavity shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetX = 2.5;
    ctx.shadowOffsetY = 5.5;
    ctx.fillStyle = '#11130e';

    for (let i = 0; i < EMBLEM_SVG_PATHS.length; i++) {
      const p = new Path2D(EMBLEM_SVG_PATHS[i]);
      ctx.fill(p);
    }

    // Groove bevel highlight catching key light
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(110, 130, 95, 0.45)';
    ctx.lineWidth = 0.65;
    for (let i = 0; i < EMBLEM_SVG_PATHS.length; i++) {
      const p = new Path2D(EMBLEM_SVG_PATHS[i]);
      ctx.stroke(p);
    }

    ctx.restore();

    // 5. Normal Map via Sobel Filter
    const heightData = ctx.getImageData(0, 0, size, size);
    const hPixels = heightData.data;
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = size;
    normalCanvas.height = size;
    const nCtx = normalCanvas.getContext('2d');
    const nImgData = nCtx.createImageData(size, size);
    const nData = nImgData.data;

    function getLuma(x, y) {
      const px = Math.min(size - 1, Math.max(0, x));
      const py = Math.min(size - 1, Math.max(0, y));
      const idx = (py * size + px) * 4;
      return (hPixels[idx] * 0.299 + hPixels[idx + 1] * 0.587 + hPixels[idx + 2] * 0.114) / 255.0;
    }

    const intensity = 3.6;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const tl = getLuma(x - 1, y - 1);
        const t  = getLuma(x, y - 1);
        const tr = getLuma(x + 1, y - 1);
        const l  = getLuma(x - 1, y);
        const r  = getLuma(x + 1, y);
        const bl = getLuma(x - 1, y + 1);
        const b  = getLuma(x, y + 1);
        const br = getLuma(x + 1, y + 1);

        const dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
        const dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
        const dZ = 1.0 / intensity;

        const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        const nx = (-dX / len) * 0.5 + 0.5;
        const ny = (-dY / len) * 0.5 + 0.5;
        const nz = (dZ / len) * 0.5 + 0.5;

        const pIdx = (y * size + x) * 4;
        nData[pIdx]     = Math.floor(nx * 255);
        nData[pIdx + 1] = Math.floor(ny * 255);
        nData[pIdx + 2] = Math.floor(nz * 255);
        nData[pIdx + 3] = 255;
      }
    }
    nCtx.putImageData(nImgData, 0, 0);

    const diffuseTex = new THREE.CanvasTexture(canvas);
    diffuseTex.wrapS = THREE.ClampToEdgeWrapping;
    diffuseTex.wrapT = THREE.ClampToEdgeWrapping;

    const normalTex = new THREE.CanvasTexture(normalCanvas);
    normalTex.wrapS = THREE.ClampToEdgeWrapping;
    normalTex.wrapT = THREE.ClampToEdgeWrapping;

    return { diffuseTex, normalTex };
  }

  // --- Scroll River & Entrance Controller ---
  function setupScrollRiver(container, onScrollUpdate) {
    const heroTrack = document.getElementById('hero');
    const heroHeading2 = document.getElementById('hero-heading-2');

    // 1. Entrance Animation (Webflow a-11)
    container.style.opacity = '0';
    container.style.transform = 'translate3d(0, -3em, 0)';
    container.style.transition = 'transform 1.4s cubic-bezier(0.075, 0.82, 0.165, 1), opacity 0.6s ease';

    setTimeout(() => {
      container.style.opacity = '1';
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const urlParams = new URLSearchParams(window.location.search);
      if (currentScroll === 0 && !urlParams.has('test_scroll')) {
        container.style.transform = 'translate3d(0, 0em, 0)';
      }
    }, 150);

    // 2. Continuous Scroll River Tracking (Webflow a-7)
    let lastProgress = 0;

    function handleScroll() {
      if (!heroTrack) return;
      const heroHeight = heroTrack.offsetHeight;
      const scrollRange = heroHeight * 0.85;
      if (scrollRange <= 0) return;

      let scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('test_scroll')) {
        scrollY = parseFloat(urlParams.get('test_scroll')) * scrollRange;
      }

      const progress = Math.min(1, Math.max(0, scrollY / scrollRange));

      // Keyframes: 0 -> 0.35 static float, 0.35 -> 1.0 river slide
      let riverT = 0;
      if (progress > 0.35) {
        riverT = Math.min(1, (progress - 0.35) / 0.65);
      }

      // Smoothstep easing for tactile, viscous water-flow feel
      const easeT = riverT * riverT * (3 - 2 * riverT);

      // Translation values matching Webflow a-7:
      // tablet slides +50em downwards
      // hero-heading-2 slides -15em upwards
      const tabletY = easeT * 50;
      const heading2Y = -easeT * 15;

      if (scrollY > 10 || urlParams.has('test_scroll')) {
        container.style.transition = 'none';
      }

      container.style.transform = `translate3d(0, ${tabletY}em, 0)`;
      if (heroHeading2) {
        heroHeading2.style.transform = `translate3d(0, ${heading2Y}em, 0)`;
        heroHeading2.style.opacity = Math.max(0, 1 - easeT * 1.4);
      }

      // Webflow a-55: Hero Background Scale on scroll
      const heroImg = document.querySelector('.hero-img');
      if (heroImg) {
        const bgScaleT = progress > 0.35 ? (progress - 0.35) / 0.65 : 0;
        heroImg.style.transform = `scale(${1.0 + bgScaleT * 0.12})`;
      }



      if (onScrollUpdate) {
        const velocity = progress - lastProgress;
        onScrollUpdate(progress, easeT, velocity);
      }
      lastProgress = progress;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
  }

  // --- High-Fidelity Isometric 2D Canvas Fallback (Headless / Non-WebGL) ---
  function initCanvas2DFallback(container, w, h) {
    const canvas = document.createElement('canvas');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = w || container.clientWidth || 360;
    const height = h || container.clientHeight || 360;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let startTime = performance.now();
    let mouseX = 0, mouseY = 0;
    let isDragging = false;
    let dragAngleX = 0, dragAngleY = 0;
    let prevX = 0, prevY = 0;
    let riverProgress = 0;

    setupScrollRiver(container, (prog, riverT, vel) => {
      riverProgress = riverT;
    });

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;
      dragAngleY += dx * 0.01;
      dragAngleX += dy * 0.01;
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    function render2D() {
      requestAnimationFrame(render2D);
      const time = (performance.now() - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.45; // Placed with generous vertical padding

      // Gentle floating levitation
      const floatY = Math.sin(time * 1.5) * 5;

      // Authentic Isometric Perspective Pose
      const isoPitch = 0.40 + (mouseY * 0.12 + dragAngleX) + riverProgress * 0.45;
      const isoYaw   = -0.45 + (mouseX * 0.18 + dragAngleY) - riverProgress * 0.25;
      const isoBank  = 0.12 - riverProgress * 0.15;

      const size = Math.min(width, height) * 0.45; // Generous margin with zero clipping
      const r = size * 0.28;
      const depth = 18; // Extruded thickness

      // 1. Contact Shadow on Pedestal
      ctx.save();
      ctx.translate(cx + isoYaw * 15, cy + size * 0.52 - floatY * 0.2);
      ctx.scale(1, 0.32);
      ctx.rotate(isoBank);
      const sGrad = ctx.createRadialGradient(0, 0, 6, 0, 0, size * 0.55);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
      sGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.4)');
      sGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.12)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Isometric Projection Matrix
      ctx.save();
      ctx.translate(cx, cy + floatY);
      // Perspective affine transformation (emulating 3D tilt)
      const cosY = Math.cos(isoYaw);
      const sinY = Math.sin(isoYaw);
      const cosX = Math.cos(isoPitch);
      const sinX = Math.sin(isoPitch);

      ctx.transform(cosY * 0.95, sinX * sinY * 0.5 + Math.sin(isoBank), -sinY * 0.35, cosX * 0.88, 0, 0);

      // 3. Extruded Bevel Layers (Side band catching rim light)
      for (let d = depth; d >= 0; d -= 3) {
        ctx.beginPath();
        ctx.roundRect(-size / 2 + d * 0.3, -size / 2 + d * 0.6, size, size, r);
        ctx.fillStyle = d === depth ? '#151711' : (d > depth / 2 ? '#1b1d16' : '#22261c');
        ctx.fill();
      }

      // 4. Equatorial Seam Membrane Ring
      ctx.beginPath();
      ctx.roundRect(-size / 2 + depth * 0.15, -size / 2 + depth * 0.3, size, size, r);
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = 'rgba(12, 14, 10, 0.8)';
      ctx.stroke();

      // 5. Front Face (Catching Solar Key Light)
      ctx.beginPath();
      ctx.roundRect(-size / 2, -size / 2, size, size, r);
      const grad = ctx.createLinearGradient(-size * 0.6, -size * 0.6, size * 0.6, size * 0.6);
      grad.addColorStop(0, '#3a4030');
      grad.addColorStop(0.3, '#2a2e23');
      grad.addColorStop(0.7, '#22251d');
      grad.addColorStop(1, '#171913');
      ctx.fillStyle = grad;
      ctx.fill();

      // 6. Bevel Rim Highlight (grazing sunlight)
      ctx.lineWidth = 2.8;
      const rimGrad = ctx.createLinearGradient(-size * 0.5, -size * 0.5, size * 0.5, size * 0.5);
      rimGrad.addColorStop(0, 'rgba(225, 250, 175, 0.55)');
      rimGrad.addColorStop(0.4, 'rgba(135, 155, 105, 0.25)');
      rimGrad.addColorStop(0.8, 'rgba(60, 72, 45, 0.15)');
      rimGrad.addColorStop(1, 'rgba(25, 30, 20, 0.4)');
      ctx.strokeStyle = rimGrad;
      ctx.stroke();

      // 7. Inner Squircle Seam (Compression boundary)
      ctx.beginPath();
      const inPad = size * 0.13;
      ctx.roundRect(-size / 2 + inPad, -size / 2 + inPad, size - inPad * 2, size - inPad * 2, r * 0.72);
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(8, 10, 6, 0.65)';
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(95, 115, 75, 0.3)';
      ctx.stroke();

      // 8. Debossed Authentic SOLUM Brand Emblem
      ctx.save();
      const emblemScale = (size * 0.44) / 72;
      ctx.scale(emblemScale, emblemScale);
      ctx.translate(0, 2);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#11130e';

      for (let i = 0; i < EMBLEM_SVG_PATHS.length; i++) {
        const p = new Path2D(EMBLEM_SVG_PATHS[i]);
        ctx.fill(p);
      }

      // Bevel highlight
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(125, 150, 105, 0.4)';
      ctx.lineWidth = 0.75;
      for (let i = 0; i < EMBLEM_SVG_PATHS.length; i++) {
        const p = new Path2D(EMBLEM_SVG_PATHS[i]);
        ctx.stroke(p);
      }

      ctx.restore(); // deboss
      ctx.restore(); // isometric transform
    }

    render2D();
  }

  // --- Main 3D Three.js WebGL Scene ---
  function initTablet3D() {
    const container = document.getElementById('tablet-3d-container');
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Headless / non-GPU environment safeguard
    const isHeadless = /HeadlessChrome|PhantomJS/i.test(navigator.userAgent) || window.location.search.includes('fallback=2d');
    if (isHeadless) {
      initCanvas2DFallback(container, width, height);
      return;
    }

    let hasWebGL = false;
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      hasWebGL = Boolean(gl && gl.getExtension);
    } catch (e) {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      initCanvas2DFallback(container, width, height);
      return;
    }

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.05, 9.2);

    // 2. WebGL Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
    } catch (err) {
      initCanvas2DFallback(container, width, height);
      return;
    }

    // 3. Textures
    const { diffuseTex, normalTex } = createTabletTextures();

    // 4. Master Group
    const tabletGroup = new THREE.Group();
    scene.add(tabletGroup);

    // 5. Procedural Squircle Geometry
    const shape = new THREE.Shape();
    const w = 3.15;
    const h = 3.15;
    const r = 0.88;
    const x = -w / 2;
    const y = -h / 2;

    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const extrudeSettings = {
      depth: 0.78,
      bevelEnabled: true,
      bevelSegments: 10,
      steps: 2,
      bevelSize: 0.32,
      bevelThickness: 0.3
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Planar UVs
    const pos = geometry.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    const bounds = 3.8;
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i);
      const py = pos.getY(i);
      uvs[i * 2] = (px / bounds) + 0.5;
      uvs[i * 2 + 1] = (py / bounds) + 0.5;
    }
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    // 6. PBR Material
    const tabletMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x282b22,
      map: diffuseTex,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.48,
      metalness: 0.15,
      clearcoat: 0.42,
      clearcoatRoughness: 0.35,
      reflectivity: 0.55
    });

    const tabletMesh = new THREE.Mesh(geometry, tabletMaterial);
    tabletMesh.castShadow = true;
    tabletMesh.receiveShadow = true;
    tabletGroup.add(tabletMesh);

    // 7. Equatorial Seam Ring
    const seamGeom = new THREE.CylinderGeometry(1.92, 1.92, 0.14, 64, 1, true);
    const seamMat = new THREE.MeshStandardMaterial({
      color: 0x1b1d16,
      roughness: 0.35,
      metalness: 0.28,
      side: THREE.DoubleSide
    });
    const seamMesh = new THREE.Mesh(seamGeom, seamMat);
    seamMesh.rotation.x = Math.PI / 2;
    tabletGroup.add(seamMesh);

    // 8. Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(128, 128, 0, 128, 128, 120);
    sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    sGrad.addColorStop(0.45, 'rgba(0, 0, 0, 0.45)');
    sGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.12)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(4.2, 4.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -2.25;
    scene.add(shadowPlane);

    // 9. Bio-Mineral Dust Field
    const particleCount = 75;
    const pGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const dist = 2.4 + Math.random() * 2.8;
      pPositions[i * 3]     = dist * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = dist * Math.cos(phi);
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc8dba0,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeom, pMat);
    tabletGroup.add(particles);

    // 10. Solar Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x353e24, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6e3, 3.0);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60773b, 1.2);
    fillLight.position.set(-4, -3, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4f0a2, 2.8);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    const cursorLight = new THREE.PointLight(0xfff9ed, 1.5, 9);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // 11. Authentic Isometric Initial Angle
    const initialRotX = 0.38;
    const initialRotY = -0.45;
    const initialRotZ = 0.12;
    tabletGroup.rotation.set(initialRotX, initialRotY, initialRotZ);

    // 12. Interaction & Kinematics State
    let targetRotX = initialRotX;
    let targetRotY = initialRotY;
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let riverProgress = 0;
    let scrollVelocity = 0;

    // Connect Scroll River Controller
    setupScrollRiver(container, (prog, riverT, vel) => {
      riverProgress = riverT;
      scrollVelocity = vel * 25.0;
    });

    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      cursorLight.position.x = normX * 3.5;
      cursorLight.position.y = normY * 3.5;

      if (!isDragging) {
        targetRotY = initialRotY + normX * 0.45;
        targetRotX = initialRotX - normY * 0.35;
      }
    });

    // Touch & Drag controls
    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointerX;
      const dy = e.clientY - prevPointerY;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;

      dragVelocityX = dx * 0.007;
      dragVelocityY = dy * 0.007;

      tabletGroup.rotation.y += dragVelocityX;
      tabletGroup.rotation.x += dragVelocityY;
    });

    window.addEventListener('pointerup', () => {
      if (isDragging) {
        isDragging = false;
        container.style.cursor = 'grab';
      }
    });

    // 13. Render Loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const dt = clock.getDelta();
      const time = clock.getElapsedTime();

      // Levitation float
      const floatY = Math.sin(time * 1.5) * 0.14;
      const wobbleZ = Math.cos(time * 1.2) * 0.04;

      tabletGroup.position.y = floatY;

      // River flow dynamic pitch & roll
      const riverTiltX = riverProgress * 0.55 + scrollVelocity * 0.4;
      const riverBankZ = -riverProgress * 0.25;

      tabletGroup.rotation.z = initialRotZ + wobbleZ + riverBankZ;

      shadowPlane.scale.setScalar(1 - floatY * 0.25);
      shadowMat.opacity = Math.max(0.15, 0.65 - floatY * 0.3 - riverProgress * 0.4);

      if (isDragging) {
        // Direct manipulation
      } else {
        // Inertia damping
        if (Math.abs(dragVelocityX) > 0.0001 || Math.abs(dragVelocityY) > 0.0001) {
          tabletGroup.rotation.y += dragVelocityX;
          tabletGroup.rotation.x += dragVelocityY;
          dragVelocityX *= Math.pow(0.92, dt * 60);
          dragVelocityY *= Math.pow(0.92, dt * 60);
          targetRotX = tabletGroup.rotation.x;
          targetRotY = tabletGroup.rotation.y;
        } else {
          // Smooth spring lerp back to target + river tilt
          const spring = 1 - Math.exp(-4.5 * dt);
          tabletGroup.rotation.x += (targetRotX + riverTiltX - tabletGroup.rotation.x) * spring;
          tabletGroup.rotation.y += (targetRotY - tabletGroup.rotation.y) * spring;
        }
      }

      scrollVelocity *= Math.pow(0.85, dt * 60);

      // Dust spin
      particles.rotation.y = time * 0.08;
      particles.rotation.x = time * 0.04;

      renderer.render(scene, camera);
    }

    animate();

    function onResize() {
      const newWidth = container.clientWidth || 360;
      const newHeight = container.clientHeight || 360;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTablet3D);
  } else {
    initTablet3D();
  }
})();

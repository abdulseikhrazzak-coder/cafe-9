import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sliders, Sparkles, Coffee, Flame, Compass } from 'lucide-react';

const Experience = () => {
  const containerRef = useRef(null);
  
  // Customizer States
  const [neonColor, setNeonColor] = useState('#ff0e3c'); // Red, Purple, Gold
  const [spinSpeed, setSpinSpeed] = useState(1.5); // 0 to 5
  const [steamIntensity, setSteamIntensity] = useState(30); // 10 to 100
  const [beanCount, setBeanCount] = useState(12); // 5 to 30

  // References for Three.js hooks to update on state change
  const rimLightRef = useRef(null);
  const underGlowRef = useRef(null);
  const spinSpeedRef = useRef(spinSpeed);
  const steamCountRef = useRef(steamIntensity);
  const steamGeometryRef = useRef(null);
  const steamSpeedsRef = useRef([]);

  // Sync state variables to refs to read them inside the high-frequency animation loop
  useEffect(() => {
    spinSpeedRef.current = spinSpeed;
  }, [spinSpeed]);

  useEffect(() => {
    if (rimLightRef.current && underGlowRef.current) {
      const color = new THREE.Color(neonColor);
      rimLightRef.current.color = color;
      underGlowRef.current.color = color;
    }
  }, [neonColor]);

  // Handle Dynamic steam particle intensity change
  useEffect(() => {
    steamCountRef.current = steamIntensity;
    if (steamGeometryRef.current) {
      // Re-initialize steam particles array size or speeds
      const count = steamIntensity;
      const positions = new Float32Array(count * 3);
      const speeds = [];

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 0.8;
        positions[i * 3 + 1] = 0.55 + Math.random() * 2.0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

        speeds.push({
          x: (Math.random() - 0.5) * 0.003,
          y: 0.006 + Math.random() * 0.012,
          z: (Math.random() - 0.5) * 0.003
        });
      }

      steamGeometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      steamGeometryRef.current.attributes.position.needsUpdate = true;
      steamSpeedsRef.current = speeds;
    }
  }, [steamIntensity]);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 3.5, 9);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const w = width || container.clientWidth || 300;
        const h = height || container.clientHeight || 550;
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0x38282d, 3.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 5.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light - Soft warm light from front-top-left to illuminate shadow areas
    const fillLight = new THREE.DirectionalLight(0xfff0e8, 2.0);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);

    // Rim/Neon Light (Customizable)
    const rimLight = new THREE.PointLight(new THREE.Color(neonColor), 9.0, 15);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Under-glow Light (Customizable)
    const underGlow = new THREE.PointLight(new THREE.Color(neonColor), 7.0, 6);
    underGlow.position.set(0, -0.5, 0);
    scene.add(underGlow);
    underGlowRef.current = underGlow;

    // --- Objects ---
    const group = new THREE.Group();
    scene.add(group);

    // Ceramic Saucer
    const saucerGeom = new THREE.CylinderGeometry(1.65, 1.15, 0.1, 32);
    const saucerMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.2,
      metalness: 0.1
    });
    const saucer = new THREE.Mesh(saucerGeom, saucerMat);
    saucer.position.y = -0.8;
    saucer.receiveShadow = true;
    group.add(saucer);

    // Cup Group
    const cupGroup = new THREE.Group();
    group.add(cupGroup);

    // Cup Ceramic Outer
    const cupOuterGeom = new THREE.CylinderGeometry(1.15, 0.98, 1.45, 32, 1, false);
    const cupOuterMat = new THREE.MeshPhysicalMaterial({
      color: 0x25252a,
      roughness: 0.15,
      metalness: 0.3,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1
    });
    const cupOuter = new THREE.Mesh(cupOuterGeom, cupOuterMat);
    cupOuter.castShadow = true;
    cupOuter.receiveShadow = true;
    cupGroup.add(cupOuter);

    // Cup Inner (Red)
    const cupInnerGeom = new THREE.CylinderGeometry(1.08, 0.92, 1.4, 32, 1, true);
    const cupInnerMat = new THREE.MeshStandardMaterial({
      color: 0x8a0b12,
      roughness: 0.1,
      metalness: 0.2
    });
    const cupInner = new THREE.Mesh(cupInnerGeom, cupInnerMat);
    cupInner.position.y = 0.03;
    cupGroup.add(cupInner);

    // Coffee Liquid
    const coffeeGeom = new THREE.CylinderGeometry(1.04, 1.02, 0.05, 32);
    const coffeeMat = new THREE.MeshStandardMaterial({
      color: 0x361c0e,
      roughness: 0.06
    });
    const coffee = new THREE.Mesh(coffeeGeom, coffeeMat);
    coffee.position.y = 0.58;
    cupGroup.add(coffee);

    // Handle
    const handleGeom = new THREE.TorusGeometry(0.42, 0.11, 16, 32, Math.PI * 1.25);
    handleGeom.rotateZ(-Math.PI / 1.7);
    const handle = new THREE.Mesh(handleGeom, cupOuterMat);
    handle.position.set(1.05, 0, 0);
    handle.castShadow = true;
    cupGroup.add(handle);

    // Neon Rim border
    const rimGeom = new THREE.TorusGeometry(1.11, 0.038, 12, 48);
    rimGeom.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xff0e3c,
      emissive: 0xff0e3c,
      emissiveIntensity: 1.0,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.y = 0.725;
    cupGroup.add(rim);

    // --- Dynamic Neon Rim updates ---
    const updateNeonRimColor = () => {
      rim.material.color = new THREE.Color(neonColor);
      rim.material.emissive = new THREE.Color(neonColor);
    };
    updateNeonRimColor();

    // --- Floating Beans ---
    const beans = [];
    const maxBeans = 30; // Max budget
    const beanGeom = new THREE.SphereGeometry(0.2, 16, 16);
    beanGeom.scale(1.4, 0.85, 0.85);

    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x301a0e,
      roughness: 0.55,
      metalness: 0.1
    });

    for (let i = 0; i < maxBeans; i++) {
      const beanGroup = new THREE.Group();
      const mainBean = new THREE.Mesh(beanGeom, beanMat);
      mainBean.castShadow = true;
      beanGroup.add(mainBean);

      // Creamy center line
      const lineGeom = new THREE.BoxGeometry(0.55, 0.04, 0.04);
      const lineMat = new THREE.MeshStandardMaterial({ color: 0x1a0d07, roughness: 0.8 });
      const line = new THREE.Mesh(lineGeom, lineMat);
      line.position.y = 0.13;
      line.rotation.y = Math.PI / 2;
      beanGroup.add(line);

      const angle = (i / maxBeans) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 2.2 + Math.random() * 1.8;
      const y = -0.8 + Math.random() * 2.5;

      beanGroup.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      
      beanGroup.userData = {
        angle: angle,
        radius: radius,
        speed: 0.003 + Math.random() * 0.006,
        yFactor: 0.15 + Math.random() * 0.35,
        ySpeed: 0.015 + Math.random() * 0.02,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        timeOffset: Math.random() * 100,
        index: i
      };

      scene.add(beanGroup);
      beans.push(beanGroup);
    }

    // --- Dynamic Steam Particles ---
    const steamGeometry = new THREE.BufferGeometry();
    steamGeometryRef.current = steamGeometry;

    const maxSteamCount = 100;
    const steamPositions = new Float32Array(maxSteamCount * 3);
    const steamSpeeds = [];

    for (let i = 0; i < maxSteamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.8;
      steamPositions[i * 3 + 1] = 0.58 + Math.random() * 2.0;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

      steamSpeeds.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.006 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.003
      });
    }
    steamSpeedsRef.current = steamSpeeds;
    steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 240, 240, 0.45)');
    grad.addColorStop(0.5, 'rgba(255, 100, 100, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const steamMaterial = new THREE.PointsMaterial({
      size: 0.4,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffaabb
    });

    const steamParticles = new THREE.Points(steamGeometry, steamMaterial);
    cupGroup.add(steamParticles);

    // Interaction mouse tilt
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotationY = x * 0.8;
      targetRotationX = -y * 0.4;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    const clock = new THREE.Clock();
    let frameId;

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      const elapsed = clock.getElapsedTime();

      // Dynamic Color update
      rim.material.color.setStyle(neonColor);
      rim.material.emissive.setStyle(neonColor);
      steamMaterial.color.setStyle(neonColor);

      // Orbit/Speed constants
      const speedMult = spinSpeedRef.current;

      // Mouse tilt Lerp
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;
      cupGroup.rotation.x = currentRotationX;
      cupGroup.rotation.y = currentRotationY;

      // Auto spin base
      group.rotation.y = elapsed * 0.1 * speedMult + currentRotationY;

      // Beans positions update
      beans.forEach((bean, idx) => {
        // Show/hide based on count settings
        if (idx >= beanCount) {
          bean.visible = false;
          return;
        }
        bean.visible = true;

        const ud = bean.userData;
        ud.angle += ud.speed * (speedMult * 0.8 + 0.2);

        const wave = Math.sin(elapsed * ud.ySpeed + ud.timeOffset) * ud.yFactor;
        bean.position.x = Math.cos(ud.angle) * ud.radius;
        bean.position.z = Math.sin(ud.angle) * ud.radius;
        bean.position.y += (wave - (bean.position.y - ud.yFactor)) * 0.05;

        bean.rotation.x += ud.rotSpeedX;
        bean.rotation.y += ud.rotSpeedY;
      });

      // Steam Particle Positions update
      const positions = steamGeometry.attributes.position.array;
      const currentSteamCount = steamCountRef.current;

      for (let i = 0; i < maxSteamCount; i++) {
        if (i >= currentSteamCount) continue;

        positions[i * 3 + 1] += steamSpeedsRef.current[i].y * (speedMult * 0.5 + 0.5);
        positions[i * 3] += steamSpeedsRef.current[i].x;
        positions[i * 3 + 2] += steamSpeedsRef.current[i].z;

        if (positions[i * 3 + 1] > 3.2) {
          positions[i * 3 + 1] = 0.58 + Math.random() * 0.15;
          positions[i * 3] = (Math.random() - 0.5) * 0.65;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.65;
        }
      }
      steamGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    tick();

    // Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 550;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      saucerGeom.dispose();
      saucerMat.dispose();
      cupOuterGeom.dispose();
      cupOuterMat.dispose();
      cupInnerGeom.dispose();
      cupInnerMat.dispose();
      coffeeGeom.dispose();
      coffeeMat.dispose();
      handleGeom.dispose();
      rimGeom.dispose();
      rimMat.dispose();
      beanGeom.dispose();
      beanMat.dispose();
      steamGeometry.dispose();
      steamMaterial.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [beanCount]); // Recreate beans when count changes to bind correct arrays

  return (
    <div style={styles.container} className="animate-fade-in-up">
      <div className="gradient-overlay" />

      <section style={styles.section}>
        <div className="section-header">
          <span className="section-subtitle">Interactive Playground</span>
          <h1 className="section-title">3D Café <span>Lab</span></h1>
        </div>

        <div className="lab-grid" style={styles.labGrid}>
          {/* 3D Canvas */}
          <div className="canvas-panel glass-panel" style={styles.canvasPanel}>
            <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '400px' }} />
            <div style={styles.badgeOverlay}>
              <span style={styles.controlBadge}>Ambient Render Active</span>
            </div>
            <div style={styles.dragHint}>
              <Compass size={14} style={{ marginRight: '6px' }} /> Move your mouse to tilt the camera viewpoint!
            </div>
          </div>

          {/* Configuration Sliders Panel */}
          <div style={styles.controlsPanel} className="glass-panel">
            <h3 style={styles.panelTitle} className="glow-text">
              <Sliders size={20} color="var(--primary-red)" /> Control Panel
            </h3>
            
            <p style={styles.panelDesc}>
              Modify render configurations in real time to customize the café visual engine experience.
            </p>

            {/* Neon Glow Color Picker */}
            <div style={styles.controlGroup}>
              <label style={styles.label}>
                <Sparkles size={16} color="var(--primary-red)" /> Neon Ambient Tint
              </label>
              <div style={styles.colorRow}>
                {[
                  { id: 'crimson', hex: '#ff0e3c', label: 'Crimson' },
                  { id: 'magenta', hex: '#e012e0', label: 'Magenta' },
                  { id: 'gold', hex: '#fcd34d', label: 'Amber' },
                  { id: 'cyan', hex: '#0ea5e9', label: 'Cyan' }
                ].map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setNeonColor(col.hex)}
                    style={{
                      ...styles.colorBtn,
                      backgroundColor: col.hex,
                      border: neonColor === col.hex ? '3px solid #ffffff' : '1px solid rgba(255,255,255,0.2)'
                    }}
                    title={col.label}
                  />
                ))}
              </div>
            </div>

            {/* Spin Speed Slider */}
            <div style={styles.controlGroup}>
              <div style={styles.sliderLabelRow}>
                <label style={styles.label}><Coffee size={16} /> Orbiting Rotation Speed</label>
                <span style={styles.sliderVal}>{spinSpeed}x</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1" 
                value={spinSpeed}
                onChange={(e) => setSpinSpeed(parseFloat(e.target.value))}
                style={styles.slider}
              />
            </div>

            {/* Steam Density Slider */}
            <div style={styles.controlGroup}>
              <div style={styles.sliderLabelRow}>
                <label style={styles.label}><Flame size={16} /> Steam Particle Count</label>
                <span style={styles.sliderVal}>{steamIntensity} pts</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5" 
                value={steamIntensity}
                onChange={(e) => setSteamIntensity(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>

            {/* Orbiting Beans Count */}
            <div style={styles.controlGroup}>
              <div style={styles.sliderLabelRow}>
                <label style={styles.label}><Sparkles size={16} /> Orbiting Coffee Beans</label>
                <span style={styles.sliderVal}>{beanCount} beans</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1" 
                value={beanCount}
                onChange={(e) => setBeanCount(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>

            <div style={styles.infoBadgePanel}>
              <span>Engine Status: Excellent (60 FPS)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Craft Gallery */}
      <section style={styles.gallerySection}>
        <div className="section-header">
          <span className="section-subtitle">The Bean Philosophy</span>
          <h2 className="section-title">How We <span>Brew</span></h2>
        </div>

        <div className="grid-3">
          <div className="glass-panel" style={styles.infoCard}>
            <span style={styles.cardNumber}>01</span>
            <h3 style={styles.cardHeader}>Selection</h3>
            <p style={styles.cardText}>
              We source strictly microlot single-origin coffee berries from elevations above 1,200 meters, ensuring optimal flavor acidity.
            </p>
          </div>

          <div className="glass-panel" style={styles.infoCard}>
            <span style={styles.cardNumber}>02</span>
            <h3 style={styles.cardHeader}>Roasting</h3>
            <p style={styles.cardText}>
              Roasted at controlled profiles to bring out natural notes of dark chocolate, berry highlights, and roasted hazelnuts.
            </p>
          </div>

          <div className="glass-panel" style={styles.infoCard}>
            <span style={styles.cardNumber}>03</span>
            <h3 style={styles.cardHeader}>Extraction</h3>
            <p style={styles.cardText}>
              Pre-infused for 8 seconds and extracted under a strict 9-bar pressure gradient using state-of-the-art Italian machines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  section: {
    paddingBottom: '40px',
  },
  labGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '35px',
    marginTop: '30px',
    alignItems: 'stretch',
  },
  canvasPanel: {
    position: 'relative',
    height: '550px',
    background: 'rgba(5, 5, 5, 0.4)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeOverlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  controlBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#22c55e',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    padding: '5px 12px',
    borderRadius: '20px',
  },
  dragHint: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 10, 12, 0.6)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.04)',
    pointerEvents: 'none',
  },
  controlsPanel: {
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    background: 'rgba(15, 15, 17, 0.8)',
    justifyContent: 'center',
  },
  panelTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  panelDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginTop: '-8px',
  },
  controlGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  colorRow: {
    display: 'flex',
    gap: '12px',
  },
  colorBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    ':hover': {
      transform: 'scale(1.15)',
    }
  },
  sliderLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderVal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--primary-red)',
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    padding: '2px 8px',
    borderRadius: '4px',
  },
  slider: {
    width: '100%',
    WebkitAppearance: 'none',
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, 0.08)',
    outline: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
    // Style the thumb
  },
  infoBadgePanel: {
    marginTop: '5px',
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textAlign: 'center',
    fontWeight: '500',
  },
  gallerySection: {
    paddingBottom: '80px',
  },
  infoCard: {
    padding: '30px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflow: 'hidden',
  },
  cardNumber: {
    fontSize: '3.5rem',
    fontWeight: '900',
    color: 'rgba(229, 9, 20, 0.05)',
    position: 'absolute',
    right: '20px',
    top: '10px',
    lineHeight: '1',
    userSelect: 'none',
  },
  cardHeader: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  cardText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  }
};

// Inject custom styles for HTML ranges
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = `
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-red);
      box-shadow: 0 0 8px rgba(229, 9, 20, 0.7);
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.2);
      background: var(--accent-red);
    }
    input[type=range]::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--primary-red);
      box-shadow: 0 0 8px rgba(229, 9, 20, 0.7);
      cursor: pointer;
      border: none;
      transition: transform 0.1s ease;
    }
    input[type=range]::-moz-range-thumb:hover {
      transform: scale(1.2);
      background: var(--accent-red);
    }
  `;
  document.head.appendChild(styleTag);
}

export default Experience;

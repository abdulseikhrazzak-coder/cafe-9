import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCoffeeCup = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Transparent or dark background
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = containerRef.current;
    container.appendChild(renderer.domElement);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const w = width || container.clientWidth || 300;
        const h = height || container.clientHeight || 500;
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // --- Lighting ---
    // Ambient light - warm crimson/dark tint
    const ambientLight = new THREE.AmbientLight(0x3d2025, 3.0);
    scene.add(ambientLight);

    // Key Light - Warm white from front-top-right
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 5.0);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light - Soft warm light from front-top-left to illuminate shadow areas
    const fillLight = new THREE.DirectionalLight(0xfff0e8, 2.0);
    fillLight.position.set(-5, 3, 5);
    scene.add(fillLight);

    // Rim/Neon Light - Crimson Red from behind-left
    const rimLight = new THREE.PointLight(0xff0e3c, 8.0, 15);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    // Under-glow Light - Neon Red underneath the cup
    const underGlow = new THREE.PointLight(0xff0e3c, 6.0, 6);
    underGlow.position.set(0, -0.5, 0);
    scene.add(underGlow);

    // --- Objects Creation ---
    const coffeeGroup = new THREE.Group();
    scene.add(coffeeGroup);

    // 1. The Saucer
    const saucerGeometry = new THREE.CylinderGeometry(1.6, 1.1, 0.1, 32);
    // Smooth the bottom edge by using a slightly torus-like profile (simplified)
    const saucerMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e1e24,
      roughness: 0.15,
      metalness: 0.1,
      bumpScale: 0.05
    });
    const saucer = new THREE.Mesh(saucerGeometry, saucerMaterial);
    saucer.position.y = -0.8;
    saucer.receiveShadow = true;
    coffeeGroup.add(saucer);

    // Saucer Inner Rim
    const saucerRimGeom = new THREE.TorusGeometry(1.55, 0.05, 12, 48);
    saucerRimGeom.rotateX(Math.PI / 2);
    const saucerRim = new THREE.Mesh(saucerRimGeom, saucerMaterial);
    saucerRim.position.y = -0.75;
    coffeeGroup.add(saucerRim);

    // 2. The Cup
    const cupGroup = new THREE.Group();
    coffeeGroup.add(cupGroup);

    // Outer Ceramic Cylinder
    const cupOuterGeom = new THREE.CylinderGeometry(1.1, 0.95, 1.4, 32, 1, false);
    const cupMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x25252a,
      roughness: 0.2,
      metalness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    // Add custom red rim border style
    const cupOuter = new THREE.Mesh(cupOuterGeom, cupMaterial);
    cupOuter.castShadow = true;
    cupOuter.receiveShadow = true;
    cupGroup.add(cupOuter);

    // Inside Ceramic Layer (Slightly smaller, open top, colored red inside)
    const cupInnerGeom = new THREE.CylinderGeometry(1.03, 0.88, 1.35, 32, 1, true);
    const cupInnerMaterial = new THREE.MeshStandardMaterial({
      color: 0x900c14, // Rich Dark Red inside
      roughness: 0.1,
      metalness: 0.2,
    });
    const cupInner = new THREE.Mesh(cupInnerGeom, cupInnerMaterial);
    cupInner.position.y = 0.03;
    cupGroup.add(cupInner);

    // 3. The Coffee Liquid
    const coffeeLiquidGeom = new THREE.CylinderGeometry(0.99, 0.97, 0.05, 32);
    const coffeeLiquidMat = new THREE.MeshStandardMaterial({
      color: 0x3d2012, // Coffee color
      roughness: 0.05,
      metalness: 0.1,
    });
    const coffeeLiquid = new THREE.Mesh(coffeeLiquidGeom, coffeeLiquidMat);
    coffeeLiquid.position.y = 0.55;
    cupGroup.add(coffeeLiquid);

    // 4. The Cup Handle
    const handleGeom = new THREE.TorusGeometry(0.4, 0.11, 16, 32, Math.PI * 1.2);
    handleGeom.rotateZ(-Math.PI / 1.7);
    const handle = new THREE.Mesh(handleGeom, cupMaterial);
    handle.position.set(1.0, 0, 0);
    handle.castShadow = true;
    cupGroup.add(handle);

    // 5. Cup Rim Highlight
    const rimGeom = new THREE.TorusGeometry(1.065, 0.035, 12, 48);
    rimGeom.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xff0e3c, // Neon red rim
      emissive: 0xff0e3c,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.y = 0.7;
    cupGroup.add(rim);

    // --- Floating Coffee Beans ---
    const beanCount = 12;
    const beans = [];
    
    // Coffee Bean Geometry: shaped like an ellipsoid
    const beanGeom = new THREE.SphereGeometry(0.2, 16, 16);
    beanGeom.scale(1.5, 0.9, 0.9); // Make it oval
    
    // Coffee Bean Material
    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e180d,
      roughness: 0.6,
      metalness: 0.1
    });

    for (let i = 0; i < beanCount; i++) {
      const beanGroup = new THREE.Group();
      
      const mainBean = new THREE.Mesh(beanGeom, beanMaterial);
      mainBean.castShadow = true;
      beanGroup.add(mainBean);
      
      // Detail crease down the middle of the bean
      const creaseGeom = new THREE.BoxGeometry(0.6, 0.05, 0.05);
      const creaseMat = new THREE.MeshStandardMaterial({ color: 0x150b06, roughness: 0.8 });
      const crease = new THREE.Mesh(creaseGeom, creaseMat);
      crease.position.y = 0.15;
      crease.rotation.y = Math.PI / 2;
      beanGroup.add(crease);

      // Random position around cup
      const angle = (i / beanCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 2.0 + Math.random() * 1.5;
      const yOffset = -0.5 + Math.random() * 2.0;

      beanGroup.position.set(
        Math.cos(angle) * radius,
        yOffset,
        Math.sin(angle) * radius
      );

      // Random rotation speeds
      beanGroup.userData = {
        angle: angle,
        radius: radius,
        speed: 0.005 + Math.random() * 0.008,
        yFactor: 0.1 + Math.random() * 0.3,
        ySpeed: 0.01 + Math.random() * 0.02,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        timeOffset: Math.random() * 100
      };

      scene.add(beanGroup);
      beans.push(beanGroup);
    }

    // --- Steam Particle System ---
    const steamCount = 30;
    const steamGeometry = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamSpeeds = [];
    const steamAlphas = [];

    for (let i = 0; i < steamCount; i++) {
      // Start inside the cup
      const x = (Math.random() - 0.5) * 0.8;
      const y = 0.6 + Math.random() * 1.0;
      const z = (Math.random() - 0.5) * 0.8;
      
      steamPositions[i * 3] = x;
      steamPositions[i * 3 + 1] = y;
      steamPositions[i * 3 + 2] = z;

      steamSpeeds.push({
        x: (Math.random() - 0.5) * 0.004,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.004
      });

      steamAlphas.push(Math.random());
    }

    steamGeometry.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    
    // Create soft particle textures using canvas dynamically (no external image dependencies)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 230, 230, 0.3)');
    grad.addColorStop(0.5, 'rgba(255, 100, 100, 0.1)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 16, 16);

    const particleTexture = new THREE.CanvasTexture(pCanvas);

    const steamMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xff8899 // Soft reddish steam
    });

    const steamParticles = new THREE.Points(steamGeometry, steamMaterial);
    cupGroup.add(steamParticles);

    // --- Interaction States ---
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const handleMouseMove = (event) => {
      // Calculate normalized mouse coords
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Map to subtle tilt rotations
      targetRotationY = x * 0.6;
      targetRotationX = -y * 0.3;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const rect = renderer.domElement.getBoundingClientRect();
        const touch = event.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        targetRotationY = x * 0.6;
        targetRotationX = -y * 0.3;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    // Scroll tilt interaction
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = currentScroll - lastScrollY;
      coffeeGroup.rotation.y += diff * 0.003;
      lastScrollY = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);

    // --- Animation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      const requestID = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse rotation follow
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      cupGroup.rotation.x = currentRotationX;
      cupGroup.rotation.y = currentRotationY;

      // Base rotation auto-spin
      coffeeGroup.rotation.y = elapsedTime * 0.15 + currentRotationY;

      // Ambient coffee beans floating
      beans.forEach((bean) => {
        const ud = bean.userData;
        
        // Update orbit angle
        ud.angle += ud.speed;
        
        // Hover wave height
        const wave = Math.sin(elapsedTime * ud.ySpeed + ud.timeOffset) * ud.yFactor;
        
        // Orbit equation
        bean.position.x = Math.cos(ud.angle) * ud.radius;
        bean.position.z = Math.sin(ud.angle) * ud.radius;
        bean.position.y += (wave - (bean.position.y - ud.yFactor)) * 0.05; // smooth drift

        // Rotate bean itself
        bean.rotation.x += ud.rotSpeedX;
        bean.rotation.y += ud.rotSpeedY;
        bean.rotation.z += ud.rotSpeedZ;
      });

      // Animate Steam Particles
      const positions = steamGeometry.attributes.position.array;
      for (let i = 0; i < steamCount; i++) {
        // Move particle up
        positions[i * 3 + 1] += steamSpeeds[i].y;
        positions[i * 3] += steamSpeeds[i].x;
        positions[i * 3 + 2] += steamSpeeds[i].z;

        // Reset if too high or drifted far
        if (positions[i * 3 + 1] > 3.0) {
          positions[i * 3 + 1] = 0.55 + Math.random() * 0.2; // back in cup
          positions[i * 3] = (Math.random() - 0.5) * 0.6;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
        }
      }
      steamGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // --- Clean Up ---
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.clear();
      saucerGeometry.dispose();
      saucerMaterial.dispose();
      saucerRimGeom.dispose();
      cupOuterGeom.dispose();
      cupMaterial.dispose();
      cupInnerGeom.dispose();
      cupInnerMaterial.dispose();
      coffeeLiquidGeom.dispose();
      coffeeLiquidMat.dispose();
      handleGeom.dispose();
      rimGeom.dispose();
      rimMat.dispose();
      beanGeom.dispose();
      beanMaterial.dispose();
      steamGeometry.dispose();
      steamMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative',
        cursor: 'grab' 
      }} 
    />
  );
};

export default ThreeCoffeeCup;

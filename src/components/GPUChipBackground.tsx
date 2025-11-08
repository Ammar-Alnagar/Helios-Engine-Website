import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three-stdlib';

const GPUChipBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // Mouse and scroll tracking
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    let scrollY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('scroll', onScroll, false);

    // Renderer with GPU acceleration
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    // Create GPU Chip geometry
    const chipGroup = new THREE.Group();

    // Main chip body
    const chipGeometry = new THREE.BoxGeometry(3, 0.3, 3);
    const chipMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.3,
      emissive: 0x0a0a0a,
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chipGroup.add(chip);

    // Create circuit lines
    const createCircuitLines = () => {
      const lines = new THREE.Group();
      const lineMaterial = new THREE.MeshBasicMaterial({
        color: 0x00f6ff,
        transparent: true,
        opacity: 0.8,
      });

      // Horizontal lines
      for (let i = 0; i < 8; i++) {
        const lineGeometry = new THREE.BoxGeometry(2.5, 0.02, 0.02);
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(0, 0.16, -1.2 + i * 0.35);
        lines.add(line);
      }

      // Vertical lines
      for (let i = 0; i < 8; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.02, 0.02, 2.5);
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.position.set(-1.2 + i * 0.35, 0.16, 0);
        lines.add(line);
      }

      return lines;
    };

    const circuitLines = createCircuitLines();
    chipGroup.add(circuitLines);

    // Create glowing connection points
    const createConnectionPoints = () => {
      const points = new THREE.Group();
      const pointGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const pointMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
      });

      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const point = new THREE.Mesh(pointGeometry, pointMaterial.clone());
          point.position.set(-1 + i * 0.4, 0.16, -1 + j * 0.4);
          
          // Random pulsing animation offset
          (point.userData as { pulseOffset: number }).pulseOffset = Math.random() * Math.PI * 2;
          points.add(point);
        }
      }

      return points;
    };

    const connectionPoints = createConnectionPoints();
    chipGroup.add(connectionPoints);

    // Create corner pins
    const createPins = () => {
      const pins = new THREE.Group();
      const pinGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
      const pinMaterial = new THREE.MeshStandardMaterial({
        color: 0xc0c0c0,
        metalness: 1,
        roughness: 0.2,
      });

      const positions = [
        [-1.3, -0.2, -1.3],
        [1.3, -0.2, -1.3],
        [-1.3, -0.2, 1.3],
        [1.3, -0.2, 1.3],
      ];

      positions.forEach((pos) => {
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(pos[0], pos[1], pos[2]);
        pins.add(pin);
      });

      return pins;
    };

    const pins = createPins();
    chipGroup.add(pins);

    // Add heat sink on top
    const heatSinkGeometry = new THREE.BoxGeometry(2, 0.6, 2);
    const heatSinkMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      metalness: 0.8,
      roughness: 0.4,
    });
    const heatSink = new THREE.Mesh(heatSinkGeometry, heatSinkMaterial);
    heatSink.position.y = 0.45;
    chipGroup.add(heatSink);

    // Add heat sink fins
    for (let i = 0; i < 8; i++) {
      const finGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.05);
      const fin = new THREE.Mesh(finGeometry, heatSinkMaterial);
      fin.position.set(0, 0.45, -0.7 + i * 0.2);
      chipGroup.add(fin);
    }

    scene.add(chipGroup);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x0088ff, 0.5);
    backLight.position.set(-5, 2, -5);
    scene.add(backLight);

    // Add rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0xff6b00, 0.8);
    rimLight.position.set(0, 3, -5);
    scene.add(rimLight);

    // Add point lights for glow
    const glowLight1 = new THREE.PointLight(0x00f6ff, 1, 10);
    glowLight1.position.set(2, 1, 2);
    scene.add(glowLight1);

    const glowLight2 = new THREE.PointLight(0xff6b00, 1, 10);
    glowLight2.position.set(-2, 1, -2);
    scene.add(glowLight2);

    // Post-processing with bloom
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8, // strength
      0.6, // radius
      0.3  // threshold
    );
    composer.addPass(bloomPass);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Smooth rotation based on mouse
      targetRotation.x = mouse.y * 0.3;
      targetRotation.y = mouse.x * 0.3;

      chipGroup.rotation.x += (targetRotation.x - chipGroup.rotation.x) * 0.05;
      chipGroup.rotation.y += (targetRotation.y - chipGroup.rotation.y) * 0.05;

      // Constant slow rotation
      chipGroup.rotation.y += 0.002;

      // Subtle floating animation
      chipGroup.position.y = Math.sin(time * 0.5) * 0.1;

      // React to scroll
      const scrollOffset = scrollY * 0.001;
      chipGroup.rotation.x = scrollOffset * 0.5 + targetRotation.x;

      // Animate connection points (pulsing glow)
      connectionPoints.children.forEach((point) => {
        const mesh = point as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const userData = mesh.userData as { pulseOffset: number };
        const pulse = Math.sin(time * 2 + userData.pulseOffset) * 0.5 + 0.5;
        material.opacity = 0.6 + pulse * 0.4;
      });

      // Animate circuit lines opacity
      circuitLines.children.forEach((line, index) => {
        const mesh = line as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const wave = Math.sin(time * 1.5 + index * 0.3) * 0.3 + 0.7;
        material.opacity = wave;
      });

      // Animate glow lights
      glowLight1.intensity = Math.sin(time * 1.5) * 0.3 + 1;
      glowLight2.intensity = Math.cos(time * 1.5) * 0.3 + 1;

      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default GPUChipBackground;
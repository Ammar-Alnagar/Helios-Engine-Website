import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GPUChipBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const chipGroupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create GPU chip group
    const chipGroup = new THREE.Group();
    chipGroupRef.current = chipGroup;
    scene.add(chipGroup);

    // Create main chip body (rectangular base)
    const chipGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.3);
    const chipMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1,
    });
    const chip = new THREE.Mesh(chipGeometry, chipMaterial);
    chipGroup.add(chip);

    // Create circuit pattern grid
    const createCircuitPattern = () => {
      const circuitGroup = new THREE.Group();
      const lineCount = 20;
      const spacing = 0.25;
      const offset = (lineCount * spacing) / 2;

      for (let i = 0; i < lineCount; i++) {
        // Horizontal lines
        const hLineGeometry = new THREE.PlaneGeometry(2.3, 0.02);
        const hLineMaterial = new THREE.MeshBasicMaterial({
          color: 0x00f6ff,
          transparent: true,
          opacity: 0.6,
        });
        const hLine = new THREE.Mesh(hLineGeometry, hLineMaterial);
        hLine.position.y = i * spacing - offset;
        hLine.position.z = 0.16;
        circuitGroup.add(hLine);

        // Vertical lines
        const vLineGeometry = new THREE.PlaneGeometry(0.02, 2.3);
        const vLineMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6b35,
          transparent: true,
          opacity: 0.5,
        });
        const vLine = new THREE.Mesh(vLineGeometry, vLineMaterial);
        vLine.position.x = i * spacing - offset;
        vLine.position.z = 0.16;
        circuitGroup.add(vLine);
      }

      return circuitGroup;
    };

    const circuitPattern = createCircuitPattern();
    chipGroup.add(circuitPattern);

    // Create corner pins/contacts
    const createCornerPins = () => {
      const pinGroup = new THREE.Group();
      const pinGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
      const pinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1,
        roughness: 0.2,
      });

      const positions = [
        [-1.1, -1.1, 0],
        [1.1, -1.1, 0],
        [-1.1, 1.1, 0],
        [1.1, 1.1, 0],
      ];

      positions.forEach(([x, y, z]) => {
        const pin = new THREE.Mesh(pinGeometry, pinMaterial);
        pin.position.set(x, y, z);
        pin.rotation.x = Math.PI / 2;
        pinGroup.add(pin);
      });

      return pinGroup;
    };

    const cornerPins = createCornerPins();
    chipGroup.add(cornerPins);

    // Create central processing core
    const coreGeometry = new THREE.BoxGeometry(1, 1, 0.2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4a4e69,
      metalness: 0.8,
      roughness: 0.3,
      emissive: 0x00f6ff,
      emissiveIntensity: 0.3,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.z = 0.2;
    chipGroup.add(core);

    // Add glowing particles around the chip
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

      // Color variation (cyan to orange)
      const t = i / particleCount;
      colors[i * 3] = t; // R
      colors[i * 3 + 1] = 0.6 + t * 0.4; // G
      colors[i * 3 + 2] = 1 - t * 0.5; // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    chipGroup.add(particles);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f6ff, 2, 10);
    pointLight1.position.set(2, 2, 3);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff6b35, 1.5, 10);
    pointLight2.position.set(-2, -2, 3);
    scene.add(pointLight2);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 0, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Scroll handler
    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight;
    };

    // Window resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (chipGroup) {
        // Base rotation
        chipGroup.rotation.y = elapsedTime * 0.15;
        chipGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;

        // React to mouse position
        chipGroup.rotation.y += mouseRef.current.x * 0.1;
        chipGroup.rotation.x += mouseRef.current.y * 0.1;

        // React to scroll
        chipGroup.position.y = scrollRef.current * 0.5;
        chipGroup.rotation.z = scrollRef.current * 0.2;

        // Animate particles
        const particlePositions = particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const angle = elapsedTime * 0.5 + (i / particleCount) * Math.PI * 2;
          const radius = 2 + Math.sin(elapsedTime + i * 0.1) * 0.5;
          particlePositions[i * 3] = Math.cos(angle) * radius;
          particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
          particlePositions[i * 3 + 2] = Math.sin(elapsedTime * 2 + i * 0.1) * 0.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Pulse the core emissive intensity
        coreMaterial.emissiveIntensity = 0.3 + Math.sin(elapsedTime * 2) * 0.2;

        // Animate lights
        pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 3;
        pointLight1.position.y = Math.cos(elapsedTime * 0.5) * 3;
        pointLight2.position.x = Math.cos(elapsedTime * 0.7) * 3;
        pointLight2.position.y = Math.sin(elapsedTime * 0.7) * 3;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default GPUChipBackground;

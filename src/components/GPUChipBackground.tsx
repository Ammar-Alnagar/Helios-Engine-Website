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
    
    // Rotate the entire chip group to face the user (90 degrees on X-axis)
    chipGroup.rotation.x = Math.PI / 2;

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

    // Create glowing wires extending from the chip
    const createGlowingWires = () => {
      const wires = new THREE.Group();
      const orangeColor = 0xff6b00; // Bright orange color for all wires
      
      // Create wire using TubeGeometry for smooth curves
      const createWire = (controlPoints: THREE.Vector3[], thickness = 0.02) => {
        const curve = new THREE.CatmullRomCurve3(controlPoints);
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, thickness, 8, false);
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: orangeColor,
          transparent: true,
          opacity: 0.9,
        });
        const wire = new THREE.Mesh(tubeGeometry, wireMaterial);
        
        // Store for animation
        (wire.userData as { baseColor: number; pulseOffset: number }) = {
          baseColor: orangeColor,
          pulseOffset: Math.random() * Math.PI * 2,
        };
        
        return wire;
      };

      // Corner wires - thicker and more prominent
      const cornerWires = [
        // Top-left corner - multiple wires
        [
          new THREE.Vector3(-1.5, 0.2, -1.5),
          new THREE.Vector3(-2.5, 0.8, -2),
          new THREE.Vector3(-3.5, 0.5, -3),
          new THREE.Vector3(-4.5, 1.2, -3.5),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, -1.5),
          new THREE.Vector3(-2.2, 0.3, -2.2),
          new THREE.Vector3(-3.2, 0.9, -3.2),
          new THREE.Vector3(-4.2, 0.4, -4.2),
        ],
        // Top-right corner
        [
          new THREE.Vector3(1.5, 0.2, -1.5),
          new THREE.Vector3(2.5, 1.0, -2),
          new THREE.Vector3(3.5, 0.4, -3),
          new THREE.Vector3(4.5, 1.3, -4),
        ],
        [
          new THREE.Vector3(1.5, 0.2, -1.5),
          new THREE.Vector3(2.2, 0.5, -2.2),
          new THREE.Vector3(3.2, 0.2, -3.2),
          new THREE.Vector3(4.2, 0.8, -4.2),
        ],
        // Bottom-left corner
        [
          new THREE.Vector3(-1.5, 0.2, 1.5),
          new THREE.Vector3(-2.5, -0.5, 2.5),
          new THREE.Vector3(-3.5, 0.6, 3.5),
          new THREE.Vector3(-4.5, 0, 4.5),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, 1.5),
          new THREE.Vector3(-2.2, 0.7, 2.2),
          new THREE.Vector3(-3.2, -0.2, 3.2),
          new THREE.Vector3(-4.2, 0.9, 4.2),
        ],
        // Bottom-right corner
        [
          new THREE.Vector3(1.5, 0.2, 1.5),
          new THREE.Vector3(2.5, 0.8, 2.5),
          new THREE.Vector3(3.5, 0.1, 3.5),
          new THREE.Vector3(4.5, 0.9, 4.5),
        ],
        [
          new THREE.Vector3(1.5, 0.2, 1.5),
          new THREE.Vector3(2.2, 0.3, 2.2),
          new THREE.Vector3(3.2, 0.7, 3.2),
          new THREE.Vector3(4.2, 0.2, 4.2),
        ],
      ];

      cornerWires.forEach(points => wires.add(createWire(points, 0.025)));

      // Edge wires - from sides and center
      const edgeWires = [
        // Top edge - multiple wires
        [
          new THREE.Vector3(0, 0.2, -1.5),
          new THREE.Vector3(0.5, 1.0, -2.5),
          new THREE.Vector3(-0.5, 0.6, -3.5),
          new THREE.Vector3(0, 1.4, -4.5),
        ],
        [
          new THREE.Vector3(-0.5, 0.2, -1.5),
          new THREE.Vector3(-1.0, 0.8, -2.5),
          new THREE.Vector3(-1.5, 0.4, -3.5),
          new THREE.Vector3(-1.0, 1.1, -4.5),
        ],
        [
          new THREE.Vector3(0.5, 0.2, -1.5),
          new THREE.Vector3(1.0, 0.7, -2.5),
          new THREE.Vector3(1.5, 0.5, -3.5),
          new THREE.Vector3(1.0, 1.2, -4.5),
        ],
        // Bottom edge
        [
          new THREE.Vector3(0, 0.2, 1.5),
          new THREE.Vector3(-0.5, -0.6, 2.5),
          new THREE.Vector3(0.5, 0.3, 3.5),
          new THREE.Vector3(0, -1.0, 4.5),
        ],
        [
          new THREE.Vector3(-0.5, 0.2, 1.5),
          new THREE.Vector3(-1.0, 0.4, 2.5),
          new THREE.Vector3(-1.5, -0.3, 3.5),
          new THREE.Vector3(-1.0, 0.7, 4.5),
        ],
        [
          new THREE.Vector3(0.5, 0.2, 1.5),
          new THREE.Vector3(1.0, 0.5, 2.5),
          new THREE.Vector3(1.5, -0.2, 3.5),
          new THREE.Vector3(1.0, 0.8, 4.5),
        ],
        // Left edge
        [
          new THREE.Vector3(-1.5, 0.2, 0),
          new THREE.Vector3(-2.5, 1.0, 0.5),
          new THREE.Vector3(-3.5, 0.5, -0.5),
          new THREE.Vector3(-4.5, 1.3, 0),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, -0.5),
          new THREE.Vector3(-2.5, 0.6, -0.8),
          new THREE.Vector3(-3.5, 0.9, -0.3),
          new THREE.Vector3(-4.5, 0.4, -0.7),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, 0.5),
          new THREE.Vector3(-2.5, 0.4, 1.0),
          new THREE.Vector3(-3.5, 0.8, 0.8),
          new THREE.Vector3(-4.5, 0.6, 1.2),
        ],
        // Right edge
        [
          new THREE.Vector3(1.5, 0.2, 0),
          new THREE.Vector3(2.5, 0.3, -0.5),
          new THREE.Vector3(3.5, 0.9, 0.5),
          new THREE.Vector3(4.5, 0.5, 0),
        ],
        [
          new THREE.Vector3(1.5, 0.2, -0.5),
          new THREE.Vector3(2.5, 0.7, -1.0),
          new THREE.Vector3(3.5, 0.4, -0.8),
          new THREE.Vector3(4.5, 0.9, -0.5),
        ],
        [
          new THREE.Vector3(1.5, 0.2, 0.5),
          new THREE.Vector3(2.5, 0.5, 1.0),
          new THREE.Vector3(3.5, 0.2, 0.8),
          new THREE.Vector3(4.5, 0.7, 1.2),
        ],
      ];

      edgeWires.forEach(points => wires.add(createWire(points, 0.018)));

      // Additional scattered wires for density
      const scatteredWires = [
        [
          new THREE.Vector3(-1.0, 0.2, -1.2),
          new THREE.Vector3(-1.8, 0.9, -2.0),
          new THREE.Vector3(-2.5, 0.5, -2.8),
          new THREE.Vector3(-3.2, 1.1, -3.5),
        ],
        [
          new THREE.Vector3(1.0, 0.2, -1.2),
          new THREE.Vector3(1.8, 0.6, -2.0),
          new THREE.Vector3(2.5, 0.9, -2.8),
          new THREE.Vector3(3.2, 0.4, -3.5),
        ],
        [
          new THREE.Vector3(-1.0, 0.2, 1.2),
          new THREE.Vector3(-1.8, 0.4, 2.0),
          new THREE.Vector3(-2.5, 0.8, 2.8),
          new THREE.Vector3(-3.2, 0.3, 3.5),
        ],
        [
          new THREE.Vector3(1.0, 0.2, 1.2),
          new THREE.Vector3(1.8, 0.7, 2.0),
          new THREE.Vector3(2.5, 0.3, 2.8),
          new THREE.Vector3(3.2, 0.8, 3.5),
        ],
      ];

      scatteredWires.forEach(points => wires.add(createWire(points, 0.015)));

      return wires;
    };

    const glowingWires = createGlowingWires();
    chipGroup.add(glowingWires);

    // Create Rust logo on the chip
    const createRustLogo = () => {
      const logoGroup = new THREE.Group();
      
      // Rust logo is a gear shape - simplified version
      const createGearShape = () => {
        const shape = new THREE.Shape();
        const outerRadius = 0.5;
        const innerRadius = 0.35;
        const teeth = 8;
        
        for (let i = 0; i < teeth * 2; i++) {
          const angle = (i / (teeth * 2)) * Math.PI * 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        shape.closePath();
        
        // Add center hole
        const holePath = new THREE.Path();
        const holeRadius = 0.15;
        holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        shape.holes.push(holePath);
        
        return shape;
      };
      
      const gearShape = createGearShape();
      const extrudeSettings = {
        depth: 0.02,
        bevelEnabled: false,
      };
      
      const logoGeometry = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
      const logoMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.95,
      });
      
      // Front logo
      const frontLogo = new THREE.Mesh(logoGeometry, logoMaterial);
      frontLogo.position.set(0, 0, 0.17);
      frontLogo.rotation.x = Math.PI / 2;
      logoGroup.add(frontLogo);
      
      // Back logo
      const backLogo = new THREE.Mesh(logoGeometry, logoMaterial.clone());
      backLogo.position.set(0, 0, -0.17);
      backLogo.rotation.x = -Math.PI / 2;
      logoGroup.add(backLogo);
      
      // Add glowing outline to logos
      const outlineGeometry = new THREE.TorusGeometry(0.5, 0.03, 16, 32);
      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 1,
      });
      
      const frontOutline = new THREE.Mesh(outlineGeometry, outlineMaterial);
      frontOutline.position.set(0, 0, 0.19);
      frontOutline.rotation.x = Math.PI / 2;
      logoGroup.add(frontOutline);
      
      const backOutline = new THREE.Mesh(outlineGeometry, outlineMaterial.clone());
      backOutline.position.set(0, 0, -0.19);
      backOutline.rotation.x = Math.PI / 2;
      logoGroup.add(backOutline);
      
      return logoGroup;
    };
    
    const rustLogo = createRustLogo();
    chipGroup.add(rustLogo);

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

      // Smooth rotation based on mouse (add to base 90-degree rotation)
      targetRotation.x = Math.PI / 2 + mouse.y * 0.2;
      targetRotation.y = mouse.x * 0.2;

      chipGroup.rotation.x += (targetRotation.x - chipGroup.rotation.x) * 0.05;
      chipGroup.rotation.y += (targetRotation.y - chipGroup.rotation.y) * 0.05;

      // Constant slow rotation around Z-axis (since chip is rotated)
      chipGroup.rotation.z += 0.002;

      // Subtle floating animation
      chipGroup.position.y = Math.sin(time * 0.5) * 0.1;

      // React to scroll
      const scrollOffset = scrollY * 0.001;
      chipGroup.rotation.z += scrollOffset * 0.0005;

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

      // Animate glowing wires - bright orange pulsing
      glowingWires.children.forEach((wire) => {
        const mesh = wire as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const userData = mesh.userData as { baseColor: number; pulseOffset: number };
        
        // Strong pulsing glow effect
        const pulse = Math.sin(time * 2.5 + userData.pulseOffset) * 0.5 + 0.5;
        material.opacity = 0.7 + pulse * 0.3;
        
        // Bright orange with intensity variation
        const intensity = 0.8 + pulse * 0.2;
        material.color.setRGB(1.0 * intensity, 0.42 * intensity, 0 * intensity);
      });

      // Animate Rust logo glow
      rustLogo.children.forEach((logoMesh) => {
        const mesh = logoMesh as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        
        // Strong pulsing for the logo
        const pulse = Math.sin(time * 1.5) * 0.3 + 0.7;
        material.opacity = pulse;
        
        // Vary intensity
        const intensity = 0.9 + Math.sin(time * 1.5) * 0.1;
        material.color.setRGB(1.0 * intensity, 0.42 * intensity, 0);
      });

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
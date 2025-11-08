import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer, RenderPass, UnrealBloomPass } from "three-stdlib";

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
      1000,
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

    window.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("scroll", onScroll, false);

    // Renderer with GPU acceleration
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
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
      metalness: 0.95,
      roughness: 0.25,
      emissive: 0x080808,
      emissiveIntensity: 0.2,
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
        const line = new THREE.Mesh(lineGeometry, lineMaterial.clone());
        line.position.set(0, 0.16, -1.2 + i * 0.35);
        lines.add(line);
      }

      // Vertical lines
      for (let i = 0; i < 8; i++) {
        const lineGeometry = new THREE.BoxGeometry(0.02, 0.02, 2.5);
        const line = new THREE.Mesh(lineGeometry, lineMaterial.clone());
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
          (point.userData as { pulseOffset: number }).pulseOffset =
            Math.random() * Math.PI * 2;
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

    // Create glowing wires extending from the chip - THESE WILL MOVE!
    const createGlowingWires = () => {
      const wires = new THREE.Group();
      const orangeColor = 0xff6b00;

      // Create wire using TubeGeometry for smooth curves
      const createWire = (controlPoints: THREE.Vector3[], thickness = 0.02) => {
        const curve = new THREE.CatmullRomCurve3(controlPoints);
        const tubeGeometry = new THREE.TubeGeometry(
          curve,
          64,
          thickness,
          8,
          false,
        );
        const wireMaterial = new THREE.MeshBasicMaterial({
          color: orangeColor,
          transparent: true,
          opacity: 0.9,
        });
        const wire = new THREE.Mesh(tubeGeometry, wireMaterial);

        // Store original positions for animation
        const positionAttribute = tubeGeometry.getAttribute("position");
        const originalPositions = new Float32Array(
          positionAttribute.array.length,
        );
        originalPositions.set(positionAttribute.array as Float32Array);

        // Store original positions and animation data
        wire.userData = {
          baseColor: orangeColor,
          pulseOffset: Math.random() * Math.PI * 2,
          originalPositions: originalPositions,
          curve: curve,
        };

        return wire;
      };

      // Corner wires - multiple wires from each corner
      const cornerWires = [
        // Top-left corner
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

      cornerWires.forEach((points) => wires.add(createWire(points, 0.025)));

      // Edge wires
      const edgeWires = [
        // Top edge
        [
          new THREE.Vector3(0, 0.2, -1.5),
          new THREE.Vector3(0.5, 1.0, -2.5),
          new THREE.Vector3(-0.5, 0.6, -3.5),
          new THREE.Vector3(0, 1.4, -4.5),
        ],
        // Bottom edge
        [
          new THREE.Vector3(0, 0.2, 1.5),
          new THREE.Vector3(-0.5, -0.6, 2.5),
          new THREE.Vector3(0.5, 0.3, 3.5),
          new THREE.Vector3(0, -1.0, 4.5),
        ],
        // Left edge
        [
          new THREE.Vector3(-1.5, 0.2, 0),
          new THREE.Vector3(-2.5, 1.0, 0.5),
          new THREE.Vector3(-3.5, 0.5, -0.5),
          new THREE.Vector3(-4.5, 1.3, 0),
        ],
        // Right edge
        [
          new THREE.Vector3(1.5, 0.2, 0),
          new THREE.Vector3(2.5, 0.3, -0.5),
          new THREE.Vector3(3.5, 0.9, 0.5),
          new THREE.Vector3(4.5, 0.5, 0),
        ],
      ];

      edgeWires.forEach((points) => wires.add(createWire(points, 0.018)));

      return wires;
    };

    const glowingWires = createGlowingWires();
    chipGroup.add(glowingWires);

    // Create NVIDIA Logo - Simple and Visible
    const createNvidiaLogo = () => {
      const logoGroup = new THREE.Group();

      // Create Nvidia eye shape using simple geometry - BIGGER AND BRIGHTER
      const eyeShape = new THREE.Shape();

      // Draw outer eye shape (ellipse) - SMALLER SIZE
      const segments = 32;
      const radiusX = 0.4; // SMALLER
      const radiusY = 0.25; // SMALLER

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        if (i === 0) {
          eyeShape.moveTo(x, y);
        } else {
          eyeShape.lineTo(x, y);
        }
      }

      // Create the geometry
      const extrudeSettings = {
        depth: 0.1, // THICKER for more visibility
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 5,
      };

      const logoGeometry = new THREE.ExtrudeGeometry(eyeShape, extrudeSettings);

      // ORANGE glowing material - MUCH BRIGHTER
      const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b00,
        metalness: 0.3,
        roughness: 0.1,
        emissive: 0xff6b00,
        emissiveIntensity: 3.5, // INCREASED from 2.0
      });

      // Create the main logo
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.rotation.x = Math.PI / 2;
      logo.position.set(0, 0.2, 0);
      logoGroup.add(logo);

      // Add MULTIPLE bright glow planes for maximum visibility
      const glowGeometry1 = new THREE.CircleGeometry(0.7, 32); // SMALLER
      const glowMaterial1 = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.8, // MORE OPAQUE
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glow1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
      glow1.position.set(0, 0.21, 0);
      glow1.rotation.x = Math.PI / 2;
      logoGroup.add(glow1);

      // Second glow layer for extra brightness
      const glowGeometry2 = new THREE.CircleGeometry(0.9, 32);
      const glowMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glow2 = new THREE.Mesh(glowGeometry2, glowMaterial2);
      glow2.position.set(0, 0.22, 0);
      glow2.rotation.x = Math.PI / 2;
      logoGroup.add(glow2);

      // Add text "NVIDIA"
      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.9,
      });

      // Create simple text geometry using shapes
      const createLetterN = () => {
        const letter = new THREE.Group();
        const box1 = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.3, 0.05),
          textMaterial.clone(),
        );
        const box2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 0.3, 0.05),
          textMaterial.clone(),
        );
        const box3 = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 0.05, 0.05),
          textMaterial.clone(),
        );
        box1.position.set(-0.1, 0.15, 0.3);
        box2.position.set(0.1, 0.15, 0.3);
        box3.position.set(0, 0.15, 0.3);
        box3.rotation.z = Math.PI / 4;
        letter.add(box1, box2, box3);
        return letter;
      };

      const letterN = createLetterN();
      logoGroup.add(letterN);

      return logoGroup;
    };

    const nvidiaLogo = createNvidiaLogo();
    chipGroup.add(nvidiaLogo);

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

    // NVIDIA logo lights - EXTREMELY bright ORANGE for maximum visibility
    const nvidiaLight1 = new THREE.PointLight(0xff6b00, 5.0, 10); // MUCH BRIGHTER
    nvidiaLight1.position.set(0, 1, 0);
    scene.add(nvidiaLight1);

    const nvidiaLight2 = new THREE.PointLight(0xff6b00, 4.0, 12); // MUCH BRIGHTER
    nvidiaLight2.position.set(0, 0.5, 0);
    scene.add(nvidiaLight2);

    // Additional spotlight for the logo
    const nvidiaSpotlight = new THREE.SpotLight(0xff6b00, 3.0);
    nvidiaSpotlight.position.set(0, 3, 0);
    nvidiaSpotlight.target.position.set(0, 0, 0);
    nvidiaSpotlight.angle = Math.PI / 6;
    scene.add(nvidiaSpotlight);
    scene.add(nvidiaSpotlight.target);

    // Post-processing with bloom
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      2.5,
      0.8,
      0.1,
    );
    composer.addPass(bloomPass);

    // Animation loop
    let time = 0;
    let frameCount = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016; // ~60fps
      frameCount++;

      // Debug logging every 120 frames (~2 seconds)
      if (frameCount % 120 === 0) {
        console.log(
          "GPU Animation running - Time:",
          time.toFixed(2),
          "Wires:",
          glowingWires.children.length,
        );
      }

      // Smooth rotation based on mouse
      targetRotation.x = Math.PI / 2 + mouse.y * 0.2;
      targetRotation.y = mouse.x * 0.2;

      chipGroup.rotation.x += (targetRotation.x - chipGroup.rotation.x) * 0.05;
      chipGroup.rotation.y += (targetRotation.y - chipGroup.rotation.y) * 0.05;

      // React to scroll
      const scrollOffset = scrollY * 0.001;
      chipGroup.rotation.z += scrollOffset * 0.0005;

      // Animate connection points (pulsing glow)
      connectionPoints.children.forEach((point) => {
        const mesh = point as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const userData = mesh.userData as { pulseOffset: number };
        const pulse = Math.sin(time * 4 + userData.pulseOffset) * 0.5 + 0.5;
        material.opacity = 0.5 + pulse * 0.5;
      });

      // Animate circuit lines with flowing data effect
      circuitLines.children.forEach((line, index) => {
        const mesh = line as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const wave = Math.sin(time * 2.5 + index * 0.4) * 0.4 + 0.6;
        material.opacity = wave;
      });

      // Animate glow lights
      glowLight1.intensity = Math.sin(time * 1.5) * 0.3 + 1;
      glowLight2.intensity = Math.cos(time * 1.5) * 0.3 + 1;

      // Animate NVIDIA logo lights - VERY strong pulsing for visibility
      nvidiaLight1.intensity = 4.0 + Math.sin(time * 2) * 1.5;
      nvidiaLight2.intensity = 3.0 + Math.cos(time * 2.3) * 1.5;

      // ANIMATE WIRES - Make them move and pulse! DRAMATIC MOVEMENT
      glowingWires.children.forEach((wire, index) => {
        const mesh = wire as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        const geometry = mesh.geometry as THREE.TubeGeometry;
        const userData = mesh.userData as {
          pulseOffset: number;
          originalPositions: Float32Array;
        };

        // Flowing current effect - very visible
        const flowSpeed = 3.0;
        const pulse =
          Math.sin(time * flowSpeed + userData.pulseOffset) * 0.5 + 0.5;
        material.opacity = 0.5 + pulse * 0.5;

        // Change color intensity - make it flash
        const intensity = 0.8 + pulse * 0.2;
        material.color.setRGB(
          1.0 * intensity,
          0.42 * intensity,
          0.0 * intensity,
        );

        // DRAMATIC PHYSICAL MOVEMENT - wires wave like cables in wind
        const swaySpeed = 1.2;
        const swayAmount = 0.5; // VERY VISIBLE MOVEMENT
        const offsetPhase = index * 0.8;

        // Multiple axis movement for snake-like motion - VERY DRAMATIC
        mesh.position.y = Math.sin(time * swaySpeed + offsetPhase) * swayAmount;
        mesh.position.x =
          Math.cos(time * swaySpeed * 0.7 + offsetPhase) * swayAmount * 0.6;
        mesh.position.z =
          Math.sin(time * swaySpeed * 0.5 + offsetPhase) * swayAmount * 0.4;

        // Strong rotation - makes wires twist and turn - MORE DRAMATIC
        mesh.rotation.x = Math.sin(time * swaySpeed * 0.8 + index * 0.4) * 0.3;
        mesh.rotation.y = Math.cos(time * swaySpeed * 0.6 + index * 0.3) * 0.25;
        mesh.rotation.z = Math.sin(time * swaySpeed * 0.4 + index * 0.5) * 0.35;

        // Vertex deformation for wave effect along the wire - FROM ORIGINAL POSITIONS
        const positionAttribute = geometry.getAttribute("position");
        if (positionAttribute && userData.originalPositions) {
          const positions = positionAttribute.array as Float32Array;
          const originalPositions = userData.originalPositions;
          const vertexCount = positions.length / 3;

          for (let i = 0; i < vertexCount; i++) {
            const i3 = i * 3;
            const wavePhase =
              (i / vertexCount) * Math.PI * 4 + time * 3 + index * 0.5;
            const waveAmount = 0.3; // MUCH MORE VISIBLE WAVE

            // Reset to original and apply wave deformation
            positions[i3] = originalPositions[i3];
            positions[i3 + 1] =
              originalPositions[i3 + 1] + Math.sin(wavePhase) * waveAmount;
            positions[i3 + 2] =
              originalPositions[i3 + 2] +
              Math.cos(wavePhase * 0.7) * waveAmount * 0.5;
          }

          positionAttribute.needsUpdate = true;
        }
      });

      // Animate NVIDIA logo - DRAMATIC pulsing glow
      nvidiaLogo.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as
          | THREE.MeshStandardMaterial
          | THREE.MeshBasicMaterial;

        const pulse = Math.sin(time * 1.8) * 0.4 + 0.8;

        if (material instanceof THREE.MeshStandardMaterial) {
          material.emissiveIntensity = 2.5 + pulse * 1.5; // MUCH BRIGHTER
        } else if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = 0.6 + pulse * 0.4;
        }
      });

      // Scale pulsing for extra dramatic effect
      nvidiaLogo.scale.setScalar(1.0 + Math.sin(time * 2) * 0.05);

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
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);

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
      const container = mountRef.current;
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default GPUChipBackground;

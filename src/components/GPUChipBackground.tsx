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

      // MANY MORE Edge wires - LOTS of orange wires!
      const edgeWires = [
        // Top edge - many wires
        [
          new THREE.Vector3(0, 0.2, -1.5),
          new THREE.Vector3(0.5, 1.0, -2.5),
          new THREE.Vector3(-0.5, 0.6, -3.5),
          new THREE.Vector3(0, 1.4, -4.5),
        ],
        [
          new THREE.Vector3(-0.7, 0.2, -1.5),
          new THREE.Vector3(-1.2, 0.8, -2.5),
          new THREE.Vector3(-1.8, 0.4, -3.5),
          new THREE.Vector3(-1.3, 1.1, -4.5),
        ],
        [
          new THREE.Vector3(0.7, 0.2, -1.5),
          new THREE.Vector3(1.2, 0.7, -2.5),
          new THREE.Vector3(1.8, 0.5, -3.5),
          new THREE.Vector3(1.3, 1.2, -4.5),
        ],
        [
          new THREE.Vector3(-0.3, 0.2, -1.5),
          new THREE.Vector3(-0.6, 1.2, -2.5),
          new THREE.Vector3(-0.2, 0.8, -3.5),
          new THREE.Vector3(-0.5, 1.5, -4.5),
        ],
        [
          new THREE.Vector3(0.3, 0.2, -1.5),
          new THREE.Vector3(0.6, 0.9, -2.5),
          new THREE.Vector3(0.2, 1.1, -3.5),
          new THREE.Vector3(0.5, 0.7, -4.5),
        ],
        // Bottom edge - many wires
        [
          new THREE.Vector3(0, 0.2, 1.5),
          new THREE.Vector3(-0.5, -0.6, 2.5),
          new THREE.Vector3(0.5, 0.3, 3.5),
          new THREE.Vector3(0, -1.0, 4.5),
        ],
        [
          new THREE.Vector3(-0.7, 0.2, 1.5),
          new THREE.Vector3(-1.2, 0.4, 2.5),
          new THREE.Vector3(-1.8, -0.3, 3.5),
          new THREE.Vector3(-1.3, 0.7, 4.5),
        ],
        [
          new THREE.Vector3(0.7, 0.2, 1.5),
          new THREE.Vector3(1.2, 0.5, 2.5),
          new THREE.Vector3(1.8, -0.2, 3.5),
          new THREE.Vector3(1.3, 0.8, 4.5),
        ],
        [
          new THREE.Vector3(-0.3, 0.2, 1.5),
          new THREE.Vector3(-0.6, 0.6, 2.5),
          new THREE.Vector3(-0.2, 0.2, 3.5),
          new THREE.Vector3(-0.5, 0.9, 4.5),
        ],
        [
          new THREE.Vector3(0.3, 0.2, 1.5),
          new THREE.Vector3(0.6, 0.3, 2.5),
          new THREE.Vector3(0.2, 0.5, 3.5),
          new THREE.Vector3(0.5, 0.1, 4.5),
        ],
        // Left edge - many wires
        [
          new THREE.Vector3(-1.5, 0.2, 0),
          new THREE.Vector3(-2.5, 1.0, 0.5),
          new THREE.Vector3(-3.5, 0.5, -0.5),
          new THREE.Vector3(-4.5, 1.3, 0),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, -0.7),
          new THREE.Vector3(-2.5, 0.6, -1.2),
          new THREE.Vector3(-3.5, 0.9, -0.8),
          new THREE.Vector3(-4.5, 0.4, -1.3),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, 0.7),
          new THREE.Vector3(-2.5, 0.4, 1.2),
          new THREE.Vector3(-3.5, 0.8, 0.8),
          new THREE.Vector3(-4.5, 0.6, 1.3),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, -0.3),
          new THREE.Vector3(-2.5, 1.2, -0.6),
          new THREE.Vector3(-3.5, 0.7, -0.2),
          new THREE.Vector3(-4.5, 1.1, -0.5),
        ],
        [
          new THREE.Vector3(-1.5, 0.2, 0.3),
          new THREE.Vector3(-2.5, 0.8, 0.6),
          new THREE.Vector3(-3.5, 0.3, 0.2),
          new THREE.Vector3(-4.5, 0.9, 0.5),
        ],
        // Right edge - many wires
        [
          new THREE.Vector3(1.5, 0.2, 0),
          new THREE.Vector3(2.5, 0.3, -0.5),
          new THREE.Vector3(3.5, 0.9, 0.5),
          new THREE.Vector3(4.5, 0.5, 0),
        ],
        [
          new THREE.Vector3(1.5, 0.2, -0.7),
          new THREE.Vector3(2.5, 0.7, -1.2),
          new THREE.Vector3(3.5, 0.4, -0.8),
          new THREE.Vector3(4.5, 0.9, -1.3),
        ],
        [
          new THREE.Vector3(1.5, 0.2, 0.7),
          new THREE.Vector3(2.5, 0.5, 1.2),
          new THREE.Vector3(3.5, 0.2, 0.8),
          new THREE.Vector3(4.5, 0.7, 1.3),
        ],
        [
          new THREE.Vector3(1.5, 0.2, -0.3),
          new THREE.Vector3(2.5, 0.9, -0.6),
          new THREE.Vector3(3.5, 0.6, -0.2),
          new THREE.Vector3(4.5, 1.1, -0.5),
        ],
        [
          new THREE.Vector3(1.5, 0.2, 0.3),
          new THREE.Vector3(2.5, 0.4, 0.6),
          new THREE.Vector3(3.5, 0.8, 0.2),
          new THREE.Vector3(4.5, 0.3, 0.5),
        ],
        // Diagonal wires for more density
        [
          new THREE.Vector3(-1.2, 0.2, -1.2),
          new THREE.Vector3(-2.0, 0.9, -2.0),
          new THREE.Vector3(-2.8, 0.5, -2.8),
          new THREE.Vector3(-3.6, 1.1, -3.6),
        ],
        [
          new THREE.Vector3(1.2, 0.2, -1.2),
          new THREE.Vector3(2.0, 0.6, -2.0),
          new THREE.Vector3(2.8, 0.9, -2.8),
          new THREE.Vector3(3.6, 0.4, -3.6),
        ],
        [
          new THREE.Vector3(-1.2, 0.2, 1.2),
          new THREE.Vector3(-2.0, 0.4, 2.0),
          new THREE.Vector3(-2.8, 0.8, 2.8),
          new THREE.Vector3(-3.6, 0.3, 3.6),
        ],
        [
          new THREE.Vector3(1.2, 0.2, 1.2),
          new THREE.Vector3(2.0, 0.7, 2.0),
          new THREE.Vector3(2.8, 0.3, 2.8),
          new THREE.Vector3(3.6, 0.8, 3.6),
        ],
        // Additional scattered wires
        [
          new THREE.Vector3(-0.8, 0.2, -1.0),
          new THREE.Vector3(-1.5, 0.8, -1.8),
          new THREE.Vector3(-2.2, 0.4, -2.5),
          new THREE.Vector3(-3.0, 1.0, -3.2),
        ],
        [
          new THREE.Vector3(0.8, 0.2, -1.0),
          new THREE.Vector3(1.5, 0.7, -1.8),
          new THREE.Vector3(2.2, 0.5, -2.5),
          new THREE.Vector3(3.0, 0.9, -3.2),
        ],
        [
          new THREE.Vector3(-0.8, 0.2, 1.0),
          new THREE.Vector3(-1.5, 0.5, 1.8),
          new THREE.Vector3(-2.2, 0.8, 2.5),
          new THREE.Vector3(-3.0, 0.4, 3.2),
        ],
        [
          new THREE.Vector3(0.8, 0.2, 1.0),
          new THREE.Vector3(1.5, 0.6, 1.8),
          new THREE.Vector3(2.2, 0.3, 2.5),
          new THREE.Vector3(3.0, 0.7, 3.2),
        ],
      ];

      edgeWires.forEach((points) => wires.add(createWire(points, 0.018)));

      return wires;
    };

    const glowingWires = createGlowingWires();
    chipGroup.add(glowingWires);

    // Create Rust Logo with Orange Glow using geometry (gear/cog shape)
    const createRustLogo = () => {
      const logoGroup = new THREE.Group();

      // Create Rust gear/cog shape
      const createGearShape = () => {
        const shape = new THREE.Shape();
        const outerRadius = 0.4;
        const innerRadius = 0.28;
        const teethCount = 8;
        const teethDepth = 0.08;
        const teethWidth = 0.15;

        // Draw outer gear with teeth
        for (let i = 0; i < teethCount; i++) {
          const angle1 = (i / teethCount) * Math.PI * 2;
          const angle2 = ((i + 0.5) / teethCount) * Math.PI * 2;

          // Tooth tip
          const tipX1 = Math.cos(angle1) * outerRadius;
          const tipY1 = Math.sin(angle1) * outerRadius;
          const tipX2 =
            Math.cos(angle1 + (teethWidth / teethCount) * Math.PI * 2) *
            outerRadius;
          const tipY2 =
            Math.sin(angle1 + (teethWidth / teethCount) * Math.PI * 2) *
            outerRadius;

          // Inner part between teeth
          const innerX = Math.cos(angle2) * (outerRadius - teethDepth);
          const innerY = Math.sin(angle2) * (outerRadius - teethDepth);

          if (i === 0) {
            shape.moveTo(tipX1, tipY1);
          }
          shape.lineTo(tipX2, tipY2);
          shape.lineTo(innerX, innerY);
        }
        shape.closePath();

        // Create center hole
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, innerRadius * 0.5, 0, Math.PI * 2, false);
        shape.holes.push(holePath);

        return shape;
      };

      const gearShape = createGearShape();
      const extrudeSettings = {
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 3,
      };

      const logoGeometry = new THREE.ExtrudeGeometry(
        gearShape,
        extrudeSettings,
      );

      // ORANGE glowing material
      const logoMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b00,
        metalness: 0.8,
        roughness: 0.3,
        emissive: 0xff6b00,
        emissiveIntensity: 2.0,
      });

      // Create the main logo - ON TOP OF HEAT SINK
      const logo = new THREE.Mesh(logoGeometry, logoMaterial);
      logo.rotation.x = Math.PI / 2;
      logo.position.set(0, 0.8, 0);
      logoGroup.add(logo);

      // Add bright orange glow planes behind it - REDUCED OPACITY
      const glowGeometry1 = new THREE.CircleGeometry(0.6, 32);
      const glowMaterial1 = new THREE.MeshBasicMaterial({
        color: 0xff6b00,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const glow1 = new THREE.Mesh(glowGeometry1, glowMaterial1);
      glow1.position.set(0, 0.79, 0); // MOVED UP to be on heat sink
      glow1.rotation.x = Math.PI / 2;
      logoGroup.add(glow1);

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

    // RUST logo lights - REDUCED intensity for better logo visibility
    const rustLight1 = new THREE.PointLight(0xff6b00, 2.5, 10);
    rustLight1.position.set(0, 1, 0);
    scene.add(rustLight1);

    const rustLight2 = new THREE.PointLight(0xff6b00, 2.0, 12);
    rustLight2.position.set(0, 0.5, 0);
    scene.add(rustLight2);

    // Additional spotlight for the logo
    const rustSpotlight = new THREE.SpotLight(0xff6b00, 1.5);
    rustSpotlight.position.set(0, 3, 0);
    rustSpotlight.target.position.set(0, 0, 0);
    rustSpotlight.angle = Math.PI / 6;
    scene.add(rustSpotlight);
    scene.add(rustSpotlight.target);

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

      // Animate RUST logo lights - REDUCED pulsing for better logo visibility
      rustLight1.intensity = 2.0 + Math.sin(time * 2) * 0.5;
      rustLight2.intensity = 1.5 + Math.cos(time * 2.3) * 0.5;

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

      // Animate RUST logo - CONSTANT glow (no pulsing)
      rustLogo.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as
          | THREE.MeshStandardMaterial
          | THREE.MeshBasicMaterial;

        // Keep constant emissive intensity - no pulsing
        if (material instanceof THREE.MeshStandardMaterial) {
          material.emissiveIntensity = 2.0; // Fixed intensity
        } else if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = 0.3; // Fixed opacity
        }
      });

      // Scale pulsing for extra dramatic effect
      rustLogo.scale.setScalar(1.0 + Math.sin(time * 2) * 0.08);

      // Rotate the logo slightly for dynamic effect
      rustLogo.rotation.z = Math.sin(time * 0.5) * 0.02;

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

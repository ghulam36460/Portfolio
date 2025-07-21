import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const AdvancedHeroBackground = () => {
  const canvasRef = useRef();
  const particleCanvasRef = useRef();
  const neuralNetworkRef = useRef();
  const audioVisualizerRef = useRef();
  const dynamicLightingRef = useRef();

  const [isLoaded, setIsLoaded] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    initAdvancedBackground();
    return () => cleanup();
  }, []);

  const initAdvancedBackground = async () => {
    try {
      // Initialize all components
      await Promise.all([
        initWebGLSphere(),
        initParticleSystem(),
        initNeuralNetwork(),
        initDynamicLighting(),
        initAudioVisualizer(),
      ]);

      setIsLoaded(true);
    } catch (error) {
      console.warn("Advanced background initialization failed:", error);
    }
  };

  const initWebGLSphere = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Custom vertex shader for displacement
    const vertexShader = `
      uniform float time;
      uniform vec2 mouse;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      // Simplex 3D Noise 
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1. + 3.0 * C.xxx;

        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }

      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        float mouseInfluence = length(mouse) * 0.5;
        
        // Multi-layered noise for organic movement
        float noise1 = snoise(vec3(pos * 1.0 + time * 0.2));
        float noise2 = snoise(vec3(pos * 2.0 + time * 0.1));
        float noise3 = snoise(vec3(pos * 4.0 + time * 0.05));
        
        float displacement = (noise1 * 0.3 + noise2 * 0.15 + noise3 * 0.05) * (1.0 + mouseInfluence);
        
        pos += normal * displacement * 0.15;
        vPosition = pos;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Custom fragment shader for advanced materials
    const fragmentShader = `
      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;
      uniform vec2 mouse;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vec3 normal = normalize(vNormal);
        
        // Dynamic color mixing based on position and time
        float mixFactor1 = sin(vPosition.x * 2.0 + time) * 0.5 + 0.5;
        float mixFactor2 = cos(vPosition.y * 2.0 + time * 0.7) * 0.5 + 0.5;
        float mixFactor3 = sin(vPosition.z * 2.0 + time * 0.3) * 0.5 + 0.5;
        
        vec3 color = mix(
          mix(color1, color2, mixFactor1),
          color3,
          mixFactor2 * mixFactor3
        );
        
        // Fresnel effect for rim lighting
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(normal, viewDirection), 2.0);
        
        // Mouse interaction glow
        float mouseDistance = length(mouse - vUv);
        float mouseGlow = 1.0 / (1.0 + mouseDistance * 10.0);
        
        color += fresnel * 0.3 + mouseGlow * 0.2;
        
        gl_FragColor = vec4(color, 0.8);
      }
    `;

    // Create sphere geometry with high detail
    const geometry = new THREE.SphereGeometry(1, 128, 128);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0, 0) },
        color1: { value: new THREE.Color(0x4a90e2) },
        color2: { value: new THREE.Color(0x8e44ad) },
        color3: { value: new THREE.Color(0x50c878) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Position camera
    camera.position.z = 3;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const handleMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      material.uniforms.mouse.value.set(mouse.x, mouse.y);

      // Update dynamic lighting
      if (dynamicLightingRef.current) {
        dynamicLightingRef.current.style.setProperty(
          "--mouse-x",
          `${(event.clientX / window.innerWidth) * 100}%`,
        );
        dynamicLightingRef.current.style.setProperty(
          "--mouse-y",
          `${(event.clientY / window.innerHeight) * 100}%`,
        );
        dynamicLightingRef.current.classList.add("active");
      }
    };

    const handleMouseLeave = () => {
      if (dynamicLightingRef.current) {
        dynamicLightingRef.current.classList.remove("active");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      material.uniforms.time.value += 0.01;
      sphere.rotation.x += 0.001;
      sphere.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  };

  const initParticleSystem = () => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 150;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        connections: [],
      });
    }

    const drawConnections = (p1, p2, distance) => {
      const opacity = Math.max(0, 1 - distance / 150);
      ctx.strokeStyle = `rgba(74, 144, 226, ${opacity * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off walls
        if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Check connections with other particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const distance = Math.sqrt(
            Math.pow(particle.x - other.x, 2) +
              Math.pow(particle.y - other.y, 2),
          );

          if (distance < 150) {
            drawConnections(particle, other, distance);
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  };

  const initNeuralNetwork = () => {
    const canvas = neuralNetworkRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodes = [];
    const connections = [];
    const nodeCount = 30;

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 4,
        pulse: Math.random() * Math.PI * 2,
        connections: [],
      });
    }

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const distance = Math.sqrt(
          Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2),
        );

        if (distance < 200 && Math.random() < 0.3) {
          connections.push({
            from: node,
            to: other,
            activity: 0,
            direction: Math.random() > 0.5 ? 1 : -1,
          });
        }
      }
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw connections
      connections.forEach((connection) => {
        connection.activity += 0.02 * connection.direction;
        if (connection.activity > 1 || connection.activity < 0) {
          connection.direction *= -1;
        }

        const gradient = ctx.createLinearGradient(
          connection.from.x,
          connection.from.y,
          connection.to.x,
          connection.to.y,
        );

        gradient.addColorStop(
          0,
          `rgba(142, 68, 173, ${0.1 + connection.activity * 0.3})`,
        );
        gradient.addColorStop(
          1,
          `rgba(74, 144, 226, ${0.1 + connection.activity * 0.3})`,
        );

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + connection.activity;
        ctx.beginPath();
        ctx.moveTo(connection.from.x, connection.from.y);
        ctx.lineTo(connection.to.x, connection.to.y);
        ctx.stroke();
      });

      // Update and draw nodes
      nodes.forEach((node) => {
        node.pulse += 0.05;
        const pulseSize = node.size + Math.sin(node.pulse) * 2;

        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          pulseSize,
        );

        gradient.addColorStop(0, "rgba(80, 200, 120, 0.8)");
        gradient.addColorStop(1, "rgba(80, 200, 120, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  const initDynamicLighting = () => {
    // Dynamic lighting is handled via CSS custom properties
    // Updated in the mouse move handler of the WebGL sphere
  };

  const initAudioVisualizer = () => {
    const container = audioVisualizerRef.current;
    if (!container) return;

    // Create visualizer bars
    const barCount = 32;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement("div");
      bar.className = "visualizer-bar";
      bar.style.height = "4px";
      container.appendChild(bar);
    }

    // Simulate audio data (replace with real audio analysis)
    const simulateAudio = () => {
      const bars = container.children;
      for (let i = 0; i < bars.length; i++) {
        const intensity = Math.random() * 50 + 5;
        bars[i].style.height = `${intensity}px`;
      }
      requestAnimationFrame(simulateAudio);
    };

    simulateAudio();
  };

  const cleanup = () => {
    // Cleanup function for all components
  };

  return (
    <>
      <div className="hero-canvas-container">
        <canvas
          ref={canvasRef}
          className={`hero-canvas ${isLoaded ? "loaded" : ""}`}
        />
      </div>

      <canvas ref={particleCanvasRef} className="particle-canvas" />

      <canvas ref={neuralNetworkRef} className="neural-network" />

      <div ref={dynamicLightingRef} className="dynamic-lighting" />

      <div ref={audioVisualizerRef} className="audio-visualizer" />
    </>
  );
};

export default AdvancedHeroBackground;

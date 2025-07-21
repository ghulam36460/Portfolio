import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Environment,
  OrbitControls,
  MeshWobbleMaterial,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

// Individual 3D Skill Card Component
function SkillCard3D({ position, skill, index, isVisible }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Smooth animations using useFrame
  useFrame((state) => {
    if (!meshRef.current || !isVisible) return;

    const time = state.clock.getElapsedTime();

    // Floating animation (replacing CSS skillFloat)
    meshRef.current.position.y =
      position[1] + Math.sin(time * 0.8 + index * 0.5) * 0.2;

    // Gentle rotation (replacing CSS skillRotate)
    meshRef.current.rotation.y = Math.sin(time * 0.3 + index) * 0.1;

    // Interactive hover scaling (replacing CSS hover transforms)
    if (hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
    } else {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Color scheme for different skills
  const getSkillColor = (skillName) => {
    const colors = {
      React: "#61DAFB",
      JavaScript: "#F7DF1E",
      TypeScript: "#3178C6",
      "Next.js": "#000000",
      "Node.js": "#339933",
      Tailwind: "#06B6D4",
      Git: "#F05032",
      HTML5: "#E34F26",
      Bootstrap: "#7952B3",
      GraphQL: "#E10098",
      GSAP: "#88CE02",
      WordPress: "#21759B",
    };
    return colors[skillName] || "#4A90E2";
  };

  return (
    <Float
      speed={1.2}
      rotationIntensity={0.2}
      floatIntensity={0.3}
      position={position}
    >
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        scale={isVisible ? 1 : 0.1}
      >
        {/* Main 3D card geometry */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.5, 0.2]} />
          <MeshWobbleMaterial
            color={getSkillColor(skill.title)}
            factor={hovered ? 0.4 : 0.1}
            speed={1.5}
            roughness={0.3}
            metalness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Glowing border effect */}
        {hovered && (
          <mesh>
            <boxGeometry args={[1.6, 1.6, 0.15]} />
            <meshBasicMaterial
              color={getSkillColor(skill.title)}
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Simple text label using HTML overlay instead of 3D text */}
        <Html
          position={[0, 0, 0.2]}
          center
          distanceFactor={8}
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "12px",
            textAlign: "center",
            background: "rgba(0,0,0,0.7)",
            padding: "2px 6px",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {skill.title}
        </Html>
      </group>
    </Float>
  );
}

// Particle Background System
function ParticleBackground() {
  const pointsRef = useRef();
  const particleCount = 200;

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
    }
  });

  // Generate particle positions
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4A90E2"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Loading Component
function LoadingSpinner() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "var(--sub)",
        fontSize: "var(--text-small)",
        textAlign: "center",
      }}
    >
      <div>Loading 3D Skills...</div>
      <div
        style={{
          width: "30px",
          height: "30px",
          border: "3px solid var(--border)",
          borderTop: "3px solid var(--important)",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "10px auto",
        }}
      ></div>
    </div>
  );
}

// Main Enhanced Skills Component
const SkillsEnhanced = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const containerRef = useRef();

  // Skills data
  const skills = [
    { title: "React", category: "Frontend" },
    { title: "JavaScript", category: "Language" },
    { title: "TypeScript", category: "Language" },
    { title: "Next.js", category: "Framework" },
    { title: "Node.js", category: "Backend" },
    { title: "Tailwind", category: "CSS" },
    { title: "Git", category: "Tools" },
    { title: "HTML5", category: "Markup" },
    { title: "Bootstrap", category: "CSS" },
    { title: "GraphQL", category: "API" },
    { title: "GSAP", category: "Animation" },
    { title: "WordPress", category: "CMS" },
  ];

  // Arrange skills in a circle
  const arrangeInCircle = (items, radius = 4) => {
    return items.map((_, index) => {
      const angle = (index / items.length) * Math.PI * 2;
      return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 2, // Random Y variation
        Math.sin(angle) * radius,
      ];
    });
  };

  const skillPositions = arrangeInCircle(skills);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // WebGL capability check
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn(
        "WebGL not supported, falling back to original skills component",
      );
      setFallbackMode(true);
    }

    return () => observer.disconnect();
  }, []);

  // Fallback to original component if WebGL not supported
  if (fallbackMode) {
    const OriginalSkills = React.lazy(() => import("./Skills"));
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OriginalSkills />
      </Suspense>
    );
  }

  return (
    <section className="skills skills-3d" ref={containerRef}>
      <div className="container">
        <h2 className="h2" id="skills">
          My Skills - WebGL Enhanced
        </h2>
        <p
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--body)",
            fontSize: "var(--text-small)",
          }}
        >
          Interactive 3D skills showcase powered by WebGL. Hover and click to
          explore!
        </p>

        <div style={{ height: "60vh", width: "100%", position: "relative" }}>
          <Suspense fallback={<LoadingSpinner />}>
            <Canvas
              shadows
              camera={{ position: [0, 3, 8], fov: 75 }}
              style={{ background: "transparent" }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
              }}
              onError={() => setFallbackMode(true)}
            >
              {/* Lighting */}
              <ambientLight intensity={0.4} />
              <pointLight position={[5, 5, 5]} intensity={0.8} castShadow />
              <directionalLight
                position={[-5, 10, 5]}
                intensity={0.6}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />

              {/* Environment */}
              <Environment preset="city" />
              <fog attach="fog" args={["#1a1a2e", 15, 30]} />

              {/* Particle Background */}
              <ParticleBackground />

              {/* 3D Skills */}
              {skills.map((skill, index) => (
                <SkillCard3D
                  key={skill.title}
                  skill={skill}
                  position={skillPositions[index]}
                  index={index}
                  isVisible={isVisible}
                />
              ))}

              {/* Camera Controls */}
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={5}
                maxDistance={15}
                autoRotate={true}
                autoRotateSpeed={0.5}
                dampingFactor={0.05}
                enableDamping={true}
              />
            </Canvas>
          </Suspense>
        </div>

        {/* Instructions */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontSize: "0.85rem",
            color: "var(--sub)",
            opacity: 0.8,
          }}
        >
          <p>
            🖱️ Drag to rotate • 🔍 Scroll to zoom • ✨ Hover skills for effects
          </p>
        </div>
      </div>
    </section>
  );
};

export default SkillsEnhanced;

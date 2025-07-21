import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Animated Particle Field (replacing CSS particle effects)
function AnimatedParticles({ count = 800 }) {
  const pointsRef = useRef();

  // Generate particles in a more organized pattern
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Create layers of particles
      const layer = Math.floor(i / (count / 3));
      const radius = 5 + layer * 10;
      const angle = ((i % (count / 3)) / (count / 3)) * Math.PI * 2;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] =
        Math.sin(angle) * radius + (Math.random() - 0.5) * 5;

      // Color gradient based on position
      const hue = (angle / (Math.PI * 2)) * 0.3 + 0.5;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame(({ clock, mouse }) => {
    if (!pointsRef.current) return;

    const time = clock.getElapsedTime();

    // Gentle rotation animation
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;

    // Mouse interaction (subtle)
    pointsRef.current.rotation.y += mouse.x * 0.0005;
    pointsRef.current.rotation.x += mouse.y * 0.0005;
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        size={0.8}
        sizeAttenuation={true}
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Floating Geometric Shapes (replacing CSS background elements)
function FloatingGeometry() {
  const groupRef = useRef();

  const shapes = [
    { type: "sphere", position: [-8, 2, -10], scale: 0.8, color: "#4A90E2" },
    { type: "box", position: [6, -3, -15], scale: 1, color: "#50C878" },
    {
      type: "octahedron",
      position: [-4, -6, -8],
      scale: 1.2,
      color: "#FF6B6B",
    },
    { type: "torus", position: [8, 4, -12], scale: 0.9, color: "#8E44AD" },
  ];

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();

    // Group rotation
    groupRef.current.rotation.y = time * 0.02;

    // Individual shape animations
    groupRef.current.children.forEach((shape, index) => {
      shape.rotation.x = time * (0.3 + index * 0.1);
      shape.rotation.z = time * (0.2 + index * 0.05);
      shape.position.y += Math.sin(time * 0.5 + index) * 0.01;

      // Mouse parallax
      shape.position.x += mouse.x * (index + 1) * 0.5;
      shape.position.y += mouse.y * (index + 1) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <mesh key={index} position={shape.position} scale={shape.scale}>
          {shape.type === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
          {shape.type === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
          {shape.type === "octahedron" && <octahedronGeometry args={[1.2]} />}
          {shape.type === "torus" && <torusGeometry args={[1, 0.4, 16, 100]} />}
          <meshLambertMaterial
            color={shape.color}
            transparent
            opacity={0.3}
            wireframe={index % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main Header Background Component
const HeaderBackground = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
      className="header-webgl-bg"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: "transparent" }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Subtle lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Animated elements */}
        <AnimatedParticles count={600} />
        <FloatingGeometry />

        {/* Atmospheric fog */}
        <fog attach="fog" args={["#0a0a0f", 20, 50]} />
      </Canvas>
    </div>
  );
};

export default HeaderBackground;

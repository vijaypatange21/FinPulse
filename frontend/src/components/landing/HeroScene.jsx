import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';

function CreditCoreMesh() {
  const meshRef = useRef();
  const innerRef = useRef();
  const outerWireRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.25;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.3;
      innerRef.current.rotation.z += delta * 0.15;
    }
    if (outerWireRef.current) {
      outerWireRef.current.rotation.x -= delta * 0.1;
      outerWireRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={outerWireRef} scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#C9FF4D"
          wireframe
          transparent
          opacity={0.35}
          emissive="#C9FF4D"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Floating Inner Organic Distorted Core */}
      <mesh ref={innerRef} scale={1.15}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#15181F"
          emissive="#242B38"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.9}
          distort={0.4}
          speed={2}
        />
      </mesh>

      {/* Orbiting Satellite Data Spheres */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 2.4;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * 0.8,
              Math.sin(angle) * radius * 0.6
            ]}
          >
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color="#C9FF4D"
              emissive="#C9FF4D"
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function FallbackFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-2 border-[var(--accent)]/30 bg-gradient-to-tr from-[#15181F] to-[#1C2029] animate-pulse shadow-2xl shadow-[var(--accent-glow)] flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border border-[var(--accent)]/50 animate-ping opacity-25" />
      </div>
    </div>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-[400px] md:h-[500px] lg:h-[560px] relative pointer-events-none select-none">
      <Suspense fallback={<FallbackFallback />}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
          <pointLight position={[-10, -10, -5]} color="#C9FF4D" intensity={2} />
          
          <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
            <CreditCoreMesh />
          </Float>
        </Canvas>
      </Suspense>
    </div>
  );
}

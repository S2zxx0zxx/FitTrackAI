import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ProgressModel({ progress, goals }) {
  const mesh = useRef();
  
  // Calculate completion percentage
  const completion = Math.min((progress / goals) * 100, 100);
  
  // Dynamic color based on completion
  const color = new THREE.Color().setHSL(completion / 360, 0.8, 0.5);

  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[1, 0.3, 16, 100]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function ThreeDProgress({ progressData }) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <ProgressModel
          progress={progressData.current}
          goals={progressData.target}
        />
        <OrbitControls enableZoom={false} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
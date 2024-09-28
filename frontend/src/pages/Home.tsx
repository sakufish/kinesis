import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three'; 

const Box: React.FC = () => {
  return (
    <mesh rotation={[0.5, 0.5, 0]} scale={2}>
      {}
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  );
};

const Home: React.FC = () => {
  return (
    <Canvas className=''>
      <Suspense fallback={null}>
        {}
        <ambientLight intensity={0.5} />
        {}
        <directionalLight position={[2, 2, 2]} intensity={1} />
        {}
        <Box />
        {}
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default Home;

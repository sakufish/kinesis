import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three'; // Make sure to import Mesh from Three.js

const Box: React.FC = () => {
  return (
    <mesh rotation={[0.5, 0.5, 0]} scale={2}>
      {/* Use BoxGeometry instead of BoxBufferGeometry */}
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color="orange" />
    </mesh>
  );
};

const Home: React.FC = () => {
  return (
    <Canvas className='min-w-screen'>
      <Suspense fallback={null}>
        {/* Add ambient lighting */}
        <ambientLight intensity={0.5} />
        {/* Add a directional light */}
        <directionalLight position={[2, 2, 2]} intensity={1} />
        {/* Add a rotating box */}
        <Box />
        {/* OrbitControls allow for camera rotation with mouse */}
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default Home;

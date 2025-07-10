'use client'
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react'
import PointsGeometry from './PointsGeometry';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

const NewScene = () => {
  return (
    <Canvas camera={{position: [0,-2.7,14], fov: 75}}>
        <ambientLight intensity={0.5} color={'white'} />
        <color attach={"background"} args={['#000']} />
        <PointsGeometry />
        <EffectComposer>
          <Bloom
            intensity={50}
            luminanceThreshold={0}
            luminanceSmoothing={0.1}
            mipmapblur
          />
        </EffectComposer>
        <OrbitControls />
    </Canvas>
  )
}

export default NewScene;

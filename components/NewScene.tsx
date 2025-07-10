'use client'
import { Html, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react'
import PointsGeometry from './PointsGeometry';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useStore } from './lib/useStore';
import CircleParticles from './CircleParticles';

const NewScene = () => {
  const whichComponent = useStore(state => state.whichComponent);


  return (
    <Canvas camera={{position: [0,-2.7,14], fov: 75}}>
        <ambientLight intensity={0.5} color={'white'} />
        <color attach={"background"} args={['#000']} />
        {(whichComponent === 'component 1' || whichComponent === '') && (
          <>
          <PointsGeometry />
          <EffectComposer>
          <Bloom
            intensity={50}
            luminanceThreshold={0}
            luminanceSmoothing={0.1}
            mipmapblur
          />
          </EffectComposer> 
          </>
        )}
        {whichComponent === 'component 2' && (
          <>
          <CircleParticles />
            <EffectComposer>
              <Bloom
                intensity={3}
                luminanceThreshold={0}
                luminanceSmoothing={0.1}
                mipmapblur
              />
          </EffectComposer> 
          </>
        )}
        
        <OrbitControls />
    </Canvas>
  )
}

export default NewScene;

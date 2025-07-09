'use client'
import dynamic from 'next/dynamic'
import React from 'react'
import { OrbitControls, useFBO } from "@react-three/drei";
import { Canvas, useFrame, extend, createPortal } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import SimulationMaterial from './SimulationMaterial';

extend({ SimulationMaterial: SimulationMaterial });

const FBOParticles = () => {
  const size = 128;

  const points = useRef<THREE.Points>(null);
  const simulationMaterialRef = useRef(null);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1);
  const positions = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]);
  const uvs = new Float32Array([
    0, 0,  // bottom-left
    1, 0,  // bottom-right
    1, 1,  // top-right
    0, 0,  // bottom-left
    1, 1,  // top-right
    0, 1   // top-left
  ]);

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const vertexShader = `uniform sampler2D uPositions;
    uniform float uTime;

    void main() {
      vec3 pos = texture2D(uPositions, position.xy).xyz;

      vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;

      gl_PointSize = 3.0;
      // Size attenuation;
      gl_PointSize *= step(1.0 - (1.0/64.0), position.x) + 0.5;
    }
    `;

  const fragmentShader = `void main() {
  vec3 color = vec3(0.34, 0.53, 0.96);
  gl_FragColor = vec4(color, 1.0);
}
`

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size ;
      particles[i3 + 1] = i / size / size ;
    }
    return particles;
  }, [size]);

  const uniforms = useMemo(() => ({
    uPositions: {
      value: null,
    }
  }), [])

  useFrame((state) => {
    const { gl, clock } = state;

    gl.setRenderTarget(renderTarget);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);


    if(points.current) {
    points.current.material.uniforms.uPositions.value = renderTarget.texture;
    }

    if(simulationMaterialRef.current) {
    simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulationMaterialRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-uv"
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene
      )}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    </>
  );
};

const Scene = () => {
  return (
    <Canvas camera={{ position: [1.5, 1.5, 2.5] }}>
      <ambientLight intensity={0.5} />
      <FBOParticles />
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
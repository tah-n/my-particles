'use client'
import { PointMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three';

type ParticleData = {
    angle: number;
    radius: number;
}

const count = 1000;
const rInner = 5;
const rOuter = 6.4;

const CircleParticles = () => {
    const points = useRef(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null);
    const baseData = useRef<ParticleData[]>([]);

    const ringPoints = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const data: ParticleData[] = [];

        for(let i = 0;i < count;i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random() * (rOuter * rOuter - rInner * rInner) + rInner * rInner);

            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);

            positions.set([x,y,0], i*3);
             data.push({ angle: theta, radius: r });

        }

        baseData.current = data;
        return positions;
    },[count]);

    useFrame(() => {
        if(geometryRef.current) {
            const positions = geometryRef.current.attributes.position.array as Float32Array;
        
        for(let i = 0;i < count; i++) {
            const particle = baseData.current[i];

            //change the angle(rotation)
            particle.angle += 0.005 + Math.random() * 0.005;

            //change the radius but stay in the limits
            particle.radius += (Math.random() - 0.7) * 0.2;
            particle.radius = Math.min(Math.max(particle.radius, rInner), rOuter); 

            //calculate the coordination
            const x = particle.radius * Math.sin(particle.angle);
            const y = particle.radius * Math.cos(particle.angle);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;

        }

            geometryRef.current.attributes.position.needsUpdate = true;
        }
    })



  return (
    <points ref={points}>
        <bufferGeometry ref={geometryRef}>
            <bufferAttribute
                attach="attributes-position"
                args={[ringPoints, 3]}   
            />
        </bufferGeometry>
        <PointMaterial 
            color="#ffffff" 
            size={0.05} 
            sizeAttenuation
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            />
    </points>
  )
}

export default CircleParticles

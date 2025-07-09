'use client'
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three';

const count = 2000;
const radius = 15;

const PointsGeometry = () => {
    const points = useRef<THREE.Points>(null);
    const geometryRef = useRef<THREE.BufferGeometry>(null) 
    const startPositions = useRef<[number, number][]>(Array.from({ length: count }, () => [0,0]));

    const particlesPosition = useMemo(() => {
      const positions = new Float32Array(count * 3);
      const velocity = new Float32Array(count * 3);
      let i = 0;
      const spaceBetween = radius + 2; // کمی فاصله بین دایره‌ها

      while (i < count) {
        // تولید نقطه در ناحیه مستطیلی بین دو دایره
        const x = (Math.random() * 2 - 1) * spaceBetween * 1.2;
        const y = (Math.random() * 2 - 1) * radius;

        // فاصله از مرکز دایره چپ
        const dLeft = Math.hypot(x + spaceBetween, y);
        // فاصله از مرکز دایره راست
        const dRight = Math.hypot(x - spaceBetween, y);

        // فقط اگر داخل هیچ‌کدام از دایره‌ها نبود، قبول کن
        if (dLeft > radius && dRight > radius) {
          positions.set([x, y, 0], i * 3);
          startPositions.current[i] = [x, y]; // نگهداری برای مسیر Bézier
          velocity[i] = 0.001 + Math.random() * 0.08; // سرعت تصادفی
          i++;
        }
      }

      return {positions,velocity};
}, [count]);


useFrame((state, delta) => {
  const positions = particlesPosition.positions;
  const velocity = particlesPosition.velocity;


  for (let i = 0; i < count; i++) {
    let x = positions[i * 3 + 0];
    let y = positions[i * 3 + 1];

    y -= velocity[i]; // حرکت به پایین

    // اگر از پایین خارج شد، ببرش بالا و نقطه جدید پیدا کن داخل ناحیه نارنجی
    const spaceBetween = radius + 2;
    const dLeft = Math.hypot(x + spaceBetween, y);
    const dRight = Math.hypot(x - spaceBetween, y);
    const bottomLimit = -radius + 0.005;

    if (y < bottomLimit || dLeft < radius || dRight < radius) {
      let newY, tries = 0;
      do {
        newY = radius * (Math.random() * 2 - 1); // y تصادفی جدید
        tries++;
      } while (
        (Math.hypot(x + spaceBetween, newY) < radius ||
          Math.hypot(x - spaceBetween, newY) < radius) &&
        tries < 10
      );
      y = newY;
    }

    positions[i * 3 + 1] = y;
  }

  if(geometryRef.current) {
    geometryRef.current.attributes.position.needsUpdate = true;
  }

});

  
  return (
    <points ref={points}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#5786F5" 
        size={0.025} 
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}  
      />
    </points>
  )
}

export default PointsGeometry

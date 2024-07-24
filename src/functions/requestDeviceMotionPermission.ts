import { Vector } from './Vector';

interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const requestPermission = (DeviceMotionEvent as unknown as DeviceMotionEventiOS)
  .requestPermission;

const iOS = typeof requestPermission === 'function';

const handleMotion = (data: DeviceMotionEventiOS): { x: number; y: number } => {
  const { accelerationIncludingGravity } = data;

  return {
    x: accelerationIncludingGravity?.x || 0,
    y: accelerationIncludingGravity?.y || 0,
  };
};

export const requestDeviceMotionPermission = async (vector: Vector) => {
  if (iOS) {
    const response = await requestPermission();
    if (response === 'granted') {
      window.addEventListener('devicemotion', (event) => {
        const motion = handleMotion(event);
        vector.updateVelocity(motion.x, motion.y);
      });
    }
  }
  window.addEventListener('devicemotion', (event) => {
    const motion = handleMotion(event);
    vector.updateVelocity(motion.x, motion.y);
  });
};

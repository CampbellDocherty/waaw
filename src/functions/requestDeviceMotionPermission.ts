import { Vector } from './Vector';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

const requestPermission = (
  DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
).requestPermission;

const iOS = typeof requestPermission === 'function';

const handleMotion = (
  data: DeviceOrientationEventiOS
): { x: number; y: number } => {
  const leftToRightDegrees = data.beta;
  const frontToBackDegrees = data.gamma;

  return {
    x: leftToRightDegrees || 0,
    y: frontToBackDegrees || 0,
  };
};

export const requestDeviceMotionPermission = async (vector: Vector) => {
  if (iOS) {
    const response = await requestPermission();
    if (response === 'granted') {
      window.addEventListener('deviceorientation', (event) => {
        const motion = handleMotion(event);
        vector.updateVelocity(motion.x, motion.y);
      });
    }
  }
  window.addEventListener('deviceorientation', (event) => {
    const motion = handleMotion(event);
    vector.updateVelocity(motion.x, motion.y);
  });
};

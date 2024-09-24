import { Star } from './Star';

export interface DeviceMotionEventiOS extends DeviceMotionEvent {
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

export const requestDeviceMotionPermission = async (star: Star) => {
  if (iOS) {
    const response = await requestPermission();
    if (response === 'granted') {
      window.addEventListener('devicemotion', (event) => {
        const motion = handleMotion(event);
        star.updateVelocity(motion.x * 2, -motion.y * 4);
      });
    }
    return false;
  }
  const isProbablyWeb = requestPermission === undefined;

  console.log(isProbablyWeb, requestPermission);
  if (isProbablyWeb) {
    return isProbablyWeb;
  }

  window.addEventListener('devicemotion', (event) => {
    const motion = handleMotion(event);
    star.updateVelocity(motion.x * 2, motion.y * 4);
  });
  return false;
};

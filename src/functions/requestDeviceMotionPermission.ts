import { Star } from './Star';

export interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>;
}

export type DeviceMotionPermissionResult =
  | 'granted'
  | 'denied'
  | 'not-required';

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

export const requestDeviceMotionPermission = async (
  star: Star
): Promise<DeviceMotionPermissionResult> => {
  if (iOS) {
    const response = await requestPermission().catch(() => 'denied' as const);
    if (response === 'granted') {
      window.addEventListener('devicemotion', (event) => {
        const motion = handleMotion(event);
        star.updateVelocity(motion.x * 8, -motion.y * 12);
      });
      return 'granted';
    }
    return 'denied';
  }
  const isProbablyWeb = requestPermission === undefined;

  if (isProbablyWeb) {
    return 'not-required';
  }

  window.addEventListener('devicemotion', (event) => {
    const motion = handleMotion(event);
    star.updateVelocity(motion.x * 8, motion.y * 12);
  });
  return 'granted';
};

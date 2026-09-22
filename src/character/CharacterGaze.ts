import { GazeDirection, GazeTarget } from './types';

export interface GazeResult {
  pupilOffset: { x: number; y: number };
  headTilt: number;
  headRotate: number;
}

export function calculateGaze(
  target: GazeTarget | undefined,
  characterRect?: DOMRect | { x: number; y: number }
): GazeResult {
  if (!target || target === 'center' || target === 'student') {
    return {
      pupilOffset: { x: 0, y: 0 },
      headTilt: 0,
      headRotate: 0,
    };
  }

  if (typeof target === 'string') {
    const dirMap: Record<GazeDirection, GazeResult> = {
      center: { pupilOffset: { x: 0, y: 0 }, headTilt: 0, headRotate: 0 },
      student: { pupilOffset: { x: 0, y: 0 }, headTilt: 0, headRotate: 0 },
      left: { pupilOffset: { x: -6, y: 0 }, headTilt: 2, headRotate: -8 },
      right: { pupilOffset: { x: 6, y: 0 }, headTilt: -2, headRotate: 8 },
      up: { pupilOffset: { x: 0, y: -6 }, headTilt: -5, headRotate: 0 },
      down: { pupilOffset: { x: 0, y: 6 }, headTilt: 5, headRotate: 0 },
      'upper-left': { pupilOffset: { x: -5, y: -5 }, headTilt: -4, headRotate: -6 },
      'upper-right': { pupilOffset: { x: 5, y: -5 }, headTilt: -4, headRotate: 6 },
      'lower-left': { pupilOffset: { x: -5, y: 5 }, headTilt: 4, headRotate: -6 },
      'lower-right': { pupilOffset: { x: 5, y: 5 }, headTilt: 4, headRotate: 6 },
    };

    return dirMap[target] || dirMap.center;
  }

  // Coordinate or Element based gaze target
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;

  if (typeof target === 'object' && 'targetElement' in target) {
    const el = typeof target.targetElement === 'string' ? document.getElementById(target.targetElement) : target.targetElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }
  } else if (typeof target === 'object' && 'x' in target && 'y' in target) {
    targetX = target.x;
    targetY = target.y;
  }

  const charX = characterRect ? ('x' in characterRect ? characterRect.x : (characterRect as DOMRect).left + (characterRect as DOMRect).width / 2) : window.innerWidth / 2;
  const charY = characterRect ? ('y' in characterRect ? characterRect.y : (characterRect as DOMRect).top + 100) : window.innerHeight / 2;

  const dx = targetX - charX;
  const dy = targetY - charY;
  const distance = Math.hypot(dx, dy) || 1;

  // Max offsets
  const maxPupil = 7;
  const maxTilt = 8;
  const maxRotate = 12;

  const normX = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.5)));
  const normY = Math.max(-1, Math.min(1, dy / (window.innerHeight * 0.5)));

  return {
    pupilOffset: {
      x: normX * maxPupil,
      y: normY * maxPupil,
    },
    headTilt: normY * maxTilt,
    headRotate: normX * maxRotate,
  };
}

import { PointTarget } from './types';

export interface PointingResult {
  rightUpperArm: number;
  rightForearm: number;
  leftUpperArm: number;
  leftForearm: number;
  headRotate: number;
  headTilt: number;
  useLeftArm: boolean;
}

export function resolvePointTargetCoords(target: PointTarget | undefined): { x: number; y: number } | null {
  if (!target) return null;

  if ('x' in target && 'y' in target) {
    return { x: target.x, y: target.y };
  }

  if ('targetElement' in target) {
    const elem = typeof target.targetElement === 'string'
      ? document.getElementById(target.targetElement) || document.querySelector(target.targetElement)
      : target.targetElement;

    if (elem) {
      const rect = elem.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
  }

  if ('target' in target) {
    const namedMap: Record<string, { x: number; y: number }> = {
      board: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 },
      input: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.9 },
      sidebar: { x: window.innerWidth * 0.15, y: window.innerHeight * 0.5 },
      student: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 },
      message1: { x: window.innerWidth * 0.45, y: window.innerHeight * 0.3 },
      header: { x: window.innerWidth * 0.5, y: window.innerHeight * 0.08 },
    };
    return namedMap[target.target] ?? namedMap['board'] ?? null;
  }

  return null;
}

export function calculatePointingAngles(
  target: PointTarget | undefined,
  characterRect?: DOMRect | { x: number; y: number }
): PointingResult | null {
  const coords = resolvePointTargetCoords(target);
  if (!coords) return null;

  const charX = characterRect
    ? ('x' in characterRect ? characterRect.x : (characterRect as DOMRect).left + (characterRect as DOMRect).width / 2)
    : window.innerWidth * 0.8;
  const charY = characterRect
    ? ('y' in characterRect ? characterRect.y : (characterRect as DOMRect).top + 150)
    : window.innerHeight * 0.7;

  const dx = coords.x - charX;
  const dy = coords.y - charY;
  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  const useLeftArm = dx < 0;

  if (useLeftArm) {
    // Target is to the left of the character
    // Convert angle to shoulder rotation
    const shoulderAngle = Math.max(10, Math.min(130, 90 - angleDeg));
    const forearmAngle = dy > 0 ? 25 : 15;

    return {
      useLeftArm: true,
      leftUpperArm: shoulderAngle,
      leftForearm: forearmAngle,
      rightUpperArm: -15,
      rightForearm: -10,
      headRotate: Math.max(-15, Math.min(0, dx / 40)),
      headTilt: Math.max(-8, Math.min(8, dy / 50)),
    };
  } else {
    // Target is to the right of the character
    const shoulderAngle = Math.max(-130, Math.min(-10, -(90 + angleDeg)));
    const forearmAngle = dy > 0 ? -25 : -15;

    return {
      useLeftArm: false,
      rightUpperArm: shoulderAngle,
      rightForearm: forearmAngle,
      leftUpperArm: 15,
      leftForearm: 10,
      headRotate: Math.max(0, Math.min(15, dx / 40)),
      headTilt: Math.max(-8, Math.min(8, dy / 50)),
    };
  }
}

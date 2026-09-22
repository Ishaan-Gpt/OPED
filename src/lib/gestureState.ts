export const gestureState = {
  enabled: false,
  present: false,
  palmOpen: false,
  pointing: false,
  clickPose: false,
  x: 0.5,
  y: 0.5,
  lookX: 0.5,
  lookY: 0.5,
  pinch: 1,
  pinching: false,
  twoHands: false,
  zoomK: 0,
  zoomVel: 0,
  raiseProgress: 0,
  facePresent: false,
  lastFaceAt: 0,
};

export const remoteGyro = {
  yaw: 0,
  pitch: 0,
};

export const gestureEvents = new EventTarget();

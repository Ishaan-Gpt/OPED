export const boardBridge = {
  canvas: null as HTMLCanvasElement | null,
  version: 0,
  events: new EventTarget(),
  publish(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.version++;
    this.events.dispatchEvent(new Event("update"));
  },
  clear() {
    this.canvas = null;
    this.version++;
    this.events.dispatchEvent(new Event("update"));
  },
};

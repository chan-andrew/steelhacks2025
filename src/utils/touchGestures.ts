import { TouchGesture } from '@/types/gym';

export class TouchGestureHandler {
  private lastTouchTime = 0;
  private lastTouchPosition: [number, number] = [0, 0];
  private touchStartTime = 0;
  private touchStartPosition: [number, number] = [0, 0];
  private isDoubleTap = false;

  private readonly DOUBLE_TAP_DELAY = 300;
  private readonly TAP_THRESHOLD = 10;
  private readonly LONG_PRESS_DELAY = 500;

  handleTouchStart = (event: TouchEvent): TouchGesture | null => {
    const touch = event.touches[0];
    const currentTime = Date.now();
    const position: [number, number] = [touch.clientX, touch.clientY];

    this.touchStartTime = currentTime;
    this.touchStartPosition = position;

    // Check for double tap
    const timeSinceLastTouch = currentTime - this.lastTouchTime;
    const distanceFromLastTouch = this.getDistance(position, this.lastTouchPosition);

    if (timeSinceLastTouch < this.DOUBLE_TAP_DELAY && distanceFromLastTouch < this.TAP_THRESHOLD) {
      this.isDoubleTap = true;
      return {
        type: 'tap',
        position,
      };
    }

    this.lastTouchTime = currentTime;
    this.lastTouchPosition = position;
    this.isDoubleTap = false;

    return null;
  };

  handleTouchMove = (event: TouchEvent): TouchGesture | null => {
    const touch = event.touches[0];
    const position: [number, number] = [touch.clientX, touch.clientY];
    const delta: [number, number] = [
      position[0] - this.touchStartPosition[0],
      position[1] - this.touchStartPosition[1],
    ];

    // Handle pinch gesture for multi-touch
    if (event.touches.length === 2) {
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );

      return {
        type: 'pinch',
        position: [
          (touch1.clientX + touch2.clientX) / 2,
          (touch1.clientY + touch2.clientY) / 2,
        ],
        scale: distance / 100, // Normalize scale
      };
    }

    // Pan gesture
    if (Math.abs(delta[0]) > this.TAP_THRESHOLD || Math.abs(delta[1]) > this.TAP_THRESHOLD) {
      return {
        type: 'pan',
        position,
        delta,
      };
    }

    return null;
  };

  handleTouchEnd = (event: TouchEvent): TouchGesture | null => {
    const currentTime = Date.now();
    const touchDuration = currentTime - this.touchStartTime;

    // Simple tap
    if (touchDuration < this.LONG_PRESS_DELAY && !this.isDoubleTap) {
      const touch = event.changedTouches[0];
      return {
        type: 'tap',
        position: [touch.clientX, touch.clientY],
      };
    }

    return null;
  };

  private getDistance(pos1: [number, number], pos2: [number, number]): number {
    return Math.sqrt(
      Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2)
    );
  }
}

export const createTouchGestureHandler = () => new TouchGestureHandler();

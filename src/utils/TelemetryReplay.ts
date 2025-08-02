type TelemetryFrame = Record<string, any>;

interface ReplayOptions {
  intervalMs?: number;
  loop?: boolean;
}

export class TelemetryReplay {
  private frames: TelemetryFrame[];
  private currentIndex = 0;
  private intervalId: any = null;
  private onTickCb: (frame: TelemetryFrame) => void = () => {};
  private options: Required<ReplayOptions>;

  constructor(frames: TelemetryFrame[], options: ReplayOptions = {}) {
    this.frames = [...frames].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    this.options = {
      intervalMs: options.intervalMs ?? 100,
      loop: options.loop ?? false,
    };
  }

  onTick(cb: (frame: TelemetryFrame) => void) {
    this.onTickCb = cb;
  }

  start() {
    if (this.intervalId || this.frames.length === 0) return;
    this.intervalId = setInterval(() => {
      if (this.currentIndex >= this.frames.length) {
        if (this.options.loop) {
          this.currentIndex = 0;
        } else {
          this.stop();
          return;
        }
      }
      const frame = this.frames[this.currentIndex++];
      this.onTickCb(frame);
    }, this.options.intervalMs);
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  stop() {
    this.pause();
    this.currentIndex = 0;
  }

  step() {
    if (this.currentIndex < this.frames.length) {
      const frame = this.frames[this.currentIndex++];
      this.onTickCb(frame);
    }
  }

  reset() {
    this.currentIndex = 0;
  }
}

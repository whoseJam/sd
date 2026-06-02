import type { SDNode } from "@/node/node";

export class Context {
  target: SDNode;
  start: number;
  duration: number;
  constructor(target: SDNode) {
    this.target = target;
    this.start = target.delay();
    this.duration = target.duration();
  }

  till(l: number, r: number) {
    if (this.duration > 0) {
      this.target.endAnimate();
      this.target.startAnimate({
        delay: this.start + this.duration * l,
        duration: this.duration * (r - l),
      });
    }
  }

  recover() {
    if (this.duration > 0) {
      this.target.endAnimate();
      this.target.startAnimate({
        delay: this.start,
        duration: this.duration,
      });
    }
  }
}

import { Component, AfterViewInit, HostListener, ElementRef, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-matrix-background',
  template: `<canvas #matrixCanvas></canvas>`,
  styles: [`
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
    }
  `]
})
export class Matrix implements AfterViewInit, OnDestroy {
  @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;

  private letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private fontSize = 16;
  private columns = 0;
  private drops: number[] = [];

  private bgColor!: string;
  private letterColor!: string;
  private observer!: MutationObserver;

  ngAfterViewInit() {
    this.updateThemeColors();

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initDrops();
    this.animate();

    // Watch for theme changes
    this.observer = new MutationObserver(() => this.updateThemeColors());
    this.observer.observe(document.documentElement, { attributes: true });
  }

  private updateThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    this.bgColor = styles.getPropertyValue('--matrix-bg-color').trim();
    this.letterColor = styles.getPropertyValue('--matrix-letter-color').trim();
  }

  private initDrops() {
    this.drops = Array(this.columns).fill(1);
  }

  private animate = () => {
    const canvas = this.canvasRef.nativeElement;

    // Background
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Letters
    this.ctx.fillStyle = this.letterColor;
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.letters.charAt(Math.floor(Math.random() * this.letters.length));
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i] += 0.9;
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.columns = Math.floor(canvas.width / this.fontSize);
    this.initDrops();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

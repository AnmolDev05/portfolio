import { Component, AfterViewInit, HostListener, ElementRef, ViewChild } from '@angular/core';
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
      z-index: 0; /* behind other content */
      pointer-events: none;
    }
  `]
})
export class Matrix {
 @ViewChild('matrixCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private fontSize = 16;
  private columns = 0;
  private drops: number[] = [];

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initDrops();
    this.animate();
  }

  private initDrops() {
    this.drops = Array(this.columns).fill(1);
  }

  private animate = () => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'rgba(0,0,0,0.05)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.fillStyle = 'rgba(166, 0, 255, 1)';
    this.ctx.font = `${this.fontSize}px monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const text = this.letters.charAt(Math.floor(Math.random() * this.letters.length));
      this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

      if (this.drops[i] * this.fontSize > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      // this.drops[i]++;
      this.drops[i] += 0.9
    }

    requestAnimationFrame(this.animate);
  }

  @HostListener('window:resize')
   resizeCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.columns = Math.floor(canvas.width / this.fontSize);
    this.initDrops();
  }
}

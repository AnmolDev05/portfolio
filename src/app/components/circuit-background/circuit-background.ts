import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-circuit-background',
  template: `<canvas #circuitCanvas></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: var(--bg-color);
    }
  `]
})
export class CircuitBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('circuitCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private nodes: { x: number, y: number, dx: number, dy: number }[] = [];

  private numNodes = 60;
  private maxDistance = 150;

  private nodeColor!: string;
  private lineColor!: string;

  ngAfterViewInit() {
    this.updateThemeColors();

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

    for (let i = 0; i < this.numNodes; i++) {
      this.nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7
      });
    }

    this.animate();
    // Listen for theme changes
    const observer = new MutationObserver(() => this.updateThemeColors());
    observer.observe(document.documentElement, { attributes: true });
  }

  private updateThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    this.nodeColor = styles.getPropertyValue('--node-color').trim();
    this.lineColor = styles.getPropertyValue('--line-color').trim();
  }

  @HostListener('window:resize')
  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  animate = () => {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let node of this.nodes) {
      node.x += node.dx;
      node.y += node.dy;
      if (node.x < 0 || node.x > canvas.width) node.dx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.dy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.nodeColor;
      ctx.shadowColor = this.nodeColor;
      ctx.shadowBlur = 15;
      ctx.fill();
    }

    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.maxDistance) {
          ctx.beginPath();
          ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          ctx.strokeStyle = `${this.lineColor}${Math.floor((1 - dist / this.maxDistance) * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 1;
          ctx.shadowColor = this.lineColor;
          ctx.shadowBlur = 10;
          ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}

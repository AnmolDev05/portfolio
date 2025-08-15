import { Component, ElementRef, ViewChild } from '@angular/core';
import { CircuitBackgroundComponent } from '../../components/circuit-background/circuit-background';
import { Matrix } from '../../components/matrix/matrix';

@Component({
  selector: 'app-main',
  imports: [CircuitBackgroundComponent,Matrix],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {
  // activeSection = 'section-about';
  // @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // ngAfterViewInit() {
  //   const options = {
  //     root: this.scrollContainer.nativeElement,
  //     threshold: 0.5
  //   };

  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.isIntersecting) {
  //         this.activeSection = entry.target.id;
  //       }
  //     });
  //   }, options);

  //   const sections = this.scrollContainer.nativeElement.querySelectorAll('.section');
  //   sections.forEach((section: HTMLElement) => observer.observe(section));
  // }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  activeSection = 'section-about';
  isLight : any = false;

  ngOnInit(): void {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      this.setLight(true);
    } else if (saved === 'dark') {
      this.setLight(false);
    } else {
      // follow OS default if user hasn't chosen
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setLight(!prefersDark);
    }
  }

  ngAfterViewInit(): void {
    // set initial active after view paints
    setTimeout(() => this.onScroll(), 60);
  }

  toggleTheme() {
    this.setLight(!this.isLight);
  }

  private setLight(isLight: boolean) {
    this.isLight = isLight;
    if (isLight) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('theme', isLight ? 'light' : 'dark');

    // notify canvas component (or anything listening)
    window.dispatchEvent(new CustomEvent('theme-change'));
  }

  scrollTo(id: string) {
    const container = this.scrollContainer?.nativeElement;
    const el = document.getElementById(id);
    if (container && el) {
      container.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  }

  onScroll() {
    const container = this.scrollContainer.nativeElement;
    const sections = ['section-about', 'section-experience', 'section-project'];
    let current = sections[0];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.offsetTop <= container.scrollTop + 120) {
        current = id;
      }
    }

    this.activeSection = current;
  }
}

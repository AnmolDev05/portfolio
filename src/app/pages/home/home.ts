import { Component, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { CommonModule } from '@angular/common';
// import { Matrix } from '../../components/matrix/matrix';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { Matrix } from '../../components/matrix/matrix';
import { CircuitBackgroundComponent } from '../../components/circuit-background/circuit-background';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, ScrollSmoother);

@Component({
  selector: 'app-home',
  imports: [CommonModule,Matrix,CircuitBackgroundComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements AfterViewInit {
  slides = [
    { bg: 1, title1: 'About Me', title2: 'No. 1', text: 'Praesent commodo cursus magna...', img: '' },
    { bg: 2, title1: 'Contact', title2: 'No. 2', text: 'Praesent commodo cursus magna...', img: '' },
    { bg: 3, title1: 'My Projects', title2: 'No. 3', text: 'Praesent commodo cursus magna...', img: '' },
  ];

  slideID = 0;

  ngAfterViewInit(): void {
     const video: HTMLVideoElement | null = document.querySelector('video');
  if (video) {
    video.muted = true;  // ensure muted
    video.play().catch(err => console.log('Video play failed:', err));
  }
    this.initPortfolio();
  }

  // Helper functions
  select = (selector: string) => document.querySelector(selector);
  selectAll = (selector: string) => document.querySelectorAll(selector);

  initPortfolio() {
    gsap.set(this.select('.stage'), { autoAlpha: 1 });
    ScrollSmoother.create({ smooth: 2, effects: true, smoothTouch: 0.1 });

    this.initHeader();
    this.initIntro();
    this.initLinks();
    this.initSlides();
    this.initParallax();
    this.initKeys();
  }

  initHeader() {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from('.logo', { y: -40, opacity: 0, duration: 2, ease: 'power4' })
      .from('.nav-btn__svg rect', { scale: 0, transformOrigin: 'center right', duration: 0.6, ease: 'power4', stagger: 0.1 }, 0.6)
      .to('.nav-rect', { scale: 0.8, transformOrigin: 'center left', duration: 0.4, ease: 'power2', stagger: 0.1 }, '-=0.6');

    const navBtn = this.select('.nav-btn');
    if (navBtn) {
      navBtn.addEventListener('mouseover', () => gsap.to('.nav-rect', { scaleX: 1, transformOrigin: 'top left', duration: 0.4, ease: 'power4' }));
      navBtn.addEventListener('mouseout', () => gsap.to('.nav-rect', { scaleX: 0.8, transformOrigin: 'top left', duration: 0.6, ease: 'power4' }));
    }
  }

  initIntro() {
    new SplitText('.intro__title', { type: 'lines', linesClass: 'intro-line' });

    const tl = gsap.timeline({ delay: 1.2 });
    tl.from('.intro-line', { y: 400, ease: 'power4', duration: 3 })
      .from('.intro__txt', { x: -100, opacity: 0, ease: 'power4', duration: 3 }, 0.7)
      .from(['.intro__img--1', '.intro__img--2'], { y: i => i === 0 ? 50 : -50, opacity: 0, ease: 'power2', duration: 10 }, 1);

    gsap.timeline({ scrollTrigger: { trigger: '.intro', scrub: 1, start: 'top bottom', end: 'bottom top' } })
      .to('.intro__title', { x: 400, ease: 'power4.in', duration: 3 })
      .to('.intro__txt', { y: 100, ease: 'power4.in', duration: 3 }, 0);
  }

  initLinks() {
    this.selectAll('.slide__scroll-link').forEach((link, index) => {
      const line = link.querySelector('.slide__scroll-line');
      link.addEventListener('click', e => { e.preventDefault(); this.scrollToSlide(index + 1); });
      link.addEventListener('mouseover', () => gsap.to(line, { y: 40, duration: 0.6, ease: 'power4' }));
      link.addEventListener('mouseout', () => gsap.to(line, { y: 0, duration: 0.6, ease: 'power4' }));
    });

    this.select('.footer__link-top')?.addEventListener('click', e => { e.preventDefault(); this.scrollTop(); });
  }

  initSlides() {
    this.selectAll('.slide').forEach(slide => {
      gsap.from(slide.querySelectorAll('.col__content-title'), {
        y: '+=5vh',
        duration: 2.5,
        ease: 'power4',
        scrollTrigger: { trigger: slide, start: '40% 50%' }
      });
    });
  }

  initParallax() {
    this.selectAll('.slide').forEach(slide => {
      gsap.fromTo(slide.querySelectorAll('.col__image-wrap'), { y: '-30vh' }, { 
        y: '30vh', 
        scrollTrigger: { trigger: slide, scrub: true }, 
        ease: 'none' 
      });
    });
  }

  scrollTop() {
    this.scrollToSlide(0);
  }

  initKeys() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') this.nextSlide();
      if (e.key === 'ArrowUp') this.scrollTop();
    });
  }

  nextSlide() {
    this.slideID++;
    this.scrollToSlide(this.slideID);
  }

  scrollToSlide(index: number) {
    this.slideID = index;
    gsap.to(window, { duration: 2, scrollTo: { y: `#slide-${index}` }, ease: 'power2.inOut' });
  }
}

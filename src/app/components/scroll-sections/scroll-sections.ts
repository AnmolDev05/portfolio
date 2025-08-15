import { Component, AfterViewInit, ContentChildren, QueryList, ElementRef } from '@angular/core';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
gsap.registerPlugin(Observer);


@Component({
  selector: 'app-scroll-sections',
  imports: [],
  // templateUrl: './scroll-sections.html',
  template: `<ng-content></ng-content>`,
  styleUrl: './scroll-sections.scss'
})
export class ScrollSections implements AfterViewInit {
  @ContentChildren('sectionRef', { read: ElementRef }) sectionsRef!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    const sections = this.sectionsRef.map(s => s.nativeElement as HTMLElement);
    const images = sections.map(sec => sec.querySelector('.bg') as HTMLElement);
    const headings = sections.map(sec => sec.querySelector('.section-heading') as HTMLElement);
    const outerWrappers = sections.map(sec => sec.querySelector('.outer') as HTMLElement);
    const innerWrappers = sections.map(sec => sec.querySelector('.inner') as HTMLElement);

    let currentIndex = -1;
    const wrap = gsap.utils.wrap(0, sections.length);
    let animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    function animateHeading(heading: HTMLElement) {
      const text = heading.textContent || '';
      heading.innerHTML = '';
      const chars = text.split('').map(c => {
        const span = document.createElement('span');
        span.textContent = c;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        heading.appendChild(span);
        return span;
      });
      gsap.to(chars, { autoAlpha: 1, yPercent: 0, duration: 1, ease: 'power2.out', stagger: { each: 0.02, from: 'random' } });
    }

    function gotoSection(index: number, direction: number) {
      index = wrap(index);
      animating = true;
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;

      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: 'power1.inOut' },
        onComplete: () => { animating = false; }
      });

      if (currentIndex >= 0) {
        gsap.set(sections[currentIndex], { zIndex: 0 });
        tl.to(images[currentIndex], { yPercent: -15 * dFactor })
          .set(sections[currentIndex], { autoAlpha: 0 });
      }

      gsap.set(sections[index], { autoAlpha: 1, zIndex: 1 });

      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: i => i ? -100 * dFactor : 100 * dFactor },
        { yPercent: 0 },
        0
      )
      .fromTo(images[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
      .call(() => animateHeading(headings[index]), undefined, 0.2);

      currentIndex = index;
    }

    Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      onDown: () => { if (!animating) gotoSection(currentIndex - 1, -1); },
      onUp: () => { if (!animating) gotoSection(currentIndex + 1, 1); },
      tolerance: 10,
      preventDefault: true
    });

    gotoSection(0, 1);
  }
}

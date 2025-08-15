import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  ngAfterViewInit(): void {
    // Fade in the navbar
    gsap.from('.navbar', { duration: 1, y: -50, opacity: 0, ease: 'power2.out' });
    
    // Animate links sequentially
    gsap.from('.nav-links li', { 
      duration: 0.8, 
      y: -20, 
      opacity: 0, 
      stagger: 0.2, 
      delay: 0.5, 
      ease: 'power2.out'
    });
  }
}

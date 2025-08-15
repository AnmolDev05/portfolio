import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollSections } from './scroll-sections';

describe('ScrollSections', () => {
  let component: ScrollSections;
  let fixture: ComponentFixture<ScrollSections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollSections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollSections);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircuitBackgroundComponent } from './circuit-background';

describe('CircuitBackgroundComponent', () => {
  let component: CircuitBackgroundComponent;
  let fixture: ComponentFixture<CircuitBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircuitBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircuitBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

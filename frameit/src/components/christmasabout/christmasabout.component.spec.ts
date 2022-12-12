import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChristmasaboutComponent } from './christmasabout.component';

describe('ChristmasaboutComponent', () => {
  let component: ChristmasaboutComponent;
  let fixture: ComponentFixture<ChristmasaboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChristmasaboutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChristmasaboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

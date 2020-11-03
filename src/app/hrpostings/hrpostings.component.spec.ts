import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrpostingsComponent } from './hrpostings.component';

describe('HrpostingsComponent', () => {
  let component: HrpostingsComponent;
  let fixture: ComponentFixture<HrpostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrpostingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrpostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FhdashboardComponent } from './fhdashboard.component';

describe('FhdashboardComponent', () => {
  let component: FhdashboardComponent;
  let fixture: ComponentFixture<FhdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FhdashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FhdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

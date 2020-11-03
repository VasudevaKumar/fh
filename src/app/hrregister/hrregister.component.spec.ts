import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrregisterComponent } from './hrregister.component';

describe('HrregisterComponent', () => {
  let component: HrregisterComponent;
  let fixture: ComponentFixture<HrregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

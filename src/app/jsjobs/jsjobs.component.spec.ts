import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsjobsComponent } from './jsjobs.component';

describe('JsjobsComponent', () => {
  let component: JsjobsComponent;
  let fixture: ComponentFixture<JsjobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsjobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

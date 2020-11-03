import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JspostingsComponent } from './jspostings.component';

describe('JspostingsComponent', () => {
  let component: JspostingsComponent;
  let fixture: ComponentFixture<JspostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JspostingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JspostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

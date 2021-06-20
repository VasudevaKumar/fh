import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsvideoComponent } from './jsvideo.component';

describe('JsvideoComponent', () => {
  let component: JsvideoComponent;
  let fixture: ComponentFixture<JsvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsvideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

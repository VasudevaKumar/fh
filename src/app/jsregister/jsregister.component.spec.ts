import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsregisterComponent } from './jsregister.component';

describe('JsregisterComponent', () => {
  let component: JsregisterComponent;
  let fixture: ComponentFixture<JsregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsregisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

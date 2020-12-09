import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsmessagesComponent } from './jsmessages.component';

describe('JsmessagesComponent', () => {
  let component: JsmessagesComponent;
  let fixture: ComponentFixture<JsmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsmessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

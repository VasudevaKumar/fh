import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareermanagersComponent } from './careermanagers.component';

describe('CareermanagersComponent', () => {
  let component: CareermanagersComponent;
  let fixture: ComponentFixture<CareermanagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareermanagersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareermanagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

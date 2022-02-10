import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCXPComponent } from './view-cxp.component';

describe('ViewCXPComponent', () => {
  let component: ViewCXPComponent;
  let fixture: ComponentFixture<ViewCXPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCXPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCXPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

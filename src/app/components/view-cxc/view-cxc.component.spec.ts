import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCxcComponent } from './view-cxc.component';

describe('ViewCxcComponent', () => {
  let component: ViewCxcComponent;
  let fixture: ComponentFixture<ViewCxcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCxcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCxcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugarInquilinoComponent } from './lugar-inquilino.component';

describe('LugarInquilinoComponent', () => {
  let component: LugarInquilinoComponent;
  let fixture: ComponentFixture<LugarInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LugarInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LugarInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeudasInquilinoComponent } from './deudas-inquilino.component';

describe('DeudasInquilinoComponent', () => {
  let component: DeudasInquilinoComponent;
  let fixture: ComponentFixture<DeudasInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeudasInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeudasInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturasInquilinoComponent } from './facturas-inquilino.component';

describe('FacturasInquilinoComponent', () => {
  let component: FacturasInquilinoComponent;
  let fixture: ComponentFixture<FacturasInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturasInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturasInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

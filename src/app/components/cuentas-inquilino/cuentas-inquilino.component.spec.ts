import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasInquilinoComponent } from './cuentas-inquilino.component';

describe('CuentasInquilinoComponent', () => {
  let component: CuentasInquilinoComponent;
  let fixture: ComponentFixture<CuentasInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

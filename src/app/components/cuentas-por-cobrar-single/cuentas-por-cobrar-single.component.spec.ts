import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasPorCobrarSingleComponent } from './cuentas-por-cobrar-single.component';

describe('CuentasPorCobrarSingleComponent', () => {
  let component: CuentasPorCobrarSingleComponent;
  let fixture: ComponentFixture<CuentasPorCobrarSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentasPorCobrarSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentasPorCobrarSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

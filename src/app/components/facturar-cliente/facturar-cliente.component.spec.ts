import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturarClienteComponent } from './facturar-cliente.component';

describe('FacturarClienteComponent', () => {
  let component: FacturarClienteComponent;
  let fixture: ComponentFixture<FacturarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturarClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

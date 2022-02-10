import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboClienteComponent } from './recibo-cliente.component';

describe('ReciboClienteComponent', () => {
  let component: ReciboClienteComponent;
  let fixture: ComponentFixture<ReciboClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciboClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciboClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCuentasComponent } from './clientes-cuentas.component';

describe('ClientesCuentasComponent', () => {
  let component: ClientesCuentasComponent;
  let fixture: ComponentFixture<ClientesCuentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesCuentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesCuentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

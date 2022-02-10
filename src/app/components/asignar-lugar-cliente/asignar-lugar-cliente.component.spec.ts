import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarLugarClienteComponent } from './asignar-lugar-cliente.component';

describe('AsignarLugarClienteComponent', () => {
  let component: AsignarLugarClienteComponent;
  let fixture: ComponentFixture<AsignarLugarClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarLugarClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarLugarClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasEmpleadosComponent } from './nominas-empleados.component';

describe('NominasEmpleadosComponent', () => {
  let component: NominasEmpleadosComponent;
  let fixture: ComponentFixture<NominasEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominasEmpleadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominasEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

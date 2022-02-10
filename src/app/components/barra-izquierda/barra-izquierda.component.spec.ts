import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraIzquierdaComponent } from './barra-izquierda.component';

describe('BarraIzquierdaComponent', () => {
  let component: BarraIzquierdaComponent;
  let fixture: ComponentFixture<BarraIzquierdaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarraIzquierdaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarraIzquierdaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

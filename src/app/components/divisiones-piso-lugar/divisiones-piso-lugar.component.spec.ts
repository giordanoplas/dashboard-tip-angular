import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionesPisoLugarComponent } from './divisiones-piso-lugar.component';

describe('DivisionesPisoLugarComponent', () => {
  let component: DivisionesPisoLugarComponent;
  let fixture: ComponentFixture<DivisionesPisoLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionesPisoLugarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionesPisoLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

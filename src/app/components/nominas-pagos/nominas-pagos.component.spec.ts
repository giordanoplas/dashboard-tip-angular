import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasPagosComponent } from './nominas-pagos.component';

describe('NominasPagosComponent', () => {
  let component: NominasPagosComponent;
  let fixture: ComponentFixture<NominasPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominasPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominasPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

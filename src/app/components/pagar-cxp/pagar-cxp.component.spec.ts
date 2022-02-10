import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarCXPComponent } from './pagar-cxp.component';

describe('PagarCXPComponent', () => {
  let component: PagarCXPComponent;
  let fixture: ComponentFixture<PagarCXPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagarCXPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarCXPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominasNominaComponent } from './nominas-nomina.component';

describe('NominasNominaComponent', () => {
  let component: NominasNominaComponent;
  let fixture: ComponentFixture<NominasNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominasNominaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NominasNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

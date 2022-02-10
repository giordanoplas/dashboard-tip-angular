import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPropiedadComponent } from './add-propiedad.component';

describe('AddPropiedadComponent', () => {
  let component: AddPropiedadComponent;
  let fixture: ComponentFixture<AddPropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPropiedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

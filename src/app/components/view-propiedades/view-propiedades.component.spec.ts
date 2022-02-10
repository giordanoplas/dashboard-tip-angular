import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropiedadesComponent } from './view-propiedades.component';

describe('ViewPropiedadesComponent', () => {
  let component: ViewPropiedadesComponent;
  let fixture: ComponentFixture<ViewPropiedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPropiedadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropiedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

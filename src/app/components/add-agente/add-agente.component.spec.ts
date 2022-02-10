import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAgenteComponent } from './add-agente.component';

describe('AddAgenteComponent', () => {
  let component: AddAgenteComponent;
  let fixture: ComponentFixture<AddAgenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAgenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLugarComponent } from './edit-lugar.component';

describe('EditLugarComponent', () => {
  let component: EditLugarComponent;
  let fixture: ComponentFixture<EditLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLugarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLugarComponent } from './add-lugar.component';

describe('AddLugarComponent', () => {
  let component: AddLugarComponent;
  let fixture: ComponentFixture<AddLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLugarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInquilinoComponent } from './add-inquilino.component';

describe('AddInquilinoComponent', () => {
  let component: AddInquilinoComponent;
  let fixture: ComponentFixture<AddInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

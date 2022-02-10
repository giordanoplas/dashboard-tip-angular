import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInquilinoComponent } from './edit-inquilino.component';

describe('EditInquilinoComponent', () => {
  let component: EditInquilinoComponent;
  let fixture: ComponentFixture<EditInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

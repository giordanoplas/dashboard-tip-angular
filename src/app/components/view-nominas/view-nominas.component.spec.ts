import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNominasComponent } from './view-nominas.component';

describe('ViewNominasComponent', () => {
  let component: ViewNominasComponent;
  let fixture: ComponentFixture<ViewNominasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewNominasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNominasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

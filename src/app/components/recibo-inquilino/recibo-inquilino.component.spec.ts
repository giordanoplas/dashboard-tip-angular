import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboInquilinoComponent } from './recibo-inquilino.component';

describe('ReciboInquilinoComponent', () => {
  let component: ReciboInquilinoComponent;
  let fixture: ComponentFixture<ReciboInquilinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciboInquilinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciboInquilinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

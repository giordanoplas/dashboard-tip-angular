import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAgentesComponent } from './view-agentes.component';

describe('ViewAgentesComponent', () => {
  let component: ViewAgentesComponent;
  let fixture: ComponentFixture<ViewAgentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAgentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

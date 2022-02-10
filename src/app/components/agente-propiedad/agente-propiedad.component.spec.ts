import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentePropiedadComponent } from './agente-propiedad.component';

describe('AgentePropiedadComponent', () => {
  let component: AgentePropiedadComponent;
  let fixture: ComponentFixture<AgentePropiedadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentePropiedadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentePropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

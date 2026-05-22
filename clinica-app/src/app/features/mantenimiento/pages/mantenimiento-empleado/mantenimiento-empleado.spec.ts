import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoEmpleado } from './mantenimiento-empleado';

describe('MantenimientoEmpleado', () => {
  let component: MantenimientoEmpleado;
  let fixture: ComponentFixture<MantenimientoEmpleado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoEmpleado],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoEmpleado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoAdmin } from './mantenimiento-admin';

describe('MantenimientoAdmin', () => {
  let component: MantenimientoAdmin;
  let fixture: ComponentFixture<MantenimientoAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(MantenimientoAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

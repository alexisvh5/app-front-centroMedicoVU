import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTarea } from './modal-tarea';

describe('ModalTarea', () => {
  let component: ModalTarea;
  let fixture: ComponentFixture<ModalTarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTarea],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

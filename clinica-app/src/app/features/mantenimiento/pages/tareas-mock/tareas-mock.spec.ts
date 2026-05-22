import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasMock } from './tareas-mock';

describe('TareasMock', () => {
  let component: TareasMock;
  let fixture: ComponentFixture<TareasMock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TareasMock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTareaMobile } from './card-tarea-mobile';

describe('CardTareaMobile', () => {
  let component: CardTareaMobile;
  let fixture: ComponentFixture<CardTareaMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTareaMobile],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTareaMobile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

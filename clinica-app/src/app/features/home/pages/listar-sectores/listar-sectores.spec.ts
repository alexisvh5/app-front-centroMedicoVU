import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarSectores } from './listar-sectores';

describe('ListarSectores', () => {
  let component: ListarSectores;
  let fixture: ComponentFixture<ListarSectores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarSectores],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarSectores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

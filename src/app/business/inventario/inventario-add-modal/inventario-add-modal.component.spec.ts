import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioAddModalComponent } from './inventario-add-modal.component';

describe('InventarioAddModalComponent', () => {
  let component: InventarioAddModalComponent;
  let fixture: ComponentFixture<InventarioAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioAddModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

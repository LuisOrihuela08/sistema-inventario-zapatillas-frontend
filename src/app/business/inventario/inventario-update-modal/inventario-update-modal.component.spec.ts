import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioUpdateModalComponent } from './inventario-update-modal.component';

describe('InventarioUpdateModalComponent', () => {
  let component: InventarioUpdateModalComponent;
  let fixture: ComponentFixture<InventarioUpdateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventarioUpdateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventarioUpdateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

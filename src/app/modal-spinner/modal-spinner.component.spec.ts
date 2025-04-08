import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSpinnerComponent } from './modal-spinner.component';

describe('ModalSpinnerComponent', () => {
  let component: ModalSpinnerComponent;
  let fixture: ComponentFixture<ModalSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalSpinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

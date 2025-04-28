import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverProductsComponent } from './discover-products.component';

describe('DiscoverProductsComponent', () => {
  let component: DiscoverProductsComponent;
  let fixture: ComponentFixture<DiscoverProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoverProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscoverProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

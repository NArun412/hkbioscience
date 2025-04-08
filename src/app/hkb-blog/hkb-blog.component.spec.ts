import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HKBBlogComponent } from './hkb-blog.component';

describe('HKBBlogComponent', () => {
  let component: HKBBlogComponent;
  let fixture: ComponentFixture<HKBBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HKBBlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HKBBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

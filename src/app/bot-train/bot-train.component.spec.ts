import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotTrainComponent } from './bot-train.component';

describe('BotTrainComponent', () => {
  let component: BotTrainComponent;
  let fixture: ComponentFixture<BotTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotTrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

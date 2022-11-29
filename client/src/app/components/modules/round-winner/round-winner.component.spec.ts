import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundWinnerComponent } from './round-winner.component';

describe('RoundWinnerComponent', () => {
  let component: RoundWinnerComponent;
  let fixture: ComponentFixture<RoundWinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundWinnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

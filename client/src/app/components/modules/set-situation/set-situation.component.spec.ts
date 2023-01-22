import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSituationComponent } from './set-situation.component';

describe('SetSituationComponent', () => {
  let component: SetSituationComponent;
  let fixture: ComponentFixture<SetSituationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetSituationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetSituationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

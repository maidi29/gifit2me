import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeStartMasterComponent } from './before-start-master.component';

describe('BeforeStartMasterComponent', () => {
  let component: BeforeStartMasterComponent;
  let fixture: ComponentFixture<BeforeStartMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeforeStartMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeforeStartMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

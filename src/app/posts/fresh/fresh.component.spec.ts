import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreshComponent } from './fresh.component';

describe('FreshComponent', () => {
  let component: FreshComponent;
  let fixture: ComponentFixture<FreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

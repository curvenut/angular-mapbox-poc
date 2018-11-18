import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftMenuSidenavComponent } from './left-menu-sidenav.component';

describe('LeftMenuComponent', () => {
  let component: LeftMenuSidenavComponent;
  let fixture: ComponentFixture<LeftMenuSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftMenuSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftMenuSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfUsers } from './list-of-users';

describe('ListOfUsers', () => {
  let component: ListOfUsers;
  let fixture: ComponentFixture<ListOfUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfUsers],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

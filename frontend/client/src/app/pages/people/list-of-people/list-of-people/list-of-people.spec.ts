import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfPeople } from './list-of-people';

describe('ListOfPeople', () => {
  let component: ListOfPeople;
  let fixture: ComponentFixture<ListOfPeople>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfPeople],
    }).compileComponents();

    fixture = TestBed.createComponent(ListOfPeople);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

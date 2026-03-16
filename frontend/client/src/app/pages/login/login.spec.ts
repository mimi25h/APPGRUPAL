import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonLogin } from './login';

describe('Login', () => {
  let component: PersonLogin;
  let fixture: ComponentFixture<PersonLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

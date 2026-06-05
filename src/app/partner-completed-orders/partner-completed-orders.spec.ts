import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerCompletedOrders } from './partner-completed-orders';

describe('PartnerCompletedOrders', () => {
  let component: PartnerCompletedOrders;
  let fixture: ComponentFixture<PartnerCompletedOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerCompletedOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(PartnerCompletedOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

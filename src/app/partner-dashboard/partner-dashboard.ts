import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { OrderDto } from '../orders/order.dto';
import { UserDto } from '../profile/user.dto';

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-dashboard.html',
  styleUrls: ['./partner-dashboard.css']
})
export class PartnerDashboard implements OnInit {

  partnerName = '';
  orders: OrderDto[] = [];
  customerMap: Record<number, UserDto> = {};
  partnerId: number = 0;
  showToast = false;
  toastMessage = '';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.partnerId = Number(localStorage.getItem('customerId'));
    this.partnerName = localStorage.getItem('userName') || '';

    // const storedOrders = localStorage.getItem('partnerOrders');
    // const storedCustomerMap = localStorage.getItem('partnerCustomerMap');

    // if (storedOrders) {
    //   this.orders = JSON.parse(storedOrders);
    // }

    // if (storedCustomerMap) {
    //   this.customerMap = JSON.parse(storedCustomerMap);
    // }

    this.getOrders();
  }

  getOrders() {
    this.apiService.getOrders().subscribe({
    next: (response:OrderDto[]) => {
        console.log('FIRST ORDER OBJECT:', response[0]);
        this.ngZone.run(() => {

          const acceptedOrders = response.filter(order =>
            order.partnerId === this.partnerId && order.orderStatus === 'IN_PROGRESS'
          );

          this.orders = acceptedOrders.length > 0
            ? acceptedOrders
            : response.filter(order => order.orderStatus === 'OPEN');

          this.orders.forEach(order => {
            if (this.customerMap[order.customerId]) return; // ← skip if already fetched

            this.apiService
            .getUserById(order.customerId)
            .subscribe({
              next: (customer:UserDto) => {
                this.ngZone.run(() => {
                  this.customerMap = {
                    ...this.customerMap,
                    [order.customerId]: customer  // ← spread to trigger change detection
                  };
                  this.cdr.detectChanges();
                });
              }
            });
          });

          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.log('Session expired, using cached data', error);
      }
    });
  }
  acceptOrder(id: number) {
    const alreadyAccepted = this.orders.some(order =>
      order.partnerId === this.partnerId && order.orderStatus === 'IN_PROGRESS');

    if (alreadyAccepted) {
      alert('You can only accept one order at a time');
      return;
    }

    this.apiService
    .assignPartner(id, this.partnerId)
    .subscribe({
      next: () => this.getOrders(),
      error: (error) => console.log(error)
    });
  }
  completeOrder(id: number) {
    console.log('id:', id, 'partnerId:', this.partnerId);
  this.apiService
    .completeOrder(id, this.partnerId).subscribe({
    next: () => {
      this.customerMap = {};
      this.toastMessage = `Completed Order ID: #${id}`;
    this.showToast = true;
      this.cdr.detectChanges();
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
      this.getOrders();
    }, 3000);

    // refresh orders if needed
    // this.getOrders();
  },
    error: (error) => console.log(error)
  });
}
}
















// After refresh, this.orders may contain only OPEN orders.
// So better solution is backend validation.
// Add validation in backend service also.
// In your assignPartner() service method:
// boolean alreadyAssigned =
//         orderRepository.existsByPartnerIdAndOrderStatus(
//                 partnerId,
//                 OrderStatus.IN_PROGRESS
//         );
// if (alreadyAssigned) {

//     throw new RuntimeException(
//             "Partner already has active order"
//     );
// }
// Now add this in repository:
// boolean existsByPartnerIdAndOrderStatus(
//         Long partnerId,
//         OrderStatus orderStatus
// );
// This is the correct production approach:
// frontend validation → quick UX
// backend validation → actual protection
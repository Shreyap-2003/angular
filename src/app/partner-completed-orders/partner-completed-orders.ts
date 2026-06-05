import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { OrderDto } from '../orders/order.dto';

@Component({
  selector: 'app-partner-completed-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-completed-orders.html',
  styleUrls: ['./partner-completed-orders.css']
})
export class PartnerCompletedOrders implements OnInit {

  completedOrders: OrderDto[] = [];
  partnerId: number = 0;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.partnerId = Number(localStorage.getItem('customerId'));

    this.apiService
      .getPartnerCompletedOrders(this.partnerId)
      .subscribe({
      next: (response: OrderDto[]) => {
        this.ngZone.run(() => {
          this.completedOrders = response;
          this.cdr.detectChanges();
          console.log(this.completedOrders);
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  // getCompletedOrders() {

  //   this.http.get<any[]>(
  //     `/api/orders/partner/${this.partnerId}/completed-orders`
  //   ).subscribe({

  //     next: (response) => {

  //       console.log(response);

  //       this.completedOrders = [...response];
  //     },

  //     error: (error) => {

  //       console.log(error);
  //     }
  //   });
  // }
}
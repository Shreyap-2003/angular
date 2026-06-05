import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderDto } from '../orders/order.dto';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html',
  styleUrls: ['./order-detail.css']
})
export class OrderDetail implements OnInit {

  order: OrderDto | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    const state = history.state as { selectedOrder: OrderDto };
    if (state?.selectedOrder) {
      this.order = state.selectedOrder;
    } else {
      // No order passed, go back to orders
      this.router.navigate(['/orders']);
    }
  }

  goBack() {
    this.router.navigate(['/orders']);
  }
}
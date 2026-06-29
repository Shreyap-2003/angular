import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OrderDto } from '../orders/order.dto';
import { ItemsDto } from '../items/items.dto';
import { UserDto } from '../profile/user.dto';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {

  inProgressOrders: OrderDto[] = [];
  completedOrders: OrderDto[] = [];
  partnerMap: Record<number, UserDto> = {};
  selectedTab = 'progress';
  customerId = 0;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const id = localStorage.getItem('customerId');
    if (id) {
      this.customerId = Number(id);
      this.getOrders();
    }
  }

  viewOrder(order: OrderDto) {
    this.router.navigate(['/order-detail'], { state: { selectedOrder: order } });
  }

  getOrders() {
    this.apiService.getOrders().subscribe({
      next: (ordersResponse: OrderDto[]) => {
        console.log('RAW ORDER:', ordersResponse[0]);

        this.apiService.getItems().subscribe({
          next: (itemsResponse: ItemsDto[]) => {

            this.apiService.getUsers().subscribe({
              next: (usersResponse: UserDto[]) => {

                usersResponse.forEach((user: UserDto) => {
                  this.partnerMap[user.id] = user;
                });

                const customerOrders = ordersResponse.filter((order: OrderDto) =>
                  order.customerId === this.customerId);

                customerOrders.forEach(order => {
                  const foundItem = itemsResponse.find((item: ItemsDto) => item.id === order.itemId);
                  if (foundItem) {
                    order.itemName = foundItem.name;
                    order.imageUrl = foundItem.imageUrl;
                    order.price = foundItem.price;
                  }

                  const partner = this.partnerMap[order.partnerId];
                  if (partner) {
                    order.partnerPhone = partner.phoneNumber;
                  }
                });

                this.inProgressOrders = customerOrders.filter(order => order.orderStatus !== 'COMPLETED');
                this.completedOrders = customerOrders.filter(order => order.orderStatus === 'COMPLETED');
                this.cdr.detectChanges();
              },
              error: (error) => console.log('USER API ERROR:', error)
            });
          },
          error: (error) => console.log('ITEM API ERROR:', error)
        });
      },
      error: (error) => console.log('ORDER API ERROR:', error)
    });
  }

  showProgressOrders() {
    this.selectedTab = 'progress';
    this.getOrders();
  }

  showCompletedOrders() {
    this.selectedTab = 'completed';
    this.getOrders();
  }
}
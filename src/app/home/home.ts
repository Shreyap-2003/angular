import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CategoryDto } from '../home/category.dto';
import { OrderDto } from '../orders/order.dto';
import { ItemsDto } from '../items/items.dto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  userName = '';
  categories: CategoryDto[] = [];
  cartCount = 0;
  activeOrders: OrderDto[] = [];
  customerId = 0;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      this.userName = storedUserName;
    }

    this.customerId = Number(localStorage.getItem('customerId'));

    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories) as CategoryDto[];
    }

    const storedActiveOrders = localStorage.getItem('activeOrders');
    if (storedActiveOrders) {
      this.activeOrders = JSON.parse(storedActiveOrders);
    }

    this.updateCartCount();
    setInterval(() => { this.updateCartCount(); }, 500);

    this.getCategories();

    if (this.customerId) {
      this.getActiveOrders();
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/') {
        this.customerId = Number(localStorage.getItem('customerId'));
        if (this.customerId) {
          this.getActiveOrders();
        }
      }
    });
  }

  getActiveOrders() {
    this.apiService.getOrders().subscribe({
      next: (orders: OrderDto[]) => {
        const customerOrders = orders.filter(
          order =>
            order.customerId === this.customerId &&
            order.orderStatus !== 'COMPLETED'
        );

        this.apiService.getItems().subscribe({
          next: (items: ItemsDto[]) => {
            customerOrders.forEach(order => {
              const foundItem = items.find(item => item.id === order.itemId);
              if (foundItem) {
                order.itemName = foundItem.name;
                order.imageUrl = foundItem.imageUrl;
                order.price = foundItem.price;
              }
            });

            this.activeOrders = customerOrders;
            localStorage.setItem('activeOrders', JSON.stringify(customerOrders));
          },
          error: error => console.error('Failed to load items', error)
        });
      },
      error: error => console.error('Failed to load orders', error)
    });
  }

  viewOrder(order: OrderDto) {
    this.router.navigate(['/order-detail'], { state: { selectedOrder: order } });
  }

  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (response: CategoryDto[]) => {
        this.categories = response;
        localStorage.setItem('categories', JSON.stringify(this.categories));
      },
      error: (error) => console.log(error)
    });
  }

  updateCartCount() {
    const storedCart = localStorage.getItem('cart');
    let cart: { [key: number]: number } = {};
    try {
      cart = storedCart ? JSON.parse(storedCart) : {};
    } catch (e) {
      cart = {};
    }
    this.cartCount = Object.values(cart).reduce((sum: number, qty: any) => {
      const num = Number(qty);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }

  openSubcategory(categoryId: number, categoryName: string) {
    this.router.navigate(['/subcategory', categoryId], {
      queryParams: { name: categoryName }
    });
  }

  goToCart() { this.router.navigate(['/cart']); }
  goToOrders() { this.router.navigate(['/orders']); }
  goHome() { this.router.navigate(['/']); }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.userName = '';
    alert('Logged out successfully');
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ItemsDto } from '../items/items.dto';
import { CreateOrderDto } from '../orders/create-order.dto';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {

  cart: { [key: number]: number } = {};
  items: ItemsDto[] = [];
  totalAmount = 0;
  cartCount = 0;
  gstAmount = 0;
  finalAmount = 0;
  showSuccessPopup = false;

  constructor(
  private router: Router,
  private apiService: ApiService
) {}

  ngOnInit() {
    this.loadCart();

    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('items_')) {
        const data = JSON.parse(localStorage.getItem(key)!);
        this.items.push(...data);
      }
    });

    // ✅ apply cart quantities to items on load
    this.items.forEach(item => {
      item.quantity = this.cart[item.id] || 0;
    });

    this.calculateTotal();
  }

  loadCart() {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : {};
    this.updateCartCount();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getCartItems(): ItemsDto[] {
    return this.items.filter(item => this.cart[item.id] > 0);
  }

  increase(item: ItemsDto) {
    this.cart[item.id]++;
    item.quantity = this.cart[item.id]; // ✅ keep in sync
    this.afterUpdate();
  }

  decrease(item: ItemsDto) {
    this.cart[item.id]--;
    if (this.cart[item.id] <= 0) {
      delete this.cart[item.id];
      item.quantity = 0; // ✅ keep in sync
    } else {
      item.quantity = this.cart[item.id]; // ✅ keep in sync
    }
    this.afterUpdate();
  }
  remove(item: ItemsDto) {
    item.quantity = 0; // ✅ keep in sync
    delete this.cart[item.id];
    this.afterUpdate();
  }
  afterUpdate() {
    this.saveCart();
    this.updateCartCount();
    this.calculateTotal();
  }
  updateCartCount() {
    this.cartCount = Object.values(this.cart).reduce(
      (sum: number, qty: any) => sum + Number(qty), 0
    );
  }
  calculateTotal() {
    // ✅ use this.cart[item.id] as source of truth
    this.totalAmount = this.getCartItems().reduce(
    (sum: number, item: ItemsDto) => {
      const qty = this.cart[item.id] || 0;
      return sum + (item.price * qty);
    },0);

    // 5% GST
    this.gstAmount = parseFloat((this.totalAmount * 0.05).toFixed(2));

    // FINAL AMOUNT
    this.finalAmount = this.totalAmount + this.gstAmount;
  }
  placeOrderForItem(item: ItemsDto) {
  const customerId = localStorage.getItem('customerId');

  if (!customerId) {
    alert('Please login first');
    return;
  }

  // ✅ immediately update UI
  delete this.cart[item.id];
  item.quantity = 0;
  this.afterUpdate();
  this.showSuccessPopup = true;

  const orderData: CreateOrderDto = {
    customerId: Number(customerId),
    itemId: item.id
  };
  this.apiService.createOrder(orderData).subscribe({
  next: () => {

      console.log('Order placed for item:', item.id);

      //  FORCE ORDERS PAGE REFRESH
      // this.router.navigateByUrl('/orders', { skipLocationChange: true }).then(() => {
      //   this.router.navigate(['/orders']);
      // });
    },
    error: (error) => {
      console.log(error);
    }
  });
}
  // goBack() {
  //   this.router.navigate(['/']);
  // }
}
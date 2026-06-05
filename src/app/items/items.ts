import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { ItemsDto } from '../items/items.dto';
import { Subcategory } from '../subcategory/subcategory';

@Component({
  selector: 'items-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './items.html',
  styleUrls: ['./items.css']
})
export class Items implements OnInit {

  items: ItemsDto[] = [];
  subcategoryId!: number;
  subcategoryName = '';
  cart: { [key: number]: number } = {};
  

  get cartCount(): number {
  return Navbar.cartCount;
}
get totalAmount(): number {
  return Subcategory.totalAmount;
}

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.subcategoryId = Number(params.get('id'));
      this.subcategoryName =
        this.route.snapshot.queryParamMap.get('name') || '';

      this.loadCart();

      const storedItems =
        localStorage.getItem(`items_${this.subcategoryId}`);

      if (storedItems) {
        this.items = JSON.parse(storedItems);
        this.items.forEach(item => {
          item.quantity = this.cart[item.id] || 0;
        });
        this.restoreTotalFromCart();
      }

      this.getItems();
    });
  }

  getItems() {
  this.apiService
    .getItemsBySubcategory(this.subcategoryId)
    .subscribe({
    next: (response: ItemsDto[]) => {
      // ✅ merge fresh data with current cart quantities
      this.items = response.map((freshItem:ItemsDto) => ({
        ...freshItem,
        quantity: this.cart[freshItem.id] || 0 // always from cart
      }));

      localStorage.setItem(`items_${this.subcategoryId}`,
        JSON.stringify(this.items));

      this.restoreTotalFromCart();
      console.log(this.items);
    },
    error: (error) => {
      console.log(error);
    }
  });
}

  restoreTotalFromCart() {
    const storedCart = localStorage.getItem('cart');
    let cart: any = {};
    try {
      cart = storedCart ? JSON.parse(storedCart) : {};
    } catch (e) {
      cart = {};
    }

    let total = 0;
    // loop ALL subcategory items, not just this.items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('items_')) {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        items.forEach((item: any) => {
          const qty = cart[item.id] || 0;
          total += qty * item.price;
        });
    }
  });
  Subcategory.totalAmount = total;
}
//   addItem(item: any) {

//   if (!this.cart[item.id]) {
//     this.cart[item.id] = 0;
//   }

//   this.cart[item.id]++;

//   item.quantity = this.cart[item.id];

//   Items.totalAmount += item.price;
//   Navbar.cartCount++;

//   this.saveCart();
// }
  addItem(item: ItemsDto) {

    this.cart[item.id] = (this.cart[item.id] || 0) + 1;

    const index =
      this.items.findIndex((i: ItemsDto)=> i.id === item.id);

    if (index !== -1) {

      this.items[index] = {
        ...this.items[index],
        quantity: this.cart[item.id]
      };

      this.items = [...this.items];
    }

    Subcategory.totalAmount += Number(item.price);
    Navbar.cartCount++;

    this.saveCart();
  }

  increaseQuantity(item: ItemsDto) {
    if (!this.cart[item.id]) {
      this.cart[item.id] = 0;
    }
    this.cart[item.id]++;
    item.quantity = this.cart[item.id];
    Subcategory.totalAmount += item.price;
    Navbar.cartCount += 1;
    this.saveCart();
  }

  decreaseQuantity(item: ItemsDto) {
    if (!this.cart[item.id]) return;
    this.cart[item.id]--;
    if (this.cart[item.id] <= 0) {
      delete this.cart[item.id];
      item.quantity = 0;
    } else {
      item.quantity = this.cart[item.id];
    }
    Subcategory.totalAmount -= item.price;
    Navbar.cartCount -= 1;
    this.saveCart();
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  loadCart() {

    const storedCart = localStorage.getItem('cart');

    try {

      this.cart = storedCart
        ? JSON.parse(storedCart)
        : {};

    } catch (e) {

      this.cart = {};
    }

    // RESTORE CART COUNT
    Navbar.cartCount = Object.values(this.cart)
      .reduce((sum: number, qty: any) => {

        const num = Number(qty);

        return sum + (isNaN(num) ? 0 : num);

      }, 0);
}
  goToCart() {
    this.router.navigate(['/cart']);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Items } from '../items/items';
import { Navbar } from '../navbar/navbar';
import { SubCategoryDto } from '../subcategory/subcategory.dto';

@Component({
  //selector: 'app-subcategory',
  selector: 'subcategory-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subcategory.html',
  styleUrls: ['./subcategory.css']
})
export class Subcategory implements OnInit {

  subcategories: SubCategoryDto[] = [];
  categoryId!: number;
  categoryName = '';
  
  static totalAmount = 0;

get totalAmount(): number {
  return Subcategory.totalAmount;
}
  get cartCount(): number {
    return Navbar.cartCount;
  }

  constructor(
  private apiService: ApiService,
  private route: ActivatedRoute,
  private router: Router
) {}

  openItems(subcategoryId: number, subcategoryName: string) {

  this.router.navigate(
    ['/items', subcategoryId],
    {
      queryParams: {
        name: subcategoryName
      }
    }
  );
}

ngOnInit() {

  this.route.paramMap.subscribe(params => {

    this.categoryId = Number(params.get('id'));

    this.categoryName = this.route.snapshot.queryParamMap.get('name') || '';

    const storedSubcategories =
      localStorage.getItem(`subcategories_${this.categoryId}`);

    if (storedSubcategories) {

      this.subcategories = JSON.parse(storedSubcategories) as SubCategoryDto[];
    }
    // this.updateBottomBar();
    this.getSubcategories();
    // this.updateCartCount();
  });
}

  getSubcategories() {

    this.apiService
    .getSubcategories(this.categoryId)
    .subscribe({

      next: (response: SubCategoryDto[]) => {

        console.log(response);

        this.subcategories = response;

        localStorage.setItem(`subcategories_${this.categoryId}`,JSON.stringify(response)
  );
},

      error: (error) => {
        console.log(error);
      }
    });
  }
//   updateBottomBar() {
//   const storedCart = localStorage.getItem('cart');
//   const cart = storedCart ? JSON.parse(storedCart) : {};
//   this.cartCount = Object.values(cart)
//     .reduce((sum: number, qty: any) => {
//       return sum + Number(qty);
//     }, 0);
   // this.calculateTotal(cart);
// }

// calculateTotal(cart: any) {

//   let total = 0;

//   Object.keys(cart).forEach(itemId => {

//     const qty = cart[itemId];

//     // search all stored items
//     Object.keys(localStorage).forEach(key => {

//       if (key.startsWith('items_')) {

//         const items =
//           JSON.parse(localStorage.getItem(key) || '[]');

//         const foundItem = items.find(
//           (item: any) => item.id == itemId
//         );

//         if (foundItem) {
//           total += foundItem.price * qty;
//         }
//       }
//     });
//   });

//   this.totalAmount = total;
// }
goToCart() {
  this.router.navigate(['/cart']);
}
// updateCartCount() {
//   const storedCart = localStorage.getItem('cart');

//   let cart: { [key: number]: number } = {};

//   try {
//     cart = storedCart ? JSON.parse(storedCart) : {};
//   } catch (e) {
//     cart = {};
//   }

//   // Guard against null/undefined/non-numeric values
//   this.cartCount = Object.values(cart).reduce((sum: number, qty: any) => {
//     const num = Number(qty);
//     return sum + (isNaN(num) ? 0 : num);
//   }, 0);
// }
}
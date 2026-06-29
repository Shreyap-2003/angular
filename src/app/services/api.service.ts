import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryDto } from '../home/category.dto';
import { ItemsDto } from '../items/items.dto';
import { OrderDto } from '../orders/order.dto';
import { UserDto } from '../profile/user.dto';
import { SubCategoryDto } from '../subcategory/subcategory.dto';
import { CreateOrderDto } from '../orders/create-order.dto';
import { RegisterDto } from '../navbar/register.dto';
<<<<<<< HEAD
import { map } from 'rxjs/operators';
=======
>>>>>>> 6bb2641fbd0d318e91895ad44f9512cc0918dbef

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // private baseUrl = '/api';
  // private authUrl = '/application/auth';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>('/api/category');
}

  getItemsBySubcategory(subcategoryId: number): Observable<ItemsDto[]> {
    return this.http.get<ItemsDto[]>(`/api/items/subcategory/${subcategoryId}`);
  }

  getOrders(): Observable<OrderDto[]> {
<<<<<<< HEAD
    return this.http.get<OrderDto[]>('/api/orders/all');
=======
    return this.http.get<OrderDto[]>('/api/orders');
>>>>>>> 6bb2641fbd0d318e91895ad44f9512cc0918dbef
  }

  getItems(): Observable<ItemsDto[]> {
    return this.http.get<ItemsDto[]>('/api/items');
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>('/api/user');
  }

<<<<<<< HEAD
  getPartnerCompletedOrders(partnerId: number): Observable<any[]> {
  return this.http.get<any>(`/api/orders/partner/${partnerId}/completed-orders`).pipe(
    map(response => {
      if (response && response.content) {
        return response.content;
      }
      return response;
    })
  );
}
=======
  getPartnerCompletedOrders(partnerId: number): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`/api/orders/partner/${partnerId}/completed-orders`);
  }
>>>>>>> 6bb2641fbd0d318e91895ad44f9512cc0918dbef

  getUserById(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`/api/user/id/${userId}`);
  }

  assignPartner(id: number,partnerId: number): Observable<OrderDto> {

    return this.http.put<OrderDto>(
      `/api/orders/${id}/assign-partner/${partnerId}`,
      {}
    );
  }

  completeOrder(id: number,partnerId: number): Observable<OrderDto> {

    return this.http.put<OrderDto>(`/api/orders/${id}/complete?partnerId=${partnerId}`,
      {}
    );
  }

  getSubcategories(categoryId: number): Observable<SubCategoryDto[]> {

    return this.http.get<SubCategoryDto[]>(`/api/subcategory/category/${categoryId}`);
  }

  createOrder(orderData: CreateOrderDto): Observable<OrderDto> {
    return this.http.post<OrderDto>('/api/orders',orderData);
  }

  login(loginData: {
    phoneNumber: string;
    password: string;
  }): Observable<HttpResponse<any>> {

    return this.http.post<any>('/application/auth/login',
      loginData,
      {
        observe: 'response'
      }
    );
  }
  register(userData: RegisterDto): Observable<void> {
  return this.http.post<void>('/api/users', userData);
}
}
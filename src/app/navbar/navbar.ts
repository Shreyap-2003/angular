import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { RegisterDto } from './register.dto';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar implements OnInit {
  
  phoneNumber = '';
  password = '';
  userName = '';
  userType = '';
  showLogin = false;
  showDropdown = false;
  showRegister = false;
  firstName = '';
  lastName = '';
  registerPhone = '';
  registerPassword = '';
  registerUserType = '';
  // address = '';
  registerLat = 0;
  registerLng = 0;
  showToast = false;
  isRegistering = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  static cartCount = 0;

  get cartCount(): number {
    return Navbar.cartCount;
  }

  ngOnInit() {
    this.userType = localStorage.getItem('userType') || '';
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      this.userName = storedUserName;
    }
    this.restoreCartCount();
  }

  restoreCartCount() {
    const storedCart = localStorage.getItem('cart');
    try {
      const cart = storedCart ? JSON.parse(storedCart) : {};
      Navbar.cartCount = Object.values(cart).reduce((sum: number, qty: any) => {
        const num = Number(qty);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    } catch (e) {
      Navbar.cartCount = 0;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('customerId');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('partnerOrders');
    localStorage.removeItem('partnerCustomerMap');
    this.userName = '';
    this.showDropdown = false;
    this.router.navigate(['/']);
  }

  openLogin() {
    this.showLogin = true;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  goToProfile() {
    this.showDropdown = false;
    this.router.navigate(['/profile']);
  }

  goToOrders() {
    this.showDropdown = false;
    this.router.navigate(['/orders']);
  }

  goToCompletedOrders() {
    this.showDropdown = false;
    this.router.navigate(['/partner-completed-orders']);
  }

  goHome() {
    const role = localStorage.getItem('userType');
    if (role === 'CUSTOMER') {
      this.router.navigate(['/']);
    }
  }
  phoneError = '';
passwordError = '';
Error='';


  login() {
    this.phoneError = '';
  this.passwordError = '';
  this.Error='';

  if (!this.phoneNumber) {
    this.phoneError = 'Phone number is required';
  }
  if (!this.password) {
    this.passwordError = 'Password is required';
  }
  if (this.phoneError || this.passwordError) return;

    const loginData = {
      phoneNumber: this.phoneNumber,
      password: this.password
    };

    this.apiService.login(loginData).subscribe({
      next: (response: any) => {
        const token = response.headers.get('X-Auth-Token');
        if (token) {
          localStorage.setItem('token', token);
        }
        this.userName = response.body.name;
        this.userType = response.body.userType;
        localStorage.setItem('userName', this.userName);
        localStorage.setItem('customerId', response.body.customerId);
        localStorage.setItem('userType', response.body.userType);

        if (response.body.userType === 'PARTNER') {
          this.router.navigate(['/partner-dashboard']);
        } else {
          this.router.navigate(['/']);
        }
        this.showLogin = false;

        this.apiService.getUserById(response.body.customerId).subscribe({
          next: (userResponse) => {
            localStorage.setItem('user', JSON.stringify(userResponse));
          },
          error: (err) => console.log(err)
        });

        this.restoreCartCount();
      },
      error: () => {
        this.Error = 'Invalid phone number or password';
        this.cdr.detectChanges();
      }
    });
  }

  openRegister() {
    this.showLogin = false;
    this.showRegister = true;
    this.captureLocation();  // ← capture location when form opens
  }

  captureLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.registerLat = position.coords.latitude;
        this.registerLng = position.coords.longitude;
        console.log('Location captured:', this.registerLat, this.registerLng);
      },
      (error) => {
        console.log('Location error:', error);
      }
    );
  }

  backToLogin() {
    this.showRegister = false;
    this.showLogin = true;
  }
registerError = '';
registerPasswordError = '';

  register() {
    
    this.registerError = '';
  this.registerPasswordError = '';

  if (this.registerPassword.length < 5) {
    this.registerPasswordError = 'Password must be at least 5 characters';
    return;
  }
  if (!this.firstName || !this.registerPhone || !this.registerPassword || !this.registerUserType) {
    this.registerError = 'Please fill all required fields';
    return;
  }
    if (this.isRegistering) return;
    this.isRegistering = true;

    const userData: RegisterDto = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.registerPhone,
      password: this.registerPassword,
      userType: this.registerUserType,
      // address: this.address,
      latitude: this.registerLat,
      longitude: this.registerLng
    };

    this.apiService.register(userData).subscribe({
      next: () => {
        this.isRegistering = false;
        this.showRegister = false;
        this.showToast = true;
        this.cdr.detectChanges();
        setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 2000);

    setTimeout(() => {
      this.showLogin = true;
      this.cdr.detectChanges();
    }, 2150);
      },
      error: (err) => {
        this.isRegistering = false;
        this.cdr.detectChanges();
        console.log('Registration error:', err.error);
        alert(err.error?.detail || 'Registration failed. Try again.');
      }
    });
  }
  allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.charCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
showPassword = false;
showRegisterPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}
toggleRegisterPassword() {
  this.showRegisterPassword = !this.showRegisterPassword;
}
}
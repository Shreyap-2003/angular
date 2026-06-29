import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Items } from './items/items';
import { Subcategory } from './subcategory/subcategory';
import { Cart } from './cart/cart';
import { Profile } from './profile/profile';
import { Orders } from './orders/orders';
import { PartnerDashboard } from './partner-dashboard/partner-dashboard';
import {PartnerCompletedOrders} from './partner-completed-orders/partner-completed-orders';
import { OrderDetail } from './order-detail/order-detail';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'subcategory/:id',
    component: Subcategory
  },

  {
  path: 'items/:id',
  component: Items
},
{
  path: 'cart',
  component: Cart
},
{
  path: 'profile',
  component: Profile
},
{
  path: 'orders',
  component: Orders
},
{
  path: 'partner-dashboard',
  component: PartnerDashboard
},
{
  path: 'partner-completed-orders',
  component: PartnerCompletedOrders
},
{ path: 'order-detail', component: OrderDetail }

];
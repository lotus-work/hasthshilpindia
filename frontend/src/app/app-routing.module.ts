import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TermsOfServiceComponent } from './components/user/terms-of-service/terms-of-service.component';
import { HomeComponent } from './components/user/home/home.component';
import { PrivacyPolicyComponent } from './components/user/privacy-policy/privacy-policy.component';
import { RefundReturnsComponent } from './components/user/refund-returns/refund-returns.component';
import { ShippingPloicyComponent } from './components/user/shipping-ploicy/shipping-ploicy.component';
import { CartComponent } from './components/user/cart/cart.component';
import { WishlistComponent } from './components/user/wishlist/wishlist.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegisterComponent } from './components/user/register/register.component';
import { MyaccountComponent } from './components/user/myaccount/myaccount.component';
import { DetailsComponent } from './components/user/product/details/details.component';
import { AuthGuardService } from './services/auth.guard/auth.guard.service';
import { CategoriesComponent } from './components/user/categories/categories.component';
import { ShippingComponent } from './components/user/shipping/shipping.component';
import { AdLoginComponent } from './components/admin/ad-login/ad-login.component';
import { AdDashboardComponent } from './components/admin/ad-dashboard/ad-dashboard.component';
import { AdCustomersComponent } from './components/admin/ad-customers/ad-customers.component';
import { AdProductListComponent } from './components/admin/ad-product-list/ad-product-list.component';
import { AdAddProductsComponent } from './components/admin/ad-add-products/ad-add-products.component';
import { AdBrandComponent } from './components/admin/ad-brand/ad-brand.component';
import { AdBrandListComponent } from './components/admin/ad-brand-list/ad-brand-list.component';
import { AdCategoryComponent } from './components/admin/ad-category/ad-category.component';
import { AdCategoryListComponent } from './components/admin/ad-category-list/ad-category-list.component';
import { AdEnquiresComponent } from './components/admin/ad-enquires/ad-enquires.component';
import { AdOrdersComponent } from './components/admin/ad-orders/ad-orders.component';
import { MyordersComponent } from './components/user/myorders/myorders.component';
import { ForgetpasswordComponent } from './components/user/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/user/resetpassword/resetpassword.component';
import { ContactUsComponent } from './components/user/contact-us/contact-us.component';
import { AdOrderDetailsComponent } from './components/admin/ad-order-details/ad-order-details.component';
import { AdTypesComponent } from './components/admin/ad-types/ad-types.component';
import { AdTypesListComponent } from './components/admin/ad-types-list/ad-types-list.component';
import { AdEditProductsComponent } from './components/admin/ad-edit-products/ad-edit-products.component';
import { AdEditUserComponent } from './components/admin/ad-edit-user/ad-edit-user.component';
import { AdSettingsComponent } from './components/admin/ad-settings/ad-settings.component';
import { AdminAuthGuardService } from './services/admin.auth.guard/admin.auth.guard.service';

const routes: Routes = [
  {path:"", component: HomeComponent},
  {path:"login", component: LoginComponent},
  {path:"register", component: RegisterComponent},
  { path: 'categories', component: CategoriesComponent },
  {path:"details/:id", component: DetailsComponent},
  {path:"myprofile", component: MyaccountComponent, canActivate: [AuthGuardService]},
  {path: "myorders", component: MyordersComponent},
  {path:"wishlist", component: WishlistComponent, canActivate: [AuthGuardService]},
  {path:"checkout/cart", component: CartComponent, canActivate: [AuthGuardService]},
  {path:"checkout/shipping", component: ShippingComponent},
  {path:"forgot-password", component: ForgetpasswordComponent},
  {path:"reset-password/:token", component: ResetpasswordComponent},
  {path:"terms-of-service", component: TermsOfServiceComponent},
  {path:"privacy-policy", component: PrivacyPolicyComponent},
  {path:"refund-returns", component: RefundReturnsComponent},
  {path:"shipping-policy", component: ShippingPloicyComponent},
  {path:"contactus", component: ContactUsComponent},

  {path: "admin/dashboard", component: AdDashboardComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/login", component: AdLoginComponent},
  {path: "admin/customers", component: AdCustomersComponent, canActivate: [AdminAuthGuardService] },
  {path: "admin/edit/customer/:id", component: AdEditUserComponent , canActivate: [AdminAuthGuardService]},
  {path: "admin/products/list", component: AdProductListComponent , canActivate: [AdminAuthGuardService]},
  {path: "admin/products/add", component: AdAddProductsComponent , canActivate: [AdminAuthGuardService]},
  {path: "admin/products/edit/:id", component: AdEditProductsComponent , canActivate: [AdminAuthGuardService]},
  {path: "admin/brand", component: AdBrandComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/brand/list", component: AdBrandListComponent , canActivate: [AdminAuthGuardService]},
  {path: "admin/category", component: AdCategoryComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/category/list", component: AdCategoryListComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/types", component: AdTypesComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/types/list", component: AdTypesListComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/enquires", component: AdEnquiresComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/orders", component: AdOrdersComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/order/details/:id", component: AdOrderDetailsComponent, canActivate: [AdminAuthGuardService]},
  {path: "admin/settings", component: AdSettingsComponent, canActivate: [AdminAuthGuardService]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

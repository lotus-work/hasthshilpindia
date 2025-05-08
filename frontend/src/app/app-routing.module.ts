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
  { path: "", component: HomeComponent, title: "Hasthshilp" },
  { path: "login", component: LoginComponent, title: "Hasthshilp : Login" },
  { path: "register", component: RegisterComponent, title: "Hasthshilp : Register" },
  { path: "categories", component: CategoriesComponent, title: "Hasthshilp : Categories" },
  { path: "details/:id", component: DetailsComponent, title: "Hasthshilp : Product Details" },
  { path: "myprofile", component: MyaccountComponent, title: "Hasthshilp : My Profile", canActivate: [AuthGuardService] },
  { path: "myorders", component: MyordersComponent, title: "Hasthshilp : My Orders" },
  { path: "wishlist", component: WishlistComponent, title: "Hasthshilp : Wishlist", canActivate: [AuthGuardService] },
  { path: "checkout/cart", component: CartComponent, title: "Hasthshilp : Your Cart", canActivate: [AuthGuardService] },
  { path: "checkout/shipping", component: ShippingComponent, title: "Hasthshilp : Shipping" },
  { path: "forgot-password", component: ForgetpasswordComponent, title: "Hasthshilp : Forgot Password" },
  { path: "reset-password/:token", component: ResetpasswordComponent, title: "Hasthshilp : Reset Password" },
  { path: "terms-of-service", component: TermsOfServiceComponent, title: "Hasthshilp : Terms of Service" },
  { path: "privacy-policy", component: PrivacyPolicyComponent, title: "Hasthshilp : Privacy Policy" },
  { path: "refund-returns", component: RefundReturnsComponent, title: "Hasthshilp : Refund and Returns" },
  { path: "shipping-policy", component: ShippingPloicyComponent, title: "Hasthshilp : Shipping Policy" },
  { path: "contactus", component: ContactUsComponent, title: "Hasthshilp : Contact Us" },
  
  // Admin Routes
  { path: "admin/dashboard", component: AdDashboardComponent, title: "Hasthshilp : Admin Dashboard", canActivate: [AdminAuthGuardService] },
  { path: "admin/login", component: AdLoginComponent, title: "Hasthshilp : Admin Login" },
  { path: "admin/customers", component: AdCustomersComponent, title: "Hasthshilp : Admin Customers", canActivate: [AdminAuthGuardService] },
  { path: "admin/edit/customer/:id", component: AdEditUserComponent, title: "Hasthshilp : Edit Customer", canActivate: [AdminAuthGuardService] },
  { path: "admin/products/list", component: AdProductListComponent, title: "Hasthshilp : Product List", canActivate: [AdminAuthGuardService] },
  { path: "admin/products/add", component: AdAddProductsComponent, title: "Hasthshilp : Add Product", canActivate: [AdminAuthGuardService] },
  { path: "admin/products/edit/:id", component: AdEditProductsComponent, title: "Hasthshilp : Edit Product", canActivate: [AdminAuthGuardService] },
  { path: "admin/brand", component: AdBrandComponent, title: "Hasthshilp : Add Brand", canActivate: [AdminAuthGuardService] },
  { path: "admin/brand/list", component: AdBrandListComponent, title: "Hasthshilp : Brand List", canActivate: [AdminAuthGuardService] },
  { path: "admin/category", component: AdCategoryComponent, title: "Hasthshilp : Add Category", canActivate: [AdminAuthGuardService] },
  { path: "admin/category/list", component: AdCategoryListComponent, title: "Hasthshilp : Category List", canActivate: [AdminAuthGuardService] },
  { path: "admin/types", component: AdTypesComponent, title: "Hasthshilp : Add Types", canActivate: [AdminAuthGuardService] },
  { path: "admin/types/list", component: AdTypesListComponent, title: "Hasthshilp : Types List", canActivate: [AdminAuthGuardService] },
  { path: "admin/enquires", component: AdEnquiresComponent, title: "Hasthshilp : Admin Enquiries", canActivate: [AdminAuthGuardService] },
  { path: "admin/orders", component: AdOrdersComponent, title: "Hasthshilp : Admin Orders", canActivate: [AdminAuthGuardService] },
  { path: "admin/order/details/:id", component: AdOrderDetailsComponent, title: "Hasthshilp : Order Details", canActivate: [AdminAuthGuardService] },
  { path: "admin/settings", component: AdSettingsComponent, title: "Hasthshilp : Admin Settings", canActivate: [AdminAuthGuardService] },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

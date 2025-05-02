import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TermsOfServiceComponent } from './components/user/terms-of-service/terms-of-service.component';
import { RefundReturnsComponent } from './components/user/refund-returns/refund-returns.component';
import { PrivacyPolicyComponent } from './components/user/privacy-policy/privacy-policy.component';
import { MyaccountComponent } from './components/user/myaccount/myaccount.component';
import { RegisterComponent } from './components/user/register/register.component';
import { LoginComponent } from './components/user/login/login.component';
import { FooterComponent } from './components/user/footer/footer.component';
import { NavbarComponent } from './components/user/navbar/navbar.component';
import { HomeComponent } from './components/user/home/home.component';
import { ShippingPloicyComponent } from './components/user/shipping-ploicy/shipping-ploicy.component';
import { ContactUsComponent } from './components/user/contact-us/contact-us.component';
import { FeaturesComponent } from './components/user/features/features.component';
import { WishlistComponent } from './components/user/wishlist/wishlist.component';
import { CartComponent } from './components/user/cart/cart.component';
import { ShopComponent } from './components/user/shop/shop.component';
import { CategoriesComponent } from './components/user/categories/categories.component';
import { FeaturedProductsComponent } from './components/user/featured-products/featured-products.component';
import { FlashSaleComponent } from './components/user/flash-sale/flash-sale.component';
import { CountdownModule } from 'ngx-countdown';
import { ExploreMoreComponent } from './components/user/explore-more/explore-more.component';
import { SuggestedProductsComponent } from './components/user/suggested-products/suggested-products.component';
import { NewArrivalsComponent } from './components/user/new-arrivals/new-arrivals.component';
import { HeaderCouponComponent } from './components/user/header-coupon/header-coupon.component';
import { DetailsComponent } from './components/user/product/details/details.component';
import { DescriptionComponent } from './components/user/product/description/description.component';
import { ReviewsComponent } from './components/user/product/reviews/reviews.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToastModule } from "ng-angular-popup";
import { NgxSpinnerModule } from 'ngx-spinner';
import { PopularProductsComponent } from './components/user/popular-products/popular-products.component';
import { SpecialProductsComponent } from './components/user/special-products/special-products.component';
import { PopularCategoriesComponent } from './components/user/popular-categories/popular-categories.component';
import { ShippingComponent } from './components/user/shipping/shipping.component';
import { AdLoginComponent } from './components/admin/ad-login/ad-login.component';
import { AdDashboardComponent } from './components/admin/ad-dashboard/ad-dashboard.component';
import { AdCustomersComponent } from './components/admin/ad-customers/ad-customers.component';
import { AdAddProductsComponent } from './components/admin/ad-add-products/ad-add-products.component';
import { AdProductListComponent } from './components/admin/ad-product-list/ad-product-list.component';
import { AdBrandComponent } from './components/admin/ad-brand/ad-brand.component';
import { AdBrandListComponent } from './components/admin/ad-brand-list/ad-brand-list.component';
import { AdCategoryComponent } from './components/admin/ad-category/ad-category.component';
import { AdCategoryListComponent } from './components/admin/ad-category-list/ad-category-list.component';
import { AdOrdersComponent } from './components/admin/ad-orders/ad-orders.component';
import { AdEnquiresComponent } from './components/admin/ad-enquires/ad-enquires.component';
import { AdNavbarComponent } from './components/admin/ad-navbar/ad-navbar.component';
import { DataTablesModule } from 'angular-datatables';
import { MyordersComponent } from './components/user/myorders/myorders.component';
import { ForgetpasswordComponent } from './components/user/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './components/user/resetpassword/resetpassword.component';
import { AdOrderDetailsComponent } from './components/admin/ad-order-details/ad-order-details.component';
import { AdTypesComponent } from './components/admin/ad-types/ad-types.component';
import { AdTypesListComponent } from './components/admin/ad-types-list/ad-types-list.component';
import { AdEditProductsComponent } from './components/admin/ad-edit-products/ad-edit-products.component';
import { QuillModule } from 'ngx-quill';
import { AdEditUserComponent } from './components/admin/ad-edit-user/ad-edit-user.component';
import { AdSettingsComponent } from './components/admin/ad-settings/ad-settings.component';
import { AdAnalyticsComponent } from './components/admin/ad-analytics/ad-analytics.component';
@NgModule({
  declarations: [
    AppComponent,
    TermsOfServiceComponent,
    RefundReturnsComponent,
    PrivacyPolicyComponent,
    MyaccountComponent,
    RegisterComponent,
    LoginComponent,
    FooterComponent,
    NavbarComponent,
    HomeComponent,
    ShippingPloicyComponent,
    ContactUsComponent,
    FeaturesComponent,
    WishlistComponent,
    CartComponent,
    ShopComponent,
    CategoriesComponent,
    FeaturedProductsComponent,
    FlashSaleComponent,
    ExploreMoreComponent,
    SuggestedProductsComponent,
    NewArrivalsComponent,
    HeaderCouponComponent,
    DetailsComponent,
    DescriptionComponent,
    ReviewsComponent,
    PopularProductsComponent,
    SpecialProductsComponent,
    PopularCategoriesComponent,
    ShippingComponent,
    AdLoginComponent,
    AdDashboardComponent,
    AdCustomersComponent,
    AdAddProductsComponent,
    AdProductListComponent,
    AdBrandComponent,
    AdBrandListComponent,
    AdCategoryComponent,
    AdCategoryListComponent,
    AdOrdersComponent,
    AdEnquiresComponent,
    AdNavbarComponent,
    MyordersComponent,
    ForgetpasswordComponent,
    ResetpasswordComponent,
    AdOrderDetailsComponent,
    AdTypesComponent,
    AdTypesListComponent,
    AdEditProductsComponent,
    AdEditUserComponent,
    AdSettingsComponent,
    AdAnalyticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CountdownModule ,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgToastModule,
    DataTablesModule,
    NgToastModule ,
    QuillModule.forRoot()
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideClientHydration(),
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

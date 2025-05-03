import { Component, Input } from '@angular/core';
import { ProductService } from '../../../../services/product/product.service';
import { Router } from '@angular/router';

declare var bootstrap: any; // Bootstrap modal

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() ratings: any[] = [];
  @Input() totalRating: number = 0;
  @Input() userData: any;
  @Input() productId: any;
  

  editReview: any = { star: 0, comment: '', reviewId: null };
  starsArray = [1, 2, 3, 4, 5];
  hoverValue = 0;
  token : any ;
  constructor(private productService: ProductService, public router: Router) {}

  ngOnInit(): void {
  this.token = localStorage.getItem('token') || '';
  }
  
  userHasReviewed(): boolean {
    return this.ratings.some(review => review.postedby === this.userData._id);
  }

  getStarArray(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (halfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
  }

  // Open modal and prefill data
  openEditModal(rating: any) {
    this.editReview = { ...rating }; // clone the rating to edit
    this.hoverValue = 0;
    const modalElement = document.getElementById('editReviewModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  // Star hover
  hoverStars(value: number) {
    this.hoverValue = value;
  }

  // Select star rating
  selectStar(value: number) {
    this.editReview.star = value;
  }

  // Submit updated review
  submitReview(): void {
    if (!this.editReview.star || !this.editReview.comment.trim()) {
      alert('Please give a rating and add a comment before submitting.');
      return;
    }

    this.productService.updateProductRating(
      this.productId,
      this.editReview.star,
      this.editReview.comment,
      this.token
    ).subscribe({
      next: (response) => {
        console.log('Review submitted!', response);
        alert('Your review has been added, thanks!');
        this.closeModal();
        window.location.reload();
      },
      error: (error) => {
        console.error('Failed to submit review', error);
        alert('Something went wrong while submitting your review.');
      }
    });
  }
  closeModal(): void {
    const modal = document.getElementById('editReviewModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();
    }
  }

  openReviewModal(event: Event): void {

    if(this.token == ''){
      alert("Please login to add a review");
      this.router.navigate(['login']);
      return;
    }
    
    event.preventDefault();
  
    // Reset for new review
    this.editReview = {
      star: 0,
      comment: ''
    };
  
    const modal = new bootstrap.Modal(document.getElementById('editReviewModal'));
    modal.show();
  }

  // Calculate new average rating (optional)
  calculateTotalRating(): number {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((sum, r) => sum + r.star, 0);
    return parseFloat((total / this.ratings.length).toFixed(1));
  }
}  

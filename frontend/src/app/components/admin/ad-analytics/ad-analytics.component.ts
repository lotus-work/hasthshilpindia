import { OnInit, Component } from '@angular/core';
import { AdminOrdersService } from '../../../services/admin.orders/admin-orders.service';

@Component({
  selector: 'app-ad-analytics',
  templateUrl: './ad-analytics.component.html',
  styleUrls: ['./ad-analytics.component.css']
})
export class AdAnalyticsComponent implements OnInit {

  apiResponse: any[] = [];
  availableYears = [2025, 2024, 2023, 2022];
  selectedYear = 2025;
  
  totalIncome = 0;
  totalSales = 0;

  monthsOrder = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  incomeChart: any;
  salesChart: any;

  constructor(private adminOrdersService: AdminOrdersService) { }

  ngOnInit() {
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    // No need to send year anymore — get everything once
    this.adminOrdersService.getOrderAnalytics(this.selectedYear).subscribe(
      (response: any[]) => {
        this.apiResponse = response;
        console.log(this.apiResponse);
        this.updateDashboard(); 
      },
      (error) => {
        console.error('Error fetching analytics:', error);
      }
    );
  }

  onYearChange() {
    this.fetchAnalytics();
  }

  updateDashboard() {
  // const filteredData = this.apiResponse.filter(item => item._id.year === this.selectedYear);

    const filteredData = this.apiResponse.filter(item => 
      Number(item._id?.year) === Number(this.selectedYear)
    );
    console.log(filteredData);
    const incomeData: number[] = [];
    const salesData: number[] = [];
    const labels: string[] = [];

    this.monthsOrder.forEach(month => {
      const monthData = filteredData.find(item => item._id.month === month);
      incomeData.push(monthData?.amount || 0);
      salesData.push(monthData?.count || 0);
      labels.push(month);
    });

    this.totalIncome = incomeData.reduce((a, b) => a + b, 0);
    this.totalSales = salesData.reduce((a, b) => a + b, 0);

    console.log(labels, incomeData, salesData);
    this.renderCharts(labels, incomeData, salesData);
  }

  renderCharts(labels: string[], incomeData: number[], salesData: number[]) {
    // Destroy existing charts if they exist
    if (this.incomeChart) {
      this.incomeChart.destroy();
      this.incomeChart = null;
    }
    if (this.salesChart) {
      this.salesChart.destroy();
      this.salesChart = null;
    }
  
    // Completely reset the canvas elements before re-rendering charts
    const incomeCanvas = document.getElementById('incomeChart') as HTMLCanvasElement;
    const salesCanvas = document.getElementById('salesChart') as HTMLCanvasElement;
  
    if (incomeCanvas) {
      const parent = incomeCanvas.parentNode;
      incomeCanvas.remove();  // Remove the old canvas
      const newIncomeCanvas = document.createElement('canvas');
      newIncomeCanvas.id = 'incomeChart';
      parent?.appendChild(newIncomeCanvas); // Append a fresh canvas
    }
  
    if (salesCanvas) {
      const parent = salesCanvas.parentNode;
      salesCanvas.remove();  // Remove the old canvas
      const newSalesCanvas = document.createElement('canvas');
      newSalesCanvas.id = 'salesChart';
      parent?.appendChild(newSalesCanvas); // Append a fresh canvas
    }
  
    // Get new canvas elements
    const incomeCtx = (document.getElementById('incomeChart') as HTMLCanvasElement)?.getContext('2d');
    const salesCtx = (document.getElementById('salesChart') as HTMLCanvasElement)?.getContext('2d');
  
    if (!incomeCtx || !salesCtx) {
      console.error('Canvas context not found');
      return;
    }
  
    // Create new charts
    this.incomeChart = new (window as any).Chart(incomeCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Income (Rs)',
          data: incomeData,
          backgroundColor: '#0d6efd'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  
    this.salesChart = new (window as any).Chart(salesCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Sales (Orders)',
          data: salesData,
          backgroundColor: '#198754'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }
  
}

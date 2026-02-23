import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../../services/content';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  private contentService = inject(ContentService);
  private authService = inject(AuthService);

  topics = this.contentService.getTopics();

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this topic?')) {
      this.contentService.deleteTopic(id);
    }
  }

  onLogout() {
    this.authService.logout();
    location.reload(); // Refresh to trigger guard redirect
  }
}

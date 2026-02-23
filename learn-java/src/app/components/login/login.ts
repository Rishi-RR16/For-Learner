import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  password = '';
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.authService.login(this.password)) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage.set('Invalid admin password.');
    }
  }
}

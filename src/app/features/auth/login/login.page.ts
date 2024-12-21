import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  loginForm: FormGroup;
  authError: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.auth.login(email, password);
        this.router.navigate(['/home']);
      } catch (error: any) {
        switch (error.code) {
          case 'auth/user-not-found':
            this.authError = 'No account found with this email address';
            break;
          case 'auth/wrong-password':
            this.authError = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            this.authError = 'Please enter a valid email address';
            break;
          case 'auth/user-disabled':
            this.authError = 'This account has been disabled';
            break;
          case 'auth/too-many-requests':
            this.authError = 'Too many failed attempts. Please try again later';
            break;
          default:
            this.authError = 'Failed to sign in. Please check your credentials';
        }
      }
    }
  }
} 
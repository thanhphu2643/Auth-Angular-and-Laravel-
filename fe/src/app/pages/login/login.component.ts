import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/api.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule,HttpClientModule,ReactiveFormsModule,CommonModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  errorMessage: string | null = null;
  constructor(
    private http:HttpClient,
    private router: Router, 
    private fb: FormBuilder,
    private apiService: ApiService,
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.pattern(this.passwordPattern)]],
      remember_me: [false]
    });
  }
  
  ngOnInit(): void {}
  
  goToRegister() {
    this.router.navigateByUrl('/register')
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apiService.login(this.loginForm.value).subscribe(
        response => {
          console.log('API response:', response);
          if (response.status_code === 200) {
            localStorage.setItem('access_token', response.access_token);
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Login failed. Please check your information.';
          }
        },
        error => {
          if (error.status === 429) {
            this.errorMessage = 'Too many login attempts. Please try again after 5 minutes';
          } else {
            this.errorMessage = 'Error during login: ' + error.message;
          }
          console.error('Error during login:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in the form correctly.';
    }
  }  
}

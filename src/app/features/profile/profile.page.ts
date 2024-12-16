import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MangaService } from '../../core/services/manga.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ng-container *ngIf="auth.user$ | async as user">
        <ion-avatar class="profile-avatar" (click)="selectImage()">
          <ion-icon name="person-outline" *ngIf="!user.photoURL" style="font-size: 128px;"></ion-icon>
          <img [src]="user.photoURL" alt="Profile picture" *ngIf="user.photoURL">
          <div class="avatar-overlay">
            <ion-icon name="camera"></ion-icon>
          </div>
        </ion-avatar>

        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
          <ion-item>
            <ion-label position="stacked">Username</ion-label>
            <ion-input formControlName="displayName" type="text"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input formControlName="email" type="email" readonly></ion-input>
          </ion-item>

          <div class="ion-padding">
            <ion-button expand="block" type="submit" [disabled]="!profileForm.valid || !profileForm.dirty">
              Update Profile
            </ion-button>
          </div>
        </form>

        <ion-list>
          <ion-list-header>
            <ion-label>Library Statistics</ion-label>
          </ion-list-header>
          
          <ion-item>
            <ion-label>
              <h2>Total Manga</h2>
              <p>{{ (libraryCount$ | async) || 0 }} titles</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="ion-padding">
          <ion-button expand="block" color="danger" (click)="logout()">
            <ion-icon slot="start" name="log-out"></ion-icon>
            Logout
          </ion-button>
        </div>
      </ng-container>
    </ion-content>
  `,
  styles: [`
    .profile-avatar {
      width: 128px;
      height: 128px;
      margin: 20px auto;
      position: relative;
      cursor: pointer;
    }
    .avatar-overlay {
      position: absolute;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0,0.6);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-overlay ion-icon {
      color: white;
      font-size: 20px;
    }
    ion-list {
      margin-top: 20px;
    }
  `]
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  libraryCount$ = this.mangaService.getUserLibrary().pipe(
    map((mangas: any[]) => mangas.length)
  );
  selectedImage?: File;

  constructor(
    public auth: AuthService,
    private mangaService: MangaService,
    private fb: FormBuilder,
    private toastCtrl: ToastController
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          displayName: user.displayName || '',
          email: user.email
        });
      }
    });
  }

  async selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      if (e.target?.files?.length) {
        this.selectedImage = e.target.files[0];
        try {
          await this.updateProfile();
          this.selectedImage = undefined;
        } catch (error) {
          console.error('Error updating profile picture:', error);
        }
      }
    };
    
    input.click();
  }

  async updateProfile() {
    if (this.profileForm.valid || this.selectedImage) {
      try {
        await this.auth.updateProfile(this.profileForm.value, this.selectedImage);
        const toast = await this.toastCtrl.create({
          message: 'Profile updated successfully',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'Error updating profile',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async logout() {
    await this.auth.logout();
  }
}

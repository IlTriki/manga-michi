import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.user$ = this.auth.authState.pipe(
      map(user => user ?? null),
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            map(userData => userData ?? null)
          );
        } else {
          return of(null);
        }
      })
    );
  }

  async login(email: string, password: string) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      await this.router.navigate(['/home']);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signup(email: string, password: string, displayName: string) {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(email, password);
      if (credential.user) {
        await this.createUserProfile(credential.user.uid, {
          uid: credential.user.uid,
          email: credential.user.email!,
          displayName,
          mangaLibrary: []
        });
      }
      await this.router.navigate(['/home']);
      return credential;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    await this.auth.signOut();
    await this.router.navigate(['/home']);
  }

  async updateProfile(profileData: Partial<User>, photoFile?: File) {
    const user = await this.auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    let photoURL = profileData.photoURL;

    if (photoFile) {
      const path = `users/${user.uid}/profile.${photoFile.name.split('.').pop()}`;
      const ref = this.storage.ref(path);
      await ref.put(photoFile);
      photoURL = await ref.getDownloadURL().toPromise();
    }

    if (profileData.displayName || photoURL) {
      await user.updateProfile({ 
        displayName: profileData.displayName,
        photoURL
      });
    }

    await this.firestore.doc(`users/${user.uid}`).update({
      ...profileData,
      photoURL
    });
  }

  private createUserProfile(uid: string, user: User) {
    return this.firestore.doc(`users/${uid}`).set(user);
  }
}
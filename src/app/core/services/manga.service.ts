import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Manga } from '../../models/manga.interface';
import { map, switchMap } from 'rxjs/operators';
import { firstValueFrom, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangaService {
  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    @Inject('AUTH_SERVICE') private auth: AuthService
  ) {}

  async searchManga(query: string): Promise<Manga[]> {
    let params = new HttpParams()
      .set('title', query)
      .set('limit', '20')
      .set('offset', '0')
      .append('includes[]', 'cover_art')
      .append('includes[]', 'author')
      .append('includes[]', 'artist');

    const response = await firstValueFrom(
      this.http.get<{ data: Manga[] }>(`${environment.mangaDexApi}/manga`, { params })
    );

    const data = response.data.map((manga: any) => {
      const coverFile = manga.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
      const authors = manga.relationships
        .filter(rel => rel.type === 'author' || rel.type === 'artist')
        .map(rel => rel.attributes?.name)
        .filter(Boolean);

      return {
        id: manga.id,
        title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
        description: manga.attributes.description.en || Object.values(manga.attributes.description)[0],
        coverImage: coverFile ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}` : '',
        authors: authors,
        status: manga.attributes.status,
        year: manga.attributes.year,
        tags: manga.attributes.tags.map(tag => tag.attributes.name.en)
      };
    });

    return data || [];
  }

  async getMangaDetails(id: string): Promise<Manga> {
    let params = new HttpParams()
    .append('includes[]', 'cover_art')
    .append('includes[]', 'author')
    .append('includes[]', 'artist');

    const response = await firstValueFrom(
      this.http.get<{ data: any }>(`${environment.mangaDexApi}/manga/${id}`, { params })
    );

    const manga = response.data;
    const coverFile = manga.relationships.find(rel => rel.type === 'cover_art')?.attributes?.fileName;
    const authors = manga.relationships
      .filter(rel => rel.type === 'author' || rel.type === 'artist')
      .map(rel => rel.attributes?.name)
      .filter(Boolean);

    return {
      id: manga.id,
      title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
      description: manga.attributes.description.en || Object.values(manga.attributes.description)[0],
      coverImage: coverFile ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}` : '',
      authors: authors,
      status: manga.attributes.status,
      year: manga.attributes.year,
      tags: manga.attributes.tags.map(tag => tag.attributes.name.en)
    };
  }

  getUserLibrary(): Observable<Manga[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) return [];
        return this.firestore
          .collection('users')
          .doc(user.uid)
          .collection('library')
          .valueChanges()
          .pipe(
            map(mangas => mangas as Manga[])
          );
      })
    );
  }

  async addToLibrary(manga: Manga): Promise<void> {
    const user = await firstValueFrom(this.auth.user$);
    if (!user) throw new Error('User not authenticated');

    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('library')
      .doc(manga.id)
      .set(manga);
  }

  async removeFromLibrary(mangaId: string): Promise<void> {
    const user = await firstValueFrom(this.auth.user$);
    if (!user) throw new Error('User not authenticated');

    return this.firestore
      .collection('users')
      .doc(user.uid)
      .collection('library')
      .doc(mangaId)
      .delete();
  }

  isInLibrary(mangaId: string): Observable<boolean> {
    return from(
      firstValueFrom(this.auth.user$).then(user => {
        if (!user) return false;
        return firstValueFrom(
          this.firestore.collection('users').doc(user.uid).collection('library').doc(mangaId).get()
        ).then(doc => doc.exists);
      })
    );
  }
}

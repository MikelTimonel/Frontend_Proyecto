import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetanalisisService {

  private apiUrl = 'https://192.168.75.24:5000/process_image'; // Reemplaza con tu URL

  constructor(private http: HttpClient) { }

  postData(data: any): Observable<any> {
    const headers = new HttpHeaders({
    });

    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_ENDPOINTS } from '../shared/constants/api-endpoints';

interface UploadFileResponse {
  fileName?: string;
  filename?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly http = inject(HttpClient);

  upload(file: File): Observable<string> {
    const normalizedFile = this.createUploadFile(file);
    const formData = new FormData();
    formData.append('file', normalizedFile, normalizedFile.name);

    return this.http
      .post<{ data?: UploadFileResponse }>(API_ENDPOINTS.files.upload, formData)
      .pipe(
        map((response) => {
          const fileName = response.data?.fileName ?? response.data?.filename;

          if (!fileName) {
            throw new Error('Upload response is missing file name.');
          }

          return fileName;
        }),
      );
  }

  private createUploadFile(file: File): File {
    const sanitizedName = this.sanitizeFileName(file.name);

    return new File([file], sanitizedName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  }

  private sanitizeFileName(fileName: string): string {
    const normalizedName = fileName.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    const sanitizedName = normalizedName.replace(/[^a-zA-Z0-9._-]/g, '_');

    return sanitizedName || 'upload-file';
  }
}

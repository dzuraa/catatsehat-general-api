import { Injectable } from '@nestjs/common';
import { FileRepository } from '../repositories/file.repository';
import { CreateFileDto } from '../dtos';
import { catchError, firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { FileType } from '@prisma/client';
import { ENV } from 'src/config/env';
import { StorageService } from 'src/platform/storage/services/storage.service';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly storageService: StorageService,
  ) {}

  async upload(createFileDto: CreateFileDto) {
    const { Mime } = await import('mime');
    const standardTypes = await import('mime/types/standard.js');
    const otherTypes = await import('mime/types/other.js');
    const mime = new Mime(standardTypes.default, otherTypes.default);
    const mimeType = createFileDto.file.split(';')[0].replace('data:', '');

    console.log(`Detected MIME type: ${mimeType}`);

    // Validate MIME type
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/heic',
      'image/heif',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new Error('Invalid file type. Only images and PDFs are allowed.');
    }

    // Get the current date for folder structure
    const now = DateTime.now();
    const year = now.toFormat('yyyy');
    const month = now.toFormat('LL');
    const day = now.toFormat('dd');
    const timeStamp = now.toFormat('yyyyLLdd_HHmmss');
    const uniqueId = uuidv4();
    const childName = createFileDto.fileName;
    const ext = mime.getExtension(mimeType);

    console.log(`File extension detected: ${ext}`);

    // Check if the file is a PDF and create a specific name format
    let fileName: string;
    if (mimeType === 'application/pdf') {
      const childName = createFileDto.fileName || 'UnknownChild'; // Assume `namaAnak` is part of DTO
      fileName = `SuratRujukan_${childName}_${timeStamp}.${ext}`;
    } else {
      fileName = `${timeStamp}-${uniqueId}-${childName}.${ext}`;
    }

    console.log(`Generated file name: ${fileName}`);

    // Construct file path with date folders
    const filePath = `${year}/${month}/${day}`;
    const fullPath = `${filePath}/${fileName}`;

    console.log(`Full file path: ${fullPath}`);

    // Get file base64
    const base64Value = createFileDto.file.split(',')[1];
    const file = Buffer.from(base64Value, 'base64');
    const payload = {
      file,
      fileName: fullPath,
      mimeType,
    };

    // Validate file size
    if (file.length > 2 * 1024 * 1024) {
      throw new Error('File size is too large. Maximum allowed is 2MB.');
    }

    await firstValueFrom(
      this.storageService.upload(payload).pipe(
        catchError((error) => {
          console.log('Error during file upload:', error);
          throw error;
        }),
      ),
    );

    const type = mimeType.startsWith('image')
      ? FileType.IMAGE
      : FileType.DOCUMENT;

    return this.fileRepository.create({
      fileName: payload.fileName,
      mimeType: payload.mimeType,
      type,
      path: [ENV.S3_ENDPOINT, ENV.S3_BUCKET_NAME, payload.fileName].join('/'),
      size: file.length,
    });
  }
}

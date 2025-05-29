import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ENV } from 'src/config/env';
import { catchError, from, of, switchMap, tap } from 'rxjs';

type UploadFileDto = {
  fileName: string;
  file: Buffer;
  mimeType: string;
};

@Injectable()
export class StorageService implements OnModuleInit {
  private bucketName = ENV.S3_BUCKET_NAME;
  private s3Client: S3Client;

  onModuleInit() {
    this.s3Client = new S3Client({
      endpoint: ENV.S3_ENDPOINT,
      region: ENV.S3_REGION,
      credentials: {
        accessKeyId: ENV.S3_ACCESS_KEY as string,
        secretAccessKey: ENV.S3_SECRET_KEY as string,
      },
      forcePathStyle: true,
    });
  }

  upload(uploadFileDto: UploadFileDto) {
    return of(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: uploadFileDto.fileName,
        Body: uploadFileDto.file,
        ContentType: uploadFileDto.mimeType,
        ACL: 'public-read',
      }),
    ).pipe(
      tap((data) => {
        console.log(data);
      }),
      switchMap((command) => from(this.s3Client.send(command))),
      catchError((err) => {
        console.log(err);
        throw new Error('Failed to upload file');
      }),
    );
  }
}

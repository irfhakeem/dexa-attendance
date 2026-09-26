import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor() {
    this.endpoint = process.env.RUSTFS_ENDPOINT || 'http://localhost:3001';
    this.bucket = process.env.RUSTFS_BUCKET || 'dexa-bucket';
    const accessKeyId = process.env.RUSTFS_ACCESS_KEY || 'rustfsadmin';
    const secretAccessKey = process.env.RUSTFS_SECRET_KEY || 'rustfsadmin';
    const region = process.env.RUSTFS_REGION || 'us-east-1';

    this.s3Client = new S3Client({
      endpoint: this.endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 900,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async move(sourceKey: string, destinationKey: string): Promise<void> {
    const copyCommand = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destinationKey,
    });
    await this.s3Client.send(copyCommand);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: sourceKey,
    });
    await this.s3Client.send(deleteCommand);
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}

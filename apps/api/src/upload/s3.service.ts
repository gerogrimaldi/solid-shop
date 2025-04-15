import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION') ?? 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
        secretAccessKey:
          this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
      },
    });

    this.bucketName =
      this.configService.get<string>('AWS_S3_BUCKET_NAME') ?? '';
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.originalname}`, // Unique filename
      Body: file.buffer, // File content
      ContentType: file.mimetype, // Correct MIME type
      Tagging: "public=true"
    };

      await this.s3.send(new PutObjectCommand(uploadParams));

      // const url = await getSignedUrl(this.s3, new GetObjectCommand({
      //   Bucket: this.bucketName,
      //   Key: uploadParams.Key,
      // }), { 
      //   // expiresIn: 60 * 60 
      // }); // URL expiration time in seconds
      const url = `https://${this.bucketName}.s3.us-east-1.amazonaws.com/${uploadParams.Key}`;
      console.log("i################### imagen subida con exito", url)
      return { message: 'File uploaded successfully', publicUrl: url };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }


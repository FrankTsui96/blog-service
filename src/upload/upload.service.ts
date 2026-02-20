import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';

@Injectable()
export class UploadService {
  private client: OSS;

  constructor(private configService: ConfigService) {
    this.client = new OSS({
      region: this.configService.get('OSS_REGION') ?? '',
      accessKeyId: this.configService.get('OSS_ACCESS_KEY_ID') ?? '',
      accessKeySecret: this.configService.get('OSS_ACCESS_KEY_SECRET') ?? '',
      bucket: this.configService.get('OSS_BUCKET') ?? '',
      secure: true, // 使用 https
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const filename = `articles/${Date.now()}-${file.originalname}`;
    const result = await this.client.put(filename, file.buffer);
    return { url: result.url };
  }
}

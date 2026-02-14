import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      message: 'Hello from NestJS!!!!!',
      timestamp: new Date().toISOString(),
      data: null,
    };
  }
}

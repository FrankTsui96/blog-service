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

  getUsers() {
    return {
      status: 'success',
      message: 'Users fetched successfully',
      timestamp: new Date().toISOString(),
      data: [
        {
          id: 1,
          name: 'Frank Tsui',
          email: 'cuix119@gmail.com',
        },
      ],
    };
  }
}

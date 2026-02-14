import { ActiveUser } from './index';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends ActiveUser {}

    interface Request {
      user?: User;
    }
  }
}

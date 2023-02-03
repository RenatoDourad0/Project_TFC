import User from '../database/models/User.model';
import { HttpException } from '../errors';

export default interface IAuthentication {
  authenticate(email: string, password: string): Promise<(string | HttpException)>;
  validate(token: string): Promise<(User | HttpException)>;
}

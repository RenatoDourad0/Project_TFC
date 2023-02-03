import HttpException from './HttpException';

export default class UnauthorizedError extends HttpException {
  constructor(message:string) {
    super(401, message);
  }
}

import HttpException from './HttpException';

export default class BadRequestError extends HttpException {
  constructor(message:string) {
    super(400, message);
  }
}

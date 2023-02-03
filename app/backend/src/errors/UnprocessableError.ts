import HttpException from './HttpException';

export default class UnprocessableError extends HttpException {
  constructor(message:string) {
    super(422, message);
  }
}

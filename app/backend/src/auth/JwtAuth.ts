import 'dotenv/config';
import { sign, verify, SignOptions, JwtPayload } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { BadRequestError, UnauthorizedError, HttpException } from '../errors';
import { IAuthentication } from '../interfaces';
import User from '../database/models/User.model';

type jwtReturn = (JwtPayload & { id: number });

const UnouthorizedErrorMessage = 'Incorrect email or password';

export default class JwtAuth implements IAuthentication {
  private isBodyValid = (email: string, password: string) => email && password;

  private secret = process.env.JWT_SECRET || 'seusecretdetoken';

  async authenticate(email: string, password: string): Promise<(string | HttpException)> {
    if (!this.isBodyValid(email, password)) {
      throw new BadRequestError('All fields must be filled');
    }
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.dataValues.password)) {
      throw new UnauthorizedError(UnouthorizedErrorMessage);
    }
    const { id, username, role, email: dbMail } = user.dataValues;
    const jwtConfig:SignOptions = { expiresIn: '7d', algorithm: 'HS256' };
    const token = sign({ id, username, role, dbMail }, this.secret, jwtConfig);
    return token;
  }

  async validate(token: string): Promise<(User | HttpException)> {
    if (token.length === 0) {
      throw new BadRequestError('All fields must be filled');
    }
    let decoded;
    try {
      decoded = verify(token, this.secret) as jwtReturn;
    } catch (error) {
      throw new UnauthorizedError(UnouthorizedErrorMessage);
    }
    const user = await User.findByPk(decoded.id) as User;
    if (!user || user.dataValues.email !== decoded.dbMail) {
      throw new UnauthorizedError(UnouthorizedErrorMessage);
    }
    return user.dataValues;
  }
}

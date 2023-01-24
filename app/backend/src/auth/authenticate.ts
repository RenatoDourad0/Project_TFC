import 'dotenv/config';
import { sign, SignOptions } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import User from '../database/models/User.model';

const secret = process.env.JWT_SECRET || 'seusecretdetoken';

const isBodyValid = (email: string, password: string) => email && password;

async function authenticate(email: string, password: string): Promise<(string | Error)> {
  if (!isBodyValid(email, password)) {
    throw new Error('All fields must be filled');
  }
  const user = await User.findOne({ where: { email } });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Incorrect email or password');
  }
  const jwtConfig:SignOptions = { expiresIn: '7d', algorithm: 'HS256' };
  const token = sign({ ...user.dataValues }, secret, jwtConfig);
  return token;
}

export default authenticate;

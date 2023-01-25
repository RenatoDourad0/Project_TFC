import 'dotenv/config';
import { verify, JwtPayload } from 'jsonwebtoken';
import User from '../database/models/User.model';

const secret = process.env.JWT_SECRET || 'seusecretdetoken';

type jwtReturn = (JwtPayload & { data: { id: number } });

async function validate(token: string): Promise<(User | Error)> {
  if (!token || token.length === 0) {
    throw new Error('Token not found');
  }

  const decoded = verify(token, secret) as jwtReturn;

  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new Error('Incorrect email or password');
  }

  return user;
}

export default validate;

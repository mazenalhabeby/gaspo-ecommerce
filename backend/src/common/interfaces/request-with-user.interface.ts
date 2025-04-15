import { JwtPayload } from './jwt-payload.interface';
import { RequestWithCookies } from './request-with-cookies.interface';

export interface RequestWithUser extends RequestWithCookies {
  user: JwtPayload;
}

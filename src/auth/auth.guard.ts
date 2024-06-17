import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_OPTIONAL_KEY } from './jwt-optional.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // canActivate(
  //   context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  //   return super.canActivate(context);
  // }

  handleRequest(err, user, info, context) {
    // You can throw an exception based on either "info" or "err" arguments
    const isOptional = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (err || !user) {
      if (isOptional) return user;
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

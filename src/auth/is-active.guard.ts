import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class IsActive implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    const isActive = await this.authService.isActiveUser(user.id);
    console.log('is user active___', isActive);
    if (isActive) {
      return true;
    }
    throw new ForbiddenException({
      message: 'کاربری شما غیر فعال شده است',
      error: 'IsNotActive',
    });
  }
}

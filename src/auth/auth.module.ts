import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationEntity } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationEntity]),
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: { expiresIn: '30h' },
    }),
    UserModule,
    PassportModule,
    MailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

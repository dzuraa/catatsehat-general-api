import { Module, forwardRef } from '@nestjs/common';
import {
  AuthAdminController,
  AuthController,
  ForgotPasswordController,
  ForgotPinController,
} from './controllers';
import { AuthService, ZenzivaService } from './services';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';
import { HttpModule } from '@nestjs/axios';
import { OtpModule } from '../otp';
import { AdminGuard } from './guards/admin.guard';
import { AuthAdminService } from './services/auth-admin.service';
import { AdminModule } from '../admin';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AdminModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    HttpModule,
    OtpModule,
  ],
  controllers: [
    AuthAdminController,
    AuthController,
    ForgotPasswordController,
    ForgotPinController,
  ],
  providers: [
    AuthService,
    AuthAdminService,
    AuthGuard,
    AdminGuard,
    ZenzivaService,
  ],
  exports: [AuthGuard, AdminGuard],
})
export class AuthModule {}

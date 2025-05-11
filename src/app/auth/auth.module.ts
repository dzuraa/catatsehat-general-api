import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService, ZenzivaService } from './services';
import { UsersModule } from '../users';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';
import { HttpModule } from '@nestjs/axios';
import { OtpModule } from '../otp';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    HttpModule,
    OtpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, AdminGuard, ZenzivaService],
  exports: [AuthGuard],
})
export class AuthModule {}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Admin, User as Auth } from '@prisma/client';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { AdminGuard, AuthGuard } from '../guards';
import { AuthService, AuthAdminService } from '../services';
import { AdminDecorator, UserDecorator } from '../decorators';
import {
  SignInDto,
  SignInAdminDto,
  SignUpDto,
  VerifyOtpDto,
  AccountRegistrationDto,
  ChangePinDto,
} from '../dtos';
import { RequestOtpDto } from '../dtos/request-otp.dto';
import { ResetPinDto } from '../dtos/reset-pin.dto';
import { ResetPassDto } from '../dtos/reset-pass.dto';

@ApiTags('[USER] Auth')
@Controller({
  path: '/user/auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in',
  })
  @Post('sign-in')
  async signIn(@Body() createAuthDto: SignInDto) {
    try {
      const data = await this.authService.signIn(createAuthDto);
      const message =
        data.user.status === 'INACTIVE'
          ? 'User inactive, proceed to registration'
          : 'Sign in success';
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({
    summary: 'Sign up',
  })
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const data = await this.authService.signUp(signUpDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Sign up success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiOperation({
    summary: 'Verify OTP',
  })
  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Post('verify-otp')
  async otpVerify(@UserDecorator() user: Auth, @Body() body: VerifyOtpDto) {
    try {
      const data = await this.authService.verifyOtp(user.id, body.otp);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Otp verified successfully',
      });
    } catch (error) {
      throw new HttpException(
        new ResponseEntity({
          message: error.message,
          status: HttpStatus.UNAUTHORIZED,
        }),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @ApiOperation({
    summary: 'Resend OTP',
  })
  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Post('resend-otp')
  async resendOtp(@UserDecorator() user: Auth) {
    try {
      const data = await this.authService.resendOtp(user);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Otp resent successfully',
      });
    } catch (error) {
      throw new HttpException(
        new ResponseEntity({
          message: error.message,
          status: HttpStatus.UNAUTHORIZED,
        }),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Put('account-registration')
  public async update(
    @UserDecorator() user: Auth,
    @Body() accountRegistrationDto: AccountRegistrationDto,
  ) {
    try {
      const data = await this.authService.accountRegistration(
        user.id,
        accountRegistrationDto,
      );
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'User account registered successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Put('change-pin')
  public async changePin(
    @UserDecorator() user: Auth,
    @Body() changePinDto: ChangePinDto,
  ) {
    console.log(user);
    try {
      const data = await this.authService.changePin(user.id, changePinDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Pin changed successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@UserDecorator() user: Auth) {
    const data = await this.authService.profile(user);

    return new ResponseEntity({
      data,
      status: HttpStatus.OK,
      message: 'Data fetched successfully',
    });
  }
}

@ApiTags('[ADMIN] Auth')
@Controller({
  path: 'admin/auth',
  version: '1',
})
export class AuthAdminController {
  constructor(private readonly authAdminService: AuthAdminService) {}

  @ApiOperation({
    summary: 'Admin Sign in',
  })
  @Post('sign-in')
  async signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    try {
      const data = await this.authAdminService.signIn(signInAdminDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'Admin signed in successfully',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AdminGuard)
  @Get('profile')
  async profileAdmin(@AdminDecorator() admin: Admin) {
    const data = await this.authAdminService.profile(admin);

    return new ResponseEntity({
      data: data,
      status: HttpStatus.OK,
      message: 'Data fetched successfully',
    });
  }
}

@ApiTags('[USER] Forgot PIN')
@Controller({
  path: 'user/auth/forgot-pin',
  version: '1',
})
export class ForgotPinController {
  constructor(private readonly authService: AuthService) {}
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      await this.authService.requestForgotPinOtp(requestOtpDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Otp sent successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      await this.authService.resendForgotPinOtp(requestOtpDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Otp resent successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-pin')
  async resetPin(@Body() resetPinDto: ResetPinDto) {
    try {
      await this.authService.resetPin(resetPinDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Pin reset successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

@ApiTags('[ADMIN] Forgot Password')
@Controller({
  path: 'admin/auth/forgot-password',
  version: '1',
})
export class ForgotPasswordController {
  constructor(private readonly authAdminService: AuthAdminService) {}
  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      await this.authAdminService.requestForgotPasswordOtp(requestOtpDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Otp sent successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() requestOtpDto: RequestOtpDto) {
    try {
      await this.authAdminService.resendForgotPasswordOtp(requestOtpDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Otp resent successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassDto: ResetPassDto) {
    try {
      await this.authAdminService.resetPassword(resetPassDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

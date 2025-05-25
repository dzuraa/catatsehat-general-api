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
        message: 'sign up success',
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
        message: 'succ.otp_verified',
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
        message: 'succ.otp_resend',
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

  @Post('sign-in')
  @ApiOperation({
    summary: 'Admin Sign in',
  })
  async signInAdmin(@Body() signInAdminDto: SignInAdminDto) {
    try {
      const data = await this.authAdminService.signIn(signInAdminDto);
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'admin signed in successfully',
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

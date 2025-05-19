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
import { AuthService } from '../services';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dtos/sign-in.dto';
import { ResponseEntity } from '@src/common/entities/response.entity';
import { AuthGuard } from '../guards';
import { User } from '../decorators';
import { User as Auth } from '@prisma/client';
import { SignUpDto } from '../dtos';
import { VerifyOtpDto } from '../dtos/verify-otp.dto';
import { AccountRegistrationDto } from '../dtos/account-regis.dto';

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
  async otpVerify(
    @User() user: Auth, // Access the request object to get user information
    @Body() body: VerifyOtpDto, // Contains only the OTP
  ) {
    try {
      const data = await this.authService.verifyOtp(user.id, body.otp); // Pass user ID and OTP
      console.log(data);
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
  @UseGuards(AuthGuard) // Use the AuthGuard to ensure the user is authenticated
  @Post('resend-otp')
  async resendOtp(@User() user: Auth) {
    try {
      const data = await this.authService.resendOtp(user); // Pass the user object directly
      return new ResponseEntity({
        data,
        status: HttpStatus.OK,
        message: 'succ.otp_resend',
      });
    } catch (error) {
      console.error('Error resending OTP:', error); // Log the error for debugging
      throw new HttpException(
        new ResponseEntity({
          message: error.message,
          status: HttpStatus.UNAUTHORIZED,
        }),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Put('account-registration')
  public async update(
    @User() user: Auth,
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
  @Get('profile')
  async profile(@User() user: Auth) {
    const data = await this.authService.profile(user);

    return new ResponseEntity({
      data: data,
      status: HttpStatus.OK,
      message: 'Data fetched successfully',
    });
  }
}

import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import { ENV } from '@src/config/env';
import { HttpService } from '@nestjs/axios';

dotenv.config();

@Injectable()
export class ZenzivaService {
  private readonly apiUrl = ENV.ZENZIVA_API_URL;
  private readonly apiKey = ENV.ZENZIVA_API_KEY;
  private readonly userKey = ENV.ZENZIVA_USER_KEY;

  constructor(private readonly httpService: HttpService) {}

  async sendOtpMessage(phone: string, otp: string): Promise<any> {
    const data = {
      userkey: this.userKey,
      passkey: this.apiKey,
      to: phone,
      brand: 'Catat Sehat',
      otp: otp,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.apiUrl!, data),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error sending OTP: ${JSON.stringify(error.response.data)}`,
      );
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }
}

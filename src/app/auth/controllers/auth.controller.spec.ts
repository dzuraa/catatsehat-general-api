
import { describe, beforeEach, expect, it, } from 'vitest'
import { Test } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { UsersModule } from '@src/app/users';
import { DatabaseModule } from '@src/platform/database/database.module';
import { PrismaService } from '@src/platform/database/services/prisma.service';
import { AppModule } from '@src/app/app.module';
import { MainModule } from '@src/main.module';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [UsersModule, MainModule],
            controllers: [AuthController],
            providers: [AuthService,],
        }).compile();

        authService = moduleRef.get<AuthService>(AuthService);
        authController = moduleRef.get<AuthController>(AuthController);
    });

    it('its defined', () => {
        expect(authService).toBeDefined()
    });
});
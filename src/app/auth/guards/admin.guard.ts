import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from 'src/common/enums/admin-role';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (context.getType() !== 'http') {
        return false;
      }

      const request = context.switchToHttp().getRequest();

      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Token not provided');
      }

      const admin = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!admin) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Gunakan field type sebagai role
      const userRole = admin.type; // Perubahan di sini

      if (!userRole) {
        throw new UnauthorizedException('Role not found in token');
      }

      const requiredRoles =
        this.reflector.get<AdminRole[]>('roles', context.getHandler()) ||
        this.reflector.get<AdminRole[]>('roles', context.getClass());

      console.log('Required Roles:', requiredRoles);
      console.log('User Role:', userRole);

      if (!requiredRoles || requiredRoles.length === 0) {
        request['user'] = admin;
        return true;
      }

      const hasPermission = requiredRoles.some((role) => role === userRole);

      if (!hasPermission) {
        throw new HttpException(
          'You do not have permission to access this resource',
          HttpStatus.FORBIDDEN,
        );
      }

      request['user'] = admin;
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Authentication failed',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

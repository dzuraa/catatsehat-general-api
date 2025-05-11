import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { verifySync } from '@node-rs/bcrypt';
import { SignInDto } from 'src/app/auth/dtos';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.userRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.userRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.userRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // public async create(createUsersDto: CreateUsersDto) {
  //   try {
  //     return this.userRepository.create(createUsersDto);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // public async update(id: string, updateUsersDto: UpdateUsersDto) {
  //   try {
  //     return this.userRepository.update({ id }, updateUsersDto);
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // public async signUp(signUpDto: CreateUsersDto) {
  //   try {
  //     const password = hashSync(signUpDto.password, 10);
  //     return this.userRepository.create({
  //       ...signUpDto,
  //       password,
  //     });
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  public async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userRepository.firstOrThrow({
        phone: signInDto.phone,
        deletedAt: null,
      });
      if (!user) throw new Error('err.not_found');
      if (user.phone != signInDto.phone) throw new Error('err.not_found');

      if (user.pin === null) {
        throw new Error('err.password_not_set');
      }

      if (!verifySync(signInDto.pin, user.pin))
        throw new Error('err.password_is_incorrect');

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

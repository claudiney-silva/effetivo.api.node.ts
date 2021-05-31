import { AccountOrigin, Role, User } from '@src/models/userModel';

export interface UserAuthorDto {
  id: string;
  fullName: string;
  avatar?: string;
}

export interface UserCreateDto {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  avatar?: string;
  origin: AccountOrigin;
  emailNewsletters: boolean;
  emailVerified?: boolean;
}

export interface UserUpdateDto {
  firstName: string;
  lastName: string;
  password?: string;
  emailNewsletters: boolean;
}

class UserMapper {
  public toAuthorDto(user: User): UserAuthorDto {
    const dto: UserAuthorDto = {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
    };
    return dto;
  }

  public toDomainDto(dto: UserCreateDto): User {
    const domain: User = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      avatar: dto.avatar,
      active: true,
      roles: [Role.USER],
      origin: [dto.origin],
      meta: {
        emailNewsletters: dto.emailNewsletters,
        emailVerified: dto.emailVerified ? dto.emailVerified : false,
      },
    };
    return domain;
  }
}

// MAPPER - SINGLETON
export const userMapper = new UserMapper();

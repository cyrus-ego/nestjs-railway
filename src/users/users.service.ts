import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  private users: UserResponseDto[] = [
    {
      id: 1,
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: '2026-06-01T00:00:00.000Z',
    },
  ];

  private nextId = 2;

  findById(id: number): UserResponseDto {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  register(dto: RegisterUserDto): UserResponseDto {
    const user: UserResponseDto = {
      id: this.nextId++,
      email: dto.email,
      name: dto.name,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }
}

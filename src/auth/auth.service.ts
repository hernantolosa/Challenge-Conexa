import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/enums/roles.enum';
import { EmailExists, UsernameExists } from '../auth/exceptions/authorization.exceptions';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserAndPassword(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      return { userId: user._id, username: user.username, role: user.role };
    }
    return null;
  }

  async validateUserByUsername(username: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) return;
    return { userId: user._id, username: user.username, role: user.role };
  }
  

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async userExists(createUserDto: CreateUserDto): Promise<void> {
    const userExists = await this.usersService.existsByUsername(createUserDto.username);
    const emailExists = await this.usersService.existsByEmail(createUserDto.email);

    if (userExists) {
      throw new UsernameExists();
    }

    if (emailExists) {
      throw new EmailExists();
    }
  }

  async register(createUserDto: CreateUserDto) {
    await this.userExists(createUserDto);
  
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
      role: UserRole.REGULAR,
    });
  
    return {
      username: user.username,
      email: user.email,
      role: user.role
    };
  }
}

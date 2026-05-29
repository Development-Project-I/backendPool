import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const { identificador, password } = loginDto;

    // busca o user no bd
    const user = await this.usersService.findByIdentificador(identificador);

    // erro 401
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
    };
  }
}
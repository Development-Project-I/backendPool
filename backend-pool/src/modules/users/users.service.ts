import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-ser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, matricula, password } = createUserDto;

    const emailExists = await this.usersRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const matriculaExists = await this.usersRepository.findOne({ where: { matricula } });
    if (matriculaExists) {
      throw new ConflictException('Esta matrícula já está cadastrada.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      email,
      matricula,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(newUser);

    const { password: _, ...result } = saved;
    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
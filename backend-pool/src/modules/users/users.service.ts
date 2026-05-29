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
    const { name, email, password, role } = createUserDto;

    const emailExists = await this.usersRepository.findOne({ where: { email } });
    if (emailExists) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    const saved = await this.usersRepository.save(newUser);

    const { password: _, ...result } = saved;
    return result;
  }
  // aqui ta buscando o user pelo email
  async findByIdentificador(identificador: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: [
        { email: identificador },
      ],
    });
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
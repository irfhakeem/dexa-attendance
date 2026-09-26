import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { NipSequenceRepository } from './nip-sequence.repository.js';
import { DepartmentsService } from '../departments/departments.service.js';
import { BcryptService } from '../infrastructure/security/bcrypt.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly nipSequenceRepository: NipSequenceRepository,
    private readonly departmentsService: DepartmentsService,
    private readonly bcryptService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const department = await this.departmentsService.findOne(
      createUserDto.departmentCode,
    );

    let nip = await this.nipSequenceRepository.generateNip(
      createUserDto.gender,
    );

    const rawPassword = createUserDto.password || 'password123';
    const hashedPassword = await this.bcryptService.hash(rawPassword);

    const created = await this.usersRepository.create({
      nip,
      name: createUserDto.name,
      gender: createUserDto.gender.toUpperCase(),
      password: hashedPassword,
      isHR: createUserDto.isHR ?? false,
      department: { connect: { id: department.id } },
    });

    return User.fromPrisma(created);
  }

  async findAll(query?: {
    search?: string;
    nip?: string;
    name?: string;
    department?: string;
    is_attend?: string | boolean;
  }): Promise<User[]> {
    const list = await this.usersRepository.findAll(query);
    return list.map((u) => User.fromPrisma(u));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return User.fromPrisma(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    const data: any = {};
    if (updateUserDto.name !== undefined) {
      data.name = updateUserDto.name;
    }
    if (updateUserDto.gender !== undefined) {
      data.gender = updateUserDto.gender.toUpperCase();
    }
    if (updateUserDto.isHR !== undefined) {
      data.isHR = updateUserDto.isHR;
    }
    if (updateUserDto.departmentCode !== undefined) {
      const dept = await this.departmentsService.findOne(
        updateUserDto.departmentCode,
      );
      data.department = { connect: { id: dept.id } };
    }
    if (updateUserDto.password) {
      data.password = await this.bcryptService.hash(updateUserDto.password);
    }

    const updated = await this.usersRepository.update(id, data);
    return User.fromPrisma(updated);
  }

  async remove(id: string): Promise<{ id: string }> {
    await this.findOne(id);
    await this.usersRepository.delete(id);
    return { id };
  }
}

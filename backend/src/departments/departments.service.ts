import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsRepository } from './departments.repository.js';
import { Department } from './entities/department.entity.js';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async findDropdown(): Promise<{ code: string; name: string }[]> {
    return this.departmentsRepository.findDropdown();
  }

  async findOne(code: string): Promise<Department> {
    const dept = await this.departmentsRepository.findByCode(
      code.trim().toUpperCase(),
    );
    if (!dept) {
      throw new NotFoundException('Department not found');
    }
    return new Department(dept);
  }

  async findByCode(code: string): Promise<Department | null> {
    const dept = await this.departmentsRepository.findByCode(
      code.trim().toUpperCase(),
    );
    return dept ? new Department(dept) : null;
  }

  async findById(id: string): Promise<Department | null> {
    const dept = await this.departmentsRepository.findById(id);
    return dept ? new Department(dept) : null;
  }
}

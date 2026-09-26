export class Department {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<Department>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}

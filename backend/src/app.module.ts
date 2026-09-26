import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { SecurityModule } from './infrastructure/security/security.module.js';
import { StorageModule } from './infrastructure/storage/storage.module.js';
import { UsersModule } from './users/users.module.js';
import { DepartmentsModule } from './departments/departments.module.js';
import { AttendancesModule } from './attendances/attendances.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AuthGuard } from './auth/guards/auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { CorsMiddleware } from './common/middleware/cors.middleware.js';

@Module({
  imports: [
    DatabaseModule,
    SecurityModule,
    StorageModule,
    UsersModule,
    DepartmentsModule,
    AttendancesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsMiddleware)
      .forRoutes({ path: '*splat', method: RequestMethod.ALL });
  }
}

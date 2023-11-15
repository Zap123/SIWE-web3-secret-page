import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './features/users/domain/user.domain';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'secretdb',
      entities: [User],
      // Disable migrations for development
      synchronize: true,
    }),
    // Endpoints 
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}

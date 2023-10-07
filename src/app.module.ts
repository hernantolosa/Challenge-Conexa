import { MiddlewareConsumer, Module, NestModule, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import * as bcrypt from 'bcrypt';

import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { MovieModule } from 'src/movies/movie.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/enums/roles.enum';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {}),
    UsersModule,
    AuthModule,
    MovieModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule, OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  // Creacion de usuario admin de pruebas
  async onModuleInit() {
    const adminExists = await this.usersService.findOneByUsername('admin');
    if (!adminExists) {
      await this.usersService.create({
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('passwordAdmin', 10),
        role: UserRole.ADMIN,
      });
      console.log('Admin user created.');
    }
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

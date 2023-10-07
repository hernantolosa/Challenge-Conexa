import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOneByUsername(username: string): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ username }).exec();
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.findOneByUsername(username);
    return !!user;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userCount = await this.userModel.countDocuments({ email }).exec();
    return userCount > 0;
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }
  
}

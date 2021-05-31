import { User, UserModel } from '@src/models/userModel';
import { AuthJwt, authService } from './authService';

class UserService {
  public async create(user: User): Promise<AuthJwt> {
    const model = new UserModel(user);
    if (user.password) {
      model.password = await authService.hashPassword(user.password);
    }
    await model.save();

    // model.password = undefined;

    return authService.generateAuthJwt(<User>model);
  }

  public async findById(id: string): Promise<User> {
    return <User>await UserModel.findById(id).select('+meta');
  }

  public async deleteById(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }

  public async save(user: User): Promise<User> {
    const model = new UserModel(user);
    if (model.password) {
      model.password = await authService.hashPassword(model.password);
    }
    return model.save();
  }

  public async delete(params: Partial<User>): Promise<void> {
    await UserModel.deleteMany(params);
  }

  public async findAll(): Promise<User[]> {
    return UserModel.find({}).select('+meta');
  }
}

export const userService = new UserService();

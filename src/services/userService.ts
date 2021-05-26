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

  /*
	private async save(user: User): Promise<User> {
		const model = new UserModel(user);
		return model.save();
	}

	private async deleteById(id: string): Promise<void> {
		await UserModel.deleteOne({ id });
	}

	private async delete(params: Partial<User>): Promise<void> {
		await UserModel.deleteMany(params);
	}

	private async findByLogin(login: string): Promise<User> {
		return UserModel.findOne({ email: login }).select('+password');
	}

	private async findAll(): Promise<User[]> {
		return UserModel.find({});
	}
	*/
}

export const userService = new UserService();

import { UserModel } from '@src/models/userModel';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await UserModel.deleteMany({});
  });
  describe('When creating a new user', () => {
    it('should successfully create a new user with id', async () => {
      const newUser = {
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: '123456789',
        emailNewsletters: true,
      };
      const response = await global.testRequest.post('/api/users').send(newUser);
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        id: expect.any(String),
      });
    });
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { User, UserType } from '../user/user.mjs';
import { UserController } from './Users';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(() => {
    userController = new UserController();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = await userController.getUsers();
      expect(users).toHaveLength(2);
      expect(users[0].firstName).toBe('Tom');
    });
  });

  describe('getUser', () => {
    it('should return a user by ID if it exists', async () => {
      const user = await userController.getUser('ff899ea1-5397-42b4-996d-f52492e8c629');
      expect(user).toBeDefined();
      expect(user?.firstName).toBe('Mark');
    });

    it('should return undefined if the user does not exist', async () => {
      const user = await userController.getUser('non-existent-id');
      expect(user).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const newUser: User = {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@example.com',
        phoneNumber: '+1-555-123-4567',
        type: UserType.Basic,
      };

      const createdUser = await userController.createUser(newUser);
      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeDefined();
      expect(createdUser.firstName).toBe('Alice');

      const users = await userController.getUsers();
      expect(users).toHaveLength(3);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user and return the updated user', async () => {
      const updatedData = { firstName: 'Thomas' };
      const updatedUser = await userController.updateUser(
        'ff899ea1-5397-42b4-996d-f52492e8c629',
        updatedData,
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.firstName).toBe('Thomas');
    });

    it('should return undefined if the user does not exist', async () => {
      const updatedUser = await userController.updateUser('non-existent-id', {
        firstName: 'NonExistent',
      });
      expect(updatedUser).toBeUndefined();
    });
  });
});

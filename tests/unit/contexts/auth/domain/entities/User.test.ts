import { User } from '../../../../../../src/contexts/auth/domain/entities/User';
import { UserId } from '../../../../../../src/contexts/auth/domain/value-objects/UserId';
import { UserEmail } from '../../../../../../src/contexts/auth/domain/value-objects/UserEmail';
import { UserPassword } from '../../../../../../src/contexts/auth/domain/value-objects/UserPassword';
import { UserRole } from '../../../../../../src/contexts/auth/domain/value-objects/UserRole';

describe('User Entity', () => {
  describe('creation', () => {
    it('should create a user with valid data', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      });

      expect(user.id).toBeInstanceOf(UserId);
      expect(user.name).toBe('john doe');
      expect(user.email).toBeInstanceOf(UserEmail);
      expect(user.email.value).toBe('john@example.com');
      expect(user.password).toBeInstanceOf(UserPassword);
      expect(user.role).toBeInstanceOf(UserRole);
    });

    it('should create an admin user', () => {
      const user = User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
      });

      expect(user.role.value).toBe('admin');
    });

    it('should fail with empty name', () => {
      expect(() => {
        User.create({
          name: '',
          email: 'john@example.com',
          password: 'password123',
          role: 'user',
        });
      }).toThrow('User name cannot be empty');
    });

    it('should fail with invalid email format', () => {
      expect(() => {
        User.create({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'password123',
          role: 'user',
        });
      }).toThrow('Invalid email format');
    });

    it('should fail with short password', () => {
      expect(() => {
        User.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: '123',
          role: 'user',
        });
      }).toThrow('Password must be at least 6 characters');
    });

    it('should fail with invalid role', () => {
      expect(() => {
        User.create({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'invalid' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        });
      }).toThrow('Invalid role');
    });
  });

  describe('password verification', () => {
    it('should verify correct password', async () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      });

      const isValid = await user.verifyPassword('password123');
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      });

      const isValid = await user.verifyPassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('toPrimitives', () => {
    it('should convert user to primitives without password', () => {
      const user = User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      });

      const primitives = user.toPrimitives();

      expect(primitives).toEqual({
        id: user.id.value,
        name: 'john doe',
        email: 'john@example.com',
        role: 'user',
      });
      expect(primitives).not.toHaveProperty('password');
    });
  });
});

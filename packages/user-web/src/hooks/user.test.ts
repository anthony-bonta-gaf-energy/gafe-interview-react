import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { User, UserType } from '../user/user.mjs';
import { useGetUser, useGetUsers, useMutateUser } from './user';

const createUser = (id: string, overrides: Partial<User> = {}): User => ({
  id,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNumber: '1234567890',
  type: UserType.Basic,
  ...overrides,
});

const tomSawyerId = "ff899ea1-5397-42b4-996d-f52492e8c835";
const tomSawyerUser: User = {
  id: tomSawyerId,
  firstName: "Tom",
  lastName: "Sawyer",
  phoneNumber: "+1-214-555-7294",
  email: "tom@email.fake",
  type: UserType.Basic
};

const WAIT_TIME_MARGIN = 500;

describe('User Hooks', () => {
  beforeAll(() => {
    vi.stubGlobal('alert', vi.fn());
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.resetModules()
  })
  describe('useGetUser', () => {
    it('should return user if found', async () => {
      const { result } = renderHook(() => useGetUser(tomSawyerId));

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeUndefined();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toEqual(tomSawyerUser);
      }, { timeout: WAIT_TIME_MARGIN });
    });

    it('should return undefined if user not found', async () => {
      const nonExistentId = 'non-existent-id';
      const { result } = renderHook(() => useGetUser(nonExistentId));

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeUndefined();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.user).toBeUndefined();
      }, { timeout: WAIT_TIME_MARGIN });
    });

    it('should not call fetchUser  if id is undefined', () => {
      const { result } = renderHook(() => useGetUser(undefined));

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeUndefined();
    });
  });

  describe('useGetUsers', () => {
    it('should be in loading state initially and then return all users', async () => {
      const { result } = renderHook(() => useGetUsers());

      expect(result.current.loading).toBe(true);
      expect(result.current.users).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.users).toEqual([tomSawyerUser]);
      }, { timeout: WAIT_TIME_MARGIN });
    });
  });

  describe('useMutateUser', () => {
    it('should set loading and success states correctly when adding a new user', async () => {
      const { result } = renderHook(() => useMutateUser());
      const newUser = createUser('new-user-for-add-test', { firstName: 'Newly', lastName: 'Added' });

      expect(result.current.loading).toBe(false);
      expect(result.current.success).toBe(false);

      act(() => {
        result.current.mutate(newUser);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.success).toBe(true);
      }, { timeout: WAIT_TIME_MARGIN });
    });

    it('should set loading and success states correctly when updating an existing user', async () => {
      const { result } = renderHook(() => useMutateUser());
      const updatedUser: User = { ...tomSawyerUser, firstName: 'Thomas Updated' };

      expect(result.current.loading).toBe(false);
      expect(result.current.success).toBe(false);

      act(() => {
        result.current.mutate(updatedUser);
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.success).toBe(true);
      }, { timeout: WAIT_TIME_MARGIN });
    });
  });
});
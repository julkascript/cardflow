import { describe, expect, it, vi } from 'vitest';
import { httpService } from '../http/http';
import { userService } from './userService';

describe('userService', () => {
  describe('startSession', () => {
    it('Returns whatever is decoded from the response', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'a' });
      vi.spyOn(localStorage, 'getItem').mockReturnValueOnce('b');
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {});

      vi.spyOn(userService, 'extractUserFromToken').mockReturnValueOnce({ user_id: 5 });

      const result = await userService.startSession();
      expect(result).toEqual({ user_id: 5 });
    });
  });

  describe('register', () => {
    it('Returns whatever is decoded from the response', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'a', refresh: 'a' });
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {});

      vi.spyOn(userService, 'extractUserFromToken').mockReturnValueOnce({ user_id: 5 });

      const result = await userService.register({ username: 'a', email: 'a', password: 'a' });
      expect(result).toEqual({ user_id: 5 });
    });
  });

  describe('login', () => {
    it('Returns whatever is decoded from the response', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'a', refresh: 'a' });
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {});

      vi.spyOn(userService, 'extractUserFromToken').mockReturnValueOnce({ user_id: 5 });

      const result = await userService.login({ username: 'a', password: 'a' });
      expect(result).toEqual({ user_id: 5 });
    });
  });
});

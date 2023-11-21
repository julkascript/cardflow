import { describe, expect, it, vi } from 'vitest';
import { httpService } from '../http/http';
import { userService } from './user';

describe('userService', () => {
  describe('verifySession', () => {
    it('Returns the response tokens', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'abc' });

      const result = await userService.verifySession('c');
      expect(result).toEqual('abc');
    });
  });

  describe('register', () => {
    it('Returns the response tokens', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'a', refresh: 'a' });

      const result = await userService.register({ username: 'a', email: 'a', password: 'a' });
      expect(result).toEqual({ access: 'a', refresh: 'a' });
    });
  });

  describe('login', () => {
    it('Returns whatever is decoded from the response', async () => {
      vi.spyOn(httpService, 'post').mockResolvedValueOnce({ access: 'a', refresh: 'a' });
      const result = await userService.login({ username: 'a', password: 'a' });
      expect(result).toEqual({ access: 'a', refresh: 'a' });
    });
  });
});

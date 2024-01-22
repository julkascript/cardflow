import { describe, expect, it, vi } from 'vitest';
import { userService } from '../../services/user/user';
import { loadPublicUserInfo } from './loadPublicUserInfo';

describe('loadPublicUserInfo', () => {
  it('Returns data successfully', async () => {
    vi.spyOn(userService, 'getUserByUsername').mockResolvedValueOnce({
      username: 'a',
      avatar: 'b',
    });

    const result = await loadPublicUserInfo({
      params: {
        username: 'a',
      },
    });

    expect(result.data.username).toBe('a');
    expect(result.data.avatar).toBe('b');
  });

  it('Throws an error if the username is invalid', () => {
    expect(() =>
      loadPublicUserInfo({
        params: {
          username: '',
        },
      }),
    ).rejects.toThrowError(Error);
  });
});

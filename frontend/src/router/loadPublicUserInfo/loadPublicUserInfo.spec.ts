import { describe, expect, it, vi } from 'vitest';
import { userService } from '../../services/user/user';
import { loadPublicUserInfo } from './loadPublicUserInfo';

describe('loadPublicUserInfo', () => {
  it('Returns data successfully', async () => {
    vi.spyOn(userService, 'getUserByUsername').mockResolvedValueOnce({
      username: 'a',
      avatar: 'b',
      stats: {
        'purchases': 1,
        'sales': 1,
        'sales_this_month': 0,
        'seller_rating': "4.2",
        'rejection_rate': 0,
        'miss_rate': 0
      }
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

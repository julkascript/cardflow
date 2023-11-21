import { describe, expect, it, vi } from 'vitest';
import { userService } from '../../services/user/userService';
import { authorizedGuard } from './authorizedGuard';
import { HttpError } from '../../util/HttpError';

describe('authorizeGuard', () => {
  it('Returns null if session is verified', async () => {
    vi.spyOn(userService, 'verifySession').mockResolvedValueOnce('a');

    const result = await authorizedGuard();
    expect(result).toBeNull();
  });

  it('Returns a redirect object if an HttpError is thrown', async () => {
    vi.spyOn(userService, 'verifySession').mockImplementationOnce(() => {
      throw new HttpError({} as Response);
    });

    const result = await authorizedGuard();
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });

  it('Rethrows any non-HTTP error', async () => {
    vi.spyOn(userService, 'verifySession').mockImplementationOnce(() => {
      throw new TypeError();
    });

    expect(() => authorizedGuard()).rejects.toThrow(TypeError);
  });
});

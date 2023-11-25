import { afterEach, describe, expect, it, vi } from 'vitest';
import { userService } from '../../services/user/user';
import { authorizedGuard } from './authorizedGuard';
import { HttpError } from '../../util/HttpError';

describe('authorizeGuard', () => {
  const localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem');

  it('Returns null if session is verified', async () => {
    vi.spyOn(userService, 'verifySession').mockResolvedValueOnce('a');
    localStorageGetItemSpy.mockImplementation(() => 'token');

    const result = await authorizedGuard();
    expect(result).toBeNull();
  });

  it('Returns a redirect object if an HttpError is thrown', async () => {
    localStorageGetItemSpy.mockReturnValue('token');
    vi.spyOn(userService, 'verifySession').mockImplementationOnce(() => {
      throw new HttpError({} as Response);
    });

    const result = await authorizedGuard();
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });

  it('Returns a redirect object if the user does not have a token', async () => {
    localStorageGetItemSpy.mockReturnValue(null);

    const result = await authorizedGuard();
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
  });

  it('Rethrows any non-HTTP error', async () => {
    localStorageGetItemSpy.mockReturnValue('token');
    vi.spyOn(userService, 'verifySession').mockImplementationOnce(() => {
      throw new TypeError();
    });

    expect(() => authorizedGuard()).rejects.toThrow(TypeError);
  });

  afterEach(() => {
    localStorageGetItemSpy.mockClear();
  });
});

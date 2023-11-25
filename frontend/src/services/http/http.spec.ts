import { describe, expect, it, vi } from 'vitest';
import { httpService } from './http';
import { HttpError } from '../../util/HttpError';

describe('httpService (tests done with post method)', () => {
  it('Returns undefined for 204 status code', async () => {
    vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => 'a');
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      status: 204,
      statusText: 'No Content',
    } as Response);

    const result = await httpService.post('a');
    expect(result).toBeUndefined();
  });

  it('Returns a response body for ok status', async () => {
    vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => 'a');
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      status: 200,
      statusText: 'Ok',
      ok: true,
      json: () => {
        return Promise.resolve({ test: 'a' });
      },
    } as Response);

    const result = await httpService.post('a');

    expect(result).toEqual({ test: 'a' });
  });

  it('Throws an HttpError for a non-ok status', async () => {
    vi.spyOn(localStorage, 'getItem').mockImplementationOnce(() => 'a');
    vi.spyOn(window, 'fetch').mockResolvedValueOnce({
      status: 403,
      statusText: 'Forbidden',
      ok: false,
    } as Response);

    expect(() => httpService.post('a')).rejects.toThrow(HttpError);
  });
});

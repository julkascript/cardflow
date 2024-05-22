import { describe, it, expect, vi } from 'vitest';
import { httpService } from '../http/http';
import { ContactFormMessage } from './types';
import { contactService } from './contact';

describe('contactService', () => {
  it('Returns retrieved data', async () => {
    const mockData: ContactFormMessage = {
      email: 'a@a.com',
      message: 'hello',
    };

    vi.spyOn(httpService, 'post').mockResolvedValueOnce(mockData);

    const result = await contactService.sendEmail(mockData);
    expect(result).toEqual(mockData);
  });
});

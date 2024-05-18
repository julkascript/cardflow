import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { ContactFormMessage } from './types';

export const contactService = {
  async sendEmail(message: ContactFormMessage): Promise<ContactFormMessage> {
    const data = await httpService.post<ContactFormMessage>(api.contacts.root, message);
    return data!;
  },
};

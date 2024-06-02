import { api } from '../../constants/api';
import { httpService } from '../http/http';
import { CreateFeedback, FeedbackCreated, UserFeedback } from './types';

export const feedbackService = {
  async getUserFeedbacks(id: number): Promise<UserFeedback> {
    const userFeedback = await httpService.get<UserFeedback[]>(api.feedback.user(id));
    return userFeedback![0];
  },

  async sendFeedback(feedback: CreateFeedback): Promise<FeedbackCreated> {
    const data = await httpService.post<FeedbackCreated>(api.feedback.root, feedback);
    return data!;
  },
};

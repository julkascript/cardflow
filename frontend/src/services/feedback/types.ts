export type Feedback = {
  related_order: number;
  sender_user: number;
  rating: number;
  comment: string;
};

export type CreateFeedback = {
  related_order: number;
  rating: number;
  comment: string;
};

export type FeedbackCreated = {
  receiver_user: number;
  sender_user: number;
  related_order: number;
  rating: number;
  comment: string;
};

export type UserFeedback = {
  user: number;
  average_rating: number;
  all_comments_and_ratings: Feedback[];
};

import api from '../lib/api';

export interface CreateReviewDto {
  appointmentId: string;
  rating: number;
  comment?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export const reviewService = {
  create(data: CreateReviewDto) {
    return api.post<Review>('/reviews', data);
  },

  getMyReviews() {
    return api.get<Review[]>('/reviews/my');
  },
};
import { describe, it, expect } from 'vitest';
import commentsReducer, {
  CommentsState,
  fetchComments,
  postComment,
  clearComments,
  clearCommentsByOfferId,
  clearPostError
} from '../../store/slices/comment-slice';
import { Review } from '../../types/review';

describe('comments slice', () => {
  const initialState: CommentsState = {
    comments: {},
    loading: false,
    error: null,
    posting: false,
    postError: null
  };

  const mockReview: Review = {
    id: '1',
    date: '2024-01-01',
    user: {
      email: 'user@user.ru',
      name: 'John Doe',
      avatarUrl: 'avatar.jpg',
      isPro: true
    },
    comment: 'Great place!',
    rating: 5
  };

  const mockReview2: Review = {
    id: '2',
    date: '2024-01-02',
    user: {
      email: 'user@user.ru',
      name: 'Jane Smith',
      avatarUrl: 'avatar2.jpg',
      isPro: false
    },
    comment: 'Nice location',
    rating: 4
  };

  describe('synchronous actions', () => {
    it('должен очищать все комментарии', () => {
      const stateWithComments: CommentsState = {
        ...initialState,
        comments: {
          'offer1': [mockReview],
          'offer2': [mockReview2]
        }
      };

      const state = commentsReducer(stateWithComments, clearComments());

      expect(state.comments).toEqual({});
      expect(state.loading).toBe(false);
      expect(state.posting).toBe(false);
    });

    it('должен очищать комментарии по ID предложения', () => {
      const stateWithComments: CommentsState = {
        ...initialState,
        comments: {
          'offer1': [mockReview],
          'offer2': [mockReview2]
        }
      };

      const state = commentsReducer(stateWithComments, clearCommentsByOfferId('offer1'));

      expect(state.comments).toEqual({
        'offer2': [mockReview2]
      });
      expect(state.comments['offer1']).toBeUndefined();
    });

    it('должен очищать ошибку отправки комментария', () => {
      const stateWithError: CommentsState = {
        ...initialState,
        postError: 'Some error'
      };

      const state = commentsReducer(stateWithError, clearPostError());

      expect(state.postError).toBeNull();
    });
  });

  describe('fetchComments thunk', () => {
    it('должен обрабатывать pending состояние', () => {
      const action = fetchComments.pending('', 'offer1');
      const state = commentsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.posting).toBe(false);
    });

    it('должен обрабатывать fulfilled состояние и сохранять комментарии по offerId', () => {
      const reviews = [mockReview, mockReview2];
      const action = fetchComments.fulfilled(reviews, '', 'offer1');
      const state = commentsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.comments['offer1']).toEqual(reviews);
      expect(state.comments['offer1']).toHaveLength(2);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Network error');
      const action = fetchComments.rejected(error, '', 'offer1');
      const state = commentsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.comments['offer1']).toBeUndefined();
    });

    it('должен использовать дефолтное сообщение об ошибке', () => {
      const action = fetchComments.rejected(new Error(), '', 'offer1');
      const state = commentsReducer(initialState, action);

      expect(state.error).toBe('Не удалось загрузить комментарии');
    });
  });

  describe('postComment thunk', () => {
    const postData = {
      offerId: 'offer1',
      comment: 'New comment',
      rating: 5
    };

    it('должен обрабатывать pending состояние', () => {
      const action = postComment.pending('', postData);
      const state = commentsReducer(initialState, action);

      expect(state.posting).toBe(true);
      expect(state.postError).toBeNull();
      expect(state.loading).toBe(false);
    });

    it('должен обрабатывать fulfilled состояние и добавлять новый комментарий в начало списка', () => {
      const stateWithExistingComments: CommentsState = {
        ...initialState,
        comments: {
          'offer1': [mockReview]
        }
      };

      const newComment = { ...mockReview2, id: '3' };
      const action = postComment.fulfilled(newComment, '', postData);
      const state = commentsReducer(stateWithExistingComments, action);

      expect(state.posting).toBe(false);
      expect(state.comments['offer1']).toHaveLength(2);
      expect(state.comments['offer1'][0]).toEqual(newComment);
      expect(state.comments['offer1'][1]).toEqual(mockReview);
    });

    it('должен создавать новый массив комментариев если его не существует', () => {
      const action = postComment.fulfilled(mockReview, '', postData);
      const state = commentsReducer(initialState, action);

      expect(state.posting).toBe(false);
      expect(state.comments['offer1']).toBeDefined();
      expect(state.comments['offer1']).toHaveLength(1);
      expect(state.comments['offer1'][0]).toEqual(mockReview);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Failed to post');
      const action = postComment.rejected(error, '', postData);
      const state = commentsReducer(initialState, action);

      expect(state.posting).toBe(false);
      expect(state.postError).toBe('Failed to post');
    });

    it('должен использовать дефолтное сообщение об ошибке при отправке', () => {
      const action = postComment.rejected(new Error(), '', postData);
      const state = commentsReducer(initialState, action);

      expect(state.postError).toBe('Не удалось отправить комментарий');
    });
  });

  describe('initial state', () => {
    it('должен возвращать initialState при пустом action', () => {
      const state = commentsReducer(undefined, { type: '' });

      expect(state).toEqual(initialState);
    });
  });

  describe('edge cases', () => {
    it('не должен модифицировать комментарии других offerId при добавлении нового', () => {
      const stateWithMultipleOffers: CommentsState = {
        ...initialState,
        comments: {
          'offer1': [mockReview],
          'offer2': [mockReview2]
        }
      };

      const postData = {
        offerId: 'offer1',
        comment: 'New comment',
        rating: 5
      };

      const newComment = { ...mockReview, id: '3' };
      const action = postComment.fulfilled(newComment, '', postData);
      const state = commentsReducer(stateWithMultipleOffers, action);

      expect(state.comments['offer1']).toHaveLength(2);
      expect(state.comments['offer2']).toEqual([mockReview2]);
    });

    it('должен сохранять состояние при очистке ошибок других offerId', () => {
      const stateWithData: CommentsState = {
        ...initialState,
        comments: {
          'offer1': [mockReview],
          'offer2': [mockReview2]
        },
        error: 'Some error',
        postError: 'Post error'
      };

      const state = commentsReducer(stateWithData, clearPostError());

      expect(state.postError).toBeNull();
      expect(state.error).toBe('Some error');
      expect(state.comments['offer1']).toHaveLength(1);
      expect(state.comments['offer2']).toHaveLength(1);
    });
  });
});

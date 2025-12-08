import commentsReducer, {
  clearComments,
  clearCommentsByOfferId,
  clearPostError,
  fetchComments,
  postComment
} from '../../store/slices/comment-slice';
import { Review } from '../../types/review';

const mockReviews: Review[] = [
  {
    id: '1',
    comment: 'Great place!',
    rating: 5,
    date: '2024-01-01',
    user: { name: 'John', avatarUrl: 'avatar.jpg', isPro: false, email: 'user@mail.ru' }
  },
  {
    id: '2',
    comment: 'Not bad',
    rating: 4,
    date: '2024-01-02',
    user: { name: 'Jane', avatarUrl: 'avatar2.jpg', isPro: true, email: 'user@mail.ru' }
  }
];

describe('Comments Slice', () => {
  const initialState = {
    comments: {},
    loading: false,
    error: null,
    posting: false,
    postError: null
  };

  describe('reducers', () => {
    it('should handle clearComments', () => {
      const stateWithComments = {
        ...initialState,
        comments: { '1': mockReviews }
      };
      const state = commentsReducer(stateWithComments, clearComments());
      expect(state.comments).toEqual({});
    });

    it('should handle clearCommentsByOfferId', () => {
      const stateWithComments = {
        ...initialState,
        comments: { '1': mockReviews, '2': mockReviews }
      };
      const state = commentsReducer(stateWithComments, clearCommentsByOfferId('1'));
      expect(state.comments).toEqual({ '2': mockReviews });
    });

    it('should handle clearPostError', () => {
      const stateWithError = { ...initialState, postError: 'Error' };
      const state = commentsReducer(stateWithError, clearPostError());
      expect(state.postError).toBeNull();
    });
  });

  describe('fetchComments thunk', () => {
    it('should set loading to true on pending', () => {
      const action = { type: fetchComments.pending.type };
      const state = commentsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled fetchComments', () => {
      const action = {
        type: fetchComments.fulfilled.type,
        payload: mockReviews,
        meta: { arg: '1' }
      };
      const state = commentsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.comments['1']).toEqual(mockReviews);
    });

    it('should handle rejected fetchComments', () => {
      const action = {
        type: fetchComments.rejected.type,
        error: { message: 'Failed to load' }
      };
      const state = commentsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to load');
    });
  });

  describe('postComment thunk', () => {
    const newReview: Review = {
      id: '3',
      comment: 'New comment',
      rating: 5,
      date: '2024-01-03',
      user: { name: 'Bob', avatarUrl: 'avatar3.jpg', isPro: false, email: 'user@mail.ru' }
    };

    it('should set posting to true on pending', () => {
      const action = { type: postComment.pending.type };
      const state = commentsReducer(initialState, action);
      expect(state.posting).toBe(true);
      expect(state.postError).toBeNull();
    });

    it('should handle fulfilled postComment when no existing comments', () => {
      const action = {
        type: postComment.fulfilled.type,
        payload: newReview,
        meta: { arg: { offerId: '1', comment: 'New', rating: 5 } }
      };
      const state = commentsReducer(initialState, action);

      expect(state.posting).toBe(false);
      expect(state.comments['1']).toEqual([newReview]);
    });

    it('should handle fulfilled postComment with existing comments', () => {
      const stateWithComments = {
        ...initialState,
        comments: { '1': mockReviews }
      };

      const action = {
        type: postComment.fulfilled.type,
        payload: newReview,
        meta: { arg: { offerId: '1', comment: 'New', rating: 5 } }
      };

      const state = commentsReducer(stateWithComments, action);

      expect(state.posting).toBe(false);
      expect(state.comments['1']).toHaveLength(3);
      expect(state.comments['1'][0]).toEqual(newReview);
    });

    it('should handle rejected postComment', () => {
      const action = {
        type: postComment.rejected.type,
        error: { message: 'Failed to post' }
      };
      const state = commentsReducer(initialState, action);

      expect(state.posting).toBe(false);
      expect(state.postError).toBe('Failed to post');
    });
  });
});

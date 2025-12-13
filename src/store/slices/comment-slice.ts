import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { Review } from '../../types/review';

export interface CommentsState {
    comments: Record<string, Review[]>;
    loading: boolean;
    error: string | null;
    posting: boolean;
    postError: string | null;
}

const initialState: CommentsState = {
  comments: {},
  loading: false,
  error: null,
  posting: false,
  postError: null,
};

interface PostCommentPayload {
    offerId: string;
    comment: string;
    rating: number;
}

export const fetchComments = createAsyncThunk<
    Review[],
    string,
    { extra: AxiosInstance }
>(
  'comments/fetchComments',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Review[]>(`/comments/${offerId}`);
    return data;
  }
);

export const postComment = createAsyncThunk<
    Review,
    PostCommentPayload,
    { extra: AxiosInstance }
>(
  'comments/postComment',
  async ({ offerId, comment, rating }, { extra: api }) => {
    const { data } = await api.post<Review>(`/comments/${offerId}`, {
      comment,
      rating,
    });
    return data;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = {};
    },
    clearCommentsByOfferId: (state, action: PayloadAction<string>) => {
      const offerId: string = action.payload;
      delete state.comments[offerId];
    },
    clearPostError: (state) => {
      state.postError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        const offerId = action.meta.arg;
        state.comments[offerId] = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить комментарии';
      })
      .addCase(postComment.pending, (state) => {
        state.posting = true;
        state.postError = null;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.posting = false;
        const offerId = action.meta.arg.offerId;
        const newComment = action.payload;

        if (!state.comments[offerId]) {
          state.comments[offerId] = [];
        }
        state.comments[offerId].unshift(newComment);
      })
      .addCase(postComment.rejected, (state, action) => {
        state.posting = false;
        state.postError = action.error.message || 'Не удалось отправить комментарий';
      });
  },
});

export const { clearComments, clearCommentsByOfferId, clearPostError } = commentsSlice.actions;
export default commentsSlice.reducer;

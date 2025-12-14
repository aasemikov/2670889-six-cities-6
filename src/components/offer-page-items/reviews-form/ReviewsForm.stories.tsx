import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ReviewForm } from '.';

const createMockStore = (posting = false, postError: string | null = null) => {
  const mockCommentSlice = createSlice({
    name: 'comments',
    initialState: {
      posting,
      postError,
    },
    reducers: {},
  });

  return configureStore({
    reducer: {
      comments: mockCommentSlice.reducer,
    },
  });
};

declare global {
  interface Window {
    require?: NodeRequire;
  }
}

const ReviewFormWrapper = (props: { posting?: boolean; postError?: string | null; offerId?: string }) => {
  const store = createMockStore(props.posting || false, props.postError || null);
  const offerId = props.offerId || '1';

  const MockedReviewForm = React.memo(() => {
    React.useEffect(() => {
      const originalUseParams = (window as any).__reactRouterDom?.useParams;
      (window as any).__reactRouterDom = {
        useParams: () => ({ id: offerId })
      };

      return () => {
        if (originalUseParams) {
          (window as any).__reactRouterDom.useParams = originalUseParams;
        } else {
          delete (window as any).__reactRouterDom;
        }
      };
    }, [offerId]);

    return <ReviewForm />;
  });

  return (
    <Provider store={store}>
      <MockedReviewForm />
    </Provider>
  );
};

const meta = {
  title: 'Components/ReviewForm',
  component: ReviewFormWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    posting: {
      control: 'boolean',
      description: 'Состояние отправки комментария',
    },
    postError: {
      control: 'text',
      description: 'Ошибка при отправке комментария',
    },
    offerId: {
      control: 'text',
      description: 'ID предложения',
    },
  },
  args: {
    posting: false,
    postError: null,
    offerId: '1',
  },
} satisfies Meta<typeof ReviewFormWrapper>;

export default meta;
type Story = StoryObj<typeof ReviewFormWrapper>;

export const Empty: Story = {};

export const Submitting: Story = {
  args: {
    posting: true,
  },
};

export const WithError: Story = {
  args: {
    posting: false,
    postError: 'Failed to post review. Please try again.',
  },
};
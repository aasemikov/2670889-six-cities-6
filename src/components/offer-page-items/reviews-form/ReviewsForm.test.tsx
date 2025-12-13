import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewForm } from '.';
import { useAppSelector } from '../../../store/hooks/redux';

const mockDispatch = vi.fn();

vi.mock('../../../store/hooks/redux', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: vi.fn(),
}));

vi.mock('../../../store/slices/comment-slice', () => ({
    postComment: (payload: any) => ({ type: 'comments/postComment', payload }),
}));

describe('ReviewForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('рендерит форму для отправки отзыва', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockReturnValue({
            posting: false,
            postError: null,
            comments: [],
            loading: false,
            error: null,
        });

        render(
            <MemoryRouter initialEntries={['/offer/123']}>
                <Routes>
                    <Route path="/offer/:id" element={<ReviewForm />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Your review')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('отображает ошибку если postError есть', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockReturnValue({
            posting: false,
            postError: 'Failed to post comment',
            comments: [],
            loading: false,
            error: null,
        });

        render(
            <MemoryRouter initialEntries={['/offer/123']}>
                <Routes>
                    <Route path="/offer/:id" element={<ReviewForm />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Failed to post comment')).toBeInTheDocument();
    });

    it('показывает количество символов при вводе текста', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockReturnValue({
            posting: false,
            postError: null,
            comments: [],
            loading: false,
            error: null,
        });

        render(
            <MemoryRouter initialEntries={['/offer/123']}>
                <Routes>
                    <Route path="/offer/:id" element={<ReviewForm />} />
                </Routes>
            </MemoryRouter>
        );

        const textarea = screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved');
        fireEvent.change(textarea, { target: { value: 'Test review text' } });

        expect(screen.getByText('16/300 characters')).toBeInTheDocument();
    });

    it('показывает индикатор загрузки когда posting = true', () => {
        const mockUseAppSelector = vi.mocked(useAppSelector);
        mockUseAppSelector.mockReturnValue({
            posting: true,
            postError: null,
            comments: [],
            loading: false,
            error: null,
        });

        render(
            <MemoryRouter initialEntries={['/offer/123']}>
                <Routes>
                    <Route path="/offer/:id" element={<ReviewForm />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Sending...')).toBeInTheDocument();
    });
});
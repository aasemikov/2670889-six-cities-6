import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ReviewForm } from '.';

jest.mock('../../../store/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('../../../store/slices/comment-slice', () => ({
  postComment: jest.fn(),
}));

describe('Компонент ReviewForm', () => {
  const mockDispatch = jest.fn();
  const mockUseAppDispatch = jest.requireMock('../../../store/hooks/redux').useAppDispatch;
  const mockUseAppSelector = jest.requireMock('../../../store/hooks/redux').useAppSelector;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockReturnValue({
      posting: false,
      postError: null,
    });
  });

  const renderWithRouter = () => render(
    <MemoryRouter
      initialEntries={['/offers/123']}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/offers/:id" element={<ReviewForm />} />
      </Routes>
    </MemoryRouter>
  );

  it('корректно рендерится', () => {
    renderWithRouter();

    expect(screen.getByText('Your review')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell how was your stay, what you like and what can be improved')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('отображает 5 звезд для рейтинга', () => {
    renderWithRouter();

    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);

    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('позволяет выбрать рейтинг', () => {
    renderWithRouter();
    const star3Input = screen.getByDisplayValue('3');
    fireEvent.click(star3Input);
    expect(star3Input).toBeChecked();
  });

  it('позволяет вводить текст отзыва', () => {
    renderWithRouter();

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Очень хороший отель!' } });

    expect(textarea).toHaveValue('Очень хороший отель!');
  });

  it('кнопка отправки заблокирована при невалидной форме', () => {
    renderWithRouter();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeDisabled();
  });

  it('кнопка отправки разблокируется при валидной форме', () => {
    renderWithRouter();

    const star4Input = screen.getByDisplayValue('4');
    fireEvent.click(star4Input);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, {
      target: { value: 'Очень хороший отель! Чисто, уютно, персонал приветливый. Обязательно вернусь сюда снова. Рекомендую!' }
    });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeEnabled();
  });

  it('отображает счетчик символов при вводе текста', () => {
    renderWithRouter();

    const textarea = screen.getByRole('textbox');
    const testText = 'Хороший отель';
    fireEvent.change(textarea, { target: { value: testText } });

    expect(screen.getByText(`${testText.length}/300 characters`)).toBeInTheDocument();
  });

  it('отображает сообщение об ошибке при postError', () => {
    mockUseAppSelector.mockReturnValue({
      posting: false,
      postError: 'Ошибка отправки',
    });

    renderWithRouter();

    expect(screen.getByText('Ошибка отправки')).toBeInTheDocument();
  });

  it('отображает состояние загрузки при posting: true', () => {
    mockUseAppSelector.mockReturnValue({
      posting: true,
      postError: null,
    });

    renderWithRouter();

    expect(screen.getByRole('button')).toHaveTextContent('Sending...');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('отправляет форму при валидных данных', () => {
    renderWithRouter();
    const star5Input = screen.getByDisplayValue('5');
    fireEvent.click(star5Input);

    const textarea = screen.getByRole('textbox');
    const reviewText = 'Прекрасный отель! Очень чистый и уютный. Персонал очень внимательный и дружелюбный. Завтраки были вкусными. Расположение удобное, рядом с центром города. Обязательно вернусь сюда снова!';
    fireEvent.change(textarea, { target: { value: reviewText } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it('сбрасывает форму после успешной отправки', () => {
    mockUseAppSelector.mockImplementation(() => ({
      posting: false,
      postError: null,
    }));

    const { rerender } = renderWithRouter();

    const star4Input = screen.getByDisplayValue('4');
    fireEvent.click(star4Input);

    const textarea = screen.getByRole('textbox');
    const testText = 'Текст более 50 символов для тестирования формы отправки отзыва. Должно хватить.';
    fireEvent.change(textarea, { target: { value: testText } });

    expect(star4Input).toBeChecked();
    expect(textarea).toHaveValue(testText);

    mockUseAppSelector.mockImplementation(() => ({
      posting: true,
      postError: null,
    }));

    rerender(
      <MemoryRouter
        initialEntries={['/offers/123']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          <Route path="/offers/:id" element={<ReviewForm />} />
        </Routes>
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Sending...');
  });

  it('форма имеет правильные атрибуты валидации', () => {
    renderWithRouter();

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('minLength', '50');
    expect(textarea).toHaveAttribute('maxLength', '300');
  });
});

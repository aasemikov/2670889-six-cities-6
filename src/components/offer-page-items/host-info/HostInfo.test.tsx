import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HostInfo } from '.';

describe('HostInfo', () => {
  const mockHost = {
    name: 'John Doe',
    avatar: 'avatar.jpg',
    isPro: false,
  };

  const mockDescription = 'This is a test description';

  it('рендерит заголовок и информацию о хосте', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByAltText('Host avatar')).toHaveAttribute('src', 'avatar.jpg');
  });

  it('показывает статус Pro когда host.isPro = true', () => {
    const proHost = { ...mockHost, isPro: true };

    render(<HostInfo host={proHost} description={mockDescription} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toHaveClass('offer__user-status');
  });

  it('не показывает статус Pro когда host.isPro = false', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('рендерит описание разбитое на параграфы', () => {
    const multilineDescription = 'First line\nSecond line\nThird line';

    render(<HostInfo host={mockHost} description={multilineDescription} />);

    expect(screen.getByText('First line')).toBeInTheDocument();
    expect(screen.getByText('Second line')).toBeInTheDocument();
    expect(screen.getByText('Third line')).toBeInTheDocument();

    const paragraphs = screen.getAllByText(/line/);
    expect(paragraphs).toHaveLength(3);
  });

  it('добавляет pro класс к аватару когда host.isPro = true', () => {
    const proHost = { ...mockHost, isPro: true };
    const { container } = render(<HostInfo host={proHost} description={mockDescription} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper--pro');
  });

  it('не добавляет pro класс к аватару когда host.isPro = false', () => {
    const { container } = render(<HostInfo host={mockHost} description={mockDescription} />);

    const avatarWrapper = container.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');
  });

  it('аватар имеет правильные размеры', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    const avatar = screen.getByAltText('Host avatar');
    expect(avatar).toHaveAttribute('width', '74');
    expect(avatar).toHaveAttribute('height', '74');
  });

  it('обрабатывает однострочное описание', () => {
    const singleLineDescription = 'Single line description';

    render(<HostInfo host={mockHost} description={singleLineDescription} />);

    expect(screen.getByText('Single line description')).toBeInTheDocument();
    const paragraphs = screen.getAllByText(/description/);
    expect(paragraphs).toHaveLength(1);
  });
});

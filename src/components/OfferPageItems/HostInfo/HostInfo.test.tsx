import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { HostInfo } from '.';

describe('Компонент HostInfo', () => {
  const mockHost = {
    name: 'John Doe',
    avatar: '/avatar.jpg',
    isPro: true,
  };

  const mockDescription = 'This is a great place to stay.\nVery comfortable and cozy.\nPerfect for families.';

  it('корректно рендерится с переданными данными', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    expect(screen.getByText('Meet the host')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('отображает аватар хоста с правильными атрибутами', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    const avatar = screen.getByAltText('Host avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/avatar.jpg');
    expect(avatar).toHaveAttribute('width', '74');
    expect(avatar).toHaveAttribute('height', '74');
  });

  it('применяет класс pro для хоста с isPro: true', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    const avatarWrapper = screen.getByAltText('Host avatar').parentElement;
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper--pro');
  });

  it('не применяет класс pro для хоста с isPro: false', () => {
    const nonProHost = { ...mockHost, isPro: false };
    render(<HostInfo host={nonProHost} description={mockDescription} />);

    const avatarWrapper = screen.getByAltText('Host avatar').parentElement;
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });

  it('разбивает описание на параграфы по переносу строки', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    const paragraphs = screen.getAllByText(/This is|Very comfortable|Perfect for/);
    expect(paragraphs).toHaveLength(3);

    expect(paragraphs[0]).toHaveTextContent('This is a great place to stay.');
    expect(paragraphs[1]).toHaveTextContent('Very comfortable and cozy.');
    expect(paragraphs[2]).toHaveTextContent('Perfect for families.');
  });

  it('правильно применяет CSS классы', () => {
    render(<HostInfo host={mockHost} description={mockDescription} />);

    expect(screen.getByText('Meet the host')).toHaveClass('offer__host-title');
    expect(screen.getByText('John Doe')).toHaveClass('offer__user-name');
    expect(screen.getByText('Pro')).toHaveClass('offer__user-status');

    const descriptionContainer = screen.getByText('This is a great place to stay.').parentElement;
    expect(descriptionContainer).toHaveClass('offer__description');
  });

  it('работает с однострочным описанием', () => {
    const singleLineDescription = 'Great host and place';
    render(<HostInfo host={mockHost} description={singleLineDescription} />);

    const paragraphs = screen.getAllByText(/Great host and place/);
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveClass('offer__text');
  });

  it('работает с пустым описанием', () => {
    render(<HostInfo host={mockHost} description="" />);

    const descriptionContainer = screen.getByText('Meet the host').nextElementSibling?.nextElementSibling;
    expect(descriptionContainer).toHaveClass('offer__description');

    const paragraph = descriptionContainer?.querySelector('.offer__text');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toBeEmptyDOMElement();
  });

  it('сохраняет структуру компонента', () => {
    const { container } = render(<HostInfo host={mockHost} description={mockDescription} />);

    expect(container.querySelector('.offer__host')).toBeInTheDocument();
    expect(container.querySelector('.offer__host-user.user')).toBeInTheDocument();
    expect(container.querySelector('.offer__description')).toBeInTheDocument();
  });

  it('отображает статус Pro только для pro хостов', () => {
    const { rerender } = render(<HostInfo host={mockHost} description={mockDescription} />);
    expect(screen.getByText('Pro')).toBeInTheDocument();

    const nonProHost = { ...mockHost, isPro: false };
    rerender(<HostInfo host={nonProHost} description={mockDescription} />);
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();
  });
});

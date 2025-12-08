import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Container } from '.';

describe('Container Component', () => {
  it('Правильный вывод', () => {
    render(<Container>Test Content</Container>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('Есть нужный класс', () => {
    render(<Container>Test Content</Container>);
    const container = screen.getByText('Test Content');
    expect(container).toHaveClass('container');
  });

  it('Отображение с правильным children', () => {
    const testContent = 'Hello, World!';
    render(<Container>{testContent}</Container>);
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('Рендер нескольких children', () => {
    render(
      <Container>
        <div data-testid="child-1">Child 1</div>
        <span data-testid="child-2">Child 2</span>
        <button data-testid="child-3">Click me</button>
      </Container>
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('Рендер с children = null', () => {
    render(<Container>{null}</Container>);
    const container = screen.getByText('', { selector: '.container' });
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('container');
  });
});

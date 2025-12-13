import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Container } from '.';

describe('Container', () => {
    it('рендерит children', () => {
        render(
            <Container>
                <span>Test content</span>
            </Container>
        );

        expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('имеет правильный CSS класс', () => {
        const { container } = render(
            <Container>
                <div>Content</div>
            </Container>
        );

        const divElement = container.firstChild;
        expect(divElement).toHaveClass('container');
    });

    it('рендерит несколько children', () => {
        render(
            <Container>
                <h1>Title</h1>
                <p>Paragraph</p>
                <button>Click me</button>
            </Container>
        );

        expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
        expect(screen.getByText('Paragraph')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('рендерит пустой контейнер', () => {
        const { container } = render(<Container>{null}</Container>);

        const divElement = container.firstChild;
        expect(divElement).toHaveClass('container');
        expect(divElement).toBeEmptyDOMElement();
    });

    it('рендерит компоненты как children', () => {
        const TestComponent = () => <div data-testid="test-component">Component</div>;

        render(
            <Container>
                <TestComponent />
            </Container>
        );

        expect(screen.getByTestId('test-component')).toBeInTheDocument();
        expect(screen.getByText('Component')).toBeInTheDocument();
    });
});
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Spinner from '.';

vi.mock('./index.module.css', () => ({
    default: {
        spinnerContainer: 'spinner-container-class',
        spinner: 'spinner-class',
        spinnerText: 'spinner-text-class',
    },
}));

describe('Spinner', () => {
    it('рендерит индикатор загрузки', () => {
        render(<Spinner />);

        const spinnerContainer = screen.getByTestId('spinner');
        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerContainer).toHaveClass('spinner-container-class');
    });

    it('содержит элемент спиннера', () => {
        const { container } = render(<Spinner />);

        const spinnerElement = container.querySelector('.spinner-class');
        expect(spinnerElement).toBeInTheDocument();
    });

    it('отображает текст "Loading..."', () => {
        render(<Spinner />);

        const textElement = screen.getByText('Loading...');
        expect(textElement).toBeInTheDocument();
        expect(textElement).toHaveClass('spinner-text-class');
    });

    it('имеет правильную структуру DOM', () => {
        const { container } = render(<Spinner />);

        const spinnerContainer = screen.getByTestId('spinner');
        expect(spinnerContainer.tagName).toBe('DIV');

        const spinner = container.querySelector('.spinner-class');
        const text = container.querySelector('.spinner-text-class');

        expect(spinner).toBeInTheDocument();
        expect(spinner?.tagName).toBe('DIV');
        expect(text).toBeInTheDocument();
        expect(text?.tagName).toBe('P');
    });

    it('применяет CSS классы из модуля', () => {
        const { container } = render(<Spinner />);

        expect(container.querySelector('.spinner-container-class')).toBeInTheDocument();
        expect(container.querySelector('.spinner-class')).toBeInTheDocument();
        expect(container.querySelector('.spinner-text-class')).toBeInTheDocument();
    });
});
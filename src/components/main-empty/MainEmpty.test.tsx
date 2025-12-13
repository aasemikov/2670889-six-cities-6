import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MainEmpty } from '.';

describe('MainEmpty', () => {
  it('отображает сообщение о пустом состоянии', () => {
    render(<MainEmpty />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(
      screen.getByText('We could not find any property available at the moment in Dusseldorf')
    ).toBeInTheDocument();
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(<MainEmpty />);

    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass(
      'cities__places-container',
      'cities__places-container--empty',
      'container'
    );
  });

  it('отображает секцию с сообщением', () => {
    render(<MainEmpty />);
    const statusWrapper = screen.getByText('No places to stay available').closest('div');
    expect(statusWrapper).toHaveClass('cities__status-wrapper', 'tabs__content');

    const boldText = screen.getByText('No places to stay available');
    expect(boldText.tagName).toBe('B');
    expect(boldText).toHaveClass('cities__status');

    const description = screen.getByText(/We could not find any property available/i);
    expect(description).toHaveClass('cities__status-description');
  });

  it('содержит правую секцию', () => {
    const { container } = render(<MainEmpty />);

    const rightSection = container.querySelector('.cities__right-section');
    expect(rightSection).toBeInTheDocument();
  });
});

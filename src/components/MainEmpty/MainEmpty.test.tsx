import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MainEmpty } from '.';

describe('Компонент MainEmpty', () => {
  it('отображает сообщение о пустом списке предложений', () => {
    render(<MainEmpty />);

    expect(screen.getByText('No places to stay available')).toBeInTheDocument();
    expect(screen.getByText(/We could not find any property available at the moment in Dusseldorf/i)).toBeInTheDocument();
  });

  it('имеет правильные CSS классы для стилизации', () => {
    render(<MainEmpty />);

    const title = screen.getByText('No places to stay available');
    expect(title).toHaveClass('cities__status');
    expect(title.closest('.cities__status-wrapper')).toHaveClass('tabs__content');
  });

  it('содержит пустую правую секцию', () => {
    const { container } = render(<MainEmpty />);

    const rightSection = container.querySelector('.cities__right-section');
    expect(rightSection).toBeInTheDocument();
    expect(rightSection).toBeEmptyDOMElement();
  });
});

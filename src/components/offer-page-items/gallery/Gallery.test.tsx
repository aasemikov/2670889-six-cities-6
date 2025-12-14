import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OfferGallery } from '.';

describe('OfferGallery', () => {
  it('рендерит изображения из массива', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

    render(<OfferGallery images={images} />);

    const imageElements = screen.getAllByAltText('Place photo');
    expect(imageElements).toHaveLength(3);

    images.forEach((image, index) => {
      expect(imageElements[index]).toHaveAttribute('src', image);
    });
  });

  it('ограничивает количество изображений шестью', () => {
    const images = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg', 'img7.jpg', 'img8.jpg'];

    render(<OfferGallery images={images} />);

    const imageElements = screen.getAllByAltText('Place photo');
    expect(imageElements).toHaveLength(6);
  });

  it('обрабатывает пустой массив изображений', () => {
    render(<OfferGallery images={[]} />);

    const imageElements = screen.queryAllByAltText('Place photo');
    expect(imageElements).toHaveLength(0);
  });

  it('имеет правильные CSS классы', () => {
    const { container } = render(<OfferGallery images={['img1.jpg']} />);

    expect(container.querySelector('.offer__gallery-container')).toBeInTheDocument();
    expect(container.querySelector('.container')).toBeInTheDocument();
    expect(container.querySelector('.offer__gallery')).toBeInTheDocument();
    expect(container.querySelector('.offer__image-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.offer__image')).toBeInTheDocument();
  });
});

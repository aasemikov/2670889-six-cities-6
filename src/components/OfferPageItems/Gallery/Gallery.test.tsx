import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { OfferGallery } from '.';

describe('Компонент OfferGallery', () => {
  const mockImages = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image5.jpg',
    'image6.jpg',
    'image7.jpg',
  ];

  it('корректно рендерится с переданными изображениями', () => {
    render(<OfferGallery images={mockImages} />);

    const images = screen.getAllByRole('img', { name: 'Place photo' });
    expect(images).toHaveLength(6);
  });

  it('ограничивает отображение до 6 изображений', () => {
    render(<OfferGallery images={mockImages} />);

    const images = screen.getAllByAltText('Place photo');
    expect(images).toHaveLength(6);

    images.forEach((img, index) => {
      expect(img).toHaveAttribute('src', mockImages[index]);
    });
  });

  it('правильно применяет CSS классы', () => {
    render(<OfferGallery images={mockImages} />);

    const firstImage = screen.getAllByRole('img')[0];
    const container = firstImage.closest('.offer__gallery-container');
    expect(container).toHaveClass('container');

    const gallery = firstImage.closest('.offer__gallery');
    expect(gallery).toBeInTheDocument();

    const imageWrappers = screen.getAllByRole('img').map((img) => img.parentElement);
    imageWrappers.forEach((wrapper) => {
      expect(wrapper).toHaveClass('offer__image-wrapper');
    });
  });

  it('каждое изображение имеет правильные атрибуты', () => {
    render(<OfferGallery images={mockImages} />);

    const images = screen.getAllByRole('img');
    images.forEach((img) => {
      expect(img).toHaveClass('offer__image');
      expect(img).toHaveAttribute('alt', 'Place photo');
    });
  });

  it('работает с пустым массивом изображений', () => {
    render(<OfferGallery images={[]} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    const container = screen.getByText('', { selector: '.offer__gallery-container' });
    expect(container).toBeInTheDocument();
  });

  it('работает с менее чем 6 изображениями', () => {
    const fewImages = ['image1.jpg', 'image2.jpg'];
    render(<OfferGallery images={fewImages} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
  });

  it('работает ровно с 6 изображениями', () => {
    const exactlySixImages = mockImages.slice(0, 6);
    render(<OfferGallery images={exactlySixImages} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6);
  });

  it('изображения оборачиваются в div с классом offer__image-wrapper', () => {
    render(<OfferGallery images={mockImages} />);

    const wrappers = document.querySelectorAll('.offer__image-wrapper');
    expect(wrappers).toHaveLength(6);

    wrappers.forEach((wrapper) => {
      expect(wrapper.querySelector('.offer__image')).toBeInTheDocument();
    });
  });
});

export type GalleryProps = {
  images: string[];
};

export const OfferGallery: React.FC<GalleryProps> = ({ images }) => (
  <div className="offer__gallery-container container">
    <div className="offer__gallery">
      {images.slice(0, 6).map((image) => (
        <div key={`${image}-${Date.now()}`} className="offer__image-wrapper">
          <img className="offer__image" src={image} alt="Place photo" />
        </div>
      ))}
    </div>
  </div>
);

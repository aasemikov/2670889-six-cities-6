type OfferInfoProps = {
  rating: number;
  type: string;
  bedrooms: number;
  maxAdults: number;
  price: number;
};

const getRatingWidth = (ratingValue: number) => `${(ratingValue / 5) * 100}%`;

export const OfferInfo: React.FC<OfferInfoProps> = ({
  rating,
  type,
  bedrooms,
  maxAdults,
  price,
}) => (
  <>
    <div className="offer__rating rating">
      <div className="offer__stars rating__stars">
        <span style={{ width: getRatingWidth(rating) }}></span>
        <span className="visually-hidden">Rating</span>
      </div>
      <span className="offer__rating-value rating__value">{rating}</span>
    </div>

    <ul className="offer__features">
      <li className="offer__feature offer__feature--entire">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </li>
      <li className="offer__feature offer__feature--bedrooms">
        {bedrooms} Bedroom{bedrooms !== 1 ? 's' : ''}
      </li>
      <li className="offer__feature offer__feature--adults">
        Max {maxAdults} adult{maxAdults !== 1 ? 's' : ''}
      </li>
    </ul>

    <div className="offer__price">
      <b className="offer__price-value">&euro;{price}</b>
      <span className="offer__price-text">&nbsp;night</span>
    </div>
  </>
);

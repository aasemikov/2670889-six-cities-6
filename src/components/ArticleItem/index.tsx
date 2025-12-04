import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks/redux';
import { toggleFavorite } from '../../store/slices/favorites-slice';
import { Offer } from '../../types/offer';

type OfferCardProps = {
  offer: Offer;
  onCardHover?: (offerId: string | null) => void;
};

const getRatingWidth = (ratingValue: number) => `${(ratingValue / 5) * 100}%`;

export const ArticleItem: React.FC<OfferCardProps> = ({
  offer,
  onCardHover,
}) => {
  const { title, type, price, isFavorite, isPremium, rating, previewImage, id } =
    offer;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authorizationStatus } = useAppSelector((state) => state.auth);
  const isAuthorized = authorizationStatus === 'AUTH';

  const handleMouseEnter = () => {
    onCardHover?.(offer.id);
  };

  const handleMouseLeave = () => {
    onCardHover?.(null);
  };

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthorized) {
      navigate('/login');
      return;
    }

    const newIsFavorite = !isFavorite;

    dispatch(toggleFavorite({
      offerId: id,
      status: newIsFavorite
    }));
  }, [id, isFavorite, isAuthorized, navigate, dispatch]);

  return (
    <article
      className="cities__card place-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <Link
        to={`/offer/${id}`}
        className="cities__card-link"
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <div className="cities__image-wrapper place-card__image-wrapper">
          <img
            className="place-card__image"
            src={previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </div>
      </Link>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button
            className={`place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''
            }`}
            type="button"
            onClick={handleFavoriteClick}
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>
        <Link
          to={`/offer/${id}`}
          className="cities__card-link"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div className="place-card__rating rating">
            <div className="place-card__stars rating__stars">
              <span style={{ width: getRatingWidth(rating) }}></span>
              <span className="visually-hidden">Rating</span>
            </div>
          </div>
          <h2 className="place-card__name">{title}</h2>
          <p className="place-card__type">{type}</p>
        </Link>
      </div>
    </article>
  );
};

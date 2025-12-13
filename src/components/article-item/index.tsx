import React, { memo, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks/redux';
import { toggleFavorite } from '../../store/slices/favorites-slice';
import { Offer } from '../../types/offer';

type OfferCardProps = {
  offer: Offer;
  onCardHover?: (offerId: string | null) => void;
  className?: string;
  'data-testid'?: string;
};

const getRatingWidth = (rating: number): string =>
  `${Math.round((rating / 5) * 100)}%`;

export const ArticleItem: React.FC<OfferCardProps> = memo(({
  offer,
  onCardHover,
  className = '',
  'data-testid': testId,
}) => {
  const {
    title,
    type,
    price,
    isFavorite,
    isPremium,
    rating,
    previewImage,
    id,
  } = offer;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isAuthorized = useAppSelector(
    (state) => state.auth.authorizationStatus === 'AUTH'
  );

  const handleMouseEnter = useCallback(() => {
    onCardHover?.(id);
  }, [onCardHover, id]);

  const handleMouseLeave = useCallback(() => {
    onCardHover?.(null);
  }, [onCardHover]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthorized) {
      navigate('/login');
      return;
    }

    dispatch(toggleFavorite({
      offerId: id,
      status: !isFavorite
    }));
  }, [id, isFavorite, isAuthorized, navigate, dispatch]);

  const ratingWidth = useMemo(() => getRatingWidth(rating), [rating]);
  const formattedPrice = useMemo(() => `€${price}`, [price]);
  const buttonAriaLabel = useMemo(() =>
    isFavorite ? 'Remove from bookmarks' : 'Add to bookmarks',
  [isFavorite]
  );
  const bookmarkButtonClass = useMemo(() =>
    `place-card__bookmark-button button ${isFavorite ? 'place-card__bookmark-button--active' : ''}`.trim(),
  [isFavorite]
  );

  return (
    <article
      className={`cities__card place-card ${className}`.trim()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`Offer: ${title}`}
      data-testid={testId || `offer-card-${id}`}
    >
      {/* Премиум метка */}
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <Link
        to={`/offer/${id}`}
        className="cities__card-link"
        style={{ textDecoration: 'none', color: 'inherit' }}
        aria-label={`View ${title}`}
      >
        <div className="cities__image-wrapper place-card__image-wrapper">
          <img
            className="place-card__image"
            src={previewImage}
            width="260"
            height="200"
            alt={`${title} - ${type}`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/img/placeholder.jpg';
            }}
          />
        </div>
      </Link>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">
              {formattedPrice}
            </b>
            <span className="place-card__price-text">
              /&nbsp;night
            </span>
          </div>

          <button
            className={bookmarkButtonClass}
            type="button"
            onClick={handleFavoriteClick}
            aria-label={buttonAriaLabel}
            data-testid={`favorite-button-${id}`}
          >
            <svg
              className="place-card__bookmark-icon"
              width="18"
              height="19"
              aria-hidden="true"
            >
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
          aria-label={`View details of ${title}`}
          data-testid={`offer-link-${id}`}
        >
          <div
            className="place-card__rating rating"
            role="img"
            aria-label={`Rating: ${rating} out of 5`}
          >
            <div className="place-card__stars rating__stars">
              <span style={{ width: ratingWidth }}></span>
              <span className="visually-hidden">
                Rating: {rating} out of 5
              </span>
            </div>
          </div>
          <h2 className="place-card__name">
            {title}
          </h2>
          <p className="place-card__type">
            {type}
          </p>
        </Link>
      </div>
    </article>
  );
}, (prevProps, nextProps) => (
  prevProps.offer.id === nextProps.offer.id &&
  prevProps.offer.isFavorite === nextProps.offer.isFavorite &&
  prevProps.offer.previewImage === nextProps.offer.previewImage &&
  prevProps.offer.title === nextProps.offer.title &&
  prevProps.offer.price === nextProps.offer.price &&
  prevProps.offer.rating === nextProps.offer.rating &&
  prevProps.onCardHover === nextProps.onCardHover &&
  prevProps.className === nextProps.className
));

ArticleItem.displayName = 'ArticleItem';

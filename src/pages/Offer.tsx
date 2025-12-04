import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AmenitiesList } from '../components/OfferPageItems/Amenities';
import { OfferGallery } from '../components/OfferPageItems/Gallery';
import { HostInfo } from '../components/OfferPageItems/HostInfo';
import { NearbyOffers } from '../components/OfferPageItems/NearbyOffers';
import { OfferHeader } from '../components/OfferPageItems/OfferHeader';
import { OfferInfo } from '../components/OfferPageItems/OfferInfo';
import { ReviewsSection } from '../components/OfferPageItems/ReviewsSection';
import Spinner from '../components/Spinner';
import { useAppDispatch, useAppSelector } from '../store/hooks/redux';
import { toggleFavorite } from '../store/slices/favorites-slice';
import { fetchNearbyOffers } from '../store/slices/nearby-slice';
import { fetchOfferDetails, toggleFavoriteOffer } from '../store/slices/offer-slice';
import { isDetailedOffer } from '../types/offer';

type OfferPageProps = {
  onFavoriteToggle?: (offerId: string, isFavorite: boolean) => void;
};

export const OfferPage: React.FC<OfferPageProps> = ({ onFavoriteToggle }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentOffer,
    loading: offerLoading,
    error: offerError
  } = useAppSelector((state) => state.detail);

  const {
    nearbyOffers,
    loading: nearbyLoading,
    error: nearbyError
  } = useAppSelector((state) => state.nearby);

  const { authorizationStatus } = useAppSelector((state) => state.auth);
  const isAuthorized = authorizationStatus === 'AUTH';

  useEffect(() => {
    if (!id) {
      navigate('/404', { replace: true });
      return;
    }

    dispatch(fetchOfferDetails(id));
    dispatch(fetchNearbyOffers(id));
  }, [id, dispatch, navigate]);

  const handleFavoriteClick = useCallback(() => {
    if (!currentOffer) {
      return;
    }

    if (!isAuthorized) {
      navigate('/login');
      return;
    }

    const newIsFavorite = !currentOffer.isFavorite;

    dispatch(toggleFavorite({
      offerId: currentOffer.id,
      status: newIsFavorite
    }));

    dispatch(toggleFavoriteOffer(currentOffer.id));

    onFavoriteToggle?.(currentOffer.id, newIsFavorite);
  }, [currentOffer, dispatch, isAuthorized, navigate, onFavoriteToggle]);

  const loading = offerLoading || nearbyLoading;
  const error = offerError || nearbyError;

  if (loading) {
    return (
      <main className="page__main page__main--offer">
        <div className="container">
          <Spinner />
        </div>
      </main>
    );
  }

  if (error || !currentOffer) {
    return (
      <main className="page__main page__main--offer">
        <div className="container">
          <div className="error-message">
            <h2>Не удалось загрузить предложение</h2>
            <p>{error || 'Предложение не найдено'}</p>
            <button
              onClick={() => navigate('/')}
              className="error-message__retry"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!isDetailedOffer(currentOffer)) {
    return (
      <main className="page__main page__main--offer">
        <div className="container">
          <div className="error-message">
            <h2>Ошибка данных</h2>
            <p>Получены неполные данные о предложении</p>
          </div>
        </div>
      </main>
    );
  }

  const detailedOffer = currentOffer;
  const currentNearbyOffers = nearbyOffers[id!] || [];

  const {
    title,
    type,
    price,
    rating,
    isPremium,
    isFavorite,
    description,
    bedrooms,
    goods,
    host,
    images,
    maxAdults,
  } = detailedOffer;

  const galleryImages = images.length > 0 ? images : [];

  return (
    <main className="page__main page__main--offer">
      <section className="offer">
        <OfferGallery images={galleryImages} />

        <div className="offer__container container">
          <div className="offer__wrapper">
            <OfferHeader
              title={title}
              isPremium={isPremium}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteClick}
            />
            <OfferInfo
              rating={rating}
              type={type}
              bedrooms={bedrooms}
              maxAdults={maxAdults}
              price={price}
            />

            {goods.length > 0 && <AmenitiesList amenities={goods} />}

            {host && (
              <HostInfo
                host={{
                  ...host,
                  avatar: host.avatarUrl,
                }}
                description={description}
              />
            )}
            <ReviewsSection reviews={[]} />
          </div>
        </div>
      </section>

      {currentNearbyOffers.length > 0 && <NearbyOffers offers={currentNearbyOffers} />}
    </main>
  );
};

import { Link } from 'react-router-dom';
import { ArticleItem } from '../../components/article-item';
import { useAppSelector } from '../../store/hooks/redux';
import { Offer } from '../../types/offer';

export const FavoritesPage: React.FC = () => {
  const { offers } = useAppSelector((state) => state.offers);
  const favorites = offers.filter((offer) => offer.isFavorite);

  const groupedFavorites = favorites.reduce<{ [city: string]: Offer[] }>(
    (acc, offer) => {
      if (!acc[offer.city.name]) {
        acc[offer.city.name] = [];
      }
      acc[offer.city.name].push(offer);
      return acc;
    },
    {},
  );

  return (
    <>
      <main className="page__main page__main--favorites">
        <div className="page__favorites-container container">
          <section className="favorites">
            <h1 className="favorites__title">Saved listing</h1>

            {favorites.length === 0 ? (
              <div className="favorites__empty">
                <p>No favorites yet</p>
              </div>
            ) : (
              <ul className="favorites__list">
                {Object.entries(groupedFavorites).map(([city, cityOffers]) => (
                  <li key={city} className="favorites__locations-items">
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <Link className="locations__item-link" to="/">
                          <span>{city}</span>
                        </Link>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {cityOffers.map((offer) => (
                        <ArticleItem
                          key={offer.id}
                          offer={offer}
                          onCardHover={undefined}
                        />
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to="/">
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </>
  );
};

import { Offer } from '../../../types/offer';
import { ArticleItem } from '../../article-item';

type NearbyOffersProps = {
  offers: Offer[];
};

export const NearbyOffers: React.FC<NearbyOffersProps> = ({ offers }) => (
  <div className="container">
    <section className="near-places places">
      <h2 className="near-places__title">Other places in the neighbourhood</h2>
      <div className="near-places__list places__list">
        {offers.map((offer) => (
          <ArticleItem key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  </div>
);

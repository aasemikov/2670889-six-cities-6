import { useAppSelector } from '../../../store/hooks/redux';
import { ReviewForm } from '../reviews-form';
import { ReviewsList } from '../reviews-list';

type ReviewsSectionProps = {
  offerId: string;
};

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ offerId }) => {
  const { comments, loading, error } = useAppSelector((state) => state.comments);
  const { authorizationStatus } = useAppSelector((state) => state.auth);

  const isAuthorized = authorizationStatus === 'AUTH';
  const offerComments = comments[offerId] || [];

  const sortedReviews = [...offerComments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (loading) {
    return (
      <section className="offer__reviews reviews">
        <h2 className="reviews__title">
          Reviews · <span className="reviews__amount">Loading...</span>
        </h2>
        <div className="reviews__loading">Loading reviews...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="offer__reviews reviews">
        <h2 className="reviews__title">
          Reviews · <span className="reviews__amount">Error</span>
        </h2>
        <div className="reviews__error" style={{ color: 'red' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        Reviews · <span className="reviews__amount">{sortedReviews.length}</span>
      </h2>
      <ReviewsList reviews={sortedReviews.slice(0, 10)} />

      {isAuthorized && <ReviewForm />}
    </section>
  );
};

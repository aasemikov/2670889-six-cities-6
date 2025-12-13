type OfferHeaderProps = {
  title: string;
  isPremium: boolean;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
};

export const OfferHeader: React.FC<OfferHeaderProps> = ({
  title,
  isPremium,
  isFavorite,
  onFavoriteToggle,
}) => (
  <>
    {isPremium && (
      <div className="offer__mark">
        <span>Premium</span>
      </div>
    )}

    <div className="offer__name-wrapper">
      <h1 className="offer__name">{title}</h1>
      <button
        className={`offer__bookmark-button button ${isFavorite ? 'offer__bookmark-button--active' : ''}`}
        type="button"
        onClick={onFavoriteToggle}
      >
        <svg className="offer__bookmark-icon" width="31" height="33">
          <use xlinkHref="#icon-bookmark"></use>
        </svg>
        <span className="visually-hidden">To bookmarks</span>
      </button>
    </div>
  </>
);

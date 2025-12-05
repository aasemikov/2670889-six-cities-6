import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks/redux';
import { postComment } from '../../../store/slices/comment-slice';

export const ReviewForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { posting, postError } = useAppSelector((state) => state.comments);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0); // Добавляем состояние для ховера

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (rating > 0 && reviewText.length >= 50 && reviewText.length <= 300 && id) {
      dispatch(postComment({
        offerId: id,
        comment: reviewText,
        rating,
      }));

      setRating(0);
      setReviewText('');
      setHoverRating(0); // Сбрасываем ховер после отправки
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (text: string) => {
    setReviewText(text);
  };

  // Функция для определения, должна ли звезда быть подсвечена
  const isStarActive = (starValue: number) => {
    // Используем hoverRating при наведении, иначе текущий рейтинг
    const currentRating = hoverRating || rating;
    return starValue <= currentRating;
  };

  const isFormValid =
    rating > 0 && reviewText.length >= 50 && reviewText.length <= 300 && !posting;

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>

      {postError && (
        <div className="reviews__error" style={{ color: 'red', marginBottom: '10px' }}>
          {postError}
        </div>
      )}

      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((star) => (
          <div
            key={star}
            onMouseEnter={() => setHoverRating(star)} // При наведении устанавливаем ховер
            onMouseLeave={() => setHoverRating(0)} // При уходе сбрасываем ховер
          >
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              checked={rating === star}
              onChange={() => handleRatingChange(star)}
              disabled={posting}
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={
                ['terribly', 'badly', 'not bad', 'good', 'perfect'][star - 1]
              }
            >
              <svg
                className="form__star-image"
                width="37"
                height="33"
                style={{
                  fill: isStarActive(star) ? '#ff9000' : '#c7c7c7',
                  transition: 'fill 0.2s ease'
                }}
              >
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </div>
        ))}
      </div>

      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={reviewText}
        onChange={(e) => handleReviewTextChange(e.target.value)}
        minLength={50}
        maxLength={300}
        disabled={posting}
      />

      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
          with at least <b className="reviews__text-amount">50 characters</b>.
          {reviewText.length > 0 && (
            <span className="reviews__char-count">
              {reviewText.length}/300 characters
            </span>
          )}
        </p>

        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={!isFormValid}
        >
          {posting ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

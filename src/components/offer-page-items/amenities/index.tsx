type AmenitiesProps = {
  amenities: string[];
};

export const AmenitiesList: React.FC<AmenitiesProps> = ({ amenities }) => (
  <div className="offer__inside">
    <h2 className="offer__inside-title">What&apos;s inside</h2>
    <ul className="offer__inside-list">
      {amenities.map((amenity) => (
        <li key={amenity} className="offer__inside-item">
          {amenity}
        </li>
      ))}
    </ul>
  </div>
);

export type HostInfoProps = {
  host: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
  description: string;
};

export const HostInfo: React.FC<HostInfoProps> = ({ host, description }) => (
  <div className="offer__host">
    <h2 className="offer__host-title">Meet the host</h2>
    <div className="offer__host-user user">
      <div
        className={`offer__avatar-wrapper ${host.isPro ? 'offer__avatar-wrapper--pro' : ''} user__avatar-wrapper`}
      >
        <img
          className="offer__avatar user__avatar"
          src={host.avatar}
          width="74"
          height="74"
          alt="Host avatar"
        />
      </div>
      <span className="offer__user-name">{host.name}</span>
      {host.isPro && <span className="offer__user-status">Pro</span>}
    </div>
    <div className="offer__description">
      {description.split('\n').map((paragraph) => (
        <p key={`${paragraph}-${Date.now()}`} className="offer__text">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
);

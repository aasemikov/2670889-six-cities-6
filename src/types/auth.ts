export type AuthStatus = 'AUTH' | 'NO_AUTH' | 'UNKNOWN';

export type User = {
  email: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
};

export type AuthInfo = {
  email: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
  token: string;
};

export type LoginData = {
  email: string;
  password: string;
};

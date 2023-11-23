export type CurrentUser = {
  user_id: number;
  username: string;
  email: string;
};

export type AccessTokenResponse = {
  access: string;
};

export type SuccessfulAuthenticationResponse = {
  access: string;
  refresh: string;
};

export type UserRegister = {
  username: string;
  password: string;
  email: string;
};

export type UserLogin = {
  username: string;
  password: string;
};

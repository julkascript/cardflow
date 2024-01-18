export type CurrentUser = {
  user_id: number;
  username: string;
  email: string;
  shipping_address: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  city: string | null;
  avatar: string | null;
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

export type UserAccount = {
  username: string;
  password: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  city: string | null;
  shipping_address: string | null;
  avatar: string | null;
};

export type UserAccountLoader = {
  data: UserAccount;
};

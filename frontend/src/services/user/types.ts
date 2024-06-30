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

export type JwtPayload = {
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
  data: PublicUserInfo;
};

export type PublicUserInfo = {
  username: string;
  avatar: string;
  stats: {
    purchases: number;
    sales: number;
    sales_this_month: number;
    seller_rating: number | string;
    rejection_rate: number;
    miss_rate: number;
  };
};

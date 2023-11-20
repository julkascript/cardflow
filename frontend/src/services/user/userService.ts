import { jwtDecode } from 'jwt-decode';
import { api } from '../../constants/api';
import { httpService } from '../http/http';
import {
  CurrentUser,
  AccessTokenResponse,
  UserRegister,
  SuccessfulAuthenticationResponse,
  UserLogin,
} from './types';

export const userService = {
  /**
   * Checks if the user has a valid session, which consists of
   * checking the validity of the refresh token on the server.
   *
   * If the user has a valid session, the data is extracted from
   * the returned access token and the same token will be stored in localStorage.
   * @returns a Promise that resolves to the user data that is extracted
   * from the generated access token
   */
  async startSession(): Promise<CurrentUser> {
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenResponse: AccessTokenResponse | undefined = await httpService.post(
      api.accounts.refresh,
      {
        refresh: refreshToken,
      },
    );

    const user = this.extractUserFromToken(refreshTokenResponse!.access);

    localStorage.setItem('accessToken', refreshTokenResponse!.access);
    return user;
  },

  /**
   * Sends a request to the server to register the user. Upon success,
   * localStorage will be updated with the returned tokens.
   * @param data
   * @returns the user extracted from the returned tokens.
   */
  async register(data: UserRegister): Promise<CurrentUser> {
    const tokens = await httpService.post<SuccessfulAuthenticationResponse>(
      api.accounts.register,
      data,
    );

    const user = this.extractUserFromToken(tokens!.access);

    localStorage.setItem('accessToken', tokens!.access);
    localStorage.setItem('refreshToken', tokens!.refresh);

    return user;
  },

  /**
   * Sends a request to the server to log in the user. Upon success,
   * localStorage will be updated with the returned tokens.
   * @param data
   * @returns the user extracted from the returned tokens.
   */
  async login(data: UserLogin): Promise<CurrentUser> {
    const tokens = await httpService.post<SuccessfulAuthenticationResponse>(
      api.accounts.login,
      data,
    );

    const user = this.extractUserFromToken(tokens!.access);

    localStorage.setItem('accessToken', tokens!.access);
    localStorage.setItem('refreshToken', tokens!.refresh);

    return user;
  },

  /**
   * Decodes the token and extracts the user data in there.
   *
   * **Warning:** This method will extract data from any well formatted token, even if
   * its signature is invalid, uses a different algorithm, or has expired.
   * This method is meant only for consumption of data on the client
   * and any authorized task should only use tokens issued by the server.
   * @param jwt the token to be decoded
   * @returns data about the user that was extracted from the token
   */
  extractUserFromToken(jwt: string): CurrentUser {
    const decodedToken: any = jwtDecode(jwt);

    const user: CurrentUser = {
      user_id: decodedToken.user_id,
    };

    return user;
  },
};

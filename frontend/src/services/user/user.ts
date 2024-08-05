import { jwtDecode } from 'jwt-decode';
import { api } from '../../constants/api';
import { httpService } from '../http/http';
import {
  AccessTokenResponse,
  UserRegister,
  SuccessfulAuthenticationResponse,
  UserLogin,
  UserAccount,
  JwtPayload,
  PublicUserInfo,
  UserSearchResult,
} from './types';
import { PaginatedItem } from '../yugioh/types';

export const userService = {
  /**
   * Checks if the user has a valid session, which consists of
   * checking the validity of the refresh token on the server.
   *
   * @returns a Promise that resolves to the access token if the session is valid.
   */
  async verifySession(refreshToken: string | null): Promise<string> {
    const refreshTokenResponse: AccessTokenResponse | undefined = await httpService.post(
      api.accounts.refresh,
      {
        refresh: refreshToken,
      },
    );

    return refreshTokenResponse!.access;
  },

  /**
   * Sends a request to the server to register the user.
   * @param data
   * @returns a Promise that resolves to the access and refresh tokens.
   */
  async register(data: UserRegister): Promise<SuccessfulAuthenticationResponse> {
    const tokens = await httpService.post<SuccessfulAuthenticationResponse>(
      api.accounts.register,
      data,
    );

    return tokens!;
  },

  /**
   * Sends a request to the server to log in the user.
   * @param data
   * @returns a Promise that resolves to the access and refresh tokens.
   */
  async login(data: UserLogin): Promise<SuccessfulAuthenticationResponse> {
    const tokens = await httpService.post<SuccessfulAuthenticationResponse>(
      api.accounts.login,
      data,
    );

    return tokens!;
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
  extractUserFromToken(jwt: string): JwtPayload {
    const decodedToken: any = jwtDecode(jwt);

    // transfer only business data, not JWT metadata.
    const user: JwtPayload = {
      user_id: decodedToken.user_id,
      email: decodedToken.email,
      username: decodedToken.username,
    };

    return user;
  },

  async getUserById(id: number): Promise<UserAccount> {
    const data = await httpService.get<UserAccount>(api.accounts.userById(id));
    return data!;
  },

  async getUserByUsername(username: string): Promise<PublicUserInfo> {
    const data = await httpService.get<PublicUserInfo>(api.accounts.user, {
      username,
    });
    return data!;
  },

  async updateUser(id: number, data: Partial<UserAccount>): Promise<UserAccount> {
    const updatedData = await httpService.patch<UserAccount>(api.accounts.userById(id), data);
    return updatedData!;
  },

  async updateUserAvatar(id: number, avatar: File): Promise<UserAccount> {
    const formData = new FormData();
    formData.append('avatar', avatar, id.toString() + '.' + avatar.type.split('/')[1]);
    const result = await httpService.patch<UserAccount>(api.accounts.userById(id), formData);
    return result!;
  },

  deleteUser(id: number): Promise<void> {
    return httpService.del(api.accounts.userById(id));
  },

  async searchUsersByUsername(
    username: string,
    page?: number,
  ): Promise<PaginatedItem<UserSearchResult>> {
    const result = await httpService.get<PaginatedItem<UserSearchResult>>(
      api.accounts.searchByUsername,
      {
        username,
        page: page || 1,
      },
    );

    return result!;
  },
};

import { redirect } from 'react-router-dom';
import { userService } from '../../services/user/userService';
import { HttpError } from '../../util/HttpError';

/**
 * Grants access to a page to users that are logged in.
 * The check happens by checking the validity of the refresh token on
 * the server
 * @returns ``null`` if logged in or a redirect to the login page.
 * @throws if an error that is not an ``HttpError`` is thrown, this function
 * will rethrow it.
 */
export async function authorizedGuard() {
  try {
    await userService.verifySession(localStorage.getItem('refreshToken'));
    return null;
  } catch (res) {
    if (res instanceof HttpError) {
      return redirect('/login');
    }

    throw res;
  }
}

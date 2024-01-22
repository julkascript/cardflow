import { Params } from 'react-router-dom';
import { userService } from '../../services/user/user';
import { UserAccountLoader } from '../../services/user/types';

/**
 * A loader for the card details page.
 * @throws an ``Error`` when the ``username`` route parameter is an empty string.
 */
export async function loadPublicUserInfo({
  params,
}: {
  params: Params;
}): Promise<UserAccountLoader> {
  const username = params.username;
  if (!username) {
    throw new Error('invalid username');
  }
  const user = await userService.getUserByUsername(username);
  return { data: user };
}

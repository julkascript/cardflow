import { Button } from '@mui/material';
import ProfilePictureAvatar from '../profilePictureAvatar/ProfilePictureAvatar';
import NewActionButton from './buttons/NewActionButton';
import NotificationButton from './buttons/NotificationButton';
import { useLogout } from '../../../util/useLogout';
import { useCurrentUser } from '../../../context/user';

/**
 * A list of navigation items for logged in users.
 * This component should be rendered on large screens only.
 * @returns
 */
function DesktopLoggedInNav(): JSX.Element {
  const logout = useLogout();
  const { user } = useCurrentUser();

  return (
    <ul className="list-none flex gap-4 items-center">
      <li>
        <NewActionButton />
      </li>
      <li>
        <NotificationButton />
      </li>
      <li>
        <ProfilePictureAvatar imageUrl={user.avatar} />
      </li>
      <li>
        <Button onClick={logout} color="primary" variant="outlined">
          Sign Out
        </Button>
      </li>
    </ul>
  );
}

export default DesktopLoggedInNav;

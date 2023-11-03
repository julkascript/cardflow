import ProfilePictureAvatar from '../profilePictureAvatar/ProfilePictureAvatar';
import NewActionButton from './buttons/NewActionButton';
import NotificationButton from './buttons/NotificationButton';

/**
 * A list of navigation items for logged in users.
 * This component should be rendered on large screens only.
 * @returns
 */
function DesktopLoggedInNav(): JSX.Element {
  /*
    TO-DO: Implement logic to display the correct navigation menu
    based on whether the user is logged in or not
  */
  return (
    <ul className="list-none flex gap-4 items-center">
      <li>
        <NewActionButton />
      </li>
      <li>
        <NotificationButton />
      </li>
      <li>
        <ProfilePictureAvatar />
      </li>
    </ul>
  );
}

export default DesktopLoggedInNav;

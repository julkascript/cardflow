import ProfilePictureAvatar from '../../ProfilePictureAvatar/ProfilePictureAvatar';
import NewActionButton from '../Buttons/NewActionButton/NewActionButton';
import NotificationButton from '../Buttons/NotificationButton/NotificationButton';
import ShoppingCartButton from '../Buttons/ShoppingCartButton/ShoppingCartButton';

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
        <ShoppingCartButton />
      </li>
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

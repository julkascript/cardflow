import { Button } from '@mui/material';

/**
 * A list of navigation items for guests.
 * This component should be rendered on large screens only.
 * @returns
 */
function DesktopGuestNav(): JSX.Element {
  return (
    <ul className="list-none">
      <li className="md:inline-block">
        <Button href="#" color="primary" variant="contained">
          Sign Up
        </Button>
      </li>
    </ul>
  );
}

export default DesktopGuestNav;

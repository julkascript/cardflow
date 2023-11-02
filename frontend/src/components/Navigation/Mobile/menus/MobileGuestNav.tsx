import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

/**
 * Mobile navigation items that can be interacted with by guests.
 * @returns
 */
function MobileGuestNav(): JSX.Element {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton href="#">
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Sign in" />
        </ListItemButton>
      </ListItem>
    </>
  );
}

export default MobileGuestNav;

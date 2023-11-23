import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import MobileLoggedInNav from './menus/MobileLoggedInNav';
import Authorized from '../../../router/Authorized';
import Unauthorized from '../../../router/Unauthorized';
import MobileGuestNav from './menus/MobileGuestNav';

type MobileNavigationProps = {
  onCloseButtonClick: (event: React.MouseEvent) => void;
};

/**
 * Navigation menu items for small screens.
 * @returns
 */
function MobileNavigation(props: MobileNavigationProps) {
  return (
    <div role="presentation" className="w-56">
      <List>
        <ListSubheader className="w-52">Navigation</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton href="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <Authorized>
          <MobileLoggedInNav />
        </Authorized>
        <Unauthorized>
          <MobileGuestNav />
        </Unauthorized>
        <ListItem disablePadding>
          <ListItemButton onClick={props.onCloseButtonClick}>
            <ListItemIcon>
              <CloseIcon />
            </ListItemIcon>
            <ListItemText primary="Close menu" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}

export default MobileNavigation;

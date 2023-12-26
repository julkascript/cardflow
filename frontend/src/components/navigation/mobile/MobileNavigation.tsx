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
import { useLocation } from 'react-router-dom';
import { useEffectAfterInitialLoad } from '../../../util/useEffectAfterInitialLoad';

type MobileNavigationProps = {
  onCloseButtonClick: (event?: React.MouseEvent) => void;
};

/**
 * Navigation menu items for small screens.
 * @returns
 */
function MobileNavigation(props: MobileNavigationProps) {
  const { pathname } = useLocation();

  useEffectAfterInitialLoad(() => {
    props.onCloseButtonClick();
  }, [pathname]);
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
          <MobileLoggedInNav onClose={props.onCloseButtonClick} />
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

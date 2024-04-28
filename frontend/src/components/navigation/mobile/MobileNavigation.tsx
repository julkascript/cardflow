import {
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MobileLoggedInNav from './menus/MobileLoggedInNav';
import Authorized from '../../../router/Authorized';
import Unauthorized from '../../../router/Unauthorized';
import MobileGuestNav from './menus/MobileGuestNav';
import { useLocation } from 'react-router-dom';
import { useEffectAfterInitialLoad } from '../../../util/useEffectAfterInitialLoad';
import { useShoppingCart } from '../../../context/shoppingCart';

type MobileNavigationProps = {
  onCloseButtonClick: (event?: React.MouseEvent) => void;
};

/**
 * Navigation menu items for small screens.
 * @returns
 */
function MobileNavigation(props: MobileNavigationProps) {
  const { pathname } = useLocation();
  const { shoppingCart } = useShoppingCart();
  const theme = useTheme();
  const infoColor = theme.palette.info.main;

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
        <ListItem disablePadding>
          <ListItemButton href="/cart">
            <ListItemIcon>
              {shoppingCart ? (
                <Badge color="error" variant="dot">
                  <ShoppingCartIcon sx={{ color: infoColor }} />
                </Badge>
              ) : (
                <ShoppingCartIcon />
              )}
            </ListItemIcon>
            <ListItemText primary="Shopping cart" />
          </ListItemButton>
        </ListItem>
        <Authorized>
          <MobileLoggedInNav onClose={props.onCloseButtonClick} />
        </Authorized>
        <Unauthorized>
          <MobileGuestNav onClose={props.onCloseButtonClick} />
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

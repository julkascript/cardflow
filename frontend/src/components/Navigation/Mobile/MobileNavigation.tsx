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

type MobileNavigationProps = {
  onClose: (event: React.MouseEvent) => void;
};

/**
 * Navigation menu items for small screens.
 * @returns
 */
function MobileNavigation(props: MobileNavigationProps) {
  /*
    TO-DO: Implement logic to display the correct navigation menu
    based on whether the user is logged in or not
  */
  return (
    <div role="presentation" className="w-56">
      <List>
        <ListSubheader className="w-52">Navigation</ListSubheader>
        <ListItem disablePadding>
          <ListItemButton href="#">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <MobileLoggedInNav />
        <ListItem disablePadding>
          <ListItemButton onClick={props.onClose}>
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

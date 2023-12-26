import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useEffectAfterInitialLoad } from '../../../../util/useEffectAfterInitialLoad';
import { useLocation } from 'react-router-dom';

type MobileGuestNavProps = {
  onClose: () => void;
};

/**
 * Mobile navigation items that can be interacted with by guests.
 * @returns
 */
function MobileGuestNav(props: MobileGuestNavProps): JSX.Element {
  const { pathname } = useLocation();

  useEffectAfterInitialLoad(() => {
    props.onClose();
  }, [pathname]);
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton href="/login">
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

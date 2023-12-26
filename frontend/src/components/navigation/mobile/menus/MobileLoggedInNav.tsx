import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useCurrentUser } from '../../../../context/user';
import { useLogout } from '../../../../util/useLogout';

type NewActionLink = {
  url: string;
  label: string;
};

type MobileLoggedInNavProps = {
  onClose: () => void;
};

/**
 * Mobile navigation items that can be interacted with by logged in users.
 * @returns
 */
function MobileLoggedInNav(props: MobileLoggedInNavProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const { user } = useCurrentUser();
  const logout = useLogout();
  function handleLogout() {
    logout();
    props.onClose();
  }

  const actions: NewActionLink[] = [
    {
      url: '/listing/create',
      label: 'New listing',
    },
    {
      url: '/trade/create',
      label: 'New trade',
    },
  ];

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setExpanded((e) => !e)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New action" />
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List disablePadding>
          {actions.map((a) => (
            <ListItemButton key={a.label} sx={{ pl: 4 }} href={a.url}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={a.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton href={`/user/${user.username}/settings`}>
          <ListItemAvatar>
            <Avatar sx={{ width: 24, height: 24 }} src="#" />
          </ListItemAvatar>
          <ListItemText primary="My profile" />
        </ListItemButton>
      </ListItem>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Sign Out" />
      </ListItemButton>
    </>
  );
}

export default MobileLoggedInNav;

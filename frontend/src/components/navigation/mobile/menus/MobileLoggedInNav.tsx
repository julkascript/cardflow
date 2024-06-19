import {
  Avatar,
  Collapse,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconTypeMap,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useCurrentUser } from '../../../../context/user';
import { useLogout } from '../../../../util/useLogout';
import toast from 'react-hot-toast';
import { legacyToastMessages } from '../../../../constants/toast';
import SettingsIcon from '@mui/icons-material/Settings';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { OverridableComponent } from '@mui/material/OverridableComponent';

type NewActionLink = {
  url: string;
  label: string;
};

type ProfileLink = {
  href: string;
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  text: string;
};

type MobileLoggedInNavProps = {
  onClose: () => void;
};

/**
 * Mobile navigation items that can be interacted with by logged in users.
 * @returns
 */
function MobileLoggedInNav(props: MobileLoggedInNavProps): JSX.Element {
  const [newActionsExpanded, setNewActionsExpanded] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const { user } = useCurrentUser();
  const logout = useLogout();

  const links: ProfileLink[] = [
    {
      href: `/user/${user.username}/settings`,
      text: 'Account settings',
      icon: SettingsIcon,
    },
    {
      href: `/user/${user.username}/orders`,
      text: 'My orders',
      icon: AddShoppingCartIcon,
    },
    {
      href: `/user/${user.username}/sales`,
      text: 'My sales',
      icon: CurrencyExchangeIcon,
    },
  ];

  function handleLogout() {
    logout();
    props.onClose();
    toast.success(legacyToastMessages.success.logout);
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
        <ListItemButton onClick={() => setNewActionsExpanded((e) => !e)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="New action" />
          {newActionsExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={newActionsExpanded} timeout="auto" unmountOnExit>
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
        <ListItemButton href="/sell/manage">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="My listings" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setProfileExpanded((e) => !e)}>
          <ListItemAvatar>
            <Avatar sx={{ width: 24, height: 24 }} src={user.avatar || ''} />
          </ListItemAvatar>
          <ListItemText primary="My profile" />
          {profileExpanded ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={profileExpanded} timeout="auto" unmountOnExit>
        <List disablePadding>
          {links.map((l) => {
            const LinkIcon = l.icon;
            return (
              <ListItemButton key={l.text + '-mobile'} sx={{ pl: 4 }} href={l.href}>
                <ListItemIcon>
                  <LinkIcon />
                </ListItemIcon>
                <ListItemText primary={l.text} />
              </ListItemButton>
            );
          })}
          <ListItemButton sx={{ pl: 4 }} onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}

export default MobileLoggedInNav;

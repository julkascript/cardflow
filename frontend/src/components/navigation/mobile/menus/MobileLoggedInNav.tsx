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
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useCurrentUser } from '../../../../context/user';
import { useLogout } from '../../../../util/useLogout';
import { toastMessages } from '../../../../constants/toast';
import SettingsIcon from '@mui/icons-material/Settings';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SyncIcon from '@mui/icons-material/Sync';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useToast } from '../../../../util/useToast';
import { useTranslation } from 'react-i18next';

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
  const toast = useToast();
  const { t } = useTranslation('common');

  const links: ProfileLink[] = [
    {
      href: `/user/${user.username}/settings`,
      text: t('navigation.accountSettings'),
      icon: SettingsIcon,
    },
    {
      href: `/user/${user.username}/orders`,
      text: t('navigation.myOrders'),
      icon: AddShoppingCartIcon,
    },
    {
      href: `/user/${user.username}/sales`,
      text: t('navigation.mySales'),
      icon: CurrencyExchangeIcon,
    },
    {
      href: '/trade',
      text: t('navigation.myTrades'),
      icon: SyncIcon,
    },
    {
      href: '/accounts/search',
      text: t('navigation.search'),
      icon: SearchIcon,
    },
  ];

  function handleLogout() {
    logout();
    props.onClose();
    toast.success({ toastKey: toastMessages.logout });
  }

  const actions: NewActionLink[] = [
    {
      url: '/listing/create',
      label: t('navigation.newListing'),
    },
    {
      url: '/accounts/search',
      label: t('navigation.newTrade'),
    },
  ];

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setNewActionsExpanded((e) => !e)}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary={t('navigation.newAction')} />
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
          <ListItemText primary={t('navigation.myListings')} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setProfileExpanded((e) => !e)}>
          <ListItemAvatar>
            <Avatar sx={{ width: 24, height: 24 }} src={user.avatar || ''} />
          </ListItemAvatar>
          <ListItemText primary={t('navigation.myProfile')} />
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
            <ListItemText primary={t('navigation.logout')} />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}

export default MobileLoggedInNav;

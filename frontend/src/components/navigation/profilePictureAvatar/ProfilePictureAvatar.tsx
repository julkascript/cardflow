import {
  Avatar,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { useCurrentUser } from '../../../context/user';
import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useLogout } from '../../../util/useLogout';
import { toastMessages } from '../../../constants/toast';
import './ProfilePictureAvatar.css';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { useToast } from '../../../util/useToast';
import { useTranslation } from 'react-i18next';

type ProfilePictureAvatarProps = {
  imageUrl: string | null;
};

const padding = '8px 16px';

/**
 * An avatar image which opens a dropdown with various links
 * to personalized pages
 * @param props
 * @returns
 */
function ProfilePictureAvatar(props: ProfilePictureAvatarProps): JSX.Element {
  const { user } = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const menuIsOpen = anchorEl !== null;

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
  ];

  function handleLogout() {
    logout();
    handleClose();
    toast.success({ toastKey: toastMessages.logout });
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar src={props.imageUrl || ''} />
      </IconButton>
      <Menu
        className="profile-picture-avatar-menu"
        color="text.secondary"
        anchorEl={anchorEl}
        open={menuIsOpen}
        onClose={handleClose}
      >
        <ListItem sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Typography color="text.secondary">{user.email}</Typography>
        </ListItem>
        <Divider />
        {links.map((l) => {
          const LinkIcon = l.icon;
          return (
            <ListItemButton
              key={l.text + '-desktop'}
              onClick={handleClose}
              sx={{ padding }}
              href={l.href}
            >
              <ListItemText>
                <Typography color="text.secondary">{l.text}</Typography>
              </ListItemText>
              <ListItemIcon className="justify-end">
                <LinkIcon fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          );
        })}
        <Divider />
        <ListItemButton
          className="logout-button"
          onClick={handleLogout}
          sx={{ paddingTop: 2, paddingBottom: 2 }}
        >
          <Typography color="text.secondary">{t('navigation.logout')}</Typography>
        </ListItemButton>
      </Menu>
    </>
  );
}

type ProfileLink = {
  href: string;
  icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
  };
  text: string;
};

export default ProfilePictureAvatar;

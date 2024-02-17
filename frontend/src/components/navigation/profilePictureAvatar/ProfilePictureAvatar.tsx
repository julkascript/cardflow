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
import toast from 'react-hot-toast';
import { toastMessages } from '../../../constants/toast';
import './ProfilePictureAvatar.css';
import { OverridableComponent } from '@mui/material/OverridableComponent';

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

  const links: ProfileLink[] = [
    {
      href: `/user/${user.username}/settings`,
      text: 'Account settings',
      icon: SettingsIcon,
    },
    {
      href: '/orders',
      text: 'My orders',
      icon: AddShoppingCartIcon,
    },
    {
      href: '/sales',
      text: 'My sales',
      icon: CurrencyExchangeIcon,
    },
  ];

  function handleLogout() {
    logout();
    handleClose();
    toast.success(toastMessages.success.logout);
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
        {/* <ListItemButton
          onClick={handleClose}
          sx={{ padding }}
          href={`/user/${user.username}/settings`}
        >
          <ListItemText>
            <Typography color="text.secondary">Account settings</Typography>
          </ListItemText>
          <ListItemIcon className="justify-end">
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
        </ListItemButton>
        <ListItemButton onClick={handleClose} sx={{ padding }} href="/orders">
          <ListItemText>
            <Typography color="text.secondary">My orders</Typography>
          </ListItemText>
          <ListItemIcon className="justify-end">
            <AddShoppingCartIcon fontSize="small" />
          </ListItemIcon>
        </ListItemButton>
        <ListItemButton onClick={handleClose} sx={{ padding }} href="/sales">
          <ListItemText>
            <Typography color="text.secondary">My sales</Typography>
          </ListItemText>
          <ListItemIcon className="justify-end">
            <CurrencyExchangeIcon fontSize="small" />
          </ListItemIcon>
        </ListItemButton> */}
        {links.map((l) => {
          const LinkIcon = l.icon;
          return (
            <ListItemButton onClick={handleClose} sx={{ padding }} href={l.href}>
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
          <Typography color="text.secondary">Log out</Typography>
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

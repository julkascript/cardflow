import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type MenuItem = {
  label: string;
  href: string;
};

/**
 * A simple button that opens a menu for a new action.
 * @returns
 */
function NewActionButton(): JSX.Element {
  const theme = useTheme();
  const secondaryTextColor = theme.palette.text.secondary;

  const { t } = useTranslation('common');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const menuItems: MenuItem[] = [
    {
      label: t('navigation.newListing'),
      href: '/sell/new',
    },
    {
      label: t('navigation.newTrade'),
      href: '/accounts/search',
    },
  ];

  return (
    <>
      <Button
        variant="outlined"
        sx={{ color: secondaryTextColor, borderColor: secondaryTextColor }}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={handleClick}
      >
        <AddIcon />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((mi) => (
          <Link key={mi.label} to={mi.href}>
            <MenuItem>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText>{mi.label}</ListItemText>
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </>
  );
}

export default NewActionButton;

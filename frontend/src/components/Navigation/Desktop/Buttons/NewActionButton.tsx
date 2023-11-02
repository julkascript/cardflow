import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, useTheme } from '@mui/material';
import { useState } from 'react';

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
      label: 'New listing',
      href: '#',
    },
    {
      label: 'New trade',
      href: '#',
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
          <a key={mi.label} href={mi.href}>
            <MenuItem>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText>{mi.label}</ListItemText>
            </MenuItem>
          </a>
        ))}
      </Menu>
    </>
  );
}

export default NewActionButton;
